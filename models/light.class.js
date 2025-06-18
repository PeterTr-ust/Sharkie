/**
 * Represents a movable light source in the game.
 * Extends the MovableObject class to inherit movement behavior.
 */
class Light extends MovableObject {
    positionX = 100;
    positionY = 0;
    width = 600;
    height = 500;

    constructor() {
        super().loadImg('img/3. Background/Layers/1. Light/2.png');

        this.animate();
    }

    animate() {
       this.moveLeft();
    }
}