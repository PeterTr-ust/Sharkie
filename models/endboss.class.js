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
    attackSpeed = 20; // Geschwindigkeit der Bewegung nach links
    returnSpeed = 30; // Geschwindigkeit der Rückkehr
    originalX = 1750; // Ursprungsposition für die Rückkehr
    attackDistance = 400; // Wie weit der Boss sich nach links bewegt
    offset = {
        top: -200,
        left: -30,
        right: -40,
        bottom: -80
    };

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
     * Startet einen Timer für die Attack-Bewegung alle 15 Sekunden
     */
    startAttackTimer() {
        setInterval(() => {
            if (this.spawnAnimationCompleted && !this.isAttacking && !this.isReturning) {
                this.startAttack();
            }
        }, 10000); // 15 Sekunden
    }

    /**
     * Startet die Attack-Bewegung
     */
    startAttack() {
        this.isAttacking = true;
        this.lastAttackTime = Date.now();

        // Attack dauert etwa 2 Sekunden, dann Rückkehr
        setTimeout(() => {
            this.isAttacking = false;
            this.startReturn();
        }, 2000);
    }

    /**
     * Startet die Rückkehr zur ursprünglichen Position
     */
    startReturn() {
        this.isReturning = true;

        // Rückkehr dauert so lange bis die ursprüngliche Position erreicht ist
        const returnInterval = setInterval(() => {
            if (this.positionX >= this.originalX) {
                this.positionX = this.originalX; // Exakte Position setzen
                this.isReturning = false;
                clearInterval(returnInterval);
            }
        }, 50);
    }

    hit(damage) {
        if (this.energy > 0) {
            this.energy -= damage;
            this.playAnimation(this.IMAGES_HURT);
            this.lastHitTime = Date.now();

            // Optional: Überprüfen, ob der Boss tot ist
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

        setInterval(() => {
            // Spawn Animation
            if (world.character.positionX > 1250 && !this.hadFirstContact) {
                i = 0;
                this.hadFirstContact = true;
            }

            if (i < 10 && this.hadFirstContact) {
                this.playAnimation(this.IMAGES_SPAWNING);
            } else if (i >= 10 && this.hadFirstContact && !this.spawnAnimationCompleted) {
                this.spawnAnimationCompleted = true;
            }

            // Animation Logic nach dem Spawning
            if (this.spawnAnimationCompleted) {
                if (this.isAttacking) {
                    this.playAnimation(this.IMAGES_ATTACK);
                    // Bewegung nach links während des Angriffs
                    this.positionX -= this.attackSpeed;
                } else if (this.isReturning) {
                    this.playAnimation(this.IMAGES_IDLE);
                    // Bewegung nach rechts zurück zur ursprünglichen Position
                    this.positionX += this.returnSpeed;
                } else {
                    this.playAnimation(this.IMAGES_IDLE);
                }
            }

            i++;
        }, 150);
    }
}