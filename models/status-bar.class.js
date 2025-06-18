/**
 * Represents a generic status bar (e.g., for health, coins, poison).
 * Inherits visual rendering functionality from DrawableObject.
 */
class StatusBar extends DrawableObject {
    percentage = 100;

    constructor() {
        super();
    }

    /**
     * Sets the current percentage and updates the image accordingly.
     * @param {number} percentage - A number between 0 and 100.
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Resolves which image index to use based on the current percentage.
     * @returns {number} Index corresponding to the appropriate image.
     */
    resolveImageIndex() {
        if (this.percentage === 100) {
            return 5;
        } else if (this.percentage > 80) {
            return 4;
        } else if (this.percentage > 60) {
            return 3;
        } else if (this.percentage > 40) {
            return 2;
        } else if (this.percentage > 20) {
            return 1;
        } else {
            return 0;
        }
    }
}