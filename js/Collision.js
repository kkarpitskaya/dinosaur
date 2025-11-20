class Collision {
    static checkPlayerObstacle(player, obstacles) {
        const playerBounds = player.getBounds();
        
        for (let obstacle of obstacles) {
            const obstacleBounds = obstacle.getBounds();
            
            if (this.rectIntersect(playerBounds, obstacleBounds)) {
                return true;
            }
        }
        return false;
    }
    
    static checkPlayerFall(player, canvas) {
        // Падение проверяем относительно уровня дороги
        const groundLevel = canvas.height - 50;
        return player.y > groundLevel;
    }
    
    static rectIntersect(rect1, rect2) {
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
        );
    }
}