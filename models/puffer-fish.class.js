/**
 * Represents a puffer fish enemy that swims from right to left.
 * Inherits movement and drawing behavior from MovableObject.
 */
class PufferFish extends MovableObject {
    IMAGES_IDLE = [
        'img/enemies/puffer-fish/idle/puffer-fish-idle-1.png',
        'img/enemies/puffer-fish/idle/puffer-fish-idle-2.png',
        'img/enemies/puffer-fish/idle/puffer-fish-idle-3.png',
        'img/enemies/puffer-fish/idle/puffer-fish-idle-4.png',
        'img/enemies/puffer-fish/idle/puffer-fish-idle-5.png',
    ];
    offset = {
        top: -15,
        left: -15,
        right: -30,
        bottom: -35
    };

    constructor() {
        super().loadImg('img/enemies/puffer-fish/idle/puffer-fish-idle-1.png');
        this.positionX = 300 + Math.random() * 500;
        this.positionY = 400 - Math.random() * 350;

        this.loadImgs(this.IMAGES_IDLE);
        this.speed = 0.15 + Math.random() * 0.25;
        this.animate();
    }

    /**
     * Starts the movement and animation intervals.
     * Moves the fish left and updates its current image.
     */
    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);

        setInterval(() => {
            this.playAnimation(this.IMAGES_IDLE);
        }, 150);
    }
}