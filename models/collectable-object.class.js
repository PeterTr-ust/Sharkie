class CollectableObject extends MovableObject {
    delayPerFrame = 150;
    pauseAfterCycle = 1500;

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
}
