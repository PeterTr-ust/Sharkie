class Coin extends CollectableObject {
    IMAGES = [
        'img/collectables/coins/coin-1.png',
        'img/collectables/coins/coin-2.png',
        'img/collectables/coins/coin-3.png',
        'img/collectables/coins/coin-4.png',
    ];
    height = 40;
    width = 40;
    isBeingCollected = false;

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
     * Triggers a short animation when the coin is collected.
     * Moves the coin upwards before removing it.
     * Returns a Promise that resolves when the animation ends.
     */
    collectCoinAnimation() {
        this.isBeingCollected = true;
        return new Promise((resolve) => {
            let animationDuration = 150;
            let startTime = performance.now();
            const startY = this.positionY;
            const endY = startY - 80;
            const animate = (time) => {
                let elapsed = time - startTime;
                let progress = Math.min(elapsed / animationDuration, 1);
                this.positionY = startY - (progress * 30);

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };

            requestAnimationFrame(animate);
        });
    }
}
