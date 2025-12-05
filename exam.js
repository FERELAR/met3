// ====================== БАЗА ДАННЫХ ДЛЯ КОНТРОЛЬНОГО БЛОКА ======================

const examDatabase = {
  // Базовый тест (множественный выбор)
  basicTest: [
    {
      question: "Что означает код METAR?",
      options: [
        "Авиационная регулярная сводка погоды на аэродроме",
        "Прогноз погоды на аэродроме",
        "Штормовое предупреждение",
        "Синоптический код для наземных наблюдений"
      ],
      correct: 0,
      topic: "Общие знания",
      difficulty: "easy",
      time: 30
    },
    {
      question: "Как расшифровывается группа 05007MPS?",
      options: [
        "Ветер 050°, 7 метров в секунду",
        "Ветер 500°, 7 метров в секунду",
        "Ветер 050°, 7 миль в час",
        "Видимость 5000 метров, скорость ветра 7 м/с"
      ],
      correct: 0,
      topic: "Ветер",
      difficulty: "easy",
      time: 30
    },
    {
      question: "Что означает видимость 9999?",
      options: [
        "Видимость 10 километров или более",
        "Видимость 9999 метров",
        "Видимость не определена",
        "Видимость ограничена до 9999 футов"
      ],
      correct: 0,
      topic: "Видимость",
      difficulty: "easy",
      time: 30
    },
    {
      question: "Какой код означает рассеянную облачность на 2000 футов?",
      options: [
        "SCT020",
        "BKN020",
        "FEW020",
        "OVC020"
      ],
      correct: 0,
      topic: "Облачность",
      difficulty: "medium",
      time: 25
    },
    {
      question: "Что означает код NOSIG?",
      options: [
        "Без значительных изменений",
        "Значительные изменения ожидаются",
        "Наблюдается туман",
        "Требуется особая осторожность"
      ],
      correct: 0,
      topic: "Тренды",
      difficulty: "easy",
      time: 20
    },
    {
      question: "Как записывается температура -5°C и точка росы -7°C?",
      options: [
        "M05/M07",
        "-05/-07",
        "05/07",
        "M5/M7"
      ],
      correct: 0,
      topic: "Температура",
      difficulty: "medium",
      time: 30
    },
    {
      question: "Что означает CAVOK?",
      options: [
        "Видимость ≥10 км, нет облаков ниже 5000 ft, нет особых явлений",
        "Облачность отсутствует полностью",
        "Отличная видимость и хорошая погода",
        "Все параметры в норме"
      ],
      correct: 0,
      topic: "Специальные коды",
      difficulty: "medium",
      time: 25
    },
    {
      question: "Какой код соответствует сильному дождю?",
      options: [
        "+RA",
        "-RA",
        "RA",
        "SHRA"
      ],
      correct: 0,
      topic: "Погодные явления",
      difficulty: "easy",
      time: 20
    },
    {
      question: "Что означает код VRB02KT?",
      options: [
        "Ветер переменный 2 узла",
        "Ветер 200° 2 узла",
        "Видимость переменная 200 метров",
        "Вертикальная видимость 200 футов"
      ],
      correct: 0,
      topic: "Ветер",
      difficulty: "medium",
      time: 25
    },
    {
      question: "Как записывается давление 1013 гПа?",
      options: [
        "Q1013",
        "A1013",
        "P1013",
        "H1013"
      ],
      correct: 0,
      topic: "Давление",
      difficulty: "easy",
      time: 20
    }
  ],

  // Продвинутый тест
  advancedTest: [
    {
      question: "Что означает группа R24/290050 в METAR?",
      options: [
        "Состояние ВПП 24: мокрая или вода местами, коэффициент сцепления 0.5",
        "Ветер на ВПП 24: 290° 5 узлов",
        "Видимость на ВПП 24: 2900 метров, RVR 500 метров",
        "Температура на ВПП 24: 29°C, точка росы 5°C"
      ],
      correct: 0,
      topic: "Состояние ВПП",
      difficulty: "hard",
      time: 40
    },
    {
      question: "Как правильно записать видимость 800 метров с минимальной 400 метров на северо-восток?",
      options: [
        "0800 0400NE",
        "800 400NE",
        "0800NE 0400",
        "800 400 NORTHEAST"
      ],
      correct: 0,
      topic: "Видимость",
      difficulty: "hard",
      time: 45
    },
    {
      question: "Что означает группа TEMPO 4000 -RA BKN010?",
      options: [
        "Временами видимость 4000 м, слабый дождь, значительная облачность 1000 футов",
        "Температура 40°C, дождь, облачность 10/10",
        "Временные работы на ВПП, дождь ожидается",
        "Температура падает до 4°C, дождь, облачность увеличивается"
      ],
      correct: 0,
      topic: "Тренды",
      difficulty: "hard",
      time: 35
    },
    {
      question: "Какой код соответствует ливневому дождю с грозой?",
      options: [
        "+TSRA",
        "SHTSRA",
        "RA+TS",
        "TS+SHRA"
      ],
      correct: 0,
      topic: "Погодные явления",
      difficulty: "hard",
      time: 30
    },
    {
      question: "Что означает группа BECMG FM1200 25010KT?",
      options: [
        "Постепенное изменение с 12:00 UTC, ветер 250° 10 узлов",
        "Будет меняться с 12:00, температура 25°C, ветер 10 узлов",
        "Ветер становится 250° 10 узлов после 12:00",
        "Постепенный ветер 250° 10 узлов с 12:00"
      ],
      correct: 0,
      topic: "TAF",
      difficulty: "hard",
      time: 40
    }
  ],

  // Практические задания (кодирование)
  practiceTasks: [
    {
      description: "Аэропорт Внуково (UUWW), 15 число, 14:30 UTC. Ветер 120° 5 м/с. Видимость 10+ км. Рассеянная облачность на 2500 футов. Температура 18°C, точка росы 12°C. Давление QNH 1012 гПа. Без изменений.",
      answer: "UUWW 151430Z 12005MPS 9999 SCT025 18/12 Q1012 NOSIG",
      topic: "METAR",
      difficulty: "easy",
      time: 120,
      hints: [
        "Начните с идентификатора аэропорта и времени",
        "Формат времени: день(две цифры)час(две цифры)минуты(две цифры)Z",
        "Ветер: направление(три цифры)скорость(две цифры)MPS",
        "Видимость 10+ км = 9999",
        "Облачность: SCT + высота в сотнях футов (025 = 2500 ft)",
        "Температура: TT/TdTd",
        "Давление: QPPPP"
      ]
    },
    {
      description: "Аэропорт Пулково (ULLI), 10 число, 06:00 UTC. Штиль. Видимость 500 м. Туман. Вертикальная видимость 100 футов. Температура 2°C, точка росы 1°C. Давление QNH 1000 гПа. Состояние ВПП 88: мокрая или вода местами, коэффициент сцепления 0.5. Без изменений. Ремарка: препятствия закрыты.",
      answer: "METAR ULLI 100600Z 00000MPS 0500 FG VV001 02/01 Q1000 R88/290050 NOSIG RMK OBST OBSC",
      topic: "METAR",
      difficulty: "medium",
      time: 180,
      hints: [
        "Начинайте с METAR для регулярной сводки",
        "Штиль = 00000MPS",
        "Видимость 500 м = 0500",
        "Туман = FG",
        "Вертикальная видимость = VV + высота в сотнях футов",
        "Состояние ВПП: R + номер ВПП + / + данные",
        "Ремарка начинается с RMK"
      ]
    },
    {
      description: "Прогноз TAF для аэропорта Внуково. Выпущен 14 числа в 16:00 UTC. Период действия с 14-го 18:00 по 15-е 24:00. Ветер 030° 5 м/с. Видимость 10+ км. Значительная облачность на 1500 футов. Максимальная температура 15°C в 14-го 12:00 UTC. Минимальная температура 10°C в 15-го 03:00 UTC.",
      answer: "TAF UUWW 141600Z 1418/1524 03005MPS 9999 BKN015 TX15/1412Z TN10/1503Z",
      topic: "TAF",
      difficulty: "medium",
      time: 150,
      hints: [
        "Начните с TAF и идентификатора аэродрома",
        "Формат периода: деньчас/деньчас (1418/1524)",
        "TX для максимальной температуры, TN для минимальной",
        "Формат температуры: TT/времяZ"
      ]
    },
    {
      description: "Специальная сводка SPECI для аэропорта Домодедово. 25 число, 16:50 UTC. Ветер переменный 3 узла. Видимость 8000 м. Слабый дождь. Малооблачно на 3000 футов. Значительная кучево-дождевая облачность на 7000 футов. Температура 15°C, точка росы 10°C. Давление QNH 1018 гПа. Без изменений.",
      answer: "SPECI UUDD 251650Z VRB03KT 8000 -RA FEW030 BKN070CB 15/10 Q1018 NOSIG",
      topic: "SPECI",
      difficulty: "hard",
      time: 200,
      hints: [
        "Начинайте с SPECI для специальной сводки",
        "Ветер переменный: VRB + скорость + единицы (KT для узлов)",
        "Видимость в метрах: 8000",
        "Слабый дождь: -RA",
        "Кучево-дождевая облачность: CB после высоты"
      ]
    }
  ],

  // Экзаменационные билеты (комбинированные)
  examTickets: [
    {
      id: 1,
      name: "Билет №1: Базовый METAR",
      tasks: [
        {
          type: "test",
          question: "Что означает код METAR?",
          options: [
            "Авиационная регулярная сводка погоды на аэродроме",
            "Прогноз погоды на аэродроме",
            "Сводка о штормовом предупреждении",
            "Код для наземных наблюдений"
          ],
          correct: 0,
          points: 10
        },
        {
          type: "practice",
          description: "Закодируйте: Аэропорт Внуково, 14 число 16:30 UTC, ветер 050° 7 м/с, видимость 10+ км, рассеянная облачность 2000 фт, температура 17°C, точка росы 12°C, давление 1011 гПа, без изменений.",
          answer: "UUWW 141630Z 05007MPS 9999 SCT020 17/12 Q1011 NOSIG",
          points: 30
        },
        {
          type: "decode",
          code: "METAR UUDD 141600Z 03005MPS 9999 BKN015 15/10 Q1012",
          question: "Расшифруйте данный код METAR",
          answer: "Аэропорт Домодедово, 14 число 16:00 UTC, ветер 030° 5 м/с, видимость 10+ км, значительная облачность на 1500 футов, температура 15°C, точка росы 10°C, давление 1012 гПа",
          points: 30
        },
        {
          type: "test",
          question: "Какой код соответствует видимости 10+ км?",
          options: ["9999", "CAVOK", "10000", "10KM"],
          correct: 0,
          points: 10
        },
        {
          type: "test",
          question: "Что означает NOSIG?",
          options: [
            "Без значительных изменений",
            "Значительные изменения",
            "Нет сигнала",
            "Не стандартно"
          ],
          correct: 0,
          points: 10
        }
      ],
      totalPoints: 90,
      timeLimit: 600, // 10 минут
      passingScore: 70
    },
    {
      id: 2,
      name: "Билет №2: Продвинутый METAR",
      tasks: [
        {
          type: "test",
          question: "Что означает группа R24/290050?",
          options: [
            "Состояние ВПП 24: мокрая или вода местами, коэффициент сцепления 0.5",
            "Ветер на ВПП 24: 290° 5 узлов",
            "Видимость на ВПП 24: 2900 метров",
            "Температура на ВПП 24: 29°C"
          ],
          correct: 0,
          points: 15
        },
        {
          type: "practice",
          description: "Закодируйте: Аэропорт Пулково, 10 число 06:00 UTC, штиль, видимость 500 м, туман, вертикальная видимость 100 футов, температура 2°C, точка росы 1°C, давление 1000 гПа, состояние ВПП 88: коэффициент 0.5, без изменений, ремарка: препятствия закрыты.",
          answer: "METAR ULLI 100600Z 00000MPS 0500 FG VV001 02/01 Q1000 R88/290050 NOSIG RMK OBST OBSC",
          points: 40
        },
        {
          type: "decode",
          code: "METAR UUEE 141500Z VRB02KT 0100 R28L/1000U FG VV001 08/07 Q0998",
          question: "Расшифруйте данный код METAR",
          answer: "Аэропорт Шереметьево, 14 число 15:00 UTC, ветер переменный 2 узла, видимость 100 м, RVR ВПП 28L 1000 м увеличивается, туман, вертикальная видимость 100 футов, температура 8°C, точка росы 7°C, давление 998 гПа",
          points: 35
        },
        {
          type: "test",
          question: "Что означает код CAVOK?",
          options: [
            "Видимость ≥10 км, нет облаков ниже 5000 ft, нет особых явлений",
            "Облачность отсутствует",
            "Отличная видимость",
            "Все параметры в норме"
          ],
          correct: 0,
          points: 10
        }
      ],
      totalPoints: 100,
      timeLimit: 480, // 8 минут
      passingScore: 80
    }
  ],

  // Типы сертификатов
  certificates: {
    basic: {
      name: "Базовый сертификат",
      requirements: {
        testScore: 80,
        practiceTasks: 2,
        totalTime: 600
      },
      description: "Подтверждает базовые знания метеорологических кодов METAR/SPECI"
    },
    advanced: {
      name: "Продвинутый уровень",
      requirements: {
        testScore: 85,
        practiceTasks: 4,
        totalTime: 480,
        minDifficulty: "hard"
      },
      description: "Подтверждает продвинутые навыки работы с METAR, SPECI и TAF"
    },
    expert: {
      name: "Эксперт",
      requirements: {
        testScore: 90,
        practiceTasks: 6,
        totalTime: 360,
        minDifficulty: "hard",
        allCodeTypes: true
      },
      description: "Подтверждает экспертные знания всех типов метеорологических кодов"
    }
  }
};

// ====================== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ======================

let examState = {
  currentExamType: null, // 'test', 'practice', 'exam'
  currentExamData: null,
  currentQuestionIndex: 0,
  userAnswers: [],
  startTime: null,
  timerInterval: null,
  remainingTime: 0,
  isExamActive: false,
  examResults: []
};

let examStats = JSON.parse(localStorage.getItem('examStats') || '{"attempts":[],"certificates":[],"totalScore":0,"totalTime":0}');

// ====================== ИНИЦИАЛИЗАЦИЯ СТРАНИЦЫ ======================

function initExamPage() {
  // Создаем интерфейс страницы экзамена
  const examPage = document.getElementById('page-exam');
  if (!examPage) return;

  examPage.innerHTML = `
    <div class="main-content">
      <h1><i class="fas fa-file-alt"></i> КОНТРОЛЬНЫЙ БЛОК</h1>
      
      <div class="exam-type-selector">
        <div class="exam-type-card" data-type="test">
          <i class="fas fa-clipboard-check"></i>
          <h3>ТЕСТ</h3>
          <p>Множественный выбор</p>
          <p><small>20 вопросов, 15 минут</small></p>
        </div>
        <div class="exam-type-card" data-type="practice">
          <i class="fas fa-pencil-alt"></i>
          <h3>ПРАКТИКА</h3>
          <p>Кодирование погоды</p>
          <p><small>4 задания, 20 минут</small></p>
        </div>
        <div class="exam-type-card" data-type="exam">
          <i class="fas fa-graduation-cap"></i>
          <h3>ЭКЗАМЕН</h3>
          <p>Комбинированный</p>
          <p><small>Билеты, 10-15 минут</small></p>
        </div>
      </div>
      
      <div class="exam-settings" style="display: none;">
        <h3>Настройки контроля</h3>
        <div id="test-settings" class="settings-section">
          <div class="setting-group">
            <label>Уровень сложности:</label>
            <select id="test-difficulty">
              <option value="basic">Базовый</option>
              <option value="advanced">Продвинутый</option>
            </select>
          </div>
          <div class="setting-group">
            <label>Количество вопросов:</label>
            <select id="test-count">
              <option value="10">10 вопросов</option>
              <option value="20">20 вопросов</option>
              <option value="30">30 вопросов</option>
            </select>
          </div>
        </div>
        
        <div id="practice-settings" class="settings-section" style="display: none;">
          <div class="setting-group">
            <label>Тип кода:</label>
            <select id="practice-type">
              <option value="METAR">METAR</option>
              <option value="TAF">TAF</option>
              <option value="all">Все типы</option>
            </select>
          </div>
          <div class="setting-group">
            <label>Количество заданий:</label>
            <select id="practice-count">
              <option value="3">3 задания</option>
              <option value="5">5 заданий</option>
              <option value="7">7 заданий</option>
            </select>
          </div>
        </div>
        
        <div id="exam-settings" class="settings-section" style="display: none;">
          <div class="setting-group">
            <label>Выберите билет:</label>
            <select id="exam-ticket">
              <option value="1">Билет №1: Базовый METAR</option>
              <option value="2">Билет №2: Продвинутый METAR</option>
            </select>
          </div>
        </div>
        
        <button class="btn btn-start-exam" onclick="startExam()">
          <i class="fas fa-play"></i> НАЧАТЬ КОНТРОЛЬНУЮ
        </button>
        <button class="btn btn-secondary" onclick="showExamTypeSelector()">
          <i class="fas fa-arrow-left"></i> НАЗАД
        </button>
      </div>
      
      <div class="exam-interface" style="display: none;">
        <div class="exam-header">
          <div class="exam-timer" id="exam-timer">
            <i class="fas fa-clock"></i> <span id="timer-display">00:00</span>
          </div>
          <div class="exam-progress">
            <span id="current-question">1</span> из <span id="total-questions">10</span>
            <progress id="exam-progress" value="0" max="100"></progress>
          </div>
          <button class="btn btn-secondary btn-finish-exam" onclick="finishExam()">
            <i class="fas fa-flag-checkered"></i> ЗАВЕРШИТЬ
          </button>
        </div>
        
        <div class="exam-content" id="exam-content">
          <!-- Здесь будет отображаться вопрос/задание -->
        </div>
        
        <div class="exam-navigation">
          <button class="btn btn-secondary" id="btn-prev" onclick="prevQuestion()" disabled>
            <i class="fas fa-arrow-left"></i> НАЗАД
          </button>
          <button class="btn" id="btn-next" onclick="nextQuestion()">
            СЛЕДУЮЩИЙ <i class="fas fa-arrow-right"></i>
          </button>
          <button class="btn" id="btn-submit" style="display: none;" onclick="submitAnswer()">
            <i class="fas fa-check"></i> ПРОВЕРИТЬ
          </button>
        </div>
      </div>
      
      <div class="exam-results" style="display: none;">
        <div id="results-content">
          <!-- Результаты экзамена -->
        </div>
        <div class="results-actions">
          <button class="btn" onclick="showDetailedResults()">
            <i class="fas fa-chart-bar"></i> ДЕТАЛЬНАЯ СТАТИСТИКА
          </button>
          <button class="btn btn-secondary" onclick="restartExam()">
            <i class="fas fa-redo"></i> ПОВТОРИТЬ
          </button>
          <button class="btn" onclick="showCertificates()">
            <i class="fas fa-award"></i> СЕРТИФИКАТЫ
          </button>
        </div>
      </div>
      
      <div class="exam-history">
        <h3><i class="fas fa-history"></i> ИСТОРИЯ ПОПЫТОК</h3>
        <div id="history-table"></div>
      </div>
    </div>
  `;

  // Инициализируем обработчики событий
  initExamEventListeners();
  loadExamHistory();
                        updateHistoryStats();

}

function updateHistoryStats() {
    if (!examStats.attempts) return;
    
    const totalAttempts = examStats.attempts.length;
    const averageScore = totalAttempts > 0 
        ? Math.round(examStats.attempts.reduce((sum, a) => sum + a.percentage, 0) / totalAttempts)
        : 0;
    const totalTime = Math.round(examStats.totalTime / 3600);
    const certificatesCount = examStats.certificates ? examStats.certificates.length : 0;
    
    document.getElementById('total-attempts').textContent = totalAttempts;
    document.getElementById('average-score').textContent = averageScore + '%';
    document.getElementById('total-time').textContent = totalTime + 'ч';
    document.getElementById('certificates-count').textContent = certificatesCount;
}


// ====================== ОБРАБОТЧИКИ СОБЫТИЙ ======================

function initExamEventListeners() {
  // Выбор типа контроля
  document.querySelectorAll('.exam-type-card').forEach(card => {
    card.addEventListener('click', function() {
      const examType = this.dataset.type;
      selectExamType(examType);
    });
  });
}

function selectExamType(type) {
  examState.currentExamType = type;
  
  // Показываем настройки для выбранного типа
  document.querySelector('.exam-type-selector').style.display = 'none';
  document.querySelector('.exam-settings').style.display = 'block';
  
  // Скрываем все настройки
  document.querySelectorAll('.settings-section').forEach(section => {
    section.style.display = 'none';
  });
  
  // Показываем соответствующие настройки
  document.getElementById(`${type}-settings`).style.display = 'block';
}

function showExamTypeSelector() {
  document.querySelector('.exam-type-selector').style.display = 'flex';
  document.querySelector('.exam-settings').style.display = 'none';
  examState.currentExamType = null;
}

// ====================== ЗАПУСК ЭКЗАМЕНА ======================

function startExam() {
  const type = examState.currentExamType;
  if (!type) return;
  
  // Получаем настройки
  let examData;
  let timeLimit;
  
  switch(type) {
    case 'test':
      const difficulty = document.getElementById('test-difficulty').value;
      const count = parseInt(document.getElementById('test-count').value);
      examData = difficulty === 'basic' 
        ? examDatabase.basicTest.slice(0, count)
        : examDatabase.advancedTest.slice(0, Math.min(count, examDatabase.advancedTest.length));
      timeLimit = count * 45; // 45 секунд на вопрос
      break;
      
    case 'practice':
      const practiceCount = parseInt(document.getElementById('practice-count').value);
      examData = examDatabase.practiceTasks.slice(0, Math.min(practiceCount, examDatabase.practiceTasks.length));
      timeLimit = examData.reduce((total, task) => total + task.time, 0);
      break;
      
    case 'exam':
      const ticketId = document.getElementById('exam-ticket').value;
      examData = examDatabase.examTickets.find(ticket => ticket.id == ticketId);
      timeLimit = examData.timeLimit;
      break;
  }
  
  // Сохраняем данные экзамена
  examState.currentExamData = examData;
  examState.currentQuestionIndex = 0;
  examState.userAnswers = [];
  examState.startTime = new Date();
  examState.remainingTime = timeLimit;
  examState.isExamActive = true;
  
  // Показываем интерфейс экзамена
  document.querySelector('.exam-settings').style.display = 'none';
  document.querySelector('.exam-interface').style.display = 'block';
  
  // Запускаем таймер
  startTimer();
  
  // Показываем первый вопрос
  showQuestion();
}

// ====================== ТАЙМЕР ======================

function startTimer() {
  updateTimerDisplay();
  
  examState.timerInterval = setInterval(() => {
    examState.remainingTime--;
    updateTimerDisplay();
    
    if (examState.remainingTime <= 0) {
      clearInterval(examState.timerInterval);
      finishExam();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const minutes = Math.floor(examState.remainingTime / 60);
  const seconds = examState.remainingTime % 60;
  const timerDisplay = document.getElementById('timer-display');
  
  if (timerDisplay) {
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Меняем цвет при малом времени
    if (examState.remainingTime < 60) {
      timerDisplay.style.color = '#e74c3c';
      timerDisplay.style.fontWeight = 'bold';
    }
  }
}

// ====================== ОТОБРАЖЕНИЕ ВОПРОСОВ ======================

function showQuestion() {
  const container = document.getElementById('exam-content');
  const currentIndex = examState.currentQuestionIndex;
  const examType = examState.currentExamType;
  let questionData;
  
  // Получаем данные вопроса в зависимости от типа экзамена
  if (examType === 'exam') {
    questionData = examState.currentExamData.tasks[currentIndex];
  } else {
    questionData = examState.currentExamData[currentIndex];
  }
  
  // Обновляем прогресс
  updateProgress();
  
  // Очищаем контейнер
  container.innerHTML = '';
  
  // Отображаем вопрос в зависимости от типа
  if (examType === 'test' || (examType === 'exam' && questionData.type === 'test')) {
    showTestQuestion(questionData, currentIndex);
  } else if (examType === 'practice' || (examType === 'exam' && questionData.type === 'practice')) {
    showPracticeQuestion(questionData, currentIndex);
  } else if (examType === 'exam' && questionData.type === 'decode') {
    showDecodeQuestion(questionData, currentIndex);
  }
  
  // Обновляем кнопки навигации
  updateNavigationButtons();
}

function showTestQuestion(question, index) {
  const container = document.getElementById('exam-content');
  
  container.innerHTML = `
    <div class="test-question">
      <h3>Вопрос ${index + 1}</h3>
      <div class="question-text">${question.question}</div>
      <div class="question-options">
        ${question.options.map((option, i) => `
          <div class="option" data-index="${i}">
            <input type="radio" name="answer" id="option-${i}" value="${i}">
            <label for="option-${i}">${option}</label>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  // Восстанавливаем выбранный ответ, если он есть
  if (examState.userAnswers[index] !== undefined) {
    const selectedOption = container.querySelector(`input[value="${examState.userAnswers[index]}"]`);
    if (selectedOption) {
      selectedOption.checked = true;
    }
  }
  
  // Добавляем обработчики для вариантов ответов
  container.querySelectorAll('.option input').forEach(input => {
    input.addEventListener('change', function() {
      examState.userAnswers[index] = parseInt(this.value);
    });
  });
}

function showPracticeQuestion(task, index) {
  const container = document.getElementById('exam-content');
  
  container.innerHTML = `
    <div class="practice-task">
      <h3>Задание ${index + 1}</h3>
      <div class="task-description">
        <p><strong>Опишите погоду:</strong></p>
        <p>${task.description}</p>
      </div>
      <div class="task-input">
        <label for="answer-input-${index}">Ваш код:</label>
        <textarea id="answer-input-${index}" placeholder="Введите код здесь..." rows="3"></textarea>
      </div>
      <button class="btn btn-hint" onclick="showHint(${index})">
        <i class="fas fa-lightbulb"></i> Подсказка
      </button>
      <div id="hint-${index}" class="hint-area" style="display: none; margin-top: 10px;"></div>
    </div>
  `;
  
  // Восстанавливаем введенный ответ, если он есть
  if (examState.userAnswers[index] !== undefined) {
    document.getElementById(`answer-input-${index}`).value = examState.userAnswers[index];
  }
  
  // Сохраняем ответ при вводе
  const textarea = document.getElementById(`answer-input-${index}`);
  textarea.addEventListener('input', function() {
    examState.userAnswers[index] = this.value.trim();
  });
}

function showDecodeQuestion(task, index) {
  const container = document.getElementById('exam-content');
  
  container.innerHTML = `
    <div class="decode-task">
      <h3>Задание ${index + 1}: Расшифровка</h3>
      <div class="task-code">
        <p><strong>Код:</strong></p>
        <div class="code-display">${task.code}</div>
        <button class="btn btn-copy" onclick="copyToClipboard('${task.code.replace(/'/g, "\\'")}')">
          <i class="fas fa-copy"></i> Скопировать
        </button>
      </div>
      <div class="task-question">${task.question}</div>
      <div class="task-input">
        <label for="decode-input-${index}">Ваша расшифровка:</label>
        <textarea id="decode-input-${index}" placeholder="Введите расшифровку здесь..." rows="4"></textarea>
      </div>
    </div>
  `;
  
  // Восстанавливаем введенный ответ, если он есть
  if (examState.userAnswers[index] !== undefined) {
    document.getElementById(`decode-input-${index}`).value = examState.userAnswers[index];
  }
  
  // Сохраняем ответ при вводе
  const textarea = document.getElementById(`decode-input-${index}`);
  textarea.addEventListener('input', function() {
    examState.userAnswers[index] = this.value.trim();
  });
}

// ====================== ПОДСКАЗКИ ======================

function showHint(index) {
  const hintContainer = document.getElementById(`hint-${index}`);
  const task = examState.currentExamType === 'exam' 
    ? examState.currentExamData.tasks[index]
    : examState.currentExamData[index];
  
  if (task.hints) {
    const hintIndex = examState.userAnswers[index] ? 
      Math.min(examState.userAnswers[index].length % task.hints.length, task.hints.length - 1) : 0;
    
    hintContainer.innerHTML = `<p><strong>Подсказка:</strong> ${task.hints[hintIndex]}</p>`;
    hintContainer.style.display = 'block';
  }
}

// ====================== НАВИГАЦИЯ ======================

function prevQuestion() {
  if (examState.currentQuestionIndex > 0) {
    examState.currentQuestionIndex--;
    showQuestion();
  }
}

function nextQuestion() {
  const totalQuestions = examState.currentExamType === 'exam' 
    ? examState.currentExamData.tasks.length 
    : examState.currentExamData.length;
  
  if (examState.currentQuestionIndex < totalQuestions - 1) {
    examState.currentQuestionIndex++;
    showQuestion();
  } else {
    // Если это последний вопрос, показываем кнопку завершения
    document.getElementById('btn-next').style.display = 'none';
    document.getElementById('btn-submit').style.display = 'inline-block';
  }
}

function submitAnswer() {
  // Проверяем текущий ответ перед завершением
  const currentIndex = examState.currentQuestionIndex;
  const userAnswer = examState.userAnswers[currentIndex];
  
  if (userAnswer === undefined || userAnswer === '') {
    alert('Пожалуйста, ответьте на текущий вопрос перед завершением!');
    return;
  }
  
  finishExam();
}

function updateProgress() {
  const totalQuestions = examState.currentExamType === 'exam' 
    ? examState.currentExamData.tasks.length 
    : examState.currentExamData.length;
  
  const progress = ((examState.currentQuestionIndex + 1) / totalQuestions) * 100;
  
  document.getElementById('current-question').textContent = examState.currentQuestionIndex + 1;
  document.getElementById('total-questions').textContent = totalQuestions;
  document.getElementById('exam-progress').value = progress;
}

function updateNavigationButtons() {
  const prevBtn = document.getElementById('btn-prev');
  const nextBtn = document.getElementById('btn-next');
  const submitBtn = document.getElementById('btn-submit');
  
  const totalQuestions = examState.currentExamType === 'exam' 
    ? examState.currentExamData.tasks.length 
    : examState.currentExamData.length;
  
  prevBtn.disabled = examState.currentQuestionIndex === 0;
  
  if (examState.currentQuestionIndex === totalQuestions - 1) {
    nextBtn.style.display = 'none';
    submitBtn.style.display = 'inline-block';
  } else {
    nextBtn.style.display = 'inline-block';
    submitBtn.style.display = 'none';
  }
}

// ====================== ЗАВЕРШЕНИЕ ЭКЗАМЕНА ======================

function finishExam() {
  clearInterval(examState.timerInterval);
  examState.isExamActive = false;
  
  // Рассчитываем результаты
  const results = calculateResults();
  
  // Сохраняем попытку
  saveExamAttempt(results);
  
  // Показываем результаты
  showResults(results);
}

function calculateResults() {
  const examType = examState.currentExamType;
  const endTime = new Date();
  const timeSpent = Math.floor((endTime - examState.startTime) / 1000);
  
  let totalScore = 0;
  let maxScore = 0;
  let correctAnswers = 0;
  let detailedResults = [];
  
  if (examType === 'test') {
    maxScore = examState.currentExamData.length * 10;
    
    examState.currentExamData.forEach((question, index) => {
      const userAnswer = examState.userAnswers[index];
      const isCorrect = userAnswer === question.correct;
      
      if (isCorrect) {
        totalScore += 10;
        correctAnswers++;
      }
      
      detailedResults.push({
        question: question.question,
        userAnswer: userAnswer !== undefined ? question.options[userAnswer] : 'Нет ответа',
        correctAnswer: question.options[question.correct],
        isCorrect: isCorrect,
        topic: question.topic
      });
    });
    
  } else if (examType === 'practice') {
    maxScore = examState.currentExamData.length * 25;
    
    examState.currentExamData.forEach((task, index) => {
      const userAnswer = examState.userAnswers[index] || '';
      const normalizedUser = normalizeText(userAnswer);
      const normalizedCorrect = normalizeText(task.answer);
      const similarity = calculateSimilarity(normalizedUser, normalizedCorrect);
      const score = Math.round(similarity * 25);
      
      if (similarity >= 0.8) correctAnswers++;
      totalScore += score;
      
      detailedResults.push({
        description: task.description,
        userAnswer: userAnswer || 'Нет ответа',
        correctAnswer: task.answer,
        similarity: Math.round(similarity * 100),
        score: score,
        topic: task.topic
      });
    });
    
  } else if (examType === 'exam') {
    maxScore = examState.currentExamData.totalPoints;
    
    examState.currentExamData.tasks.forEach((task, index) => {
      const userAnswer = examState.userAnswers[index];
      let score = 0;
      let isCorrect = false;
      
      if (task.type === 'test') {
        isCorrect = userAnswer === task.correct;
        score = isCorrect ? task.points : 0;
        if (isCorrect) correctAnswers++;
        
        detailedResults.push({
          type: 'test',
          question: task.question,
          userAnswer: userAnswer !== undefined ? task.options[userAnswer] : 'Нет ответа',
          correctAnswer: task.options[task.correct],
          isCorrect: isCorrect,
          score: score,
          maxScore: task.points
        });
        
      } else if (task.type === 'practice' || task.type === 'decode') {
        const normalizedUser = normalizeText(userAnswer || '');
        const normalizedCorrect = normalizeText(task.answer);
        const similarity = calculateSimilarity(normalizedUser, normalizedCorrect);
        score = Math.round(similarity * task.points);
        
        if (similarity >= 0.8) correctAnswers++;
        
        detailedResults.push({
          type: task.type,
          question: task.description || task.question,
          userAnswer: userAnswer || 'Нет ответа',
          correctAnswer: task.answer,
          similarity: Math.round(similarity * 100),
          isCorrect: similarity >= 0.8,
          score: score,
          maxScore: task.points
        });
      }
      
      totalScore += score;
    });
  }
  
  const percentage = Math.round((totalScore / maxScore) * 100);
  const isPassed = examType === 'exam' 
    ? percentage >= examState.currentExamData.passingScore
    : percentage >= 70;
  
  return {
    examType: examType,
    examName: examType === 'exam' ? examState.currentExamData.name : examType.toUpperCase(),
    totalScore: totalScore,
    maxScore: maxScore,
    percentage: percentage,
    correctAnswers: correctAnswers,
    totalQuestions: detailedResults.length,
    timeSpent: timeSpent,
    timeLimit: examState.remainingTime,
    isPassed: isPassed,
    detailedResults: detailedResults,
    date: new Date().toISOString()
  };
}

// ====================== ОТОБРАЖЕНИЕ РЕЗУЛЬТАТОВ ======================

function showResults(results) {
  document.querySelector('.exam-interface').style.display = 'none';
  document.querySelector('.exam-results').style.display = 'block';
  
  const container = document.getElementById('results-content');
  
  let certificateHtml = '';
  const newCertificate = checkForCertificate(results);
  if (newCertificate) {
    certificateHtml = `
      <div class="certificate-notification" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center;">
        <h3><i class="fas fa-award"></i> ПОЗДРАВЛЯЕМ!</h3>
        <p>Вы получили новый сертификат:</p>
        <h2>${newCertificate}</h2>
        <p>Сертификат добавлен в вашу коллекцию</p>
      </div>
    `;
  }
  
  container.innerHTML = `
    <div class="results-summary">
      <h2><i class="fas fa-chart-line"></i> РЕЗУЛЬТАТЫ КОНТРОЛЬНОЙ</h2>
      <div class="results-stats">
        <div class="stat-card ${results.isPassed ? 'success' : 'error'}">
          <div class="stat-value">${results.percentage}%</div>
          <div class="stat-label">ОБЩИЙ РЕЗУЛЬТАТ</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${results.correctAnswers}/${results.totalQuestions}</div>
          <div class="stat-label">ПРАВИЛЬНЫХ ОТВЕТОВ</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${formatTime(results.timeSpent)}</div>
          <div class="stat-label">ЗАТРАЧЕНО ВРЕМЕНИ</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${results.isPassed ? 'СДАН' : 'НЕ СДАН'}</div>
          <div class="stat-label">СТАТУС</div>
        </div>
      </div>
      
      ${certificateHtml}
      
      <div class="results-details">
        <h3>Детализация по вопросам:</h3>
        <div class="details-table">
          ${results.detailedResults.map((result, index) => `
            <div class="detail-row ${result.isCorrect ? 'correct' : 'incorrect'}">
              <div class="detail-question">
                <strong>Вопрос ${index + 1}:</strong> ${result.question || result.description || ''}
              </div>
              <div class="detail-result">
                ${result.type === 'test' ? 
                  `Ваш ответ: ${result.userAnswer}<br>Правильный: ${result.correctAnswer}` :
                  `Сходство: ${result.similarity}%<br>Баллы: ${result.score}/${result.maxScore}`
                }
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  
  // Обновляем историю
  loadExamHistory();
}

function showDetailedResults() {
  // В будущем можно сделать более детальную статистику
  alert('Детальная статистика в разработке...');
}

function showCertificates() {
  const container = document.getElementById('results-content');
  const certificates = examStats.certificates;
  
  if (certificates.length === 0) {
    container.innerHTML = `
      <div class="certificates-view">
        <h2><i class="fas fa-award"></i> ВАШИ СЕРТИФИКАТЫ</h2>
        <p style="text-align: center; margin: 40px 0;">
          <i class="fas fa-certificate" style="font-size: 60px; color: #ccc;"></i><br>
          У вас пока нет сертификатов. Пройдите контрольные работы, чтобы их получить!
        </p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = `
    <div class="certificates-view">
      <h2><i class="fas fa-award"></i> ВАШИ СЕРТИФИКАТЫ</h2>
      <div class="certificates-grid">
        ${certificates.map(cert => `
          <div class="certificate-card">
            <div class="certificate-header" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
              <i class="fas fa-certificate"></i>
              <h3>${cert.name}</h3>
            </div>
            <div class="certificate-body">
              <p><strong>Дата получения:</strong><br>${new Date(cert.date).toLocaleDateString('ru-RU')}</p>
              <p><strong>Результат:</strong> ${cert.score}%</p>
              <p><strong>Тип:</strong> ${cert.examType}</p>
              <button class="btn btn-copy" onclick="downloadCertificate('${cert.name}')">
                <i class="fas fa-download"></i> Скачать
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ====================== СЕРТИФИКАТЫ ======================

// Обновлю функцию checkForCertificate для более строгих условий
function checkForCertificate(results) {
    let newCertificate = null;
    
    // Проверяем условия для каждого сертификата
    const certificates = examDatabase.certificates;
    
    if (results.percentage >= certificates.basic.requirements.testScore && 
        results.totalQuestions >= certificates.basic.requirements.practiceTasks) {
        if (!examStats.certificates.some(c => c.name === certificates.basic.name)) {
            awardCertificate(certificates.basic, results);
            newCertificate = certificates.basic.name;
        }
    }
    
    if (results.percentage >= certificates.advanced.requirements.testScore && 
        results.totalQuestions >= certificates.advanced.requirements.practiceTasks &&
        results.examType !== 'test') { // Только для практики и экзаменов
        if (!examStats.certificates.some(c => c.name === certificates.advanced.name)) {
            awardCertificate(certificates.advanced, results);
            newCertificate = certificates.advanced.name;
        }
    }
    
    if (results.percentage >= certificates.expert.requirements.testScore && 
        results.totalQuestions >= certificates.expert.requirements.practiceTasks &&
        results.examType === 'exam' && 
        results.timeSpent <= certificates.expert.requirements.totalTime) {
        if (!examStats.certificates.some(c => c.name === certificates.expert.name)) {
            awardCertificate(certificates.expert, results);
            newCertificate = certificates.expert.name;
        }
    }
    
    return newCertificate;
}
function awardCertificate(certData, results) {
    examStats.certificates.push({
        name: certData.name,
        description: certData.description,
        date: new Date().toISOString(),
        score: results.percentage,
        examType: results.examType,
        examName: results.examName,
        level: certData.name.includes('Базовый') ? 1 : 
               certData.name.includes('Продвинутый') ? 2 : 3
    });
    
    localStorage.setItem('examStats', JSON.stringify(examStats));
}


function downloadCertificate(certificateName) {
  // В будущем можно реализовать генерацию PDF
  alert(`Сертификат "${certificateName}" будет скачан в формате PDF.\n(Функция в разработке)`);
}

// ====================== ИСТОРИЯ ПОПЫТОК ======================

function saveExamAttempt(results) {
  examStats.attempts.unshift({
    id: Date.now(),
    ...results
  });
  
  // Ограничиваем историю 50 последними попытками
  if (examStats.attempts.length > 50) {
    examStats.attempts = examStats.attempts.slice(0, 50);
  }
  
  // Обновляем общую статистику
  examStats.totalScore += results.totalScore;
  examStats.totalTime += results.timeSpent;
  
  localStorage.setItem('examStats', JSON.stringify(examStats));
}

function loadExamHistory() {
  const container = document.getElementById('history-table');
  if (!container) return;
  
  const attempts = examStats.attempts;
  
  if (attempts.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #777;">История попыток пуста</p>';
    return;
  }
  
  container.innerHTML = `
    <table class="history-table">
      <thead>
        <tr>
          <th>Дата</th>
          <th>Тип</th>
          <th>Результат</th>
          <th>Время</th>
          <th>Статус</th>
        </tr>
      </thead>
      <tbody>
        ${attempts.slice(0, 10).map(attempt => `
          <tr onclick="showAttemptDetails(${attempt.id})" style="cursor: pointer;">
            <td>${new Date(attempt.date).toLocaleDateString('ru-RU')}</td>
            <td>${attempt.examType}</td>
            <td>${attempt.percentage}% (${attempt.totalScore}/${attempt.maxScore})</td>
            <td>${formatTime(attempt.timeSpent)}</td>
            <td>
              <span class="status-badge ${attempt.isPassed ? 'passed' : 'failed'}">
                ${attempt.isPassed ? 'Сдан' : 'Не сдан'}
              </span>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    
    ${attempts.length > 10 ? 
      `<p style="text-align: center; margin-top: 10px;">Показано 10 из ${attempts.length} попыток</p>` : 
      ''
    }
  `;
}

function showAttemptDetails(attemptId) {
  const attempt = examStats.attempts.find(a => a.id === attemptId);
  if (!attempt) return;
  
  const details = attempt.detailedResults.map((result, index) => `
    <div class="attempt-detail">
      <p><strong>Вопрос ${index + 1}:</strong> ${result.question || result.description || ''}</p>
      <p>Ваш ответ: ${result.userAnswer}</p>
      <p>Правильный ответ: ${result.correctAnswer}</p>
      <p>Результат: ${result.isCorrect ? '✓ Верно' : '✗ Ошибка'}</p>
    </div>
  `).join('');
  
  alert(`Детали попытки от ${new Date(attempt.date).toLocaleString('ru-RU')}\n\n${details}`);
}

// ====================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ======================

function normalizeText(text) {
  return text.toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function calculateSimilarity(str1, str2) {
  const words1 = str1.split(' ');
  const words2 = str2.split(' ');
  const set1 = new Set(words1);
  const set2 = new Set(words2);
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return union.size > 0 ? intersection.size / union.size : 0;
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert('Код скопирован в буфер обмена!');
  });
}

function restartExam() {
  document.querySelector('.exam-results').style.display = 'none';
  showExamTypeSelector();
}

// ====================== ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ ======================

// Добавляем стили для раздела экзамена
const examStyles = `
  <style>
    .exam-type-selector {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin: 30px 0;
      flex-wrap: wrap;
    }
    
    .exam-type-card {
      background: var(--content-bg);
      border: 2px solid var(--border-color);
      border-radius: 10px;
      padding: 25px;
      width: 250px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .exam-type-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.1);
      border-color: var(--btn-bg);
    }
    
    .exam-type-card i {
      font-size: 40px;
      margin-bottom: 15px;
      color: var(--btn-bg);
    }
    
    .exam-settings {
      background: var(--content-bg);
      padding: 25px;
      border-radius: 10px;
      margin: 20px 0;
    }
    
    .exam-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--content-bg);
      padding: 15px;
      border-radius: 10px;
      margin-bottom: 20px;
    }
    
    .exam-timer {
      font-size: 1.2rem;
      font-weight: bold;
      color: var(--btn-bg);
    }
    
    .exam-progress {
      flex-grow: 1;
      margin: 0 20px;
      text-align: center;
    }
    
    .exam-progress progress {
      width: 100%;
      height: 10px;
      margin-top: 5px;
    }
    
    .test-question, .practice-task, .decode-task {
      background: var(--content-bg);
      padding: 25px;
      border-radius: 10px;
      margin-bottom: 20px;
    }
    
    .question-options {
      margin-top: 20px;
    }
    
    .option {
      background: var(--result-bg);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 12px;
      margin: 8px 0;
      cursor: pointer;
      transition: background 0.3s;
    }
    
    .option:hover {
      background: var(--instructions-bg);
    }
    
    .option input {
      margin-right: 10px;
    }
    
    .task-description {
      background: var(--result-bg);
      padding: 15px;
      border-radius: 6px;
      margin: 15px 0;
    }
    
    .code-display {
      font-family: monospace;
      background: var(--code-bg);
      color: var(--code-text);
      padding: 15px;
      border-radius: 6px;
      margin: 10px 0;
    }
    
    .exam-navigation {
      display: flex;
      justify-content: space-between;
      margin-top: 30px;
    }
    
    .results-summary {
      background: var(--content-bg);
      padding: 25px;
      border-radius: 10px;
    }
    
    .results-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin: 25px 0;
    }
    
    .stat-card {
      background: var(--result-bg);
      border-radius: 10px;
      padding: 20px;
      text-align: center;
      border: 2px solid var(--border-color);
    }
    
    .stat-card.success {
      border-color: var(--success-color);
      background: #d4edda;
    }
    
    .stat-card.error {
      border-color: #dc3545;
      background: #f8d7da;
    }
    
    .stat-value {
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: 10px;
    }
    
    .stat-label {
      font-size: 0.9rem;
      color: #666;
    }
    
    .details-table {
      margin-top: 20px;
    }
    
    .detail-row {
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 15px;
      margin: 10px 0;
    }
    
    .detail-row.correct {
      background: #d4edda;
      border-color: #c3e6cb;
    }
    
    .detail-row.incorrect {
      background: #f8d7da;
      border-color: #f5c6cb;
    }
    
    .results-actions {
      display: flex;
      justify-content: center;
      gap: 15px;
      margin-top: 30px;
      flex-wrap: wrap;
    }
    
    .exam-history {
      background: var(--content-bg);
      padding: 25px;
      border-radius: 10px;
      margin-top: 30px;
    }
    
    .history-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }
    
    .history-table th, .history-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid var(--border-color);
    }
    
    .history-table tr:hover {
      background: var(--result-bg);
    }
    
    .status-badge {
      padding: 5px 10px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: bold;
    }
    
    .status-badge.passed {
      background: #d4edda;
      color: #155724;
    }
    
    .status-badge.failed {
      background: #f8d7da;
      color: #721c24;
    }
    
    .certificates-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    
    .certificate-card {
      border: 1px solid var(--border-color);
      border-radius: 10px;
      overflow: hidden;
    }
    
    .certificate-header {
      padding: 20px;
      text-align: center;
      color: white;
    }
    
    .certificate-header i {
      font-size: 40px;
      margin-bottom: 10px;
    }
    
    .certificate-body {
      padding: 20px;
      background: var(--content-bg);
    }
    
    @media (max-width: 768px) {
      .exam-type-selector {
        flex-direction: column;
        align-items: center;
      }
      
      .exam-type-card {
        width: 100%;
        max-width: 300px;
      }
      
      .exam-header {
        flex-direction: column;
        gap: 15px;
      }
      
      .results-stats {
        grid-template-columns: 1fr 1fr;
      }
      
      .results-actions {
        flex-direction: column;
      }
    }
  </style>
`;

// Добавляем стили в head при загрузке
document.addEventListener('DOMContentLoaded', function() {
  if (!document.getElementById('exam-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'exam-styles';
    styleElement.innerHTML = examStyles;
    document.head.appendChild(styleElement);
  }
  
  // Инициализируем страницу экзамена
  initExamPage();
});

// Экспортируем функции для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initExamPage,
    calculateResults,
    checkForCertificate
  };
}

// ====================== ФУНКЦИИ ДЛЯ ОЧИСТКИ ИСТОРИИ ======================

function clearHistory() {
    if (confirm('Вы уверены, что хотите очистить всю историю попыток? Это действие нельзя отменить.')) {
        examStats = {
            attempts: [],
            certificates: examStats.certificates, // Сохраняем сертификаты
            totalScore: 0,
            totalTime: 0
        };
        localStorage.setItem('examStats', JSON.stringify(examStats));
        loadExamHistory();
        alert('История попыток очищена.');
    }
}


function generateCertificateHTML(cert) {
    const issueDate = new Date(cert.date).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    return `
        <div class="certificate-preview" style="
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            border: 15px solid gold;
            border-radius: 20px;
            padding: 40px;
            text-align: center;
            color: #333;
            max-width: 800px;
            margin: 0 auto 30px auto;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            position: relative;
            overflow: hidden;
        ">
            <div style="
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-size: 100% 100%;
                opacity: 0.1;
                z-index: 1;
            "></div>
            
            <div style="position: relative; z-index: 2;">
                <h1 style="font-size: 36px; color: #2c3e50; margin-bottom: 30px; text-transform: uppercase;">
                    <i class="fas fa-award" style="color: gold; margin-right: 15px;"></i>
                    Сертификат
                </h1>
                
                <div style="
                    border: 3px double gold;
                    padding: 30px;
                    margin: 20px 0;
                    background: rgba(255, 255, 255, 0.9);
                    border-radius: 10px;
                ">
                    <p style="font-size: 20px; margin-bottom: 20px;">
                        Настоящий сертификат подтверждает, что
                    </p>
                    
                    <h2 style="
                        font-size: 28px;
                        color: #e74c3c;
                        margin: 20px 0;
                        text-transform: uppercase;
                        font-weight: bold;
                    ">
                        Пользователь Метеокод
                    </h2>
                    
                    <p style="font-size: 20px; margin-bottom: 20px;">
                        успешно освоил программу обучения и продемонстрировал
                    </p>
                    
                    <h3 style="
                        font-size: 24px;
                        color: #2c3e50;
                        margin: 20px 0;
                        padding: 10px;
                        background: linear-gradient(90deg, #f8f9fa, #e9ecef);
                        border-radius: 10px;
                    ">
                        ${cert.name}
                    </h3>
                    
                    <p style="font-size: 18px; margin-bottom: 20px;">
                        ${cert.description}
                    </p>
                    
                    <div style="
                        display: flex;
                        justify-content: space-around;
                        margin: 30px 0;
                        flex-wrap: wrap;
                        gap: 20px;
                    ">
                        <div style="text-align: center;">
                            <div style="font-size: 16px; color: #7f8c8d;">Результат</div>
                            <div style="font-size: 28px; font-weight: bold; color: #27ae60;">${cert.score}%</div>
                        </div>
                        
                        <div style="text-align: center;">
                            <div style="font-size: 16px; color: #7f8c8d;">Дата выдачи</div>
                            <div style="font-size: 22px; font-weight: bold; color: #2c3e50;">${issueDate}</div>
                        </div>
                        
                        <div style="text-align: center;">
                            <div style="font-size: 16px; color: #7f8c8d;">Уровень</div>
                            <div style="font-size: 24px; color: gold;">${'★'.repeat(cert.level)}${'☆'.repeat(3 - cert.level)}</div>
                        </div>
                    </div>
                </div>
                
                <div style="
                    display: flex;
                    justify-content: space-between;
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 2px solid rgba(0,0,0,0.1);
                    flex-wrap: wrap;
                    gap: 20px;
                ">
                    <div style="text-align: left;">
                        <div style="font-weight: bold; margin-bottom: 5px;">Подпись</div>
                        <div style="border-top: 2px solid #333; width: 200px; padding-top: 5px;">
                            Директор Метеокод
                        </div>
                    </div>
                    
                    <div style="text-align: right;">
                        <div style="font-weight: bold; margin-bottom: 5px;">Номер сертификата</div>
                        <div style="font-family: monospace; color: #666;">
                            MET-${Date.now().toString().slice(-8)}
                        </div>
                    </div>
                </div>
                
                <p style="
                    margin-top: 20px;
                    font-size: 14px;
                    color: #666;
                    font-style: italic;
                ">
                    Данный сертификат подтверждает успешное прохождение контрольной работы
                    в системе обучения метеорологическим кодам "Метеокод"
                </p>
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
            <button class="btn btn-primary" onclick="downloadCertificateImage('${cert.name}')">
                <i class="fas fa-download"></i> СКАЧАТЬ СЕРТИФИКАТ (PNG)
            </button>
            <button class="btn" onclick="shareCertificate('${cert.name}')">
                <i class="fas fa-share-alt"></i> ПОДЕЛИТЬСЯ
            </button>
            <button class="btn btn-secondary" onclick="printCertificate('${cert.name}')">
                <i class="fas fa-print"></i> ПЕЧАТЬ
            </button>
        </div>
    `;
}

// Обновлю функцию showCertificates в exam.js:
function showCertificates() {
    const container = document.getElementById('results-content');
    const certificates = examStats.certificates;
    
    if (certificates.length === 0) {
        container.innerHTML = `
            <div class="certificates-view">
                <h2><i class="fas fa-award"></i> ВАШИ СЕРТИФИКАТЫ</h2>
                <div style="text-align: center; margin: 40px 0; padding: 30px; background: var(--result-bg); border-radius: 10px;">
                    <i class="fas fa-certificate" style="font-size: 60px; color: #ccc;"></i>
                    <h3 style="margin: 20px 0;">Сертификатов пока нет</h3>
                    <p>Для получения сертификатов выполните следующие условия:</p>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-top: 20px;">
                        <div class="requirement-card">
                            <h4><i class="fas fa-certificate" style="color: #3498db;"></i> Базовый сертификат</h4>
                            <ul style="text-align: left;">
                                <li>Результат ≥ 80%</li>
                                <li>Минимум 2 практических задания</li>
                                <li>Любой тип контроля</li>
                            </ul>
                        </div>
                        <div class="requirement-card">
                            <h4><i class="fas fa-certificate" style="color: #9b59b6;"></i> Продвинутый уровень</h4>
                            <ul style="text-align: left;">
                                <li>Результат ≥ 85%</li>
                                <li>Минимум 4 задания</li>
                                <li>Только практика/экзамен</li>
                            </ul>
                        </div>
                        <div class="requirement-card">
                            <h4><i class="fas fa-certificate" style="color: #f1c40f;"></i> Эксперт</h4>
                            <ul style="text-align: left;">
                                <li>Результат ≥ 90%</li>
                                <li>Минимум 6 заданий</li>
                                <li>Только экзамен</li>
                                <li>Время ≤ 6 минут</li>
                            </ul>
                        </div>
                    </div>
                    <button class="btn btn-primary" onclick="showExamTypeSelector()" style="margin-top: 30px;">
                        <i class="fas fa-play"></i> НАЧАТЬ КОНТРОЛЬНУЮ РАБОТУ
                    </button>
                </div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="certificates-view">
            <h2><i class="fas fa-award"></i> ВАШИ СЕРТИФИКАТЫ</h2>
            <p style="text-align: center; margin-bottom: 20px; color: #666;">
                Найдено сертификатов: ${certificates.length}
            </p>
            
            <div class="certificates-controls" style="margin-bottom: 20px; text-align: center;">
                <select id="certificate-filter" onchange="filterCertificates()">
                    <option value="all">Все сертификаты</option>
                    <option value="basic">Базовые</option>
                    <option value="advanced">Продвинутые</option>
                    <option value="expert">Экспертные</option>
                </select>
                <input type="text" id="certificate-search" placeholder="Поиск по названию..." 
                       onkeyup="searchCertificates()" style="margin-left: 10px;">
            </div>
            
            <div class="certificates-grid" id="certificates-grid">
                ${certificates.map((cert, index) => `
                    <div class="certificate-card" data-level="${cert.level}">
                        <div class="certificate-header" style="
                            background: ${cert.level === 1 ? 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)' : 
                                      cert.level === 2 ? 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)' :
                                      'linear-gradient(135deg, #f1c40f 0%, #f39c12 100%)'};
                        ">
                            <i class="fas fa-certificate"></i>
                            <h3>${cert.name}</h3>
                            <div class="certificate-level">${'★'.repeat(cert.level)}${'☆'.repeat(3 - cert.level)}</div>
                        </div>
                        <div class="certificate-body">
                            <p><strong>Дата получения:</strong><br>${new Date(cert.date).toLocaleDateString('ru-RU')}</p>
                            <p><strong>Результат:</strong> ${cert.score}%</p>
                            <p><strong>Тип:</strong> ${cert.examType}</p>
                            <div class="certificate-actions">
                                <button class="btn btn-sm" onclick="viewCertificate(${index})">
                                    <i class="fas fa-eye"></i> Просмотр
                                </button>
                                <button class="btn btn-sm btn-secondary" onclick="downloadCertificate('${cert.name}')">
                                    <i class="fas fa-download"></i> Скачать
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Добавлю функцию просмотра сертификата
function viewCertificate(index) {
    const cert = examStats.certificates[index];
    const container = document.getElementById('results-content');
    container.innerHTML = generateCertificateHTML(cert);
}