/**
 * Represents a dangerous jelly fish enemy that swims vertically.
 * Inherits movement and drawing behavior from MovableObject.
 */
class DangerousJellyFish extends MovableObject {
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

    constructor(x, y) {
        super().loadImg('img/enemies/jelly-fish/dangerous/idle/dangerous-jelly-fish-idle-1.png');
        this.positionX = x;
        this.positionY = y;
        this.loadImgs(this.IMAGES_IDLE);
        this.loadImgs(this.IMAGES_DEAD);
        this.speed = 0.25 + Math.random() * 2;
    }

    /**
    * Triggers the jellyfish death animation.
    * Plays the death frames and initiates the fly-away effect.
    */
    dead() {
        this.playJellyDeathAnimation(this.IMAGES_DEAD);
    }

    /**
    * Starts the movement and animation intervals for the jellyfish.
    * Handles idle/dead animation and vertical swimming behavior.
    */
    animate() {
        if (this.animationsPaused) return;

        this.startIdleOrDeathAnimation();
        this.startVerticalSwimMovement();
    }

    /**
     * Starts the animation loop for idle or dead state.
     * Plays the appropriate animation based on the jellyfish's state.
     */
    startIdleOrDeathAnimation() {
        this.createAnimationInterval(() => {
            const images = this.isDead ? this.IMAGES_DEAD : this.IMAGES_IDLE;
            this.playAnimation(images);
        }, 150);
    }

    /**
     * Starts the vertical movement loop for the jellyfish.
     * Moves the jellyfish up and down within a defined range.
     */
    startVerticalSwimMovement() {
        this.createAnimationInterval(() => {
            if (this.isFlyingAway) return;

            this.movingUp ? this.moveDown() : this.moveUp();
            this.toggleSwimDirectionIfNeeded();
        }, 1000 / 60);
    }

    /**
     * Reverses the swim direction if the jellyfish reaches movement bounds.
     */
    toggleSwimDirectionIfNeeded() {
        if (this.positionY >= 380) {
            this.movingUp = false;
        } else if (this.positionY <= 10) {
            this.movingUp = true;
        }
    }
}