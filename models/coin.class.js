class Coin extends CollectableObject {
    IMAGES = [
        'img/collectables/coins/coin-1.png',
        'img/collectables/coins/coin-2.png',
        'img/collectables/coins/coin-3.png',
        'img/collectables/coins/coin-4.png',
    ];
    height = 40;
    width = 40;

    constructor(x, y) {
        super();
        this.loadImg(this.IMAGES[0]);
        this.positionX = x;
        this.positionY = y;
        this.loadImgs(this.IMAGES);
        this.animate();
    }

    animate() {
        this.playCycle(this.IMAGES);
    }

    /**
    * Executes the collection animation and then hides the coin.
    */
    async collect() {
        if (this.isBeingCollected) return;
        await this.collectAnimation();
    }

}
