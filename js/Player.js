class Player {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        // Фиксированные размеры для сохранения качества
        this.width = 50;
        this.height = 70;
        this.x = 100;
        this.y = canvas.height - this.height - 50;
        this.velocityY = 0;
        this.jumpForce = -18;
        this.gravity = 0.9;
        this.isJumping = false;
        this.color = '#4CAF50';
        this.groundLevel = canvas.height - 50;
    }
    
    update() {
        // Применяем гравитацию
        this.velocityY += this.gravity;
        this.y += this.velocityY;
        
        // Проверяем, стоит ли динозавр на дороге
        if (this.y >= this.groundLevel - this.height) {
            this.y = this.groundLevel - this.height;
            this.velocityY = 0;
            this.isJumping = false;
        }
    }
    
    jump() {
        if (!this.isJumping) {
            this.velocityY = this.jumpForce;
            this.isJumping = true;
        }
    }
    
    draw() {
        // Рисуем тело динозавра простым зеленым цветом
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Рисуем глаза
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(this.x + 30, this.y + 15, 12, 12);
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(this.x + 33, this.y + 18, 6, 6);
        
        // Рисуем ноги
        this.ctx.fillStyle = '#2E7D32';
        this.ctx.fillRect(this.x - 5, this.y + this.height - 15, 15, 15);
        this.ctx.fillRect(this.x + this.width - 10, this.y + this.height - 15, 15, 15);
        
        
    }
    
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
    
    reset() {
        this.x = 100;
        this.y = this.groundLevel - this.height;
        this.velocityY = 0;
        this.isJumping = false;
    }
}