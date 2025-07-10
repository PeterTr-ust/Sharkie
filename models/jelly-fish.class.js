/**
 * Represents a jelly fish enemy that swims vertically.
 * Inherits movement and drawing behavior from MovableObject.
 */
class JellyFish extends MovableObject {
    offset = {
        top: -15,
        left: -10,
        right: -10,
        bottom: -15
    };
    movingUp = true;
    height = 80;
    width = 80;
    damage = 10;
    isDead = false;
    IMAGES_IDLE = [
        'img/enemies/jelly-fish/normal/idle/jelly-fish-idle-1.png',
        'img/enemies/jelly-fish/normal/idle/jelly-fish-idle-2.png',
        'img/enemies/jelly-fish/normal/idle/jelly-fish-idle-3.png',
        'img/enemies/jelly-fish/normal/idle/jelly-fish-idle-4.png',
    ];
    IMAGES_DEAD = [
        'img/enemies/jelly-fish/normal/dead/jelly-fish-dead-1.png',
        'img/enemies/jelly-fish/normal/dead/jelly-fish-dead-2.png',
        'img/enemies/jelly-fish/normal/dead/jelly-fish-dead-3.png',
        'img/enemies/jelly-fish/normal/dead/jelly-fish-dead-4.png',
    ];

    constructor(x, y) {
        super().loadImg('img/enemies/jelly-fish/normal/idle/jelly-fish-idle-1.png');
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
    * Starts the movement and animation intervals.
    * Controls idle/dead animation and vertical swimming behavior.
    */
    animate() {
        if (this.animationsPaused) return;

        this.startIdleOrDeadAnimation();
        this.startVerticalSwimMovement();
    }

    /**
     * Starts the animation loop for idle or dead state.
     * Plays the appropriate animation based on the object's state.
     */
    startIdleOrDeadAnimation() {
        this.createAnimationInterval(() => {
            const images = this.isDead ? this.IMAGES_DEAD : this.IMAGES_IDLE;
            this.playAnimation(images);
        }, 150);
    }

    /**
     * Starts the vertical movement loop for the object.
     * Moves the object up and down within a defined range unless flying away.
     */
    startVerticalSwimMovement() {
        this.createAnimationInterval(() => {
            if (this.isFlyingAway) return;

            this.movingUp ? this.moveDown() : this.moveUp();
            this.toggleSwimDirectionIfNeeded();
        }, 1000 / 60);
    }

    /**
     * Reverses the swim direction if the object reaches vertical bounds.
     */
    toggleSwimDirectionIfNeeded() {
        if (this.positionY >= 380) {
            this.movingUp = false;
        } else if (this.positionY <= 10) {
            this.movingUp = true;
        }
    }
}