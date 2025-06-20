/**
 * Represents the poison status bar in the game.
 * Displays the player's poison level using different image states.
 */
class PoisonBar extends StatusBar {
    IMAGES = [
        'img/status-bars/poison-bar/0-poison-bar.png',
        'img/status-bars/poison-bar/20-poison-bar.png',
        'img/status-bars/poison-bar/40-poison-bar.png',
        'img/status-bars/poison-bar/60-poison-bar.png',
        'img/status-bars/poison-bar/80-poison-bar.png',
        'img/status-bars/poison-bar/100-poison-bar.png'
    ];

    constructor(x, y, width, height) {
        super().loadImg(this.IMAGES[0]);
        
        this.positionX = x || 20;
        this.positionY = y || 110;
        this.width = width || 200;
        this.height = height || 60;
        
        this.loadImgs(this.IMAGES);
        this.setPercentage(0);
    }
}