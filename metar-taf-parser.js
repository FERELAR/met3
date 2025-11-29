// ===================================================================
// metar-taf-parser.js
// Полноценный токенизирующий парсер METAR и TAF на русском языке
// Поддерживает: METAR, SPECI, TAF (включая AMD/COR), все основные группы
// Автор: на основе твоего кода + профессиональной архитектуры
// Дата: 29.11.2025
// ===================================================================

const WEATHER_CODES = {
  // Описательные
  'MI': 'мелкий',     'BC': 'пятнами',     'PR': 'частично',     'DR': 'низкий перенос', 'BL': 'высокий перенос',
  'SH': 'ливневый',   'TS': 'гроза',       'FZ': 'переохлаждённый/замерзающий',
  // Осадки
  'DZ': 'морось',     'RA': 'дождь',       'SN': 'снег',         'SG': 'снежные зерна', 'IC': 'ледяные кристаллы',
  'PL': 'ледяная крупа', 'GR': 'град',     'GS': 'мелкий град/крупа', 'UP': 'неизвестные осадки',
  // Затруднение видимости
  'BR': 'дымка',      'FG': 'туман',       'FU': 'дым',          'VA': 'вулканический пепел',
  'DU': 'пыль',       'SA': 'песок',       'HZ': 'мгла',         'PY': 'брызги',
  // Другие явления
  'PO': 'пыльный вихрь', 'SQ': 'шквал',    'FC': 'воронка (торнадо)', 'SS': 'песчаная буря', 'DS': 'пыльная буря'
};

const CLOUD_TYPES = {
  'SKC': 'ясно', 'CLR': 'ясно (автомат)', 'NSC': 'нет значимой облачности', 'FEW': 'малооблачно (1–2/8)',
  'SCT': 'рассеянная облачность (3–4/8)', 'BKN': 'значительная облачность (5–7/8)', 'OVC': 'сплошная облачность (8/8)',
  'VV': 'вертикальная видимость', '///': 'облачность не определяется'
};

const CLOUD_SUFFIX = { 'CB': 'кучево-дождевые (Cb)', 'TCU': 'мощные кучевые (Tcu)' };

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

  const translate = (str) => str ? str.match(/.{2}/g).map(c => WEATHER_CODES[c] || c).join(' ') : '';

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
        const cover = CLOUD_TYPES[m[1]] || m[1];
        const height = m[2] !== '///' ? `${parseInt(m[2]) * 30} м (${parseInt(m[2]) * 100} ft)` : 'неизвестна';
        const special = m[3] && m[3] !== '///' ? CLOUD_SUFFIX[m[3]] : '';
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