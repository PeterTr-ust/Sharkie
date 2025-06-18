/**
 * Represents a puffer fish enemy that swims from right to left.
 * Inherits movement and drawing behavior from MovableObject.
 */
class PufferFish extends MovableObject {
    IMAGES_WALKING = [
        'img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/2.swim1.png',
        'img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/2.swim2.png',
        'img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/2.swim3.png',
        'img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/2.swim4.png',
        'img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/2.swim5.png',
    ];
    offset = {
        top: -15,
        left: -15,
        right: -30,
        bottom: -35
    };

    constructor() {
        super().loadImg('img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/2.swim1.png');
        this.positionX = 300 + Math.random() * 500;
        this.positionY = 400 - Math.random() * 350;

        this.loadImgs(this.IMAGES_WALKING);
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
            this.playAnimation(this.IMAGES_WALKING);
        }, 150);
    }
}