/**
 * Represents a background object in the game.
 * Extends the MovableObject class.
 */
class BackgroundObject extends MovableObject {
    width = 720;
    height = 480;

    constructor(imagePath, positionX) {
        super().loadImg(imagePath);
        this.positionX = positionX;
        this.positionY = 480 - this.height;
    }
}