/**
 * Represents a throwable object (e.g., a projectile like a bubble).
 * Inherits from MovableObject for basic movement and rendering.
 */
class ThrowableObject extends MovableObject {
    height = 70;
    width = 70;

    constructor(positionX, positionY, directionRight) {
        super().loadImg('img/character/attacks/bubble/bubble.png');
        this.positionX = positionX;
        this.positionY = positionY;
        this.directionRight = directionRight;
        this.startX = positionX; 
        this.maxDistance = 400;
        this.throw();
    }

    /**
     * Starts the object's forward motion.
     * Moves it to the right at a fixed interval.
     */
    throw() {
        this.throwInterval = setInterval(() => {
            this.positionX += this.directionRight ? 4 : -4;

            const distance = Math.abs(this.positionX - this.startX);
            if (distance >= this.maxDistance) {
                clearInterval(this.throwInterval);
                this.markForRemoval = true;
            }
        }, 16);
    }
}