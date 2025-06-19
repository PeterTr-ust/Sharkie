/**
 * Represents a jelly fish enemy that swims vertically.
 * Inherits movement and drawing behavior from MovableObject.
 */
class JellyFish extends MovableObject {
    IMAGES_IDLE = [
        'img/enemies/jelly-fish/idle/jelly-fish-idle-1.png',
        'img/enemies/jelly-fish/idle/jelly-fish-idle-2.png',
        'img/enemies/jelly-fish/idle/jelly-fish-idle-3.png',
        'img/enemies/jelly-fish/idle/jelly-fish-idle-4.png',
    ];
    offset = {
        top: -15,
        left: -10,
        right: -10,
        bottom: -15
    };
    movingUp = true;

    constructor() {
        super().loadImg('img/enemies/jelly-fish/idle/jelly-fish-idle-1.png');
        this.positionX = 300 + Math.random() * 500;
        this.positionY = 400 - Math.random() * 350;

        this.loadImgs(this.IMAGES_IDLE);
        this.speed = 1 + Math.random() * 0.25;
        this.animate();
    }

    /**
     * Starts the movement and animation intervals.
     * Moves the fish up and down.
     */
    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_IDLE);
        }, 150);

        setInterval(() => {
            if (this.movingUp) {
                this.moveUp();
                if (this.positionY >= 380) {
                    this.movingUp = false;
                }
            } else {
                this.moveDown();
                if (this.positionY <= 10) {
                    this.movingUp = true;
                }
            }
        }, 1000 / 60);
    }
}