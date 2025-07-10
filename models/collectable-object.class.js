/**
 * Base class for all collectible objects in the game, such as coins or poison.
 * 
 * Extends {@link MovableObject} and provides shared animation and collection behavior.
 */
class CollectableObject extends MovableObject {
    delayPerFrame = 150;
    pauseAfterCycle = 1500;
    isBeingCollected = false;

    constructor() {
        super();
    }

    /**
    * Runs an animation loop using the provided image sequence.
    * After completing one cycle, it pauses before restarting.
    *
    * @param {string[]} images - The image paths for the animation frames.
    */
    playCycle(images) {
        let index = 0;

        const cycle = () => {
            this.updateImage(images[index]);
            index++;

            if (index < images.length) {
                this.scheduleNextFrame(cycle, this.delayPerFrame);
            } else {
                index = 0;
                this.scheduleNextFrame(cycle, this.pauseAfterCycle);
            }
        };

        cycle();
    }

    /**
     * Updates the current image from the cache.
     *
     * @param {string} imagePath - The path to the image to display.
     */
    updateImage(imagePath) {
        this.img = this.imageCache[imagePath];
    }

    /**
     * Schedules the next frame of the animation after a delay.
     *
     * @param {Function} callback - The function to call after the delay.
     * @param {number} delay - The delay in milliseconds.
     */
    scheduleNextFrame(callback, delay) {
        setTimeout(callback, delay);
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
    * Animates vertical position from startY to endY over a given duration.
    *
    * @param {number} startY - The starting Y position.
    * @param {number} endY - The ending Y position.
    * @param {number} duration - Duration of the animation in milliseconds.
    * @param {function(number): void} updateCallback - Callback to update the Y position.
    * @returns {Promise<void>} A promise that resolves when the animation is complete.
    */
    animatePositionY(startY, endY, duration, updateCallback) {
        return new Promise((resolve) => {
            const startTime = performance.now();

            const step = (currentTime) => {
                const progress = this.calculateProgress(startTime, currentTime, duration);
                const newY = this.interpolateY(startY, endY, progress);

                updateCallback(newY);

                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    resolve();
                }
            };

            requestAnimationFrame(step);
        });
    }

    /**
     * Calculates the normalized progress of the animation.
     *
     * @param {number} startTime - The timestamp when the animation started.
     * @param {number} currentTime - The current timestamp.
     * @param {number} duration - Total duration of the animation.
     * @returns {number} A value between 0 and 1 representing animation progress.
     */
    calculateProgress(startTime, currentTime, duration) {
        const elapsed = currentTime - startTime;
        return Math.min(elapsed / duration, 1);
    }

    /**
     * Interpolates the Y position based on progress.
     *
     * @param {number} startY - The starting Y position.
     * @param {number} endY - The ending Y position.
     * @param {number} progress - A value between 0 and 1.
     * @returns {number} The interpolated Y position.
     */
    interpolateY(startY, endY, progress) {
        return startY + (endY - startY) * progress;
    }
}