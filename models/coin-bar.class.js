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

    constructor(x = 240, y = 10, width = 200, height = 60) {
        super();
        this.loadImg(this.IMAGES[0]);
        this.positionX = x;
        this.positionY = y;
        this.width = width;
        this.height = height;
        this.loadImgs(this.IMAGES);
        this.setMax(10);
        this.setPercentage(0);
    }

    addCoin() {
        this.addItem();
    }
}
