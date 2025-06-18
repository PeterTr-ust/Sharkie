/**
 * Represents the coin status bar in the game.
 * Extends the StatusBar class and displays the coin collection status.
 */
class CoinBar extends StatusBar {
    IMAGES = [
        'img/status-bars/coin-bar/0-coin-bar.png',
        'img/status-bars/coin-bar/20-coin-bar.png',
        'img/status-bars/coin-bar/40-coin-bar.png',
        'img/status-bars/coin-bar/60-coin-bar.png',
        'img/status-bars/coin-bar/80-coin-bar.png',
        'img/status-bars/coin-bar/100-coin-bar.png'
    ];

    constructor(x, y, width, height) {
        super().loadImg(this.IMAGES[5]);

        this.positionX = x || 20;
        this.positionY = y || 60;
        this.width = width || 200;
        this.height = height || 60;

        this.loadImgs(this.IMAGES);
        this.setPercentage(100);
    }
}