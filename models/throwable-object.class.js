/**
 * Represents a throwable object (e.g., a projectile like a bubble).
 * Inherits from MovableObject for basic movement and rendering.
 */
class ThrowableObject extends MovableObject {
    height = 70;
    width = 70;

    constructor(positionX, positionY) {
        super().loadImg('img/1.Sharkie/4.Attack/Bubble trap/Bubble.png');
        this.positionX = positionX;
        this.positionY = positionY;
        this.throw();
    }

    /**
     * Starts the object's forward motion.
     * Moves it to the right at a fixed interval.
     */
    throw() {
        this.positionX = positionX;
        this.positionY = positionY;
        setInterval( () => {
            this.positionX += 4;
        }, 10)
    }
}