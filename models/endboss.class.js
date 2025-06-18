/**
 * Represents the final boss in the game.
 * Extends the MovableObject class to inherit movement behavior.
 */
class Endboss extends MovableObject {
    height = 400;
    width = 400;
    positionX = 1750;
    positionY = 0;
    IMAGES_SPAWNING = [
        'img/endboss/spawn/1.png',
        'img/endboss/spawn/2.png',
        'img/endboss/spawn/3.png',
        'img/endboss/spawn/4.png',
        'img/endboss/spawn/5.png',
        'img/endboss/spawn/6.png',
        'img/endboss/spawn/7.png',
        'img/endboss/spawn/8.png',
        'img/endboss/spawn/9.png',
        'img/endboss/spawn/10.png',
    ];
    IMAGES_IDLE = [
        'img/endboss/idle/1.png',
        'img/endboss/idle/2.png',
        'img/endboss/idle/3.png',
        'img/endboss/idle/4.png',
        'img/endboss/idle/5.png',
        'img/endboss/idle/6.png',
        'img/endboss/idle/7.png',
        'img/endboss/idle/8.png',
        'img/endboss/idle/9.png',
        'img/endboss/idle/10.png',
        'img/endboss/idle/11.png',
        'img/endboss/idle/12.png',
        'img/endboss/idle/13.png',
    ];
    hadFirstContact = false;
    spawnAnimationCompleted = false;

    constructor() {
        super().loadImg('');
        this.loadImgs(this.IMAGES_SPAWNING);
        this.loadImgs(this.IMAGES_IDLE);
        this.animate();
    }

    /**
     * Controls the animation and interaction with the player.
     */
    animate() {
        let i = 0;

        setInterval(() => {
            if (world.character.positionX > 1250 && !this.hadFirstContact) {
                i = 0;
                this.hadFirstContact = true;
            }
            if (i < 10 && this.hadFirstContact) {
                this.playAnimation(this.IMAGES_SPAWNING);
            } else if (i >= 10 && this.hadFirstContact) {
                this.spawnAnimationCompleted = true;
                this.playAnimation(this.IMAGES_IDLE);
            } else if (this.spawnAnimationCompleted) {
                this.playAnimation(this.IMAGES_IDLE);
            }

            i++;
        }, 150);
    }
}
