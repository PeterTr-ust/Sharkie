class CollectableObject extends MovableObject {
    delayPerFrame = 150;   
    pauseAfterCycle = 1500;

    constructor() {
        super();
    }

    /**
     * Führt eine Animationsschleife mit Pause nach jedem Durchlauf aus.
     * @param {string[]} images - Die Bildpfade für die Animation
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
