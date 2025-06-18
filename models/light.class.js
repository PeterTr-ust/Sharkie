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
        super().loadImg('img/game-background/game-background-element-7.png');

        this.animate();
    }

    animate() {
       this.moveLeft();
    }
}