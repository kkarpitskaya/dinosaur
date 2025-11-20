class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Игровые состояния
        this.running = false;
        this.paused = false;
        this.gameStarted = false;
        
        // Игровые объекты
        this.player = new Player(canvas);
        this.obstacles = [];
        
        // Системы
        this.renderer = new Renderer(canvas);
        this.inputHandler = new InputHandler(this);
        this.collision = Collision;
        
        // Игровые переменные
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        this.gameSpeed = 8;
        this.lastObstacleTime = 0;
        this.baseObstacleInterval = 1800;
        this.nextObstacleTime = 0;
        this.minObstacleDistance = 300;
        this.maxObstacleDistance = 400;
        
        // UI элементы
        this.scoreElement = document.getElementById('score');
        this.levelElement = document.getElementById('level');
        this.livesElement = document.getElementById('lives');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.restartBtn = document.getElementById('restartBtn');
        this.gameOverScreen = document.getElementById('gameOverScreen');
        this.finalScoreElement = document.getElementById('finalScore');
        this.startScreen = document.getElementById('startScreen');
        this.startGameBtn = document.getElementById('startGameBtn');
        this.restartGameBtn = document.getElementById('restartGameBtn');
        
        this.init();
    }
    
    init() {
        this.updateUI();
        this.showStartScreen();
        this.scheduleNextObstacle();
    }
    
    showStartScreen() {
        this.startScreen.style.display = 'flex';
        this.startBtn.style.display = 'inline-block';
        this.pauseBtn.style.display = 'none';
        this.restartBtn.style.display = 'none';
    }
    
    hideStartScreen() {
        this.startScreen.style.display = 'none';
    }
    
    startFromButton() {
        if (!this.gameStarted) {
            this.startGame();
        } else if (this.paused) {
            this.resume();
        }
    }
    
    startGame() {
        this.gameStarted = true;
        this.running = true;
        this.paused = false;
        this.hideStartScreen();
        this.updateControlButtons();
        this.scheduleNextObstacle();
    }
    
    pause() {
        if (this.running && !this.paused) {
            this.paused = true;
            this.updateControlButtons();
        }
    }
    
    resume() {
        if (this.running && this.paused) {
            this.paused = false;
            this.updateControlButtons();
        }
    }
    
    restart() {
        // Сбрасываем игровые переменные
        this.running = false;
        this.paused = false;
        this.gameStarted = false;
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        this.gameSpeed = 8;
        this.baseObstacleInterval = 1800;
        this.minObstacleDistance = 300;
        this.maxObstacleDistance = 400;
        
        // Обновляем UI
        this.updateUI();
        this.gameOverScreen.style.display = 'none';
        
        // Очищаем массивы объектов
        this.obstacles.length = 0;
        
        // Сбрасываем позицию игрока
        this.player.reset();
        
        this.showStartScreen();
        this.scheduleNextObstacle();
    }
    
    updateControlButtons() {
        if (this.running && !this.paused) {
            this.startBtn.textContent = 'Старт';
            this.startBtn.style.display = 'none';
            this.pauseBtn.style.display = 'inline-block';
            this.restartBtn.style.display = 'inline-block';
        } else if (this.paused) {
            this.startBtn.textContent = 'Продолжить';
            this.startBtn.style.display = 'inline-block';
            this.pauseBtn.style.display = 'none';
            this.restartBtn.style.display = 'inline-block';
        }
    }
    
    gameOver() {
        this.running = false;
        this.gameStarted = false;
        this.finalScoreElement.textContent = this.score;
        this.gameOverScreen.style.display = 'flex';
        this.startBtn.style.display = 'none';
        this.pauseBtn.style.display = 'none';
        this.restartBtn.style.display = 'none';
    }
    
    takeDamage() {
        this.lives--;
        this.livesElement.textContent = this.lives;
        this.livesElement.classList.add('damage');
        setTimeout(() => {
            this.livesElement.classList.remove('damage');
        }, 300);
        
        if (this.lives <= 0) {
            this.gameOver();
        } else {
            // Перезапускаем позицию игрока
            this.player.reset();
            // Очищаем препятствия
            this.obstacles.length = 0;
            this.scheduleNextObstacle();
        }
    }
    
    update() {
        if (!this.running || this.paused) return;
        
        // Обновляем игрока (только физику прыжка)
        this.player.update();
        
        // Обновляем препятствия с текущей скоростью игры
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            this.obstacles[i].update(this.gameSpeed);
            
            // Удаляем препятствия, которые ушли за экран
            if (this.obstacles[i].x + this.obstacles[i].width < 0) {
                this.obstacles.splice(i, 1);
                // Добавляем очки за пройденное препятствие
                this.score += 5;
                this.scoreElement.textContent = this.score;
            }
        }
        
        // Создаем новые препятствия по расписанию
        const currentTime = Date.now();
        if (currentTime >= this.nextObstacleTime) {
            this.createObstacleGroup();
            this.scheduleNextObstacle();
        }
        
        // Проверяем коллизии
        this.checkCollisions();
        
        // Повышаем уровень
        this.updateLevel();
    }
    
    scheduleNextObstacle() {
        // Случайный интервал между группами кактусов
        const randomInterval = this.baseObstacleInterval * (0.7 + Math.random() * 0.8); // 70%-150% от базового
        
        this.nextObstacleTime = Date.now() + randomInterval;
    }
    
    createObstacleGroup() {
        // Случайное количество кактусов в группе (1-2)
        const groupSize = Math.floor(Math.random() * 2) + 1;
        
        for (let i = 0; i < groupSize; i++) {
            const safeX = this.findSafePosition();
            if (safeX !== null) {
                this.createSingleObstacle(safeX);
            }
        }
    }
    
    findSafePosition() {
        let startX;
        
        if (this.obstacles.length === 0) {
            // Первый кактус - создаем за пределами экрана справа
            startX = this.canvas.width + 50;
        } else {
            // Находим самый правый кактус
            const rightmostObstacle = this.obstacles.reduce((rightmost, current) => 
                current.x > rightmost.x ? current : rightmost
            );
            
            // Случайное расстояние между 200 и 400 пикселями
            const distance = this.minObstacleDistance + Math.random() * (this.maxObstacleDistance - this.minObstacleDistance);
            startX = rightmostObstacle.x + rightmostObstacle.width + distance;
        }
        
        // Убеждаемся, что кактус создается за пределами экрана
        return Math.max(startX, this.canvas.width + 50);
    }
    
    createSingleObstacle(x) {
        // Случайный тип кактуса
        const obstacleType = Math.floor(Math.random() * 3);
        
        let width, height;
        
        switch(obstacleType) {
            case 0: // Маленький кактус
                width = 18 + Math.random() * 8;
                height = 30 + Math.random() * 10;
                break;
            case 1: // Средний кактус
                width = 22 + Math.random() * 8;
                height = 40 + Math.random() * 10;
                break;
            case 2: // Большой кактус
                width = 26 + Math.random() * 10;
                height = 50 + Math.random() * 15;
                break;
        }
        
        const obstacle = new Obstacle(this.canvas, x);
        obstacle.width = width;
        obstacle.height = height;
        obstacle.y = this.canvas.height - 50 - obstacle.height;
        obstacle.type = obstacleType;
        
        this.obstacles.push(obstacle);
    }
    
    checkCollisions() {
        // Проверяем столкновение с препятствиями
        if (this.collision.checkPlayerObstacle(this.player, this.obstacles)) {
            this.takeDamage();
            return;
        }
        
        // Проверяем падение (если игрок упал за пределы экрана)
        if (this.collision.checkPlayerFall(this.player, this.canvas)) {
            this.takeDamage();
            return;
        }
    }
    
    updateLevel() {
        const newLevel = Math.floor(this.score / 50) + 1;
        if (newLevel > this.level) {
            this.level = newLevel;
            this.levelElement.textContent = this.level;
            this.levelElement.classList.add('level-up');
            setTimeout(() => {
                this.levelElement.classList.remove('level-up');
            }, 500);
            
            // Увеличиваем скорость игры
            this.gameSpeed = 8 + this.level * 1.0;
            
            // Уменьшаем базовый интервал создания препятствий
            this.baseObstacleInterval = Math.max(1000, 1800 - this.level * 80);
            
            // Уменьшаем расстояние между кактусами с уровнем (делаем игру сложнее)
            this.minObstacleDistance = Math.max(260, 300 - this.level * 5);
            this.maxObstacleDistance = Math.max(300, 400 - this.level * 8);
        }
    }
    
    updateUI() {
        this.scoreElement.textContent = this.score;
        this.levelElement.textContent = this.level;
        this.livesElement.textContent = this.lives;
    }
    
    render() {
        this.renderer.clear();
        this.renderer.drawBackground(this.gameSpeed);
        this.renderer.drawGameObjects(this.player, this.obstacles);
        
        if (this.paused) {
            this.renderer.drawPauseScreen();
        }
    }
    
    gameLoop() {
        this.update();
        this.render();
    }
}

// Класс препятствия (кактус)
class Obstacle {
    constructor(canvas, x) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.x = x;
        this.y = canvas.height - 70;
        this.width = 25;
        this.height = 45;
        this.color = '#388E3C';
        this.type = 1;
    }
    
    update(speed) {
        this.x -= speed;
    }
    
    draw() {
        // Разные цвета для разных типов кактусов
        let color1, color2;
        switch(this.type) {
            case 0: // Маленький - светлее
                color1 = '#66BB6A';
                color2 = '#388E3C';
                break;
            case 1: // Средний - стандартный
                color1 = '#4CAF50';
                color2 = '#2E7D32';
                break;
            case 2: // Большой - темнее
                color1 = '#388E3C';
                color2 = '#1B5E20';
                break;
        }
        
        // Рисуем кактус с градиентом
        const gradient = this.ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Рисуем иголки
        this.ctx.fillStyle = '#1B5E20';
        const needleCount = 2 + this.type;
        
        for (let i = 0; i < needleCount; i++) {
            const yPos = this.y + 8 + (i * (this.height - 16) / needleCount);
            this.ctx.fillRect(this.x - 5, yPos, 5, 6);
            this.ctx.fillRect(this.x + this.width, yPos, 5, 6);
        }
        
        // Добавляем детали на кактус
        this.ctx.fillStyle = color1 === '#66BB6A' ? '#81C784' : '#66BB6A';
        for (let i = 0; i < 3; i++) {
            this.ctx.fillRect(this.x + 4, this.y + 6 + i * 14, this.width - 8, 3);
        }
        
        // Добавляем тень под кактусом
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.fillRect(this.x - 4, this.canvas.height - 50, this.width + 8, 4);
    }
    
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}