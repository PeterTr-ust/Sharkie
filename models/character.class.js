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
    IMAGES_FIN_SLAP = [
        'img/character/attacks/fin-slap/fin-slap-1.png',
        'img/character/attacks/fin-slap/fin-slap-2.png',
        'img/character/attacks/fin-slap/fin-slap-3.png',
        'img/character/attacks/fin-slap/fin-slap-4.png',
        'img/character/attacks/fin-slap/fin-slap-5.png',
        'img/character/attacks/fin-slap/fin-slap-6.png',
        'img/character/attacks/fin-slap/fin-slap-7.png',
        'img/character/attacks/fin-slap/fin-slap-8.png',
    ];
    IMAGES_BUBBLE_ATTACK = [
        'img/character/attacks/bubble/bubble-attack-1.png',
        'img/character/attacks/bubble/bubble-attack-2.png',
        'img/character/attacks/bubble/bubble-attack-3.png',
        'img/character/attacks/bubble/bubble-attack-4.png',
        'img/character/attacks/bubble/bubble-attack-5.png',
        'img/character/attacks/bubble/bubble-attack-6.png',
        'img/character/attacks/bubble/bubble-attack-7.png',
        'img/character/attacks/bubble/bubble-attack-8.png',
    ];
    IMAGES_POISON_BUBBLE_ATTACK = [
        'img/character/attacks/bubble/poison-bubble-attack-1.png',
        'img/character/attacks/bubble/poison-bubble-attack-2.png',
        'img/character/attacks/bubble/poison-bubble-attack-3.png',
        'img/character/attacks/bubble/poison-bubble-attack-4.png',
        'img/character/attacks/bubble/poison-bubble-attack-5.png',
        'img/character/attacks/bubble/poison-bubble-attack-6.png',
        'img/character/attacks/bubble/poison-bubble-attack-7.png',
        'img/character/attacks/bubble/poison-bubble-attack-8.png',
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
    isAttacking = false;
    poisonBottlesCollected = 0;
    maxPoisonBottles = 5;
    finalDeadImage = 'img/character/dead/8.png';
    hasPlayedHurtSound = false;

    constructor(soundManager) {
        super().loadImg('img/character/idle/1.png');
        this.loadImgs(this.IMAGES_IDLE);
        this.loadImgs(this.IMAGES_INACTIVE);
        this.loadImgs(this.IMAGES_SWIM);
        this.loadImgs(this.IMAGES_FIN_SLAP);
        this.loadImgs(this.IMAGES_BUBBLE_ATTACK);
        this.loadImgs(this.IMAGES_POISON_BUBBLE_ATTACK);
        this.loadImgs(this.IMAGES_DEAD);
        this.loadImgs(this.IMAGES_HURT_BY_PUFFERFISH);
        this.loadImgs(this.IMAGES_HURT_BY_JELLYFISH);
        this.soundManager = soundManager;
        this.inactivity = this.setupInactivityTimer();
        this.animate();
    }

    /**
    * Executes the character's fin slap attack.
    * 
    * - Plays the attack animation and sound.
    * - Temporarily adjusts the character's collision offset to extend attack range.
    * - Detects and triggers fly-away behavior on any enemy within the attack zone.
    * - Restores the original offset and attack state after a short delay.
    */
    finAttack() {
        this.isAttacking = true;
        this.playAnimation(this.IMAGES_FIN_SLAP);
        this.soundManager.play?.('finSlap');

        const originalOffset = { ...this.offset };
        this.offset.right = -20;
        this.offset.bottom = -30;
        this.offset.top = -90;

        const hitEnemies = this.world.level.enemies.filter(enemy => !enemy.isFlyingAway && this.isColliding(enemy));
        hitEnemies.forEach(enemy => {
            if (enemy instanceof PufferFish) {
                enemy.playPufferDeathAnimation();
            }
        });


        setTimeout(() => {
            this.offset = originalOffset;
            this.isAttacking = false;
        }, 150);
    }

    /**
     * Überprüft, ob alle Poison Bottles gesammelt wurden
     * @returns {boolean} True wenn alle 5 Poison Bottles gesammelt wurden
     */
    hasAllPoisonBottles() {
        return this.poisonBottlesCollected >= this.maxPoisonBottles;
    }

    /**
     * Erhöht den Counter für gesammelte Poison Bottles
     */
    collectPoisonBottle() {
        if (this.poisonBottlesCollected < this.maxPoisonBottles) {
            this.poisonBottlesCollected++;
            this.soundManager.play?.('collectPoison');
        }
    }

    /**
    * Performs the bubble attack animation and spawns a bubble after animation delay.
    * @param {Function} onComplete - Callback to execute after animation finishes.
    */
    bubbleAttack(onComplete) {
        this.isAttacking = true;

        const animationImages = this.hasAllPoisonBottles()
            ? this.IMAGES_POISON_BUBBLE_ATTACK
            : this.IMAGES_BUBBLE_ATTACK;

        this.playAnimation(animationImages);
        this.soundManager.play?.('bubbleAttack');

        const totalDuration = animationImages.length * 100;
        const bubbleSpawnTime = totalDuration * 0.2;

        setTimeout(() => {
            if (typeof onComplete === 'function') {
                onComplete();
            }
        }, bubbleSpawnTime);

        setTimeout(() => {
            this.isAttacking = false;
        }, totalDuration);
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
        this.createAnimationInterval(() => {
            this.handleMovementAndSounds();
        }, 1000 / 60);

        this.createAnimationInterval(() => {
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

        if (this.hasDied) {
            return;
        } else if (this.isHurt()) {
            this.inactivity.resetInactivityTimer();
            const enemy = this.lastHitByEnemy;
            const images = enemy instanceof PufferFish
                ? this.IMAGES_HURT_BY_PUFFERFISH
                : this.IMAGES_HURT_BY_JELLYFISH;

            if (!this.hasPlayedHurtSound) {
                this.soundManager?.play('hurt');
                this.hasPlayedHurtSound = true;
            }

            this.playAnimation(images);
        } else {
            this.hasPlayedHurtSound = false;

            if (kb?.RIGHT || kb?.LEFT || kb?.UP || kb?.DOWN) {
                this.playAnimation(this.IMAGES_SWIM);
            } else if (this.inactivity.getInactivityDuration() > 15000) {
                this.playAnimation(this.IMAGES_INACTIVE);
            } else {
                this.playAnimation(this.IMAGES_IDLE);
            }
        }
    }

}