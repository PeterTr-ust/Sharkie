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
    hadFirstContact = false;
    spawnAnimationCompleted = false;
    isAttacking = false;
    isReturning = false;
    lastAttackTime = 0;
    attackSpeed = 20;
    returnSpeed = 30;
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
    * Starts a recurring timer that initiates the Endboss attack behavior
    * every 10 seconds, as long as the spawn animation is completed and 
    * the boss is not already attacking or returning.
     */
    startAttackTimer() {
        setInterval(() => {
            if (this.spawnAnimationCompleted && !this.isAttacking && !this.isReturning) {
                this.startAttack();
            }
        }, 8000);
    }

    /**
     * Initiates the boss's attack phase, marking it as attacking
     * and triggering the return phase after 2 seconds.
     */
    startAttack() {
        if (this.isDead()) return;
        world.soundManager.playLoop('endbossBite');
        this.isAttacking = true;
        this.lastAttackTime = Date.now();

        setTimeout(() => {
            this.isAttacking = false;
            this.startReturn();
        }, 2000);
    }

    /**
     * Moves the boss back to its original X position.
     * Continues moving right until the original position is reached,
     * then stops the return behavior.
     */
    startReturn() {
        if (this.isDead()) return;
        world.soundManager.stop('endbossBite');
        this.isReturning = true;

        const returnInterval = setInterval(() => {
            if (this.positionX >= this.originalX) {
                this.positionX = this.originalX; // Snap to original position
                this.isReturning = false;
                clearInterval(returnInterval);
            }
        }, 50);
    }

    /**
    * Applies damage to the Endboss and triggers the hurt animation.
    * If energy drops to 0 or below, initiates the death sequence.
     * 
     * @param {number} damage - The amount of damage to inflict.
    */
    hit(damage) {
        if (this.isDead()) return;
        if (this.energy > 0) {
            this.energy -= damage;
            this.playAnimation(this.IMAGES_HURT);
            this.lastHitTime = Date.now();

            if (this.energy <= 0) {
                this.energy = 0;
                this.die();
            }
        }
    }

    /**
     * Controls the animation and interaction with the player.
     */
    animate() {
        let i = 0;
        let deadAnimationPlayed = false;

        const animationInterval = setInterval(() => {
            if (this.isDead()) {
                if (!deadAnimationPlayed) {
                    this.playAnimation(this.IMAGES_DEAD);
                    deadAnimationPlayed = true;
                }
                return;
            }

            if (world.character.positionX > 1250 && !this.hadFirstContact) {
                i = 0;
                this.hadFirstContact = true;
            }

            if (i < 10 && this.hadFirstContact) {
                this.playAnimation(this.IMAGES_SPAWNING);
            } else if (i >= 10 && this.hadFirstContact && !this.spawnAnimationCompleted) {
                this.spawnAnimationCompleted = true;
            }

            if (this.spawnAnimationCompleted) {
                if (this.isAttacking) {
                    this.playAnimation(this.IMAGES_ATTACK);
                    this.positionX -= this.attackSpeed;
                } else if (this.isReturning) {
                    this.playAnimation(this.IMAGES_IDLE);
                    this.positionX += this.returnSpeed;
                } else {
                    this.playAnimation(this.IMAGES_IDLE);
                }
            }

            i++;
        }, 150);
    }
}