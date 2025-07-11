import { draw, } from '../js/renderUtils.js';

import {
    showGameEndScreen,
    showPowerUpNotification,
} from '../js/uiUtils.js';

import {
    checkEnemyCollisions,
    checkBubbleEnemyCollision,
    checkBubbleEndbossCollision,
    checkCollectablesCollisions,
    checkThrowObjects,
    checkAttack,
    removeMarkedThrowables
} from '../js/collisionUtils.js';

/**
 * Represents the main game world, tying together the character, level,
 * canvas context, status bars, and gameplay logic.
 */
export class World {
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
        draw(this);
        this.run();
    }

    /**
     * Assigns a reference of the world to the character.
     */
    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach(enemy => {
            if (enemy instanceof Endboss) {
                enemy.setWorld(this);
            }
        });
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

            checkEnemyCollisions(this);
            checkCollectablesCollisions(this, () => this.handlePoisonCollection());
            checkThrowObjects(this);
            checkAttack(this);
            checkBubbleEnemyCollision(this);
            checkBubbleEndbossCollision(this);
            removeMarkedThrowables(this);
        }, 50);
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
            showGameEndScreen(won ? 'win' : 'lose');
        }, 3000);

        setTimeout(() => {
            this.stopGame();
        }, 3500);
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
            showPowerUpNotification();
        }
    }
}