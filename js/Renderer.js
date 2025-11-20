class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.clouds = [];
        this.initBackground();
    }
    
    initBackground() {
        // Создаем облака для фона
        for (let i = 0; i < 12; i++) {
            this.clouds.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height * 0.7,
                size: Math.random() * 80 + 40,
                speed: Math.random() * 0.8 + 0.3
            });
        }
    }
    
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    drawBackground(gameSpeed = 4) {
        // Рисуем градиентное небо в синих тонах
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#e3f2fd');
        gradient.addColorStop(0.5, '#bbdefb');
        gradient.addColorStop(1, '#90caf9');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Рисуем движущиеся облака (их скорость тоже зависит от gameSpeed)
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        for (let cloud of this.clouds) {
            cloud.x -= cloud.speed * (gameSpeed / 4);
            if (cloud.x + cloud.size * 2 < 0) {
                cloud.x = this.canvas.width + cloud.size;
                cloud.y = Math.random() * this.canvas.height * 0.7;
            }
            
            this.drawCloud(cloud.x, cloud.y, cloud.size);
        }
        
        // Рисуем непрерывную коричневую дорогу без разделительных полос
        this.drawContinuousRoad();
    }
    
    drawContinuousRoad() {
        const roadHeight = 50;
        const roadY = this.canvas.height - roadHeight;
        
        // Коричневый цвет дороги
        const roadGradient = this.ctx.createLinearGradient(0, roadY, 0, this.canvas.height);
        roadGradient.addColorStop(0, '#8B4513'); // Светло-коричневый
        roadGradient.addColorStop(1, '#654321'); // Темно-коричневый
        
        this.ctx.fillStyle = roadGradient;
        this.ctx.fillRect(0, roadY, this.canvas.width, roadHeight);
        
        // Больше ничего не рисуем - только сплошная коричневая дорога без линий
    }
    
    drawCloud(x, y, size) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, size * 0.3, 0, Math.PI * 2);
        this.ctx.arc(x + size * 0.3, y - size * 0.1, size * 0.4, 0, Math.PI * 2);
        this.ctx.arc(x + size * 0.6, y, size * 0.35, 0, Math.PI * 2);
        this.ctx.arc(x + size * 0.9, y - size * 0.05, size * 0.3, 0, Math.PI * 2);
        this.ctx.arc(x + size * 1.1, y + size * 0.1, size * 0.25, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawPauseScreen() {
        this.ctx.fillStyle = 'rgba(33, 150, 243, 0.9)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = `bold ${Math.min(this.canvas.width * 0.1, 80)}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('ПАУЗА', this.canvas.width / 2, this.canvas.height / 2);
    }
    
    drawGameObjects(player, obstacles) {
        // Рисуем препятствия
        for (let obstacle of obstacles) {
            obstacle.draw();
        }
        
        // Рисуем игрока
        player.draw();
    }
}