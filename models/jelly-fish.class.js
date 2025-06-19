/**
 * Represents a jelly fish enemy that swims vertically.
 * Inherits movement and drawing behavior from MovableObject.
 */
class JellyFish extends MovableObject {
    IMAGES_IDLE = [
        'img/enemies/jelly-fish/normal/idle/jelly-fish-idle-1.png',
        'img/enemies/jelly-fish/normal/idle/jelly-fish-idle-2.png',
        'img/enemies/jelly-fish/normal/idle/jelly-fish-idle-3.png',
        'img/enemies/jelly-fish/normal/idle/jelly-fish-idle-4.png',
    ];
    offset = {
        top: -15,
        left: -10,
        right: -10,
        bottom: -15
    };
    movingUp = true;
    height = 80;
    width = 80;
    damage = 5;

    constructor(x, y) {
        super().loadImg('img/enemies/jelly-fish/normal/idle/jelly-fish-idle-1.png');
        this.positionX = x;
        this.positionY = y;

        this.loadImgs(this.IMAGES_IDLE);
        this.speed = 0.25 + Math.random() * 2;
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
                this.moveDown();
                if (this.positionY >= 380) {
                    this.movingUp = false;
                }
            } else {
                this.moveUp();
                if (this.positionY <= 10) {
                    this.movingUp = true;
                }
            }
        }, 1000 / 60);
    }
}