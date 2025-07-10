/**
 * Represents the main game world, tying together the character, level,
 * canvas context, status bars, and gameplay logic.
 */
class World {
    character;
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
    endGameTimeout = null;

    constructor(canvas, keyboard, soundManager, level) {
        this.level = level;
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.soundManager = soundManager;
        this.character = new Character(this.soundManager);
        this.setWorld();
        this.pauseAllAnimations();
        this.animationId = null;
    }

    /**
    * Stops all running loops, intervals, animations and sounds
    * so that a subsequent restart starts with a clean game state.
    *
    * @returns {void}
    */
    stopGame() {
        this.stopMainLoops();
        this.stopCharacterAnimations();
        this.stopEnemyAnimations();
        this.stopThrowableObjectAnimations();
        this.stopCollectableAnimations();
        this.soundManager.stopAllSounds();
    }

    /**
     * Cancels the main game loop and interval.
     */
    stopMainLoops() {
        cancelAnimationFrame(this.drawFrameId);
        this.drawFrameId = null;
        clearInterval(this.runInterval);
        this.runInterval = null;
    }

    /**
     * Clears all animation intervals related to the player character.
     */
    stopCharacterAnimations() {
        this.character.clearAllAnimationIntervals();
        clearInterval(this.character.floatingInterval);
    }

    /**
     * Clears all animation intervals and timers for enemies.
     */
    stopEnemyAnimations() {
        this.level.enemies.forEach(enemy => {
            enemy.clearAllAnimationIntervals?.();
            clearInterval(enemy.floatingInterval);
            clearInterval(enemy.returnInterval);
            clearTimeout(enemy.startReturnTimeout);
            clearTimeout(enemy.patrolTimeout);
        });
    }

    /**
     * Clears all animation intervals for throwable objects.
     */
    stopThrowableObjectAnimations() {
        this.throwableObjects.forEach(obj => {
            obj.clearAllAnimationIntervals?.();
            clearInterval(obj.floatingInterval);
        });
    }

    /**
     * Clears all animation intervals for coins, poison bottles, and lights.
     */
    stopCollectableAnimations() {
        [...this.level.coins, ...this.level.poisonBottles, ...this.level.lights]
            .forEach(obj => {
                obj.clearAllAnimationIntervals?.();
                clearInterval(obj.floatingInterval);
            });
    }

    /**
    * Pauses all running animations for the character, enemies, and collectables.
    *
    * @returns {void}
    */
    pauseAllAnimations() {
        this.pauseCharacterAnimations();
        this.pauseEnemyAnimations();
        this.pauseCollectableAnimations();
    }

    /**
     * Pauses animations for the player character if available.
     */
    pauseCharacterAnimations() {
        if (this.character?.pauseAnimations) {
            this.character.pauseAnimations();
        }
    }

    /**
     * Pauses animations for all enemies in the current level.
     */
    pauseEnemyAnimations() {
        this.level.enemies.forEach(enemy => {
            if (enemy.pauseAnimations) {
                enemy.pauseAnimations();
            }
        });
    }

    /**
     * Pauses animations for all coins, poison bottles, and lights in the level.
     */
    pauseCollectableAnimations() {
        const collectables = [
            ...this.level.coins,
            ...this.level.poisonBottles,
            ...this.level.lights
        ];

        collectables.forEach(obj => {
            if (obj.pauseAnimations) {
                obj.pauseAnimations();
            }
        });
    }

    /**
    * Resumes all paused animations for the character, enemies, and collectables.
    *
    * @returns {void}
    */
    resumeAllAnimations() {
        this.resumeCharacterAnimations();
        this.resumeEnemyAnimations();
        this.resumeCollectableAnimations();
    }

    /**
     * Resumes animations for the player character if available.
     */
    resumeCharacterAnimations() {
        if (this.character?.resumeAnimations) {
            this.character.resumeAnimations();
        }
    }

    /**
     * Resumes animations for all enemies in the current level.
     */
    resumeEnemyAnimations() {
        this.level.enemies.forEach(enemy => {
            if (enemy.resumeAnimations) {
                enemy.resumeAnimations();
            }
        });
    }

    /**
     * Resumes animations for all coins, poison bottles, and lights in the level.
     */
    resumeCollectableAnimations() {
        const collectables = [
            ...this.level.coins,
            ...this.level.poisonBottles,
            ...this.level.lights
        ];

        collectables.forEach(obj => {
            if (obj.resumeAnimations) {
                obj.resumeAnimations();
            }
        });
    }

    /**
    * Starts the game loop and initializes all core systems.
    *
    * Sets the game state to running, resumes all paused animations,
    * starts ambient background sound, and begins the rendering and logic loops.
    *
    * @returns {void}
    */
    start() {
        this.gameRunning = true;
        this.resumeAllAnimations();
        this.soundManager.playLoop('ambient');
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
        if (this.runInterval) {
            clearInterval(this.runInterval);
        }
        this.runInterval = setInterval(() => {
            if (!this.gameRunning) return;

            this.checkGameState();
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
    * Checks the current game state to determine if the game should end.
    *
    * - Ends the game with a loss if the character has died.
    * - Ends the game with a win if the endboss has been defeated.
    *
    * @returns {void}
    */
    checkGameState() {
        const endboss = this.level.enemies.find(e => e instanceof Endboss);

        if (!this.character?.isDead) return;

        if (this.character.hasDied && this.gameRunning) {
            this.endGame(false);
        }

        if (endboss && endboss.isDead() && this.gameRunning) {
            this.endGame(true);
        }
    }

    /**
    * Ends the game and triggers the appropriate end screen and cleanup.
    *
    * - Stops the game loop and disables further updates.
    * - Displays the win or lose screen after a short delay.
    * - Stops all animations and sounds shortly after the end screen appears.
    *
    * @param {boolean} won - Indicates whether the player has won (`true`) or lost (`false`).
    * @returns {void}
    */
    endGame(won) {
        this.gameRunning = false;
        clearTimeout(this.endGameTimeout);

        setTimeout(() => {
            this.showGameEndScreen(won ? 'win' : 'lose');
        }, 3000);

        setTimeout(() => {
            this.stopGame();
        }, 3500);
    }

    /**
    * Displays the game end screen with a message based on the outcome.
    *
    * Updates the title and message elements to reflect a win or loss,
    * and makes the end screen visible by removing the 'd-none' class.
    *
    * @param {string} type - The outcome of the game; either `'win'` or `'lose'`.
    * @returns {void}
    */
    showGameEndScreen(type) {
        const screen = document.getElementById('game-end-screen');
        const title = document.getElementById('end-title');
        const message = document.getElementById('end-message');

        if (type === 'win') {
            title.textContent = 'Victory!';
            message.textContent = 'You defeated the endboss – Sharkie is the hero!';
        } else {
            title.textContent = 'Game Over';
            message.textContent = 'Sharkie was defeated… Try again!';
        }

        screen.classList.remove('d-none');
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
            }
        });
    }

    /**
    * Checks for collisions between bubbles and jellyfish enemies.
    *
    * Iterates over all throwable bubble objects and checks for collisions
    * with enemies of type {@link JellyFish} or {@link DangerousJellyFish}.
    * If a collision is detected and the enemy is not already flying away,
    * the enemy is marked as dead and the bubble is flagged for removal.
    *
    * @returns {void}
    */
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

    /**
    * Checks for collisions between poisoned bubbles and the endboss.
    *
    * - Finds the endboss from the list of enemies.
    * - If the endboss is alive, iterates over all throwable objects.
    * - For each poisoned bubble, checks for collision with the endboss.
    * - On collision, applies damage to the endboss, marks the bubble for removal,
    *   and plays a hit sound.
    *
    * @returns {void}
    */
    checkBubbleEndbossCollision() {
        const endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
        if (!endboss || endboss.isDead()) return;

        this.throwableObjects.forEach((bubble, index) => {
            if (bubble.isPoisoned) {

                if (bubble.isColliding(endboss)) {
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

    /**
    * Handles the logic when the character collects a poison bottle.
    *
    * - Increments the character's poison bottle count.
    * - Updates the poison status bar.
    * - If all poison bottles are collected, plays a sound and shows a power-up notification.
    *
    * @returns {void}
    */
    handlePoisonCollection() {
        this.character.collectPoisonBottle();
        this.poisonBar.addPoison();

        if (this.character.hasAllPoisonBottles()) {
            this.soundManager.play?.('allPoisenCollected');
            this.showPowerUpNotification();
        }
    }

    /**
    * Displays a temporary power-up notification on the screen.
    *
    * - Reveals the notification element by removing the 'd-none' class.
    * - Automatically hides it again after 3 seconds.
    * - Does nothing if the notification element is not found in the DOM.
    *
    * @returns {void}
    */
    showPowerUpNotification() {
        const notification = document.getElementById('powerup-notification');
        if (!notification) return;

        notification.classList.remove('d-none');

        setTimeout(() => {
            notification.classList.add('d-none');
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
    * Checks if the player pressed the 'D' key and throws a bubble if allowed.
    *
    * @returns {void}
    */
    checkThrowObjects() {
        if (this.keyboard.D && !this.character.isAttacking) {
            const directionRight = !this.character.otherDirection;
            const offsetX = this.getBubbleOffsetX(directionRight);
            const offsetY = 90;

            this.character.bubbleAttack(() => {
                const bubble = this.createBubble(offsetX, offsetY);
                this.throwableObjects.push(bubble);
            });
        }
    }

    /**
     * Calculates the horizontal offset for the bubble based on direction.
     *
     * @param {boolean} directionRight - Whether the character is facing right.
     * @returns {number} The X offset for bubble spawn position.
     */
    getBubbleOffsetX(directionRight) {
        return directionRight ? 120 : -10;
    }

    /**
     * Creates a new bubble object at the character's position.
     *
     * @param {number} offsetX - Horizontal offset from the character.
     * @param {number} offsetY - Vertical offset from the character.
     * @returns {ThrowableObject} The newly created bubble object.
     */
    createBubble(offsetX, offsetY) {
        const hasAllPoison = this.character.hasAllPoisonBottles();
        return new ThrowableObject(
            this.character.positionX + offsetX,
            this.character.positionY + offsetY,
            this.character.otherDirection !== true,
            hasAllPoison
        );
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

        this.ctx.font = '18px Luckiest Guy';
        this.ctx.fillStyle = 'white';
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 2;
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'middle';
        this.ctx.strokeText(text, x, y);
        this.ctx.fillText(text, x, y);
    }

    /**
    * Clears the canvas, draws the world (background, enemies, player, etc.) 
    * with the current camera offset, then draws the UI (status bars).
    * This method schedules itself on the next animation frame.
    *
    * @returns {void}
    */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.translate(this.cameraX, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.lights);
        this.level.enemies = this.level.enemies.filter(e => !e.markedForRemoval);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.poisonBottles);
        this.addToMap(this.character);
        this.ctx.restore();
        this.addToMap(this.lifeBar);
        this.addToMap(this.coinBar);
        this.drawCollectableCounter(this.coinBar, 310, 42);
        this.addToMap(this.poisonBar);
        this.drawCollectableCounter(this.poisonBar, 515, 42);
        this.drawFrameId = requestAnimationFrame(() => this.draw());
    }

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