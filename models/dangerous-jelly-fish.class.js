/**
 * Represents a dangerous jelly fish enemy that swims vertically.
 * Inherits movement and drawing behavior from MovableObject.
 */
class DangerousJellyFish extends MovableObject {
    IMAGES_IDLE = [
        'img/enemies/jelly-fish/dangerous/idle/dangerous-jelly-fish-idle-1.png',
        'img/enemies/jelly-fish/dangerous/idle/dangerous-jelly-fish-idle-2.png',
        'img/enemies/jelly-fish/dangerous/idle/dangerous-jelly-fish-idle-3.png',
        'img/enemies/jelly-fish/dangerous/idle/dangerous-jelly-fish-idle-4.png',
    ];
    IMAGES_DEAD = [
        'img/enemies/jelly-fish/dangerous/dead/dangerous-jelly-fish-dead-1.png',
        'img/enemies/jelly-fish/dangerous/dead/dangerous-jelly-fish-dead-2.png',
        'img/enemies/jelly-fish/dangerous/dead/dangerous-jelly-fish-dead-3.png',
        'img/enemies/jelly-fish/dangerous/dead/dangerous-jelly-fish-dead-4.png',
    ];
    offset = {
        top: -15,
        left: -10,
        right: -10,
        bottom: -15
    };
    movingUp = true;
    height = 100;
    width = 100;
    damage = 20;
    isDead = false;
    isFlyingAway = false;

    constructor(x, y) {
        super().loadImg('img/enemies/jelly-fish/dangerous/idle/dangerous-jelly-fish-idle-1.png');
        this.positionX = x;
        this.positionY = y;
        this.loadImgs(this.IMAGES_IDLE);
        this.loadImgs(this.IMAGES_DEAD);
        this.speed = 0.25 + Math.random() * 2;
        this.animate();
    }

    /**
    * Triggers the jellyfish death animation.
    * Plays the death frames and initiates the fly-away effect.
    */
    dead() {
        this.playJellyDeathAnimation(this.IMAGES_DEAD);
    }

    /**
    * Starts the movement and animation intervals.
    * Moves the fish up and down.
    */
    animate() {
        this.animationInterval = setInterval(() => {
            if (this.isDead) {
                this.playAnimation(this.IMAGES_DEAD);
            } else {
                this.playAnimation(this.IMAGES_IDLE);
            }
        }, 150);

        this.movementInterval = setInterval(() => {
            if (this.isFlyingAway) return;

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