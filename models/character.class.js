/**
 * Represents the main character in the game.
 * Extends the MovableObject class to inherit movement behavior.
 */
class Character extends MovableObject {
    positionX = 20;
    positionY = 80;
    height = 200;
    width = 200;
    speed = 2;
    IMAGES_IDLE = [
        'img/character/idle/1.png',
        'img/character/idle/2.png',
        'img/character/idle/3.png',
        'img/character/idle/4.png',
        'img/character/idle/5.png',
        'img/character/idle/6.png',
        'img/character/idle/7.png',
        'img/character/idle/8.png',
        'img/character/idle/9.png',
        'img/character/idle/10.png',
        'img/character/idle/11.png',
        'img/character/idle/12.png',
        'img/character/idle/13.png',
        'img/character/idle/14.png',
        'img/character/idle/15.png',
        'img/character/idle/16.png',
        'img/character/idle/17.png',
        'img/character/idle/18.png'
    ];
    IMAGES_SWIM = [
        'img/character/swim/character-swim-1.png',
        'img/character/swim/character-swim-2.png',
        'img/character/swim/character-swim-3.png',
        'img/character/swim/character-swim-4.png',
        'img/character/swim/character-swim-5.png',
        'img/character/swim/character-swim-6.png',
    ];
    IMAGES_DEAD = [
        'img/character/dead/1.png',
        'img/character/dead/2.png',
        'img/character/dead/3.png',
        'img/character/dead/4.png',
        'img/character/dead/5.png',
        'img/character/dead/6.png',
        'img/character/dead/7.png',
        'img/character/dead/8.png',
        'img/character/dead/9.png',
        'img/character/dead/10.png',
        'img/character/dead/11.png',
        'img/character/dead/12.png'
    ];
    IMAGES_HURT = [
        'img/character/hurt/poisoned/1.png',
        'img/character/hurt/poisoned/2.png',
        'img/character/hurt/poisoned/3.png',
        'img/character/hurt/poisoned/4.png',
        'img/character/hurt/poisoned/5.png'
    ];
    world;
    offset = {
        top: -110,
        left: -50,
        right: -50,
        bottom: -50
    };

    constructor(soundManager) {
        super().loadImg('img/character/idle/1.png');
        this.loadImgs(this.IMAGES_IDLE);
        this.loadImgs(this.IMAGES_SWIM);
        this.loadImgs(this.IMAGES_DEAD);
        this.loadImgs(this.IMAGES_HURT);
        this.soundManager = soundManager;
        this.animate();
    }

    /**
    * Handles character movement and animation updates.
    */
    animate() {
        setInterval(() => {
            if (this.world && this.world.keyboard) {
                if (this.world.keyboard.RIGHT && this.positionX < this.world.level.levelEndX) {
                    this.moveRight();
                    this.otherDirection = false;
                    this.soundManager.play('swim');
                }

                if (this.world.keyboard.LEFT && this.positionX > 0) {
                    this.moveLeft();
                    this.otherDirection = true;
                    this.soundManager.play('swim');
                }

                if ((this.world.keyboard.UP) && this.isOnTop()) {
                    this.moveUp();
                    this.soundManager.play('swim');
                }

                if ((this.world.keyboard.DOWN) && this.isOnBottom()) {
                    this.moveDown();
                    this.soundManager.play('swim');
                }

                this.world.cameraX = -this.positionX;
            }
        }, 1000 / 60);

        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            } else if (
                this.world.keyboard.RIGHT ||
                this.world.keyboard.LEFT ||
                this.world.keyboard.UP ||
                this.world.keyboard.DOWN
            ) {
                this.playAnimation(this.IMAGES_SWIM);
            } else {
                this.playAnimation(this.IMAGES_IDLE);
            }
        }, 150);

    }
}