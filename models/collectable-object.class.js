class CollectableObject extends MovableObject {
    delayPerFrame = 150;
    pauseAfterCycle = 1500;
    isBeingCollected = false;

    constructor() {
        super();
    }

    /**
     * Runs an animation loop with a pause after each cycle.
     * @param {string[]} images - The image paths for the animation
     */
    playCycle(images) {
        let index = 0;

        const cycle = () => {
            this.img = this.imageCache[images[index]];
            index++;

            if (index < images.length) {
                setTimeout(cycle, this.delayPerFrame);
            } else {
                index = 0;
                setTimeout(cycle, this.pauseAfterCycle);
            }
        };

        cycle();
    }

    /**
     * Triggers a generic collect animation (e.g. float upward).
     * Can be reused by any collectable object like coins or poison.
     */
    async collectAnimation(offsetY = -50, duration = 150) {
        this.isBeingCollected = true;
        const startY = this.positionY;
        const endY = startY + offsetY;
        await this.animatePositionY(startY, endY, duration, (newY) => {
            this.positionY = newY;
        });
    }

    /**
     * Animates vertical position from startY to endY over time.
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
