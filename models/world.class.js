/**
 * Represents the main game world, tying together the character, level,
 * canvas context, status bars, and gameplay logic.
 */
class World {
    character;
    level = level1;
    canvas;
    ctx;
    keyboard;
    soundManager;
    cameraX = 0;
    lifeBar = new LifeBar();
    coinBar = new CoinBar();
    poisonBar = new PoisonBar();
    throwableObjects = [];
    spaceKeyPressed = false;
    lastBubbleTime = 0;
    bubbleCooldown = 1000;
    gameRunning = false;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.soundManager = soundManager;
        this.character = new Character(this.soundManager);
        this.setWorld();
        this.pauseAllAnimations();
    }

    pauseAllAnimations() {
        // Pausiere Character-Animationen
        if (this.character && this.character.pauseAnimations) {
            this.character.pauseAnimations();
        }

        // Pausiere alle Enemy-Animationen
        this.level.enemies.forEach(enemy => {
            if (enemy.pauseAnimations) {
                enemy.pauseAnimations();
            }
        });

        // Pausiere alle anderen animierten Objekte
        [...this.level.coins, ...this.level.poisonBottles, ...this.level.lights].forEach(obj => {
            if (obj.pauseAnimations) {
                obj.pauseAnimations();
            }
        });
    }

    resumeAllAnimations() {
        // Starte Character-Animationen
        if (this.character && this.character.resumeAnimations) {
            this.character.resumeAnimations();
        }

        // Starte alle Enemy-Animationen
        this.level.enemies.forEach(enemy => {
            if (enemy.resumeAnimations) {
                enemy.resumeAnimations();
            }
        });

        // Starte alle anderen animierten Objekte
        [...this.level.coins, ...this.level.poisonBottles, ...this.level.lights].forEach(obj => {
            if (obj.resumeAnimations) {
                obj.resumeAnimations();
            }
        });
    }

    start() {
        this.gameRunning = true;
        this.resumeAllAnimations(); // Starte alle Animationen
        this.draw();
        this.run();
    }

    /**
     * Assigns a reference of the world to the character.
     */
    setWorld() {
        this.character.world = this;
    }

    /**
     * Starts recurring game logic checks like collision and throwing.
     */
    run() {
        setInterval(() => {
            if (!this.gameRunning) return;
            
            this.checkEnemyCollisions();
            this.checkCollectablesCollisions();
            this.checkThrowObjects();
            this.checkAttack();
            this.checkBubbleEnemyCollision();
            this.checkBubbleEndbossCollision();
            this.removeMarkedThrowables();
        }, 50)
    }

    /**
    * Checks for collisions between the character and enemies.
    * Applies damage only if the character is not currently attacking
    * and the enemy is not already flying away.
    */
    checkEnemyCollisions() {
        this.level.enemies.forEach((enemy) => {
            const isColliding = this.character.isColliding(enemy);
            const characterNotAttacking = !this.character.isAttacking;
            const enemyNotFlyingAway = !enemy.isFlyingAway;

            if (isColliding && characterNotAttacking && enemyNotFlyingAway) {
                this.character.hit(enemy.damage, enemy);
                this.lifeBar.setPercentage(this.character.energy);
                console.log('Collision with Character, energy', this.character.energy);
            }
        });
    }

    checkBubbleEnemyCollision() {
        this.throwableObjects.forEach((bubble) => {
            this.level.enemies.forEach((enemy) => {
                if (enemy instanceof JellyFish || enemy instanceof DangerousJellyFish) {
                    if (!enemy.isFlyingAway && bubble.isColliding(enemy)) {
                        enemy.dead();
                        bubble.markForRemoval = true;
                    }
                }
            });
        });
    }

    checkBubbleEndbossCollision() {
        const endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
        if (!endboss || endboss.isDead()) return;

        this.throwableObjects.forEach((bubble, index) => {
            if (bubble.isPoisoned) {
                console.log(`Poisoned bubble ${index} checking collision...`);
                console.log('Bubble position:', bubble.positionX, bubble.positionY);
                console.log('Endboss position:', endboss.positionX, endboss.positionY);

                if (bubble.isColliding(endboss)) {
                    console.log('🔥 HIT DETECTED!');
                    endboss.hit(20);
                    bubble.markForRemoval = true;
                    this.soundManager.play('bubbleHit');
                }
            }
        });
    }


    /**
    * Checks for collisions between the character and all collectable objects.
    * Handles collection of coins and poison items.
    */
    checkCollectablesCollisions() {
        this.checkCollection(this.level.coins, 'collectedCoin', this.coinBar.addCoin.bind(this.coinBar));
        this.checkCollection(this.level.poisonBottles, 'collectedPoison', () => {
            this.handlePoisonCollection();
        });
    }

    handlePoisonCollection() {
        this.character.collectPoisonBottle();
        this.poisonBar.addPoison();

        if (this.character.hasAllPoisonBottles()) {
            this.soundManager.play?.('allPoisenCollected');
            this.showPowerUpNotification();
        }
    }

    showPowerUpNotification() {
        const notification = document.createElement('div');
        notification.textContent = 'POISON BUBBLES UNLOCKED!';
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(88, 101, 240, 0.9);
            color: rgba(92, 241, 102, 0.9);;
            padding: 20px;
            border-radius: 10px;
            font-size: 24px;
            font-weight: 100;
            z-index: 1000;
            animation: fadeInOut 4s ease-in-out;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }

    /**
    * Generic method for detecting and processing collectable item collisions.
    * Plays a sound, updates the corresponding bar, triggers collection animation, and removes the item.
    *
    * @param {Object[]} objects - The array of collectable game objects (e.g., coins, poison).
    * @param {string} soundKey - The key for the sound to be played when collected.
    * @param {Function} onCollect - Callback function executed after successful collection (e.g., update UI).
    */
    checkCollection(objects, soundKey, onCollect) {
        for (let i = objects.length - 1; i >= 0; i--) {
            const obj = objects[i];
            if (!obj.isBeingCollected && this.character.isColliding(obj)) {
                this.soundManager.play(soundKey);
                onCollect();
                obj.collectAnimation().then(() => {
                    objects.splice(i, 1);
                });
            }
        }
    }

    /**
    * Removes all throwable objects that have been marked for removal
    * (e.g., due to exceeding the maximum allowed distance).
    */
    removeMarkedThrowables() {
        this.throwableObjects = this.throwableObjects.filter(obj => !obj.markForRemoval);
    }

    /**
     * Checks if the player pressed the 'D' key and throws a bubble if so.
     */
    checkThrowObjects() {
        if (this.keyboard.D && !this.character.isAttacking) {
            let directionRight = !this.character.otherDirection;
            const offsetX = directionRight ? 120 : -10;
            const offsetY = 90;

            this.character.bubbleAttack(() => {
                const hasAllPoison = this.character.hasAllPoisonBottles();
                console.log('🔫 Creating bubble:');
                console.log('  - Character has all poison bottles:', hasAllPoison);
                console.log('  - Bubble will be poisoned:', hasAllPoison);

                const bubble = new ThrowableObject(
                    this.character.positionX + offsetX,
                    this.character.positionY + offsetY,
                    this.character.otherDirection !== true,
                    hasAllPoison
                );

                console.log('  - Created bubble isPoisoned:', bubble.isPoisoned);
                this.throwableObjects.push(bubble);
            });
        }
    }

    /**
    * Checks if the SPACE key was pressed to initiate an attack.
    * Ensures the attack is triggered only once per key press.
    * Prevents repeated attacks while holding down the key.
    */
    checkAttack() {
        if (this.keyboard.SPACE && !this.spaceKeyPressed && !this.character.isAttacking) {
            this.spaceKeyPressed = true;
            this.character.finAttack();
        }

        if (!this.keyboard.SPACE) {
            this.spaceKeyPressed = false;
        }
    }

    /**
    * Renders a collectable counter (e.g., "3 / 10") on the canvas at a specified position.
    * Displays the current collected count out of the total available.
    *
    * @param {Object} bar - The bar object containing the collectable status.
    * @param {number} bar.collected - The current number of collected items.
    * @param {number} bar.max - The total number of collectable items.
    * @param {number} x - The x-coordinate on the canvas where the text is drawn.
    * @param {number} y - The y-coordinate on the canvas where the text is drawn.
    */
    drawCollectableCounter(bar, x, y) {
        const text = `${bar.collected} / ${bar.max}`;

        this.ctx.font = '20px Arial';
        this.ctx.fillStyle = 'white';
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 2;
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'middle';

        this.ctx.strokeText(text, x, y);
        this.ctx.fillText(text, x, y);
    }

    /**
     * Clears and redraws the entire game scene.
     * Uses animation frames for smooth updates.
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.cameraX, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.lights);
        this.level.enemies = this.level.enemies.filter(enemy => !enemy.markedForRemoval);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.poisonBottles);
        this.addToMap(this.character);
        this.ctx.translate(-this.cameraX, 0);
        this.addToMap(this.lifeBar);
        this.addToMap(this.coinBar);
        this.drawCollectableCounter(this.coinBar, 325, 41);
        this.addToMap(this.poisonBar);
        this.drawCollectableCounter(this.poisonBar, 550, 41);
        this.ctx.translate(this.cameraX, 0);
        this.ctx.translate(-this.cameraX, 0);
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    };

    /**
     * Adds multiple drawable objects to the canvas.
     * @param {DrawableObject[]} objects - The objects to draw.
     */
    addObjectsToMap(objects) {
        objects.forEach(object => {
            this.addToMap(object);
        });
    }

    /**
    * Adds a single object to the canvas, respecting orientation.
    * @param {DrawableObject} objectToAdd - Object to render.
    */
    addToMap(objectToAdd) {
        if (objectToAdd.otherDirection) {
            this.flipImage(objectToAdd);
        }

        objectToAdd.draw(this.ctx);

        objectToAdd.drawFrame(this.ctx);

        if (objectToAdd.otherDirection) {
            this.flipImageBack(objectToAdd);
        }
    }

    /**
     * Flips an object's image horizontally.
     * @param {DrawableObject} objectToAdd - Object to flip.
     */
    flipImage(objectToAdd) {
        this.ctx.save();
        this.ctx.translate(objectToAdd.width, 0);
        this.ctx.scale(-1, 1);
        objectToAdd.positionX = objectToAdd.positionX * -1;
    }

    /**
     * Restores the object's original orientation.
     * @param {DrawableObject} objectToAdd - Object to unflip.
     */
    flipImageBack(objectToAdd) {
        objectToAdd.positionX = objectToAdd.positionX * -1;
        this.ctx.restore();
    }
}