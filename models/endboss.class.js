/**
 * Represents the final boss in the game.
 * Extends the MovableObject class to inherit movement behavior.
 */
class Endboss extends MovableObject {
    world = null;
    height = 400;
    width = 400;
    positionX = 1750;
    positionY = 0;
    hadFirstContact = false;
    spawnAnimationCompleted = false;
    isAttacking = false;
    isReturning = false;
    lastAttackTime = 0;
    attackSpeed = 20;
    returnSpeed = 10;
    originalX = 1750;
    attackDistance = 400;
    offset = {
        top: -200,
        left: -30,
        right: -40,
        bottom: -80
    };
    damage = 40;
    finalDeadImage = 'img/endboss/dead/endboss-dead-5.png';
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
    IMAGES_ATTACK = [
        'img/endboss/attack/1.png',
        'img/endboss/attack/2.png',
        'img/endboss/attack/3.png',
        'img/endboss/attack/4.png',
        'img/endboss/attack/5.png',
        'img/endboss/attack/6.png',
    ];
    IMAGES_HURT = [
        'img/endboss/hurt/1.png',
        'img/endboss/hurt/2.png',
        'img/endboss/hurt/3.png',
        'img/endboss/hurt/4.png',
    ];
    IMAGES_DEAD = [
        'img/endboss/dead/endboss-dead-1.png',
        'img/endboss/dead/endboss-dead-2.png',
        'img/endboss/dead/endboss-dead-3.png',
        'img/endboss/dead/endboss-dead-4.png',
        'img/endboss/dead/endboss-dead-5.png',
    ];

    constructor() {
        super().loadImg('');
        this.loadImgs(this.IMAGES_SPAWNING);
        this.loadImgs(this.IMAGES_IDLE);
        this.loadImgs(this.IMAGES_ATTACK);
        this.loadImgs(this.IMAGES_HURT);
        this.loadImgs(this.IMAGES_DEAD);
        this.animate();
        this.startAttackTimer();
    }

    /**
     * Assigns the current world reference to the boss.
     * @param {World} world - The game world instance
     */
    setWorld(world) {
        this.world = world;
    }

    /**
     * Starts the recurring interval that triggers boss attacks every few seconds.
     */
    startAttackTimer() {
        this.createAnimationInterval(() => {
            if (this.spawnAnimationCompleted && !this.isAttacking && !this.isReturning) {
                this.startAttack();
            }
        }, 5000);
    }

    /**
     * Initiates the attack sequence if the boss is alive.
     */
    startAttack() {
        if (this.isDead()) return;
        this.world?.soundManager?.playLoop('endbossBite');
        this.isAttacking = true;
        this.lastAttackTime = Date.now();

        setTimeout(() => {
            this.isAttacking = false;
            this.startReturn();
        }, 2000);
    }

    /**
     * Begins the return animation after attacking.
     */
    startReturn() {
        if (this.isDead()) return;
        this.stopBiteSound();
        this.isReturning = true;
        this.returnInterval = this.startReturnInterval();
        this.animationIntervals.push(this.returnInterval);
    }

    /**
     * Stops the bite sound effect when returning begins.
     */
    stopBiteSound() {
        this.world?.soundManager?.stop?.('endbossBite');
    }

    /**
     * Handles movement logic while returning to the original X position.
     * @returns {number} Interval ID used for clearing later
     */
    startReturnInterval() {
        return setInterval(() => {
            if (this.hasReachedOriginalX()) {
                this.snapToOriginalX();
                this.stopReturning();
            } else {
                this.moveTowardOriginalX();
            }
        }, 50);
    }

    /**
     * Checks whether the boss has returned to its original X position.
     * @returns {boolean}
     */
    hasReachedOriginalX() {
        return this.positionX >= this.originalX;
    }

    /**
     * Immediately snaps the boss to its original X position.
     */
    snapToOriginalX() {
        this.positionX = this.originalX;
    }

    /**
     * Stops the returning process and clears the interval.
     */
    stopReturning() {
        this.isReturning = false;
        clearInterval(this.returnInterval);
    }

    /**
     * Moves the boss toward its original X position.
     */
    moveTowardOriginalX() {
        this.positionX += this.returnSpeed;
    }

    /**
     * Applies damage to the boss and updates the health bar.
     * @param {number} damage - The amount of damage received
     */
    hit(damage) {
        if (this.isDead()) return;
        if (this.energy > 0) {
            this.energy -= damage;
            this.playAnimation(this.IMAGES_HURT);
            this.lastHitTime = Date.now();
            this.world?.endbossLifeBar?.setPercentage(this.energy);

            if (this.energy <= 0) {
                this.energy = 0;
                this.world?.soundManager?.stop?.('endbossBite');
                this.die();
            }
        }
    }

    /**
     * Starts the main animation loop for the boss.
     * Controls death animation, spawning, and combat behavior.
     */
    animate() {
        let deadAnimationPlayed = false;
        this.spawnFrameCount = 0;

        this.createAnimationInterval(() => {
            if (this.handleDeathAnimation(deadAnimationPlayed)) {
                deadAnimationPlayed = true;
                return;
            }

            this.checkFirstContact();

            if (this.shouldPlaySpawningAnimation(this.spawnFrameCount)) {
                this.playAnimation(this.IMAGES_SPAWNING);
            } else if (this.shouldCompleteSpawnAnimation(this.spawnFrameCount)) {
                this.spawnAnimationCompleted = true;
            }

            if (this.spawnAnimationCompleted) {
                this.handleCombatBehavior();
            }

            this.spawnFrameCount++;
        }, 150);
    }

    /**
     * Handles the one-time death animation sequence.
     * @param {boolean} alreadyPlayed - Whether the animation was already triggered
     * @returns {boolean} True if animation has been played
     */
    handleDeathAnimation(alreadyPlayed) {
        if (this.isDead()) {
            if (!alreadyPlayed) {
                this.playAnimation(this.IMAGES_DEAD);
            }
            return true;
        }
        return false;
    }

    /**
     * Checks whether the player has entered the boss activation zone.
     */
    checkFirstContact() {
        if (this.world?.character?.positionX > 1250 && !this.hadFirstContact) {
            this.hadFirstContact = true;
            this.spawnFrameCount = 0;
        }
    }

    /**
     * Determines whether to play spawning animation frames.
     * @param {number} frameCount - The current animation frame count
     * @returns {boolean}
     */
    shouldPlaySpawningAnimation(frameCount) {
        return this.hadFirstContact && frameCount < 10;
    }

    /**
     * Determines whether the spawning animation has completed.
     * @param {number} frameCount - The current animation frame count
     * @returns {boolean}
     */
    shouldCompleteSpawnAnimation(frameCount) {
        return this.hadFirstContact && frameCount >= 10 && !this.spawnAnimationCompleted;
    }

    /**
     * Handles combat animations and movement based on boss state.
     */
    handleCombatBehavior() {
        if (this.isAttacking) {
            this.playAnimation(this.IMAGES_ATTACK);
            this.positionX -= this.attackSpeed;
        } else if (this.isReturning) {
            this.playAnimation(this.IMAGES_IDLE);
            this.positionX += this.returnSpeed;

            if (this.positionX >= this.originalX) {
                this.positionX = this.originalX;
                this.isReturning = false;
                this.world?.soundManager?.stop?.('endbossBite');
            }
        } else {
            this.playAnimation(this.IMAGES_IDLE);
        }
    }
}