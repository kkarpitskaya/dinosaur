// Главный файл инициализации игры
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const backgroundAnimation = document.getElementById('backgroundAnimation');
    
    // Устанавливаем фиксированный размер canvas для сохранения качества
    function setCanvasSize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Устанавливаем фиксированные размеры для сохранения пропорций
        canvas.width = width;
        canvas.height = height;
    }
    
    // Создаем анимированные частицы фона
    function createBackgroundParticles() {
        backgroundAnimation.innerHTML = ''; // Очищаем старые частицы
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'background-particle';
            
            // Случайный размер и позиция
            const size = Math.random() * 80 + 40;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}vw`;
            particle.style.animationDuration = `${Math.random() * 25 + 15}s`;
            particle.style.animationDelay = `${Math.random() * 8}s`;
            
            backgroundAnimation.appendChild(particle);
        }
    }
    
    // Инициализация
    setCanvasSize();
    createBackgroundParticles();
    
    // Обработчик изменения размера окна
    window.addEventListener('resize', () => {
        setCanvasSize();
        createBackgroundParticles();
    });
    
    const game = new Game(canvas);
    
    // Запуск игрового цикла
    function gameLoop() {
        game.gameLoop();
        requestAnimationFrame(gameLoop);
    }
    
    gameLoop();
});