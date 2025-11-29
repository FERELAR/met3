let trainerStats = JSON.parse(localStorage.getItem('trainerStats') || '{"level":1,"totalDecoded":0,"correctDecoded":0,"sessionDecoded":0,"sessionCorrect":0,"errorsByType":{"metar":0,"kn01":0,"taf":0,"gamet":0,"sigmet":0,"warep":0,"kn04":0,"airmet":0}}');
let currentPracticeCode = null;
let hintStep = 0;


let appSettings = JSON.parse(localStorage.getItem('meteoCoderSettings') || '{"theme":"light","fontSize":"normal","animations":true}');

const WEATHER_CODES1 = {
  'MI': 'мелкий',     'BC': 'пятнами',     'PR': 'частично',     'DR': 'низкий перенос', 'BL': 'высокий перенос',
  'SH': 'ливневый',   'TS': 'гроза',       'FZ': 'переохлаждённый/замерзающий',
  'DZ': 'морось',     'RA': 'дождь',       'SN': 'снег',         'SG': 'снежные зерна', 'IC': 'ледяные кристаллы',
  'PL': 'ледяная крупа', 'GR': 'град',     'GS': 'мелкий град/крупа', 'UP': 'неизвестные осадки',
  'BR': 'дымка',      'FG': 'туман',       'FU': 'дым',          'VA': 'вулканический пепел',
  'DU': 'пыль',       'SA': 'песок',       'HZ': 'мгла',         'PY': 'брызги',
  'PO': 'пыльный вихрь', 'SQ': 'шквал',    'FC': 'воронка (торнадо)', 'SS': 'песчаная буря', 'DS': 'пыльная буря'
};

const CLOUD_TYPES1 = {
  'SKC': 'ясно', 'CLR': 'ясно (автомат)', 'NSC': 'нет значимой облачности', 'FEW': 'малооблачно (1–2/8)',
  'SCT': 'рассеянная облачность (3–4/8)', 'BKN': 'значительная облачность (5–7/8)', 'OVC': 'сплошная облачность (8/8)',
  'VV': 'вертикальная видимость', '///': 'облачность не определяется'
};

const CLOUD_SUFFIX1 = { 'CB': 'кучево-дождевые (Cb)', 'TCU': 'мощные кучевые (Tcu)' };

// ====================== ТОКЕНИЗАТОР ======================
const TOKENS = {
  TYPE:      /^(METAR|SPECI|TAF|TAF AMD|TAF COR)$/,
  ICAO:      /^[A-Z]{4}$/,
  TIME:      /^\d{6}Z$/,
  PERIOD:    /^\d{6}\/\d{6}$/,           // TAF validity, например 0218/0318
  WIND:      /^(VRB|\d{3}|\d{5})\d{2}(G\d{2})?(KT|MPS|KMH)$/,
  VAR_WIND:  /^\d{3}V\d{3}$/,
  VIS:       /^(CAVOK|\d{4}|9999|\/\/\/\/)$/,
  RVR:       /^R\d{2}(L|C|R)?\/(P|M)?\d{4}(V\d{4})?(U|D|N)?$/,
  WX:        /^[+\-]?VC?(MI|BC|PR|DR|BL|SH|TS|FZ)?(DZ|RA|SN|SG|IC|PL|GR|GS|UP)?(BR|FG|FU|VA|DU|SA|HZ|PY)?(PO|SQ|FC|SS|DS)?$/,
  CLOUDS:    /^(FEW|SCT|BKN|OVC|NSC|SKC|CLR|VV|\/\/\/)\d{3}(CB|TCU|\/\/\/)?$/,
  TEMP:      /^(M)?\d{2}\/(M)?\d{2}$/,
  QNH:       /^[QA]\d{4}$/,
  TREND:     /^(NOSIG|BECMG|TEMPO|FM\d{6}|TL\d{6}|PROB\d{2}|PROB\d{2} TEMPO)$/,
  RMK:       /^RMK$/,
  AUTO:      /^AUTO$/,
  COR:       /^COR$/,
  AMD:       /^AMD$/,
  NIL:       /^NIL$/,
  CNL:       /^CNL$/
};

function tokenize(rawCode) {
  const parts = rawCode.trim().toUpperCase().replace(/=+$/, '').split(/\s+/);
  const tokens = [];

  for (const part of parts) {
    let matched = false;
    for (const [type, regex] of Object.entries(TOKENS)) {
      if (regex.test(part)) {
        tokens.push({ type, value: part });
        matched = true;
        break;
      }
    }
    if (!matched) {
      tokens.push({ type: 'UNKNOWN', value: part });
    }
  }
  return tokens;
}

// ====================== ДЕКОДЕР ПОГОДЫ ======================
function decodeWeather(code) {
  if (!code || code === '') return '';
  let result = '';
  let intensity = '';
  if (code[0] === '+') { intensity = 'сильный '; code = code.slice(1); }
  else if (code[0] === '-') { intensity = 'слабый '; code = code.slice(1); }

  if (code.startsWith('VC')) { result += 'в окрестностях '; code = code.slice(2); }

  const descriptors = code.match(/^(MI|BC|PR|DR|BL|SH|TS|FZ)*/)[0];
  const precipitation = code.match(/(DZ|RA|SN|SG|IC|PL|GR|GS|UP)*/)[0];
  const obscuration = code.match(/(BR|FG|FU|VA|DU|SA|HZ|PY)*/)[0];
  const other = code.match(/(PO|SQ|FC|SS|DS)*/)[0];

  const translate = (str) => str ? str.match(/.{2}/g).map(c => WEATHER_CODES1[c] || c).join(' ') : '';

  result += intensity;
  result += translate(descriptors) + ' ';
  result += translate(precipitation) + ' ';
  result += translate(obscuration) + ' ';
  result += translate(other);

  return result.trim() || code;
}

// ====================== ОСНОВНОЙ ПАРСЕР ======================
class BaseParser {
  constructor(tokens) {
    this.tokens = tokens;
    this.pos = 0;
    this.result = [];
    this.errors = [];
  }

  current() { return this.tokens[this.pos] || null; }
  consume() { return this.tokens[this.pos++]; }
  peek(ahead = 0) { return this.tokens[this.pos + ahead] || null; }

  expect(types, optional = false) {
    const token = this.current();
    if (!token || !types.includes(token.type)) {
      if (!optional) this.errors.push(`Ожидалось ${types.join(' или ')}, получено: ${token?.value || 'конец'}`);
      return null;
    }
    this.result.push(this.format(token));
    this.pos++;
    return token;
  }

  optional(type) {
    if (this.current()?.type === type) {
      this.result.push(this.format(this.consume()));
    }
  }

  format(token) { return token.value; }
}

// ====================== METAR ПАРСЕР ======================
class MetarParser extends BaseParser {
  parse() {
    this.expect(['TYPE'], true);
    this.optional('COR');
    this.optional('AMD');
    this.expect(['ICAO']);
    this.expect(['TIME']);
    this.optional('AUTO');
    this.wind();
    this.visibility();
    this.rvr();
    this.weather();
    this.clouds();
    this.tempDew();
    this.pressure();
    this.recentWeather();
    this.windshear();
    this.trends();
    this.remarks();
    return { text: this.result.join('\n'), errors: this.errors };
  }

  wind() {
    if (this.current()?.type === 'WIND') {
      const w = this.consume().value;
      const m = w.match(/^(\d{3}|VRB)(\d{2,3})(G(\d{2,3}))?(KT|MPS|KMH)$/);
      if (!m) return;
      const dir = m[1] === 'VRB' ? 'переменного направления' : m[1] === '000' ? 'штиль' : m[1] + '°';
      const speed = m[2];
      const gust = m[4] ? `, порывы до ${m[4]}` : '';
      const unit = m[5] === 'KT' ? 'уз' : m[5] === 'MPS' ? 'м/с' : 'км/ч';
      this.result.push(`Ветер: ${dir} ${speed} ${unit}${gust}`);
    }
    if (this.current()?.type === 'VAR_WIND') {
      const v = this.consume().value;
      this.result.push(`Вариация ветра: ${v.slice(0,3)}° ↔ ${v.slice(4,7)}°`);
    }
  }

  visibility() {
    const v = this.current();
    if (v?.type === 'VIS') {
      if (v.value === 'CAVOK') {
        this.result.push('CAVOK — видимость ≥10 км, нет значимой облачности и погоды');
      } else if (v.value === '9999') {
        this.result.push('Видимость: более 10 км');
      } else {
        this.result.push(`Видимость: ${parseInt(v.value)} м`);
      }
      this.pos++;
    }
  }

  rvr() {
    while (this.current()?.type === 'RVR') {
      const r = this.consume().value;
      const m = r.match(/^R(\d{2}[LCR]?)\/(P|M)?(\d{4})(V\d{4})?(U|D|N)?$/);
      let txt = `RVR ВПП ${m[1]}: `;
      txt += m[2] === 'P' ? 'более ' : m[2] === 'M' ? 'менее ' : '';
      txt += m[3] + ' м';
      if (m[4]) txt += ` ↔ ${m[4].slice(1)} м`;
      if (m[5]) txt += m[5] === 'U' ? ' ↑' : m[5] === 'D' ? ' ↓' : ' без изменений';
      this.result.push(txt);
    }
  }

  weather() {
    while (this.current()?.type === 'WX') {
      this.result.push(`Явления погоды: ${decodeWeather(this.consume().value)}`);
    }
  }

  clouds() {
    while (this.current()?.type === 'CLOUDS') {
      const c = this.consume().value;
      const m = c.match(/^(FEW|SCT|BKN|OVC|NSC|SKC|CLR|VV|\/\/\/)(\d{3}|\/\/\/)(CB|TCU|\/\/\/)?$/);
      if (!m) continue;
      if (m[1] === 'VV') {
        this.result.push(`Вертикальная видимость: ${parseInt(m[2]) * 30} м`);
      } else {
        const cover = CLOUD_TYPES1[m[1]] || m[1];
        const height = m[2] !== '///' ? `${parseInt(m[2]) * 30} м (${parseInt(m[2]) * 100} ft)` : 'неизвестна';
        const special = m[3] && m[3] !== '///' ? CLOUD_SUFFIX1[m[3]] : '';
        this.result.push(`Облачность: ${cover}, высота ${height}${special ? ', ' + special : ''}`);
      }
    }
  }

  tempDew() {
    if (this.current()?.type === 'TEMP') {
      const [t, d] = this.consume().value.split('/');
      const temp = t.startsWith('M') ? '-' + t.slice(1) : t;
      const dew = d.startsWith('M') ? '-' + d.slice(1) : d;
      this.result.push(`Температура: ${temp}°C, точка росы: ${dew}°C`);
    }
  }

  pressure() {
    if (this.current()?.type === 'QNH') {
      const p = this.consume().value;
      if (p.startsWith('Q')) this.result.push(`QNH: ${p.slice(1)} гПа`);
      else this.result.push(`Атмосферное давление: ${p.slice(1,3)}.${p.slice(3)} inHg`);
    }
  }

  recentWeather() {
    // REw1w2 — недавние осадки (не реализовано подробно)
  }

  windshear() {
    if (this.current()?.value?.startsWith('WS')) {
      this.result.push(`Низовой сдвиг ветра: ${this.consume().value}`);
    }
  }

  trends() {
    while (this.current()?.type === 'TREND') {
      const trend = this.consume();
      let line = '';
      if (trend.value === 'NOSIG') {
        line = 'Значительных изменений не ожидается';
      } else {
        line = trend.value;
        // Если после BECMG/TEMPO идёт период — добавляем
        if (['BECMG', 'TEMPO'].includes(trend.value) && this.peek()?.type === 'PERIOD') {
          line += ' ' + this.consume().value;
        }
        // Парсим мини-METAR внутри тренда
        const subParser = new MetarParser(this.tokens.slice(this.pos));
        const sub = subParser.parse();
        if (sub.text.trim()) line += ' → ' + sub.text.replace(/\n/g, '; ');
        this.pos += subParser.pos;
      }
      this.result.push(`Прогнозная часть: ${line}`);
    }
  }

  remarks() {
    if (this.current()?.type === 'RMK') {
      this.pos++;
      const remark = this.tokens.slice(this.pos).map(t => t.value).join(' ');
      if (remark) this.result.push(`Замечания: ${remark}`);
    }
  }

  format(token) {
    switch (token.type) {
      case 'TYPE': return `Тип сообщения: ${token.value}`;
      case 'ICAO': return `Аэродром: ${token.value}`;
      case 'TIME':
        const d = token.value;
        return `Время наблюдения: ${d.slice(0,2)} число, ${d.slice(2,4)}:${d.slice(4,6)} UTC`;
      case 'AUTO': return 'Автоматическое наблюдение';
      case 'COR': return 'Исправленное сообщение';
      case 'AMD': return 'Поправка к прогнозу';
      default: return token.value;
    }
  }
}

// ====================== TAF ПАРСЕР ======================
class TafParser extends MetarParser {
  parse() {
    this.expect(['TYPE'], true);
    this.optional('AMD');
    this.optional('COR');
    this.optional('CNL');
    this.expect(['ICAO']);
    this.expect(['TIME']);
    this.expect(['PERIOD']);
    this.wind();
    this.visibility();
    this.weather();
    this.clouds();
    this.trends();         // В TAF это основная часть!
    this.remarks();
    return { text: this.result.join('\n'), errors: this.errors };
  }

  format(token) {
    if (token.type === 'PERIOD') {
      const [from, to] = token.value.split('/');
      const fromDay = from.slice(0,2);
      const fromHour = from.slice(2,4);
      const toDay = to.slice(0,2);
      const toHour = to.slice(2,4);
      return `Период действия: с ${fromDay}-го в ${fromHour}:00 до ${toDay}-го в ${toHour}:00 UTC`;
    }
    return super.format(token);
  }
}

// ====================== ЭКСПОРТ ======================
function parseMetar(code) {
  const tokens = tokenize(code);
  const parser = new MetarParser(tokens);
  const result = parser.parse();
  return result.errors.length ? result.text + '\n\nОшибки:\n' + result.errors.join('\n') : result.text;
}

function parseTaf(code) {
  const tokens = tokenize(code);
  const parser = new TafParser(tokens);
  const result = parser.parse();
  return result.errors.length ? result.text + '\n\nОшибки:\n' + result.errors.join('\n') : result.text;
}

function parseMetarFields(metar) {
    const parts = metar.trim().toUpperCase().replace(/=+$/,'').split(/\s+/);
    const out = { wind: '', vis: '', temp: '', qnh: '' };
    for (let i = 0; i < parts.length; i++) {
        if (/^(VRB|\d{3}|\/\/\/)\d{2,3}(G\d{2,3})?(KT|MPS|KMH)$/.test(parts[i])) {
            out.wind = parts[i];
            continue;
        }
    }
    const visMatch = parts.find(p => p === 'CAVOK' || /^\d{4}$/.test(p) || p === '9999');
    if (visMatch) out.vis = visMatch;
    const tempMatch = parts.find(p => /^(M?\d{2})\/(M?\d{2})$/.test(p));
    if (tempMatch) out.temp = tempMatch.split('/')[0];
    const qnhMatch = parts.find(p => /^[QA]\d{4}$/.test(p));
    if (qnhMatch) out.qnh = qnhMatch;
    return out;
}

function decodeCode() {
    const input = document.getElementById('metar-input').value.trim().toUpperCase();
    if (!input) {
        document.getElementById('decode-result').textContent = 'Введите код для расшифровки';
        document.getElementById('decode-result').className = 'result error';
        return;
    }
    document.getElementById('loading-decode').style.display = 'block';
    setTimeout(() => {
        const codeType = document.querySelector('.code-type-btn.active').dataset.type;
        let parsed = '';
        if (codeType === 'metar' || codeType === 'speci') {
            parsed = parseMetar(input);
        } else if (codeType === 'taf') {
            parsed = parseTaf(input);
        } else {
            parsed = window[`parse${codeType.charAt(0).toUpperCase() + codeType.slice(1)}`](input) || 'Парсер в разработке';
        }
        document.getElementById('decode-result').textContent = parsed || 'Ошибка расшифровки';
        document.getElementById('decode-result').className = parsed.includes('Ошибка') ? 'result error' : 'result success';
        document.getElementById('loading-decode').style.display = 'none';
        try { gtag('event', 'decode_code', { 'type': codeType }); } catch(e){}
    }, 500);
}

function checkUserDecode() {
    const code = document.getElementById('practice-code').textContent.trim().toUpperCase();
    const userDecode = document.getElementById('user-decode').value.trim();
    if (!userDecode) {
        document.getElementById('practice-decode-result').textContent = 'Введите вашу расшифровку';
        document.getElementById('practice-decode-result').className = 'result error';
        return;
    }
    document.getElementById('loading-practice-decode').style.display = 'block';
    setTimeout(() => {
        const codeType = document.querySelector('.code-type-btn.active').dataset.type;
        let correct = '';
        if (codeType === 'metar') correct = parseMetar(code);
        else if (codeType === 'taf') correct = parseTaf(code);
        else correct = window[`parse${codeType.charAt(0).toUpperCase() + codeType.slice(1)}`](code) || 'Парсер в разработке';
        const userNorm = normalizeText(userDecode);
        const correctNorm = normalizeText(correct);
        let similarity = calculateSimilarity(userNorm, correctNorm);
        let resultText = `Сходство: ${Math.round(similarity * 100)}%`;
        if (similarity >= 0.9) {
            resultText += '\nОтлично! Ваша расшифровка верна.';
            trainerStats.correctDecoded++;
            trainerStats.sessionCorrect++;
        } else if (similarity >= 0.7) {
            resultText += '\nХорошо, но есть неточности. Посмотрите подсказки.';
        } else {
            resultText += '\nЕсть ошибки. Попробуйте снова.';
            const codeTypeKey = document.querySelector('.code-type-btn.active').dataset.type;
            trainerStats.errorsByType[codeTypeKey]++;
        }
        document.getElementById('practice-decode-result').textContent = resultText;
        document.getElementById('practice-decode-result').className = similarity >= 0.9 ? 'result success' : similarity >= 0.7 ? 'result warning' : 'result error';
        displayLineComparison(userNorm.split('\n'), correctNorm.split('\n'), 'decode');
        document.getElementById('decode-comparison').style.display = 'grid';
        document.getElementById('loading-practice-decode').style.display = 'none';
        trainerStats.totalDecoded++;
        trainerStats.sessionDecoded++;
        updateTrainerStats();
        try { gtag('event', 'check_decode', { 'similarity': Math.round(similarity * 100) }); } catch(e){}
    }, 500);
}

function newEncodeExercise() {
    const codeType = document.querySelector('.code-type-btn.active').dataset.type;
    const level = document.querySelector('.mode-btn[data-mode="practice-encode"]').dataset.level || 'easy';
    const exercises = gameData[codeType.toUpperCase()][level] || gameData.METAR.easy;
    currentEncodeExercise = exercises[Math.floor(Math.random() * exercises.length)];
    document.getElementById('encode-description').textContent = currentEncodeExercise.description;
    document.getElementById('encode-hint').style.display = 'none';
    document.getElementById('encode-result').textContent = '';
    document.getElementById('encode-result').className = 'result';
    document.getElementById('user-encode').value = '';
    document.getElementById('encode-comparison').style.display = 'none';
    hintStep = 0;
}

function checkUserEncode() {
    const userCode = document.getElementById('user-encode').value.trim().toUpperCase().replace(/=+$/,'');
    if (!userCode) {
        document.getElementById('encode-result').textContent = 'Введите ваш код';
        document.getElementById('encode-result').className = 'result error';
        return;
    }
    document.getElementById('loading-practice-encode').style.display = 'block';
    setTimeout(() => {
        const codeType = document.querySelector('.code-type-btn.active').dataset.type;
        const correct = currentEncodeExercise.code.trim().toUpperCase().replace(/=+$/,'');
        const userGroups = userCode.split(/\s+/);
        const correctGroups = correct.split(/\s+/);
        let feedback = '';
        let errorCount = 0;
        for (let j = 0; j < Math.max(userGroups.length, correctGroups.length); j++) {
            if (userGroups[j] !== correctGroups[j]) {
                let errorDetail = '';
                if (j === 0 && correctGroups[j] === 'METAR' && codeType === 'metar') errorDetail = ' (Ожидается тип отчёта METAR)';
                if (j === 2 && !userGroups[j]?.match(/^\d{3}\d{2,3}(G\d{2,3})?(MPS|KT)$/)) errorDetail = ' (Неверный формат ветра: направление° скорость [порывы] единицы)';
                if (j === correctGroups.length - 1 && correctGroups[j] === 'NOSIG') errorDetail = ' (Забыли NOSIG - без изменений)';
                if (j === 5 && !userGroups[j]?.match(/^(M?\d{2})\/(M?\d{2})$/)) errorDetail = ' (Неверный формат температуры: T/TD)';
                feedback += `• Ошибка в группе ${j+1}: Ожидалось ${correctGroups[j] || 'отсутствует'}, введено ${userGroups[j] || 'отсутствует'}${errorDetail}\n`;
                errorCount++;
            }
        }
        if (errorCount === 0) {
            resultDiv.textContent = 'Отлично! Код закодирован верно!';
            resultDiv.className = 'result success';
            comparisonDiv.style.display = 'none';
            trainerStats.correctDecoded++;
            trainerStats.sessionCorrect++;
        } else {
            resultDiv.textContent = 'Есть ошибки в кодировании. Детали:\n' + feedback;
            resultDiv.className = 'result error';
            displayLineComparison(userGroups, correctGroups, 'encode');
            comparisonDiv.style.display = 'grid';
            const codeTypeKey = document.querySelector('.code-type-btn.active').dataset.type;
            trainerStats.errorsByType[codeTypeKey]++;
        }
        trainerStats.totalDecoded++;
        trainerStats.sessionDecoded++;
        updateTrainerStats();
        try { gtag('event', 'check_encode', { 'success': errorCount === 0 }); } catch(e){}
        document.getElementById('loading-practice-encode').style.display = 'none';
    }, 500);
}

function showEncodeHint() {
    if (!currentEncodeExercise) return;
    hintStep = 1;
    updateHint();
    document.getElementById('next-hint-btn').style.display = 'inline-block';
}

function showNextHint() {
    hintStep++;
    updateHint();
}

function updateHint() {
    const code = currentEncodeExercise.code.trim();
    const groups = code.split(/\s+/);
    let hint = '';
    for (let i = 0; i < groups.length; i++) {
        if (i < hintStep) {
            hint += groups[i] + ' ';
        } else {
            hint += '-'.repeat(groups[i].length) + ' ';
        }
    }
    document.getElementById('encode-hint').textContent = hint.trim();
    document.getElementById('encode-hint').style.display = 'block';
    if (hintStep >= groups.length) {
        document.getElementById('next-hint-btn').style.display = 'none';
    }
}

function newPracticeCode() {
    const codes = {
        metar: ['UUWW 141630Z 05007MPS 9999 SCT020 17/12 Q1011 NOSIG', 'UUDD 141600Z 03005MPS 9999 BKN015 15/10 Q1012'],
        taf: ['TAF UUWW 141600Z 1418/1524 03005MPS 9999 BKN015 TX15/1412Z TN10/1503Z'],
        kn01: ['KN01 34580 11012 21089 30012 40123 52015 60022 70033 80044 91012'],
        gamet: ['GAMET VALID 151200/151800 UUEE SEC I: TURB MOD FL050-100 SEC II: SFC VIS 5000 RA'],
        sigmet: ['SIGMET 1 VALID 151200/151600 UUEE TS OBS AT 1200Z N OF N55 MOV E 30KT'],
        warep: ['WAREP TURB SEV FL180 TIME 1230Z POSITION 55N030E'],
        kn04: ['KN04 WARNING VALID 151200/152400 WIND 20020MPS G35MPS'],
        airmet: ['AIRMET 1 VALID 151600/151600 UUEE MOD TURB FL050-100']
    };
    const codeType = document.querySelector('.code-type-btn.active').dataset.type;
    const typeCodes = codes[codeType] || codes.metar;
    const randomCode = typeCodes[Math.floor(Math.random() * typeCodes.length)];
    document.getElementById('practice-code').textContent = randomCode;
    document.getElementById('user-decode').value = '';
    document.getElementById('practice-decode-result').textContent = 'Результат проверки...';
    document.getElementById('practice-decode-result').className = 'result';
    document.getElementById('decode-comparison').style.display = 'none';
}

function clearFields() {
    document.getElementById('metar-input').value = '';
    document.getElementById('decode-result').textContent = 'Здесь появится расшифровка кода...';
    document.getElementById('decode-result').className = 'result';
}

function copyCode(elementId) {
    const el = document.getElementById(elementId);
    const text = (el.value !== undefined) ? el.value : el.textContent;
    navigator.clipboard.writeText(text).then(() => {
        alert('Код скопирован!');
    }).catch(err => {
        console.error('Ошибка копирования: ', err);
    });
}

function updateTrainerStats() {
    const percent = trainerStats.sessionDecoded > 0 ? Math.round((trainerStats.sessionCorrect / trainerStats.sessionDecoded) * 100) : 0;
    document.getElementById('trainer-level').textContent = trainerStats.level;
    document.getElementById('decoded-count').textContent = trainerStats.sessionDecoded;
    document.getElementById('correct-percent').textContent = percent + '%';
    document.getElementById('level-progress').value = trainerStats.totalDecoded % 50;
    const badge = percent > 90 ? 'Эксперт' : percent > 70 ? 'Профи' : 'Новичок';
    document.getElementById('badge').textContent = `Бейдж: ${badge}`;
    const errorsList = document.getElementById('errors-by-type');
    errorsList.innerHTML = '';
    for (const type in trainerStats.errorsByType) {
        const li = document.createElement('li');
        li.textContent = `${type.toUpperCase()}: ${trainerStats.errorsByType[type]}`;
        errorsList.appendChild(li);
    }
    if (trainerStats.totalDecoded >= trainerStats.level * 50) {
        trainerStats.level++;
    }
    localStorage.setItem('trainerStats', JSON.stringify(trainerStats));
}

function resetStats() {
    if (confirm('Сбросить статистику?')) {
        trainerStats = {"level":1,"totalDecoded":0,"correctDecoded":0,"sessionDecoded":0,"sessionCorrect":0,"errorsByType":{"metar":0,"kn01":0,"taf":0,"gamet":0,"sigmet":0,"warep":0,"kn04":0,"airmet":0}};
        localStorage.setItem('trainerStats', JSON.stringify(trainerStats));
        updateTrainerStats();
    }
}

function initTopMenu() {
    document.querySelectorAll('.top-menu button').forEach(btn => {
        btn.addEventListener('click', function () {
            if (this.disabled) return;
            document.querySelectorAll('.top-menu button').forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            const pageId = 'page-' + this.dataset.page;
            if (document.getElementById(pageId)) {
                document.getElementById(pageId).classList.add('active');
            }
        });
    });
}

// Заглушки для нереализованных парсеров
function parseKn01(code) { return 'Парсер КН-01 в разработке'; }
function parseGamet(code) { return 'Парсер GAMET в разработке'; }
function parseSigmet(code) { return 'Парсер SIGMET в разработке'; }
function parseWarep(code) { return 'Парсер WAREP в разработке'; }
function parseKn04(code) { return 'Парсер КН-04 в разработке'; }

function parseAirmet(code) { return 'Парсер AIRMET в разработке'; }

