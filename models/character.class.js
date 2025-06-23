/**
 * Represents the main character in the game.
 * Extends the MovableObject class to inherit movement behavior.
 */
class Character extends MovableObject {
    positionX = 20;
    positionY = 200;
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
    IMAGES_INACTIVE = [
        'img/character/inactive/sharkie-inactive-1.png',
        'img/character/inactive/sharkie-inactive-2.png',
        'img/character/inactive/sharkie-inactive-3.png',
        'img/character/inactive/sharkie-inactive-4.png',
        'img/character/inactive/sharkie-inactive-5.png',
        'img/character/inactive/sharkie-inactive-6.png',
        'img/character/inactive/sharkie-inactive-7.png',
        'img/character/inactive/sharkie-inactive-8.png',
        'img/character/inactive/sharkie-inactive-9.png',
        'img/character/inactive/sharkie-inactive-10.png',
        'img/character/inactive/sharkie-inactive-11.png',
        'img/character/inactive/sharkie-inactive-12.png',
        'img/character/inactive/sharkie-inactive-13.png',
        'img/character/inactive/sharkie-inactive-14.png',
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
    IMAGES_HURT_BY_PUFFERFISH = [
        'img/character/hurt/poisoned/1.png',
        'img/character/hurt/poisoned/2.png',
        'img/character/hurt/poisoned/3.png',
        'img/character/hurt/poisoned/4.png',
        'img/character/hurt/poisoned/5.png'
    ];
    IMAGES_HURT_BY_JELLYFISH = [
        'img/character/hurt/shocked/shocked-1.png',
        'img/character/hurt/shocked/shocked-2.png',
        'img/character/hurt/shocked/shocked-3.png',
        'img/character/hurt/shocked/shocked-4.png',
        'img/character/hurt/shocked/shocked-5.png'
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
        this.loadImgs(this.IMAGES_INACTIVE);
        this.loadImgs(this.IMAGES_SWIM);
        this.loadImgs(this.IMAGES_DEAD);
        this.loadImgs(this.IMAGES_HURT_BY_PUFFERFISH);
        this.loadImgs(this.IMAGES_HURT_BY_JELLYFISH);
        this.soundManager = soundManager;
        this.inactivity = this.setupInactivityTimer();
        this.animate();
    }

    /**
    * Sets up a global inactivity timer that resets on any key press.
    *
    * @returns {{ getInactivityDuration: function(): number, resetInactivityTimer: function(): void }}
    */
    setupInactivityTimer() {
        let lastInputTime = Date.now();

        const resetInactivityTimer = () => {
            lastInputTime = Date.now();
        };

        document.addEventListener('keydown', resetInactivityTimer);

        return {
            getInactivityDuration: () => Date.now() - lastInputTime,
            resetInactivityTimer
        };
    }

    /**
    * Initializes main game loops for movement/audio and animation updates.
    */
    animate() {
        setInterval(() => {
            this.handleMovementAndSounds();
        }, 1000 / 60);

        setInterval(() => {
            this.handleAnimations();
        }, 150);
    }

    /**
     * Handles character movement and sound logic.
     */
    handleMovementAndSounds() {
        const kb = this.world?.keyboard;
        const swimming = kb?.RIGHT || kb?.LEFT || kb?.UP || kb?.DOWN;

        if (swimming) {
            this.handleMovement(kb);
            this.inactivity.resetInactivityTimer();
            this.soundManager.playLoop('swim');
        } else {
            this.soundManager.stop('swim');
        }

        if (this.inactivity.getInactivityDuration() > 15000) {
            this.soundManager.playLoop('snoring');
        } else {
            this.soundManager.stop('snoring');
        }
    }

    /**
     * Moves the character based on active keys.
     * @param {KeyboardInput} kb - The current keyboard input state.
     */
    handleMovement(kb) {
        if (kb.RIGHT && this.positionX < this.world.level.levelEndX) {
            this.moveRight();
            this.otherDirection = false;
        }
        if (kb.LEFT && this.positionX > 0) {
            this.moveLeft();
            this.otherDirection = true;
        }
        if (kb.UP && this.isOnTop()) this.moveUp();
        if (kb.DOWN && this.isOnBottom()) this.moveDown();

        this.world.cameraX = -this.positionX;
    }

    /**
     * Handles character animations based on state and input.
     */
    handleAnimations() {
        const kb = this.world?.keyboard;

        if (this.isDead()) {
            this.playAnimation(this.IMAGES_DEAD);
        } else if (this.isHurt()) {
            this.inactivity.resetInactivityTimer();
            const enemy = this.lastHitByEnemy;
            const images = enemy instanceof PufferFish
                ? this.IMAGES_HURT_BY_PUFFERFISH
                : this.IMAGES_HURT_BY_JELLYFISH;
            this.playAnimation(images);
        } else if (kb?.RIGHT || kb?.LEFT || kb?.UP || kb?.DOWN) {
            this.playAnimation(this.IMAGES_SWIM);
        } else if (this.inactivity.getInactivityDuration() > 15000) {
            this.playAnimation(this.IMAGES_INACTIVE);
        } else {
            this.playAnimation(this.IMAGES_IDLE);
        }
    }
}