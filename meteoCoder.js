let currentEncodeExercise = null;
let trainerStats = JSON.parse(localStorage.getItem('trainerStats') || '{"level":1,"totalDecoded":0,"correctDecoded":0,"sessionDecoded":0,"sessionCorrect":0,"errorsByType":{"metar":0,"kn01":0,"taf":0,"gamet":0,"sigmet":0,"warep":0,"kn04":0,"airmet":0}}');
let currentPracticeCode = null;
let hintStep = 0;

// Система достижений (бейджи)
const achievementsSystem = {
    achievements: JSON.parse(localStorage.getItem('meteoAchievements') || '[]'),
    
    badges: {
        firstDecode: { id: 'firstDecode', name: 'Первый шаг', description: 'Расшифруйте первый код', icon: '🥇', earned: false },
        speedMaster: { id: 'speedMaster', name: 'Скоростник', description: 'Наберите 1000 очков в играх', icon: '⚡', earned: false },
        codeExpert: { id: 'codeExpert', name: 'Эксперт кодов', description: 'Расшифруйте 50 кодов', icon: '🔍', earned: false },
        gameMaster: { id: 'gameMaster', name: 'Мастер игр', description: 'Пройдите все мини-игры', icon: '🎮', earned: false },
        perfectScore: { id: 'perfectScore', name: 'Перфекционист', description: 'Получите 100% точность', icon: '💯', earned: false },
        metarPro: { id: 'metarPro', name: 'METAR Профи', description: 'Расшифруйте 20 METAR кодов', icon: '✈️', earned: false },
        tafExpert: { id: 'tafExpert', name: 'TAF Специалист', description: 'Расшифруйте 10 TAF кодов', icon: '📊', earned: false }
    },

    checkAchievements() {
        this.updateBadgeStatus();
        this.saveAchievements();
        this.displayNewBadges();
    },

    updateBadgeStatus() {
        // Первый шаг
        if (trainerStats.totalDecoded > 0 && !this.badges.firstDecode.earned) {
            this.unlockBadge('firstDecode');
        }

        // Скоростник
        const totalPoints = Object.values(miniStats || {}).reduce((sum, stat) => sum + (stat.totalPoints || 0), 0);
        if (totalPoints >= 1000 && !this.badges.speedMaster.earned) {
            this.unlockBadge('speedMaster');
        }

        // Эксперт кодов
        if (trainerStats.totalDecoded >= 50 && !this.badges.codeExpert.earned) {
            this.unlockBadge('codeExpert');
        }

        // Мастер игр (проверяем, что во всех играх есть хотя бы одна победа)
        const games = ['find-error', 'guess-code', 'speed-decode', 'code-builder', 'quiz-bowl'];
        const allGamesPlayed = games.every(game => miniStats[game]?.wins > 0);
        if (allGamesPlayed && !this.badges.gameMaster.earned) {
            this.unlockBadge('gameMaster');
        }

        // Перфекционист
        if (trainerStats.sessionDecoded > 5 && 
            (trainerStats.sessionCorrect / trainerStats.sessionDecoded) === 1 && 
            !this.badges.perfectScore.earned) {
            this.unlockBadge('perfectScore');
        }

        // METAR Профи
        if (trainerStats.totalDecoded >= 20 && !this.badges.metarPro.earned) {
            this.unlockBadge('metarPro');
        }

        // TAF Специалист
        if (trainerStats.errorsByType.taf >= 10 && !this.badges.tafExpert.earned) {
            this.unlockBadge('tafExpert');
        }
    },

    unlockBadge(badgeId) {
        if (!this.badges[badgeId] || this.badges[badgeId].earned) return;
        
        this.badges[badgeId].earned = true;
        this.achievements.push({
            id: badgeId,
            name: this.badges[badgeId].name,
            icon: this.badges[badgeId].icon,
            description: this.badges[badgeId].description,
            date: new Date().toISOString()
        });
        this.showBadgeNotification(this.badges[badgeId]);
    },

    showBadgeNotification(badge) {
        const notification = document.createElement('div');
        notification.className = 'badge-notification';
        notification.innerHTML = `
            <div class="badge-notification-content">
                <span class="badge-icon">${badge.icon}</span>
                <div>
                    <div class="badge-title">Достижение разблокировано!</div>
                    <div class="badge-name">${badge.name}</div>
                    <div class="badge-desc">${badge.description}</div>
                </div>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideInRight 0.5s ease-out;
            max-width: 300px;
            border-left: 4px solid gold;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease-in forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, 4000);
    },

    displayAchievementsModal() {
        const modal = document.createElement('div');
        modal.className = 'achievements-modal';
        modal.innerHTML = `
            <div class="achievements-content">
                <h3>🏆 Мои достижения</h3>
                <div class="achievements-list">
                    ${Object.values(this.badges).map(badge => `
                        <div class="achievement-item ${badge.earned ? 'earned' : 'locked'}">
                            <span class="achievement-icon">${badge.earned ? badge.icon : '🔒'}</span>
                            <div class="achievement-info">
                                <div class="achievement-name">${badge.name}</div>
                                <div class="achievement-desc">${badge.description}</div>
                                <div class="achievement-status">${badge.earned ? '✔️ Получено' : '🔒 Не разблокировано'}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <button class="btn" onclick="achievementsSystem.closeAchievementsModal()">Закрыть</button>
            </div>
        `;

        document.body.appendChild(modal);
    },

    closeAchievementsModal() {
        const modal = document.querySelector('.achievements-modal');
        if (modal) {
            modal.remove();
        }
    },

    saveAchievements() {
        localStorage.setItem('meteoAchievements', JSON.stringify(this.achievements));
    },

    loadAchievements() {
        const saved = JSON.parse(localStorage.getItem('meteoAchievements') || '[]');
        this.achievements = saved;
        // Обновляем статусы бейджей
        saved.forEach(achievement => {
            if (this.badges[achievement.id]) {
                this.badges[achievement.id].earned = true;
            }
        });
    }
};

// Система настроек внешнего вида
const appearanceSettings = {
    settings: JSON.parse(localStorage.getItem('meteoAppearance') || '{"theme":"auto","fontSize":"medium","animations":true,"highContrast":false}'),

    init() {
        this.applySettings();
        this.createSettingsPanel();
    },

    applySettings() {
        // Применяем тему
        if (this.settings.theme === 'dark') {
            document.body.classList.add('dark');
            document.body.classList.remove('light');
        } else if (this.settings.theme === 'light') {
            document.body.classList.add('light');
            document.body.classList.remove('dark');
        } else {
            // Авто тема
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.body.classList.add('dark');
                document.body.classList.remove('light');
            } else {
                document.body.classList.add('light');
                document.body.classList.remove('dark');
            }
        }

        // Применяем размер шрифта
        document.body.classList.remove('font-small', 'font-medium', 'font-large');
        document.body.classList.add(`font-${this.settings.fontSize}`);

        // Применяем настройки анимаций
        if (!this.settings.animations) {
            document.body.classList.add('no-animations');
        } else {
            document.body.classList.remove('no-animations');
        }

        // Применяем высокую контрастность
        if (this.settings.highContrast) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }
    },

    createSettingsPanel() {
        const settingsBtn = document.createElement('button');
        settingsBtn.className = 'btn btn-secondary settings-btn';
        settingsBtn.innerHTML = '<i class="fas fa-cog"></i> Настройки';
        settingsBtn.onclick = () => this.showSettingsModal();
        
        const header = document.querySelector('header');
        if (header) {
            header.style.position = 'relative';
            header.appendChild(settingsBtn);
        }
    },

    showSettingsModal() {
        const modal = document.createElement('div');
        modal.className = 'settings-modal';
        modal.innerHTML = `
            <div class="settings-content">
                <h3><i class="fas fa-palette"></i> Настройки внешнего вида</h3>
                
                <div class="setting-group">
                    <label><i class="fas fa-paint-brush"></i> Тема:</label>
                    <select id="theme-select">
                        <option value="auto">Авто (системная)</option>
                        <option value="light">Светлая</option>
                        <option value="dark">Тёмная</option>
                    </select>
                </div>

                <div class="setting-group">
                    <label><i class="fas fa-text-height"></i> Размер шрифта:</label>
                    <select id="font-size-select">
                        <option value="small">Маленький</option>
                        <option value="medium">Средний</option>
                        <option value="large">Большой</option>
                    </select>
                </div>

                <div class="setting-group">
                    <label>
                        <input type="checkbox" id="animations-checkbox"> <i class="fas fa-film"></i> Анимации
                    </label>
                </div>

                <div class="setting-group">
                    <label>
                        <input type="checkbox" id="high-contrast-checkbox"> <i class="fas fa-eye"></i> Высокая контрастность
                    </label>
                </div>

                <div class="settings-buttons">
                    <button class="btn btn-primary" onclick="appearanceSettings.saveSettings()">
                        <i class="fas fa-save"></i> Сохранить
                    </button>
                    <button class="btn btn-secondary" onclick="appearanceSettings.closeModal()">
                        <i class="fas fa-times"></i> Отмена
                    </button>
                </div>
            </div>
        `;

        // Заполняем текущие значения
        setTimeout(() => {
            document.getElementById('theme-select').value = this.settings.theme;
            document.getElementById('font-size-select').value = this.settings.fontSize;
            document.getElementById('animations-checkbox').checked = this.settings.animations;
            document.getElementById('high-contrast-checkbox').checked = this.settings.highContrast;
        }, 0);

        document.body.appendChild(modal);
    },

    saveSettings() {
        this.settings = {
            theme: document.getElementById('theme-select').value,
            fontSize: document.getElementById('font-size-select').value,
            animations: document.getElementById('animations-checkbox').checked,
            highContrast: document.getElementById('high-contrast-checkbox').checked
        };

        localStorage.setItem('meteoAppearance', JSON.stringify(this.settings));
        this.applySettings();
        this.closeModal();
        
        // Показываем уведомление об успешном сохранении
        this.showSaveNotification();
    },

    showSaveNotification() {
        const notification = document.createElement('div');
        notification.className = 'save-notification';
        notification.textContent = 'Настройки сохранены!';
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #27ae60;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 10000;
            animation: fadeInOut 2s ease-in-out;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 2000);
    },

    closeModal() {
        const modal = document.querySelector('.settings-modal');
        if (modal) {
            modal.remove();
        }
    }
};

// Система истории и избранного
const historySystem = {
    history: JSON.parse(localStorage.getItem('meteoHistory') || '[]'),
    favorites: JSON.parse(localStorage.getItem('meteoFavorites') || '[]'),

    addToHistory(code, decoded, type = 'metar') {
        const entry = {
            id: Date.now(),
            code: code,
            decoded: decoded,
            type: type,
            timestamp: new Date().toISOString()
        };

        // Проверяем, нет ли уже такого кода в истории (чтобы избежать дублирования)
        const existingIndex = this.history.findIndex(item => item.code === code);
        if (existingIndex >= 0) {
            this.history.splice(existingIndex, 1);
        }

        this.history.unshift(entry);
        
        // Ограничиваем историю 100 записями
        if (this.history.length > 100) {
            this.history = this.history.slice(0, 100);
        }

        this.saveHistory();
        this.updateHistoryUI();
    },

    toggleFavorite(code, decoded, type = 'metar') {
        const existingIndex = this.favorites.findIndex(fav => fav.code === code);
        let isAdded = false;
        
        if (existingIndex >= 0) {
            this.favorites.splice(existingIndex, 1);
            isAdded = false;
        } else {
            this.favorites.unshift({
                id: Date.now(),
                code: code,
                decoded: decoded,
                type: type,
                timestamp: new Date().toISOString()
            });
            isAdded = true;
        }

        this.saveFavorites();
        this.updateFavoritesUI();
        return isAdded;
    },

    saveHistory() {
        localStorage.setItem('meteoHistory', JSON.stringify(this.history));
    },

    saveFavorites() {
        localStorage.setItem('meteoFavorites', JSON.stringify(this.favorites));
    },

    updateHistoryUI() {
        // Обновляем счетчик истории в интерфейсе если нужно
        const historyBtn = document.querySelector('.history-btn');
        if (historyBtn && this.history.length > 0) {
            historyBtn.innerHTML = `<i class="fas fa-history"></i> История (${this.history.length})`;
        }
    },

    updateFavoritesUI() {
        // Обновляем счетчик избранного если нужно
        const favoritesBtn = document.querySelector('.favorites-btn');
        if (favoritesBtn && this.favorites.length > 0) {
            favoritesBtn.innerHTML = `<i class="fas fa-star"></i> Избранное (${this.favorites.length})`;
        }
    },

    showHistoryModal() {
        const modal = document.createElement('div');
        modal.className = 'history-modal';
        modal.innerHTML = `
            <div class="history-content">
                <div class="history-header">
                    <h3><i class="fas fa-history"></i> История расшифровок</h3>
                    <div class="history-tabs">
                        <button class="tab-btn active" onclick="historySystem.switchTab('history')">История</button>
                        <button class="tab-btn" onclick="historySystem.switchTab('favorites')">Избранное</button>
                    </div>
                </div>
                <div class="history-list" id="history-list">
                    ${this.history.length > 0 ? 
                        this.history.map(entry => `
                            <div class="history-item">
                                <div class="history-type">${entry.type.toUpperCase()}</div>
                                <div class="history-code">${entry.code}</div>
                                <div class="history-decoded">${entry.decoded.split('\n').slice(0, 3).join('\n')}...</div>
                                <div class="history-timestamp">${new Date(entry.timestamp).toLocaleString()}</div>
                                <div class="history-actions">
                                    <button class="btn-small" onclick="historySystem.useHistoryItem('${entry.id}')">
                                        <i class="fas fa-play"></i> Использовать
                                    </button>
                                    <button class="btn-small ${this.favorites.some(fav => fav.code === entry.code) ? 'favorited' : ''}" 
                                            onclick="historySystem.toggleFavoriteFromHistory('${entry.id}')">
                                        ${this.favorites.some(fav => fav.code === entry.code) ? '★' : '☆'}
                                    </button>
                                    <button class="btn-small btn-danger" onclick="historySystem.deleteHistoryItem('${entry.id}')">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        `).join('') : 
                        '<div class="empty-state">История пуста</div>'
                    }
                </div>
                <div class="modal-actions">
                    <button class="btn btn-secondary" onclick="historySystem.clearHistory()">
                        <i class="fas fa-broom"></i> Очистить историю
                    </button>
                    <button class="btn" onclick="historySystem.closeModal()">
                        <i class="fas fa-times"></i> Закрыть
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    },

    switchTab(tabName) {
        const historyList = document.getElementById('history-list');
        const tabBtns = document.querySelectorAll('.tab-btn');
        
        tabBtns.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');

        if (tabName === 'history') {
            historyList.innerHTML = this.history.length > 0 ? 
                this.history.map(entry => `
                    <div class="history-item">
                        <div class="history-type">${entry.type.toUpperCase()}</div>
                        <div class="history-code">${entry.code}</div>
                        <div class="history-decoded">${entry.decoded.split('\n').slice(0, 3).join('\n')}...</div>
                        <div class="history-timestamp">${new Date(entry.timestamp).toLocaleString()}</div>
                        <div class="history-actions">
                            <button class="btn-small" onclick="historySystem.useHistoryItem('${entry.id}')">
                                <i class="fas fa-play"></i> Использовать
                            </button>
                            <button class="btn-small ${this.favorites.some(fav => fav.code === entry.code) ? 'favorited' : ''}" 
                                    onclick="historySystem.toggleFavoriteFromHistory('${entry.id}')">
                                ${this.favorites.some(fav => fav.code === entry.code) ? '★' : '☆'}
                            </button>
                            <button class="btn-small btn-danger" onclick="historySystem.deleteHistoryItem('${entry.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `).join('') : 
                '<div class="empty-state">История пуста</div>';
        } else {
            historyList.innerHTML = this.favorites.length > 0 ? 
                this.favorites.map(entry => `
                    <div class="history-item favorite-item">
                        <div class="history-type">${entry.type.toUpperCase()}</div>
                        <div class="history-code">${entry.code}</div>
                        <div class="history-decoded">${entry.decoded.split('\n').slice(0, 3).join('\n')}...</div>
                        <div class="history-timestamp">${new Date(entry.timestamp).toLocaleString()}</div>
                        <div class="history-actions">
                            <button class="btn-small" onclick="historySystem.useHistoryItem('${entry.id}', true)">
                                <i class="fas fa-play"></i> Использовать
                            </button>
                            <button class="btn-small favorited" onclick="historySystem.toggleFavoriteFromHistory('${entry.id}', true)">
                                ★
                            </button>
                        </div>
                    </div>
                `).join('') : 
                '<div class="empty-state">В избранном ничего нет</div>';
        }
    },

    useHistoryItem(id, fromFavorites = false) {
        const source = fromFavorites ? this.favorites : this.history;
        const entry = source.find(item => item.id == id);
        if (entry) {
            document.getElementById('metar-input').value = entry.code;
            this.closeModal();
        }
    },

    toggleFavoriteFromHistory(id, fromFavorites = false) {
        const source = fromFavorites ? this.favorites : this.history;
        const entry = source.find(item => item.id == id);
        if (entry) {
            const isAdded = this.toggleFavorite(entry.code, entry.decoded, entry.type);
            
            // Показываем уведомление
            this.showFavoriteNotification(isAdded, entry.code);
            
            // Обновляем модалку
            this.showHistoryModal();
        }
    },

    showFavoriteNotification(isAdded, code) {
        const notification = document.createElement('div');
        notification.className = 'favorite-notification';
        notification.innerHTML = isAdded ? 
            `★ Добавлено в избранное: ${code}` : 
            `☆ Удалено из избранного: ${code}`;
        
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: ${isAdded ? '#27ae60' : '#e74c3c'};
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 10000;
            animation: fadeInOut 2s ease-in-out;
            max-width: 400px;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 2000);
    },

    deleteHistoryItem(id) {
        if (confirm('Удалить эту запись из истории?')) {
            this.history = this.history.filter(item => item.id != id);
            this.saveHistory();
            this.showHistoryModal(); // Перезагружаем модалку
        }
    },

    clearHistory() {
        if (confirm('Очистить всю историю? Это действие нельзя отменить.')) {
            this.history = [];
            this.saveHistory();
            this.showHistoryModal(); // Перезагружаем модалку
        }
    },

    closeModal() {
        const modal = document.querySelector('.history-modal');
        if (modal) {
            modal.remove();
        }
    }
};

// Улучшенный парсер METAR с валидацией
function parseMetar(metar) {
    try {
        if (!metar || typeof metar !== 'string') {
            throw new Error('Пустой или неверный формат кода');
        }

        const originalCode = metar.trim().toUpperCase();
        if (originalCode.length < 10) {
            throw new Error('Слишком короткий код METAR');
        }

        const parts = originalCode.replace(/=+$/, '').split(/\s+/);
        
        if (parts.length < 3) {
            throw new Error('Слишком короткий код METAR. Минимум 3 группы: аэродром, время, данные');
        }

        let i = 0;
        const out = [];
        const errors = [];
        const warnings = [];

        // Валидация типа
        if (parts[i] === 'METAR' || parts[i] === 'SPECI') {
            out.push(`📋 Тип: ${parts[i]}`);
            i++;
        } else {
            warnings.push('Рекомендуется указать тип METAR/SPECI в начале');
        }

        // Валидация аэродрома
        if (i < parts.length && /^[A-Z]{4}$/.test(parts[i])) {
            out.push(`🏢 Аэродром: ${parts[i]}`);
            i++;
        } else {
            errors.push(`Неверный код аэродрома: "${parts[i]}" (должен быть 4 заглавные буквы)`);
            if (i < parts.length) i++;
        }

        // Валидация времени
        if (i < parts.length && /^\d{6}Z$/.test(parts[i])) {
            const d = parts[i];
            const day = d.slice(0,2);
            const hour = d.slice(2,4);
            const minute = d.slice(4,6);
            out.push(`🕐 Время наблюдения: ${day} число, ${hour}:${minute} UTC`);
            i++;
        } else {
            errors.push(`Неверный формат времени: "${parts[i]}" (должен быть DDhhmmZ)`);
            if (i < parts.length) i++;
        }

        // Автоматический отчет
        if (i < parts.length && parts[i] === 'AUTO') {
            out.push('🤖 Отчёт автоматический');
            i++;
        }

        // Корректированный отчет
        if (i < parts.length && parts[i] === 'COR') {
            out.push('✏️ Отчёт исправленный');
            i++;
        }

        // Валидация ветра
        const windRe = /^(VRB|\d{3})(\d{2,3})(G(\d{2,3}))?(KT|MPS|KMH)$/;
        if (i < parts.length && windRe.test(parts[i])) {
            const m = parts[i].match(windRe);
            const dir = m[1] === 'VRB' ? 'переменного направления' : m[1] === '000' ? 'штиль' : `${m[1]}°`;
            const speed = m[2];
            const gust = m[4] ? `, порывы до ${m[4]} ${m[5]}` : '';
            const unit = m[5] === 'KT' ? 'узлов' : m[5] === 'MPS' ? 'м/с' : 'км/ч';
            out.push(`💨 Ветер: ${dir}, ${speed} ${unit}${gust}`);
            i++;
        } else if (i < parts.length && parts[i]) {
            errors.push(`Неверный формат ветра: "${parts[i]}" (пример: 05007MPS или VRB02KT)`);
            i++;
        }

        // Изменение направления ветра
        if (i < parts.length && /^\d{3}V\d{3}$/.test(parts[i])) {
            out.push(`🔄 Изменение направления ветра: от ${parts[i].slice(0,3)}° до ${parts[i].slice(5,8)}°`);
            i++;
        }

        // Видимость
        if (i < parts.length && parts[i] === 'CAVOK') {
            out.push('☀️ CAVOK — видимость ≥10 км, нет значимой погоды и облачности ниже 1500 м (5000 ft), нет CB/TCU');
            i++;
        } else if (i < parts.length && /^\d{4}$/.test(parts[i])) {
            const visibility = parseInt(parts[i]);
            if (visibility === 9999) {
                out.push('👁️ Преобладающая видимость: 10 км или более');
            } else {
                out.push(`👁️ Преобладающая видимость: ${visibility} метров`);
            }
            i++;
        } else if (i < parts.length && parts[i]) {
            errors.push(`Неверный формат видимости: "${parts[i]}" (должен быть CAVOK или 4 цифры)`);
            i++;
        }

        // RVR (Дальность видимости на ВПП)
        while (i < parts.length && /^R\d{2}[LCR]?\/.*/.test(parts[i])) {
            const rvr = parts[i].match(/^R(\d{2}[LCR]?)\/(P|M)?(\d{4})(V(\d{4}))?(U|D|N)?$/);
            if (rvr) {
                let vis = rvr[3];
                const prefix = rvr[2] === 'P' ? 'более ' : rvr[2] === 'M' ? 'менее ' : '';
                const varVis = rvr[5] ? ` изменяется до ${rvr[5]}` : '';
                const trend = rvr[6] === 'U' ? ' улучшается' : rvr[6] === 'D' ? ' ухудшается' : rvr[6] === 'N' ? ' без изменений' : '';
                out.push(`🛣️ RVR на ВПП ${rvr[1]}: ${prefix}${vis} м${varVis}${trend}`);
            } else {
                out.push(`🛣️ Дальность видимости на ВПП: ${parts[i]}`);
            }
            i++;
        }

        // Погодные явления
        while (i < parts.length && /^[+-]?(VC)?(MI|BC|PR|DR|BL|SH|TS|FZ)?(DZ|RA|SN|SG|IC|PL|GR|GS|UP)?(BR|FG|FU|VA|DU|SA|HZ|PY)?(PO|SQ|FC|SS|DS)?$/.test(parts[i])) {
            let code = parts[i];
            let intensity = code[0] === '+' ? 'сильный ' : code[0] === '-' ? 'слабый ' : '';
            if ('+-'.includes(code[0])) code = code.slice(1);
            let descr = '', precip = '', obsc = '', other = '';
            if (code.startsWith('VC')) { descr += 'в окрестностях '; code = code.slice(2); }
            for (const key of ['MI','BC','PR','DR','BL','SH','TS','FZ']) if (code.startsWith(key)) { descr += WEATHER_CODES[key] + ' '; code = code.slice(key.length); }
            for (const key of ['DZ','RA','SN','SG','IC','PL','GR','GS','UP']) if (code.startsWith(key)) { precip += WEATHER_CODES[key] + ' '; code = code.slice(key.length); }
            for (const key of ['BR','FG','FU','VA','DU','SA','HZ','PY']) if (code.startsWith(key)) { obsc += WEATHER_CODES[key] + ' '; code = code.slice(key.length); }
            for (const key of ['PO','SQ','FC','SS','DS']) if (code.startsWith(key)) { other += WEATHER_CODES[key] + ' '; code = code.slice(key.length); }
            if (code) {
                errors.push(`Неизвестный код погоды: "${parts[i]}"`);
            } else {
                out.push(`🌤️ Текущая погода: ${intensity}${descr}${precip}${obsc}${other}`.trim());
            }
            i++;
        }

        // Облачность
        while (i < parts.length && (/^(FEW|SCT|BKN|OVC|NSC|SKC|CLR|\/\/\/)\d{3}(CB|TCU|\/\/\/)?$/.test(parts[i]) || /^VV\d{3}$/.test(parts[i]))) {
            if (/^VV\d{3}$/.test(parts[i])) {
                const height = parseInt(parts[i].slice(2)) * 30;
                out.push(`☁️ Вертикальная видимость: ${height} м`);
                i++;
                continue;
            }
            const m = parts[i].match(/^(FEW|SCT|BKN|OVC|NSC|SKC|CLR|\/\/\/)(\d{3}|\/\/\/)(CB|TCU|\/\/\/)?$/);
            const cov = CLOUD_TYPES[m[1]] || m[1];
            const height = m[2] === '///' ? '' : `${parseInt(m[2]) * 30} м (${parseInt(m[2]) * 100} футов)`;
            const type = m[3] && m[3] !== '///' ? CLOUD_SUFFIX[m[3]] : '';
            out.push(`☁️ Облачность: ${cov}${height ? ', высота ' + height : ''}${type ? ', ' + type : ''}`);
            i++;
        }

        // Температура и точка росы
        if (i < parts.length && /^(M?\d{2})\/(M?\d{2})$/.test(parts[i])) {
            let [t, td] = parts[i].split('/');
            t = t.startsWith('M') ? '-' + t.slice(1) : t;
            td = td.startsWith('M') ? '-' + td.slice(1) : td;
            out.push(`🌡️ Температура воздуха: ${t}°C, точка росы: ${td}°C`);
            i++;
        } else if (i < parts.length && parts[i]) {
            errors.push(`Неверный формат температуры: "${parts[i]}" (должен быть TT/TdTd или MTT/MTdTd)`);
            i++;
        }

        // Давление
        if (i < parts.length && /^[QA]\d{4}$/.test(parts[i])) {
            if (parts[i].startsWith('Q')) {
                out.push(`📊 Давление QNH: ${parts[i].slice(1)} гПа`);
            } else {
                const inches = parts[i].slice(1,3) + '.' + parts[i].slice(3);
                out.push(`📊 Давление: ${inches} дюймов рт. ст.`);
            }
            i++;
        } else if (i < parts.length && parts[i]) {
            errors.push(`Неверный формат давления: "${parts[i]}" (должен быть QNNNN или ANNNN)`);
            i++;
        }

        // Дополнительные группы (RMK, NOSIG, etc.)
        while (i < parts.length) {
            if (parts[i].startsWith('RE')) {
                out.push(`🕒 Недавняя погода: ${parseWeather(parts[i].slice(2))}`);
                i++;
            } else if (parts[i].startsWith('WS')) {
                out.push(`💨 Сдвиг ветра: ${parts[i]}`);
                i++;
            } else if (parts[i] === 'RMK') {
                out.push(`📝 Замечания: ${parts.slice(i+1).join(' ')}`);
                break;
            } else if (parts[i] === 'NOSIG') {
                out.push('✅ Без значительных изменений');
                i++;
            } else if (parts[i] === 'TEMPO' || parts[i] === 'BECMG') {
                out.push(`🔄 Тренд: ${parts[i]} ${parts.slice(i+1).join(' ')}`);
                break;
            } else {
                warnings.push(`Неизвестная группа: "${parts[i]}"`);
                i++;
            }
        }

        // Если есть ошибки, добавляем их в вывод
        if (errors.length > 0) {
            out.push('\n--- ❌ Ошибки валидации ---');
            errors.forEach(error => out.push(`• ${error}`));
        }

        // Если есть предупреждения, добавляем их в вывод
        if (warnings.length > 0) {
            out.push('\n--- ⚠️ Предупреждения ---');
            warnings.forEach(warning => out.push(`• ${warning}`));
        }

        // Добавляем подсказки для исправления
        if (errors.length > 0) {
            out.push('\n--- 💡 Рекомендации ---');
            out.push('• Проверьте пробелы между группами');
            out.push('• Убедитесь в правильности формата каждой группы');
            out.push('• Сравните с примером: METAR UUWW 141630Z 05007MPS 9999 SCT020 17/12 Q1011 NOSIG');
        }

        return out.join('\n');

    } catch (error) {
        return `❌ Критическая ошибка парсинга METAR: ${error.message}\n\n🔍 Проверьте:\n• Формат кода (должен быть текстом)\n• Пробелы между группами\n• Корректность обозначений\n• Пример правильного формата: METAR UUWW 141630Z 05007MPS 9999 SCT020 17/12 Q1011 NOSIG`;
    }
}

// Улучшенный парсер TAF с валидацией
function parseTaf(taf) {
    try {
        if (!taf || typeof taf !== 'string') {
            throw new Error('Пустой или неверный формат кода TAF');
        }

        const originalCode = taf.trim().toUpperCase();
        if (originalCode.length < 15) {
            throw new Error('Слишком короткий код TAF');
        }

        const parts = originalCode.split(/\s+/);
        
        if (parts.length < 4) {
            throw new Error('Слишком короткий код TAF. Минимум 4 группы');
        }

        let i = 0;
        const out = ['📋 Прогноз погоды по аэродрому (TAF)'];
        const errors = [];
        const warnings = [];

        // Валидация заголовка TAF
        if (parts[i] === 'TAF') {
            i++;
        } else {
            errors.push('Отсутствует заголовок TAF');
        }

        // AMD или COR
        if (i < parts.length && (parts[i] === 'AMD' || parts[i] === 'COR')) {
            out.push(`✏️ Статус: ${parts[i] === 'AMD' ? 'исправленный' : 'корректированный'}`);
            i++;
        }

        // Валидация аэродрома
        if (i < parts.length && /^[A-Z]{4}$/.test(parts[i])) {
            out.push(`🏢 Аэродром: ${parts[i]}`);
            i++;
        } else {
            errors.push(`Неверный код аэродрома: "${parts[i]}"`);
            if (i < parts.length) i++;
        }

        // Валидация времени выпуска
        if (i < parts.length && /^\d{6}Z/.test(parts[i])) {
            const d = parts[i];
            const day = d.slice(0,2);
            const hour = d.slice(2,4);
            const minute = d.slice(4,6);
            out.push(`🕐 Выпущен: ${day} число, ${hour}:${minute} UTC`);
            i++;
        } else {
            errors.push(`Неверный формат времени выпуска: "${parts[i]}"`);
            if (i < parts.length) i++;
        }

        // Валидация периода действия
        if (i < parts.length && /^\d{4}\/\d{4}$/.test(parts[i])) {
            const [from, to] = parts[i].split('/');
            const fromDay = from.slice(0,2);
            const fromHour = from.slice(2);
            const toDay = to.slice(0,2);
            const toHour = to.slice(2);
            out.push(`📅 Действует: с ${fromDay} ${fromHour}:00 до ${toDay} ${toHour}:00 UTC`);
            i++;
        } else {
            errors.push(`Неверный формат периода действия: "${parts[i]}" (должен быть DDhh/DDhh)`);
            if (i < parts.length) i++;
        }

        let temp = [];
        while (i < parts.length && !['FM','TEMPO','BECMG','PROB30','PROB40'].includes(parts[i])) {
            temp.push(parts[i++]);
        }

        if (temp.length > 0) {
            out.push('\n--- 🌤️ Основной прогноз ---');
            out.push(parseMetar(temp.join(' ')));
        }

        // Обработка изменений (FM, TEMPO, BECMG)
        while (i < parts.length) {
            let line = '';
            let prob = '';

            if (parts[i].startsWith('PROB')) {
                prob = ` (${parts[i]} вероятность) `;
                i++;
            }

            if (i < parts.length) {
                const type = parts[i++];
                
                if (type === 'FM') {
                    if (i < parts.length && /^\d{4}$/.test(parts[i])) {
                        const time = parts[i++];
                        const day = time.slice(0,2);
                        const hour = time.slice(2,4);
                        line += `🔄 ${prob}С ${day} числа ${hour}:00 UTC: `;
                    } else {
                        errors.push(`Неверный формат времени FM: "${parts[i-1]}"`);
                    }
                } else if (type === 'TEMPO' || type === 'BECMG') {
                    if (i < parts.length && /^\d{4}\/\d{4}$/.test(parts[i])) {
                        const period = parts[i++];
                        const [f,t] = period.split('/');
                        const fromDay = f.slice(0,2);
                        const fromHour = f.slice(2);
                        const toDay = t.slice(0,2);
                        const toHour = t.slice(2);
                        line += `🔄 ${prob}${type === 'TEMPO' ? 'Временно' : 'Становясь'} с ${fromDay} ${fromHour}:00 до ${toDay} ${toHour}:00: `;
                    } else {
                        errors.push(`Неверный формат периода ${type}: "${parts[i-1]}"`);
                    }
                } else {
                    warnings.push(`Неизвестный тип изменения: "${type}"`);
                }
            }

            temp = [];
            while (i < parts.length && !['FM','TEMPO','BECMG','PROB30','PROB40'].includes(parts[i])) {
                temp.push(parts[i++]);
            }

            if (line) {
                out.push(`\n${line}`);
                if (temp.length > 0) {
                    out.push(parseMetar(temp.join(' ')));
                }
            }
        }

        // Если есть ошибки, добавляем их в вывод
        if (errors.length > 0) {
            out.push('\n--- ❌ Ошибки валидации TAF ---');
            errors.forEach(error => out.push(`• ${error}`));
        }

        // Если есть предупреждения, добавляем их в вывод
        if (warnings.length > 0) {
            out.push('\n--- ⚠️ Предупреждения TAF ---');
            warnings.forEach(warning => out.push(`• ${warning}`));
        }

        return out.join('\n');

    } catch (error) {
        return `❌ Критическая ошибка парсинга TAF: ${error.message}\n\n🔍 Проверьте:\n• Формат периода действия (DDhh/DDhh)\n• Корректность групп FM/TEMPO/BECMG\n• Синтаксис временных интервалов\n• Пример правильного формата: TAF UUWW 141600Z 1418/1524 03005MPS 9999 BKN015 TX15/1412Z TN10/1503Z`;
    }
}

// Валидатор кодов с детальной проверкой
function validateWeatherCode(code, type = 'metar') {
    const errors = [];
    const warnings = [];
    const suggestions = [];
    
    if (!code || typeof code !== 'string') {
        errors.push('Код не может быть пустым');
        return { isValid: false, errors, warnings, suggestions };
    }

    const normalizedCode = code.trim().toUpperCase();
    const parts = normalizedCode.split(/\s+/);

    // Базовые проверки
    if (parts.length < 3) {
        errors.push('Код слишком короткий (минимум 3 группы)');
    }

    if (normalizedCode.length > 500) {
        warnings.push('Код очень длинный, проверьте правильность');
    }

    // Проверки в зависимости от типа
    if (type === 'metar') {
        if (!normalizedCode.includes('METAR') && !normalizedCode.includes('SPECI')) {
            warnings.push('Рекомендуется указать тип METAR/SPECI в начале');
        }

        // Проверка временной метки
        const timePattern = /\d{6}Z/;
        const hasTime = parts.some(part => timePattern.test(part));
        if (!hasTime) {
            errors.push('Отсутствует временная метка (формат: DDhhmmZ)');
        }

    } else if (type === 'taf') {
        if (!normalizedCode.startsWith('TAF')) {
            errors.push('TAF должен начинаться с ключевого слова TAF');
        }

        // Проверка периода действия для TAF
        const periodPattern = /\d{4}\/\d{4}/;
        const hasPeriod = parts.some(part => periodPattern.test(part));
        if (!hasPeriod) {
            errors.push('Отсутствует период действия (формат: DDhh/DDhh)');
        }
    }

    // Проверка аэродрома
    const stationPattern = /^[A-Z]{4}$/;
    const hasStation = parts.some(part => stationPattern.test(part));
    if (!hasStation) {
        errors.push('Отсутствует или неверный код аэродрома (4 заглавные буквы)');
    }

    // Проверка ветра
    const windPattern = /^(VRB|\d{3})\d{2,3}(G\d{2,3})?(KT|MPS|KMH)$/;
    const hasWind = parts.some(part => windPattern.test(part));
    if (!hasWind) {
        warnings.push('Не найден корректный формат ветра');
    }

    // Проверка видимости
    const visPattern = /^(CAVOK|\d{4})$/;
    const hasVis = parts.some(part => visPattern.test(part));
    if (!hasVis) {
        warnings.push('Не найден корректный формат видимости');
    }

    // Предложения по улучшению
    if (errors.length === 0 && warnings.length > 0) {
        suggestions.push('Код в основном корректен, но есть предупреждения');
    }

    if (parts.some(part => part.length > 10)) {
        suggestions.push('Проверьте группы длиннее 10 символов - возможно ошибка');
    }

    return {
        isValid: errors.length === 0,
        errors: errors,
        warnings: warnings,
        suggestions: suggestions
    };
}

// Функция для показа результатов валидации в интерфейсе
function showValidationResults(validation, inputElement) {
    // Убираем предыдущие сообщения
    const existingMessages = inputElement.parentNode.querySelectorAll('.validation-message');
    existingMessages.forEach(msg => msg.remove());

    // Убираем предыдущие классы
    inputElement.classList.remove('validation-error', 'validation-warning', 'validation-success');

    if (validation.isValid) {
        if (validation.warnings.length === 0) {
            inputElement.classList.add('validation-success');
            const successMsg = document.createElement('div');
            successMsg.className = 'validation-message validation-success';
            successMsg.innerHTML = '✅ Код валиден';
            inputElement.parentNode.appendChild(successMsg);
        } else {
            inputElement.classList.add('validation-warning');
            const warningMsg = document.createElement('div');
            warningMsg.className = 'validation-message validation-warning';
            warningMsg.innerHTML = `⚠️ Есть предупреждения:<br>${validation.warnings.map(w => `• ${w}`).join('<br>')}`;
            inputElement.parentNode.appendChild(warningMsg);
        }
    } else {
        inputElement.classList.add('validation-error');
        const errorMsg = document.createElement('div');
        errorMsg.className = 'validation-message validation-error';
        errorMsg.innerHTML = `❌ Ошибки валидации:<br>${validation.errors.map(e => `• ${e}`).join('<br>')}`;
        if (validation.warnings.length > 0) {
            errorMsg.innerHTML += `<br>⚠️ Предупреждения:<br>${validation.warnings.map(w => `• ${w}`).join('<br>')}`;
        }
        inputElement.parentNode.appendChild(errorMsg);
    }
}

// Улучшенная функция декодирования с валидацией
function decodeCode() {
    const inputElement = document.getElementById('metar-input');
    const input = inputElement.value.trim();
    const resultDiv = document.getElementById('decode-result');
    const codeType = document.querySelector('.code-type-btn.active').dataset.type;
    
    document.getElementById('loading-decode').style.display = 'block';
    
    // Сбрасываем предыдущие результаты
    resultDiv.textContent = '';
    resultDiv.className = 'result';
    
    setTimeout(() => {
        if (!input) {
            resultDiv.textContent = '❌ Ошибка: Пожалуйста, введите код';
            resultDiv.className = 'result error';
            document.getElementById('loading-decode').style.display = 'none';
            
            // Показываем ошибку в поле ввода
            inputElement.classList.add('validation-error');
            return;
        }

        // Валидация кода
        const validation = validateWeatherCode(input, codeType);
        showValidationResults(validation, inputElement);

        if (!validation.isValid) {
            resultDiv.innerHTML = `<strong>❌ Нельзя расшифровать из-за ошибок:</strong><br>${validation.errors.map(err => `• ${err}`).join('<br>')}`;
            if (validation.warnings.length > 0) {
                resultDiv.innerHTML += `<br><strong>⚠️ Предупреждения:</strong><br>${validation.warnings.map(warn => `• ${warn}`).join('<br>')}`;
            }
            resultDiv.className = 'result error';
            document.getElementById('loading-decode').style.display = 'none';
            return;
        }

        let decoded = '';
        if (codeType === 'metar') {
            decoded = parseMetar(input);
        } else if (codeType === 'taf') {
            decoded = parseTaf(input);
        } else {
            decoded = '🔧 Парсер для этого типа кодов в разработке';
        }

        resultDiv.textContent = decoded;
        
        if (decoded.includes('❌ Ошибка') || decoded.includes('Критическая ошибка')) {
            resultDiv.className = 'result error';
        } else {
            resultDiv.className = 'result success';
            
            // Добавляем в историю только если расшифровка успешна
            historySystem.addToHistory(input, decoded, codeType);
            
            // Проверяем достижения
            achievementsSystem.checkAchievements();
            
            // Добавляем кнопку "В избранное"
            addFavoriteButton(input, decoded, codeType);
        }

        document.getElementById('loading-decode').style.display = 'none';
    }, 500);
}

// Функция для добавления кнопки "В избранное"
function addFavoriteButton(code, decoded, type) {
    const existingButton = document.querySelector('.favorite-result-button');
    if (existingButton) {
        existingButton.remove();
    }

    const isFavorited = historySystem.favorites.some(fav => fav.code === code);
    
    const favoriteBtn = document.createElement('button');
    favoriteBtn.className = `btn ${isFavorited ? 'btn-secondary' : 'btn-copy'} favorite-result-button`;
    favoriteBtn.innerHTML = isFavorited ? 
        '<i class="fas fa-star"></i> В избранном' : 
        '<i class="far fa-star"></i> В избранное';
    favoriteBtn.onclick = () => {
        const added = historySystem.toggleFavorite(code, decoded, type);
        favoriteBtn.innerHTML = added ? 
            '<i class="fas fa-star"></i> В избранном' : 
            '<i class="far fa-star"></i> В избранное';
        favoriteBtn.className = `btn ${added ? 'btn-secondary' : 'btn-copy'} favorite-result-button`;
    };

    const resultDiv = document.getElementById('decode-result');
    resultDiv.parentNode.insertBefore(favoriteBtn, resultDiv.nextSibling);
}

// Функция для добавления кнопок в интерфейс
function addInterfaceButtons() {
    const header = document.querySelector('header');
    if (!header) return;

    // Кнопка достижений
    const achievementsBtn = document.createElement('button');
    achievementsBtn.className = 'btn btn-secondary achievements-btn';
    achievementsBtn.innerHTML = '<i class="fas fa-trophy"></i> Достижения';
    achievementsBtn.onclick = () => achievementsSystem.displayAchievementsModal();
    header.appendChild(achievementsBtn);

    // Кнопка истории
    const historyBtn = document.createElement('button');
    historyBtn.className = 'btn btn-secondary history-btn';
    historyBtn.innerHTML = '<i class="fas fa-history"></i> История';
    historyBtn.onclick = () => historySystem.showHistoryModal();
    header.appendChild(historyBtn);

    // Обновляем счетчики
    historySystem.updateHistoryUI();
}

// Real-time валидация при вводе
function setupRealTimeValidation() {
    const metarInput = document.getElementById('metar-input');
    if (metarInput) {
        let validationTimeout;
        
        metarInput.addEventListener('input', function() {
            clearTimeout(validationTimeout);
            
            validationTimeout = setTimeout(() => {
                const code = this.value.trim();
                if (code.length > 10) {
                    const codeType = document.querySelector('.code-type-btn.active').dataset.type;
                    const validation = validateWeatherCode(code, codeType);
                    showValidationResults(validation, this);
                }
            }, 1000);
        });
    }
}

// Остальные существующие функции (без изменений)
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

function parseWeather(code) {
    return code.split(/(?=[A-Z]{2})/).map(c => WEATHER_CODES[c] || c).join(' ');
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
    
    // Очищаем сообщения валидации
    const inputElement = document.getElementById('metar-input');
    const existingMessages = inputElement.parentNode.querySelectorAll('.validation-message');
    existingMessages.forEach(msg => msg.remove());
    inputElement.classList.remove('validation-error', 'validation-warning', 'validation-success');
}

function copyCode(elementId) {
    const el = document.getElementById(elementId);
    const text = (el.value !== undefined) ? el.value : el.textContent;
    navigator.clipboard.writeText(text).then(() => {
        // Показываем уведомление о копировании
        const notification = document.createElement('div');
        notification.textContent = '✅ Код скопирован в буфер обмена!';
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #27ae60;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 10000;
            animation: fadeInOut 2s ease-in-out;
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 2000);
    }).catch(err => {
        console.error('Ошибка копирования: ', err);
        alert('Не удалось скопировать код');
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
function parseKn01(code) { return '🔧 Парсер КН-01 в разработке'; }
function parseGamet(code) { return '🔧 Парсер GAMET в разработке'; }
function parseSigmet(code) { return '🔧 Парсер SIGMET в разработке'; }
function parseWarep(code) { return '🔧 Парсер WAREP в разработке'; }
function parseKn04(code) { return '🔧 Парсер КН-04 в разработке'; }
function parseAirmet(code) { return '🔧 Парсер AIRMET в разработке'; }

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function () {
    newEncodeExercise();
    updateTrainerStats();
    
    // Инициализируем все системы
    achievementsSystem.loadAchievements();
    appearanceSettings.init();
    addInterfaceButtons();
    setupRealTimeValidation();
    
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
    
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
    }
    
    initTopMenu();
});

// Добавляем CSS анимации
const additionalStyles = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translateY(10px); }
        20% { opacity: 1; transform: translateY(0); }
        80% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-10px); }
    }
    
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .validation-success {
        border-color: #27ae60 !important;
        background-color: #d4f8e8 !important;
    }
    
    .validation-warning {
        border-color: #f39c12 !important;
        background-color: #fef5e7 !important;
    }
    
    .validation-error {
        border-color: #e74c3c !important;
        background-color: #fdeaea !important;
    }
    
    .validation-message {
        padding: 8px 12px;
        margin-top: 5px;
        border-radius: 4px;
        font-size: 0.9em;
    }
    
    .validation-message.validation-success {
        background: #d4f8e8;
        color: #27ae60;
        border-left: 4px solid #27ae60;
    }
    
    .validation-message.validation-warning {
        background: #fef5e7;
        color: #f39c12;
        border-left: 4px solid #f39c12;
    }
    
    .validation-message.validation-error {
        background: #fdeaea;
        color: #e74c3c;
        border-left: 4px solid #e74c3c;
    }
    
    .settings-btn, .history-btn, .achievements-btn {
        margin-left: 10px;
        padding: 8px 12px;
        font-size: 0.9em;
    }
    
    .favorite-result-button {
        margin-top: 10px;
    }
    
    .btn-small {
        padding: 4px 8px;
        font-size: 0.8em;
        margin: 2px;
    }
    
    .btn-danger {
        background: #e74c3c;
    }
    
    .btn-danger:hover {
        background: #c0392b;
    }
    
    .favorited {
        background: #f39c12 !important;
    }
`;

// Добавляем стили в документ
const styleElement = document.createElement('style');
styleElement.textContent = additionalStyles;
document.head.appendChild(styleElement);