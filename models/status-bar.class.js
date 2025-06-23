/**
 * Represents a generic status bar (e.g., for health, coins, poison).
 * Inherits visual rendering functionality from DrawableObject.
 */
class StatusBar extends DrawableObject {
    percentage = 100;
    collected = 0;
    max = 10;

    constructor() {
        super();
    }

    /**
     * Sets the current percentage and updates the image accordingly.
     * @param {number} percentage - A number between 0 and 100.
     */
    setPercentage(percentage) {
        this.percentage = Math.max(0, Math.min(percentage, 100));
        const path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Increases the collected count and updates the percentage and image.
     */
    addItem() {
        if (this.collected < this.max) {
            this.collected++;
            const percentage = (this.collected / this.max) * 100;
            this.setPercentage(percentage);
        }
    }

    /**
     * Optionally resets the collected count and percentage.
     */
    reset() {
        this.collected = 0;
        this.setPercentage(0);
    }

    /**
     * Sets the maximum number of items for this status bar.
     * @param {number} maxValue - The total number of items needed for 100%.
     */
    setMax(maxValue) {
        this.max = maxValue;
    }

    /**
     * Resolves which image index to use based on the current percentage.
     * @returns {number} Index corresponding to the appropriate image.
     */
    resolveImageIndex() {
        if (this.percentage === 100) return 5;
        else if (this.percentage > 80) return 4;
        else if (this.percentage > 60) return 3;
        else if (this.percentage > 40) return 2;
        else if (this.percentage > 20) return 1;
        else return 0;
    }
}