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
    * Triggers a short upward animation when the coin is collected.
    * Marks the coin as being collected and moves it upward smoothly before removal.
    *
    * @returns {Promise<void>} A promise that resolves when the coin's animation has completed.
    */
    collectCoinAnimation() {
        this.isBeingCollected = true;
        const startY = this.positionY;
        const endY = startY - 50;
        const duration = 150;

        return this.animatePositionY(startY, endY, duration, (newY) => {
            this.positionY = newY;
        });
    }

    /**
    * Animates the vertical position of an object from a start value to an end value over time.
    * Calls the given callback with the updated position on each animation frame.
    *
    * @param {number} startY - The starting Y position.
    * @param {number} endY - The target Y position to animate to.
    * @param {number} duration - Total duration of the animation in milliseconds.
    * @param {function(number): void} updateCallback - Function called on each frame with the new Y position.
    * @returns {Promise<void>} A promise that resolves when the animation is complete.
    */
    animatePositionY(startY, endY, duration, updateCallback) {
        return new Promise((resolve) => {
            const startTime = performance.now();

            const animate = (time) => {
                const elapsed = time - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const newY = startY + (endY - startY) * progress;

                updateCallback(newY);

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
