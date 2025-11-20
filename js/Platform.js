class Platform {
    constructor(canvas, x, width) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.x = x;
        this.y = canvas.height - 50;
        this.width = width;
        this.height = 20;
        this.color = '#42a5f5'; // Синий цвет
    }
    
    update(speed) {
        this.x -= speed;
    }
    
    draw() {
        // Рисуем платформу с градиентом
        const gradient = this.ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        gradient.addColorStop(0, '#64b5f6');
        gradient.addColorStop(1, '#1976d2');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Добавляем текстуру платформы
        this.ctx.fillStyle = '#bbdefb';
        for (let i = 0; i < this.width; i += 25) {
            this.ctx.fillRect(this.x + i, this.y, 12, 5);
        }
    }
    
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
    
    isOffScreen() {
        return this.x + this.width < 0;
    }
}