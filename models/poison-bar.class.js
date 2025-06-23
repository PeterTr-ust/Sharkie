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

    constructor(x = 460, y = 10, width = 200, height = 60) {
        super().loadImg(this.IMAGES[0]);
        this.positionX = x;
        this.positionY = y;
        this.width = width;
        this.height = height;
        this.loadImgs(this.IMAGES);
        this.setMax(5);
        this.setPercentage(0);
    }

    addPoison() {
        this.addItem();
    }
}