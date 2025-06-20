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

    coinsCollected = 0;
    maxCoins = 10; // z. B. 5 Coins im Level – kann auch dynamisch sein

    constructor(x, y, width, height) {
        super().loadImg(this.IMAGES[0]);
        this.positionX = x || 20;
        this.positionY = y || 60;
        this.width = width || 200;
        this.height = height || 60;

        this.loadImgs(this.IMAGES);
        this.setPercentage(0);
    }

    addCoin() {
        if (this.coinsCollected < this.maxCoins) {
            this.coinsCollected++;
            let percentage = (this.coinsCollected / this.maxCoins) * 100;
            this.setPercentage(percentage);
        }
    }
}