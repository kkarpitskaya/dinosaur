class InputHandler {
    constructor(game) {
        this.game = game;
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (!this.game.running || this.game.paused) return;
            
            switch(e.code) {
                case 'Space':
                case 'ArrowUp':
                    e.preventDefault();
                    this.game.player.jump();
                    break;
            }
        });

        // Обработчики для кнопок UI
        document.getElementById('startBtn').addEventListener('click', () => {
            this.game.startFromButton();
        });
        
        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.game.pause();
        });
        
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.game.restart();
        });
        
        document.getElementById('restartGameBtn').addEventListener('click', () => {
            this.game.restart();
        });
        
        // Обработчик для кнопки "Начать игру" на стартовом экране
        document.getElementById('startGameBtn').addEventListener('click', () => {
            this.game.startGame();
        });
    }
}