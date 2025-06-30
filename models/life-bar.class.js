/**
 * Represents the life status bar in the game.
 * Displays the player's health with different image states.
 */
class LifeBar extends StatusBar {
    IMAGES = [
        'img/status-bars/life-bar/0-life-bar.png',
        'img/status-bars/life-bar/20-life-bar.png',
        'img/status-bars/life-bar/40-life-bar.png',
        'img/status-bars/life-bar/60-life-bar.png',
        'img/status-bars/life-bar/80-life-bar.png',
        'img/status-bars/life-bar/100-life-bar.png',
    ];

    constructor(x = 10, y = 0, width = 200, height = 60) {
        super().loadImg(this.IMAGES[5]);
        this.positionX = x;
        this.positionY = y;
        this.width = width;
        this.height = height;
        this.loadImgs(this.IMAGES);
        this.setPercentage(100);
    }
}