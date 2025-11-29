let currentEncodeExercise = null;
let trainerStats = JSON.parse(localStorage.getItem('trainerStats') || '{"level":1,"totalDecoded":0,"correctDecoded":0,"sessionDecoded":0,"sessionCorrect":0,"errorsByType":{"metar":0,"kn01":0,"taf":0,"gamet":0,"sigmet":0,"warep":0,"kn04":0,"airmet":0}}');
let currentPracticeCode = null;
let hintStep = 0;
let appSettings = JSON.parse(localStorage.getItem('meteoCoderSettings') || '{"theme":"light","fontSize":"normal","animations":true}');

function applyAppSettings() {
    // Применяем тему
    document.body.className = '';
    if (appSettings.theme !== 'light') {
        document.body.classList.add(appSettings.theme);
    }
    
    // Применяем размер шрифта
    document.body.classList.add(`font-${appSettings.fontSize}`);
    
    // Применяем настройки анимации
    if (!appSettings.animations) {
        document.body.classList.add('no-animations');
    } else {
        document.body.classList.remove('no-animations');
    }
}

function parseMetar(metar) {
    try {
        const parts = metar.trim().toUpperCase().replace(/=+$/,'').split(/\s+/);
        let i = 0;
        const out = [];
        if (parts[i] === 'METAR' || parts[i] === 'SPECI') { out.push(`Тип: ${parts[i]}`); i++; }
        if (/^[A-Z]{4}$/.test(parts[i])) {
            out.push(`Аэродром: ${parts[i]}`);
            i++;
        } else {
            out.push('Ошибка: Неверный код аэродрома');
        }
        if (/^\d{6}Z$/.test(parts[i])) {
            const d = parts[i];
            out.push(`Время наблюдения: ${d.slice(0,2)} число, ${d.slice(2,4)}:${d.slice(4,6)} UTC`);
            i++;
        } else {
            out.push('Ошибка: Неверный формат времени');
        }
        if (parts[i] === 'AUTO') { out.push('Отчёт автоматический'); i++; }
        if (parts[i] === 'COR') { out.push('Отчёт исправленный'); i++; }
        const windRe = /^(VRB|\d{3}|\/\/\/)(\d{2,3})(G(\d{2,3}))?(KT|MPS|KMH)$/;
        if (windRe.test(parts[i])) {
            const m = parts[i].match(windRe);
            const dir = m[1] === 'VRB' ? 'переменного направления' : m[1] === '000' ? 'штиль' : `${m[1]}°`;
            const speed = m[2];
            const gust = m[4] ? `, порывы до ${m[4]} ${m[5]}` : '';
            const unit = m[5] === 'KT' ? 'узлов' : m[5] === 'MPS' ? 'м/с' : 'км/ч';
            out.push(`Ветер: ${dir}, ${speed} ${unit}${gust}`);
            i++;
        } else if (parts[i]) {
            out.push('Ошибка: Неверный формат ветра');
            i++;
        }
        if (/^\d{3}V\d{3}$/.test(parts[i])) {
            out.push(`Изменение направления ветра: от ${parts[i].slice(0,3)}° до ${parts[i].slice(5,8)}°`);
            i++;
        }
        if (parts[i] === 'CAVOK') {
            out.push('CAVOK — видимость ≥10 км, нет значимой погоды и облачности ниже 1500 м (5000 ft), нет CB/TCU');
            i++;
        } else if (/^\d{4}$/.test(parts[i])) {
            out.push(`Преобладающая видимость: ${parseInt(parts[i])} метров`);
            i++;
        } else if (parts[i]) {
            out.push('Ошибка: Неверный формат видимости');
            i++;
        }
        while (/^R\d{2}[LCR]?\/.*/.test(parts[i])) {
            const rvr = parts[i].match(/^R(\d{2}[LCR]?)\/(P|M)?(\d{4})(V(\d{4}))?(U|D|N)?$/);
            if (rvr) {
                let vis = rvr[3];
                const prefix = rvr[2] === 'P' ? 'более ' : rvr[2] === 'M' ? 'менее ' : '';
                const varVis = rvr[5] ? ` изменяется до ${rvr[5]}` : '';
                const trend = rvr[6] === 'U' ? ' улучшается' : rvr[6] === 'D' ? ' ухудшается' : rvr[6] === 'N' ? ' без изменений' : '';
                out.push(`RVR на ВПП ${rvr[1]}: ${prefix}${vis} м${varVis}${trend}`);
            } else {
                out.push(`Дальность видимости на ВПП: ${parts[i]}`);
            }
            i++;
        }
        while (/^[+-]?(VC)?(MI|BC|PR|DR|BL|SH|TS|FZ)?(DZ|RA|SN|SG|IC|PL|GR|GS|UP)?(BR|FG|FU|VA|DU|SA|HZ|PY)?(PO|SQ|FC|SS|DS)?$/.test(parts[i])) {
            let code = parts[i];
            let intensity = code[0] === '+' ? 'сильный ' : code[0] === '-' ? 'слабый ' : '';
            if ('+-'.includes(code[0])) code = code.slice(1);
            let descr = '', precip = '', obsc = '', other = '';
            if (code.startsWith('VC')) { descr += 'в окрестностях '; code = code.slice(2); }
            for (const key of ['MI','BC','PR','DR','BL','SH','TS','FZ']) if (code.startsWith(key)) { descr += WEATHER_CODES[key] + ' '; code = code.slice(key.length); }
            for (const key of ['DZ','RA','SN','SG','IC','PL','GR','GS','UP']) if (code.startsWith(key)) { precip += WEATHER_CODES[key] + ' '; code = code.slice(key.length); }
            for (const key of ['BR','FG','FU','VA','DU','SA','HZ','PY']) if (code.startsWith(key)) { obsc += WEATHER_CODES[key] + ' '; code = code.slice(key.length); }
            for (const key of ['PO','SQ','FC','SS','DS']) if (code.startsWith(key)) { other += WEATHER_CODES[key] + ' '; code = code.slice(key.length); }
            if (code) out.push('Ошибка: Неизвестный код погоды ' + parts[i]);
            else out.push(`Текущая погода: ${intensity}${descr}${precip}${obsc}${other}`.trim());
            i++;
        }
        while (/^(FEW|SCT|BKN|OVC|NSC|SKC|CLR|\/\/\/)\d{3}(CB|TCU|\/\/\/)?$/.test(parts[i]) || /^VV\d{3}$/.test(parts[i])) {
            if (/^VV\d{3}$/.test(parts[i])) {
                out.push(`Вертикальная видимость: ${parseInt(parts[i].slice(2))*30} м`);
                i++;
                continue;
            }
            const m = parts[i].match(/^(FEW|SCT|BKN|OVC|NSC|SKC|CLR|\/\/\/)(\d{3}|\/\/\/)(CB|TCU|\/\/\/)?$/);
            const cov = CLOUD_TYPES[m[1]] || m[1];
            const height = m[2] === '///' ? '' : `${parseInt(m[2])*30} м (${parseInt(m[2])*100} футов)`;
            const type = m[3] && m[3] !== '///' ? CLOUD_SUFFIX[m[3]] : '';
            out.push(`Облачность: ${cov}${height ? ', высота ' + height : ''}${type ? ', ' + type : ''}`);
            i++;
        }
        if (/^(M?\d{2})\/(M?\d{2})$/.test(parts[i])) {
            let [t, td] = parts[i].split('/');
            t = t.startsWith('M') ? '-' + t.slice(1) : t;
            td = td.startsWith('M') ? '-' + td.slice(1) : td;
            out.push(`Температура воздуха: ${t}°C, точка росы: ${td}°C`);
            i++;
        } else if (parts[i]) {
            out.push('Ошибка: Неверный формат температуры');
            i++;
        }
        if (/^[QA]\d{4}$/.test(parts[i])) {
            if (parts[i].startsWith('Q')) {
                out.push(`Давление QNH: ${parts[i].slice(1)} гПа`);
            } else {
                const inches = parts[i].slice(1,3) + '.' + parts[i].slice(3);
                out.push(`Давление: ${inches} дюймов рт. ст.`);
            }
            i++;
        } else if (parts[i]) {
            out.push('Ошибка: Неверный формат давления');
            i++;
        }
        while (i < parts.length) {
            if (parts[i].startsWith('RE')) {
                out.push(`Недавняя погода: ${parseWeather(parts[i].slice(2))}`);
                i++;
            } else if (parts[i].startsWith('WS')) {
                out.push(`Сдвиг ветра: ${parts[i]}`);
                i++;
            } else if (parts[i] === 'RMK') {
                out.push(`Замечания: ${parts.slice(i+1).join(' ')}`);
                break;
            } else {
                out.push(`Тренд или дополнительно: ${parts[i]}`);
                i++;
            }
        }
        return out.join('\n');
    } catch (e) {
        return 'Ошибка парсинга METAR: ' + e.message;
    }
}

function parseWeather(code) {
    return code.split(/(?=[A-Z]{2})/).map(c => WEATHER_CODES[c] || c).join(' ');
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
    const visMatch = parts.find(p => p === 'CAVOK' || /^\d{4}$/.test(p));
    out.vis = visMatch || '';
    const tempMatch = parts.find(p => /^(M?\d{2})\/(M?\d{2})$/.test(p));
    out.temp = tempMatch || '';
    const qMatch = parts.find(p => /^[QA]\d{4}$/.test(p));
    out.qnh = qMatch || '';
    return out;
}

function parseTaf(taf) {
    try {
        const parts = taf.trim().toUpperCase().split(/\s+/);
        let i = 0;
        const out = ['Прогноз погоды по аэродрому (TAF)'];
        if (parts[i] === 'TAF') i++;
        if (parts[i] === 'AMD' || parts[i] === 'COR') { out.push(`Статус: ${parts[i] === 'AMD' ? 'исправленный' : 'корректированный'}`); i++; }
        if (/^[A-Z]{4}$/.test(parts[i])) { out.push(`Аэродром: ${parts[i]}`); i++; }
        if (/^\d{6}Z/.test(parts[i])) {
            const d = parts[i];
            out.push(`Выпущен: ${d.slice(0,2)} число, ${d.slice(2,4)}:${d.slice(4,6)} UTC`);
            i++;
        }
        if (/^\d{4}\/\d{4}$/.test(parts[i])) {
            const [from, to] = parts[i].split('/');
            out.push(`Действует: с ${from.slice(0,2)} ${from.slice(2)}:00 до ${to.slice(0,2)} ${to.slice(2)}:00 UTC`);
            i++;
        }
        let temp = [];
        while (i < parts.length && !['FM','TEMPO','BECMG','PROB30','PROB40'].includes(parts[i])) {
            temp.push(parts[i++]);
        }
        out.push('Основной прогноз:');
        out.push(parseMetar(temp.join(' ')));
        while (i < parts.length) {
            let line = '';
            let prob = '';
            if (parts[i].startsWith('PROB')) {
                prob = parts[i] + ' вероятность ';
                i++;
            }
            const type = parts[i++];
            if (type === 'FM') {
                const time = parts[i++];
                line += `${prob}С ${time.slice(0,2)} числа ${time.slice(2,4)}:${time.slice(4,6)} UTC: `;
            } else if (type === 'TEMPO' || type === 'BECMG') {
                const period = parts[i++];
                const [f,t] = period.split('/');
                line += `${prob}${type === 'TEMPO' ? 'Временно' : 'Становясь'} с ${f.slice(0,2)} ${f.slice(2)}:00 до ${t.slice(0,2)} ${t.slice(2)}:00: `;
            }
            temp = [];
            while (i < parts.length && !['FM','TEMPO','BECMG','PROB30','PROB40'].includes(parts[i])) {
                temp.push(parts[i++]);
            }
            out.push(line);
            out.push(parseMetar(temp.join(' ')));
        }
        return out.join('\n');
    } catch (e) {
        return 'Ошибка парсинга TAF: ' + e.message;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    newEncodeExercise();
    updateTrainerStats();
    const devTypes = ['kn01', 'taf', 'gamet', 'sigmet', 'warep', 'kn04', 'airmet'];
    document.querySelectorAll('.code-type-selector .code-type-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const devMessageEl = document.getElementById('dev-message');
            const modeSelectorEl = document.querySelector('.mode-selector');
            const inputSectionEl = document.querySelector('.input-section');
            document.querySelectorAll('.code-type-selector .code-type-btn').forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');
            const type = this.dataset.type;
            if (devTypes.includes(type)) {
                if (modeSelectorEl) modeSelectorEl.style.display = 'none';
                if (inputSectionEl) inputSectionEl.style.display = 'none';
                if (devMessageEl) {
                    devMessageEl.style.display = 'block';
                    devMessageEl.textContent = 'В разработке';
                }
                if (document.getElementById('sidebar-hints')) {
                    document.getElementById('sidebar-hints').innerHTML = `<strong>${type.toUpperCase()}</strong> — Модуль находится в разработке.`;
                }
                return;
            }
            if (modeSelectorEl) modeSelectorEl.style.display = '';
            if (inputSectionEl) inputSectionEl.style.display = '';
            if (devMessageEl) devMessageEl.style.display = 'none';
            const info = codeInstructions[type];
            if (info) {
                document.getElementById('decode-instructions').innerHTML = info.decode;
                document.getElementById('sidebar-hints').innerHTML = `<strong>${info.title}</strong><br><br>` + info.hints.replace(/\n/g, '<br>');
            }
        });
    });
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.mode-btn').forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');
            const mode = this.dataset.mode;
            document.querySelectorAll('.mode-content').forEach(c => c.classList.remove('active'));
            document.getElementById(mode + '-content').classList.add('active');
        });
    });
    
    // Применяем настройки при загрузке
    applyAppSettings();
    
    initTopMenu();
});

const codeInstructions = {
    metar: {
        title: "METAR / SPECI",
        decode: `<strong>Режим авторасшифровки METAR:</strong><br>Вставьте код — получите полную расшифровку.<br>
                         Поддерживается: ветер, видимость, RVR, погода, облачность, температура, давление, тренд, RMK.`,
        hints: `• ICAO код аэродрома<br>
                        • День и время (Z)<br>
                        • Ветер: 05007MPS или 18015G25KT<br>
                        • Видимость: 9999, 6000, CAVOK<br>
                        • Погода: RA, TS, +SHRA<br>
                        • Облачность: BKN020CB<br>
                        • Температура/точка росы: 15/12 или M02/M04<br>
                        • Q1013, A2992<br>
                        • NOSIG, BECMG, TEMPO`
    },
    taf: {
        title: "TAF (Прогноз по аэродрому)",
        decode: `<strong>TAF — прогноз погоды</strong><br>Включает период действия, изменения FM, TEMPO, BECMG, PROB.`,
        hints: ` TAF AMD, COR<br>
                        • Период: 151200/161200<br>
                        • FM151300 — с 13:00<br>
                        • TEMPO 1514/1518 — временно<br>
                        • BECMG 1520/1522 — постепенное изменение<br>
                        • PROB30, PROB40 — вероятность`
    },
};

function openSettingsModal() {
    document.getElementById('settings-modal').style.display = 'block';
    document.getElementById('theme-select').value = appSettings.theme;
    document.getElementById('font-size').value = appSettings.fontSize;
    document.getElementById('animations-enabled').checked = appSettings.animations;
}
function closeSettingsModal() {
    document.getElementById('settings-modal').style.display = 'none';
}
function applySettings() {
    appSettings.theme = document.getElementById('theme-select').value;
    appSettings.fontSize = document.getElementById('font-size').value;
    appSettings.animations = document.getElementById('animations-enabled').checked;
    
    localStorage.setItem('meteoCoderSettings', JSON.stringify(appSettings));
    
    applyAppSettings();
    closeSettingsModal();
}

function toggleAccordion(element) {
    const expanded = element.getAttribute('aria-expanded') === 'true';
    element.setAttribute('aria-expanded', !expanded);
    const panel = element.nextElementSibling;
    panel.style.display = expanded ? 'none' : 'block';
}

function decodeCode() {
    document.getElementById('loading-decode').style.display = 'block';
    setTimeout(() => {
        const input = document.getElementById('metar-input').value.trim().toUpperCase();
        const resultDiv = document.getElementById('decode-result');
        const codeType = document.querySelector('.code-type-btn.active').dataset.type;
        let decoded = '';
        if (codeType === 'metar') decoded = parseMetar(input);
        else if (codeType === 'taf') decoded = parseTaf(input);
        else if (codeType === 'kn01') decoded = parseKn01(input);
        else if (codeType === 'gamet') decoded = parseGamet(input);
        else if (codeType === 'sigmet') decoded = parseSigmet(input);
        else if (codeType === 'warep') decoded = parseWarep(input);
        else if (codeType === 'kn04') decoded = parseKn04(input);
        else if (codeType === 'airmet') decoded = parseAirmet(input);
        resultDiv.textContent = decoded || 'Ошибка: Пожалуйста, введите код';
        resultDiv.className = decoded.startsWith('Ошибка') ? 'result error' : 'result';
        document.getElementById('loading-decode').style.display = 'none';
    }, 500);
}

function checkDecode() {
    document.getElementById('loading-practice-decode').style.display = 'block';
    setTimeout(() => {
        const userAnswer = document.getElementById('user-decode').value.trim().toLowerCase();
        const resultDiv = document.getElementById('practice-decode-result');
        const comparisonDiv = document.getElementById('decode-comparison');
        if (!userAnswer) {
            resultDiv.textContent = 'Ошибка: Введите вашу расшифровку';
            resultDiv.className = 'result error';
            document.getElementById('loading-practice-decode').style.display = 'none';
            return;
        }
        currentPracticeCode = document.getElementById('practice-code').textContent.trim();
        const codeType = document.querySelector('.code-type-btn.active').dataset.type;
        let correctDecoded = '';
        if (codeType === 'metar') {
            correctDecoded = parseMetar(currentPracticeCode).toLowerCase();
        } else if (codeType === 'taf') {
            correctDecoded = parseTaf(currentPracticeCode).toLowerCase();
        } else if (codeType === 'kn01') {
            correctDecoded = parseKn01(currentPracticeCode).toLowerCase();
        } else if (codeType === 'gamet') {
            correctDecoded = parseGamet(currentPracticeCode).toLowerCase();
        } else if (codeType === 'sigmet') {
            correctDecoded = parseSigmet(currentPracticeCode).toLowerCase();
        } else if (codeType === 'warep') {
            correctDecoded = parseWarep(currentPracticeCode).toLowerCase();
        } else if (codeType === 'kn04') {
            correctDecoded = parseKn04(currentPracticeCode).toLowerCase();
        } else if (codeType === 'airmet') {
            correctDecoded = parseAirmet(currentPracticeCode).toLowerCase();
        }
        const userLines = userAnswer.split('\n').map(line => line.trim()).filter(line => line);
        const correctLines = correctDecoded.split('\n').map(line => line.trim()).filter(line => line);
        let matchCount = 0;
        correctLines.forEach((correct, idx) => {
            if (userLines[idx] && userLines[idx].includes(correct)) matchCount++;
        });
        const accuracy = (matchCount / correctLines.length) * 100;
        if (accuracy > 80) {
            resultDiv.textContent = 'Отлично! Расшифровка верная! (Точность: ' + accuracy.toFixed(0) + '%)';
            resultDiv.className = 'result success';
            comparisonDiv.style.display = 'none';
            trainerStats.correctDecoded++;
            trainerStats.sessionCorrect++;
        } else {
            resultDiv.textContent = 'Есть ошибки. Точность: ' + accuracy.toFixed(0) + '%. Сравните с правильной расшифровкой:';
            resultDiv.className = 'result error';
            displayLineComparison(userLines, correctLines, 'decode');
            comparisonDiv.style.display = 'grid';
            const codeTypeKey = document.querySelector('.code-type-btn.active').dataset.type;
            trainerStats.errorsByType[codeTypeKey]++;
        }
        trainerStats.totalDecoded++;
        trainerStats.sessionDecoded++;
        updateTrainerStats();
        try { gtag('event', 'check_decode', { 'accuracy': accuracy }); } catch(e){}
        document.getElementById('loading-practice-decode').style.display = 'none';
    }, 500);
}

function displayLineComparison(userLines, correctLines, mode) {
    const userDisplay = document.getElementById(mode === 'decode' ? 'user-decode-display' : 'user-answer-display');
    const correctDisplay = document.getElementById(mode === 'decode' ? 'correct-decode-display' : 'correct-answer-display');
    userDisplay.innerHTML = '';
    correctDisplay.innerHTML = '';
    const maxLen = Math.max(userLines.length, correctLines.length);
    for (let i = 0; i < maxLen; i++) {
        const userSpan = document.createElement('div');
        const correctSpan = document.createElement('div');
        userSpan.textContent = userLines[i] || '';
        correctSpan.textContent = correctLines[i] || '';
        userSpan.classList.add('comparison-group');
        correctSpan.classList.add('comparison-group');
        if (userLines[i] === correctLines[i]) {
            userSpan.classList.add('correct');
            correctSpan.classList.add('correct');
        } else {
            userSpan.classList.add('incorrect');
            correctSpan.classList.add('incorrect');
        }
        userDisplay.appendChild(userSpan);
        correctDisplay.appendChild(correctSpan);
    }
}

function newEncodeExercise() {
    const randomIndex = Math.floor(Math.random() * weatherDatabase.length);
    currentEncodeExercise = weatherDatabase[randomIndex];
    document.getElementById('weather-description').textContent = currentEncodeExercise.description;
    document.getElementById('user-encode').value = '';
    document.getElementById('practice-encode-result').textContent = 'Результат проверки кодирования...';
    document.getElementById('practice-encode-result').className = 'result';
    document.getElementById('encode-comparison').style.display = 'none';
    document.getElementById('encode-hint').style.display = 'none';
    hintStep = 0;
    document.getElementById('next-hint-btn').style.display = 'none';
}

function checkEncode() {
    document.getElementById('loading-practice-encode').style.display = 'block';
    setTimeout(() => {
        const userCode = document.getElementById('user-encode').value.trim();
        const resultDiv = document.getElementById('practice-encode-result');
        const comparisonDiv = document.getElementById('encode-comparison');
        const codeType = document.querySelector('.code-type-btn.active').dataset.type;
        if (!userCode) {
            resultDiv.textContent = 'Ошибка: Введите ваш код';
            resultDiv.className = 'result error';
            document.getElementById('loading-practice-encode').style.display = 'none';
            return;
        }
        if (!currentEncodeExercise) {
            resultDiv.textContent = 'Ошибка: Сначала выберите задание';
            resultDiv.className = 'result error';
            document.getElementById('loading-practice-encode').style.display = 'none';
            return;
        }
        const normalizeCode = code => code.trim().toUpperCase().replace(/\s+/g, ' ').replace(/=+$/, '');
        const userNorm = normalizeCode(userCode);
        const correctNorm = normalizeCode(currentEncodeExercise.code);
        const userGroups = userNorm.split(' ');
        const correctGroups = correctNorm.split(' ');
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