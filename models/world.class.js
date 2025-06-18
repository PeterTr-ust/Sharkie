/**
 * Represents the main game world, tying together the character, level,
 * canvas context, status bars, and gameplay logic.
 */
class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    cameraX = 0;
    lifeBar = new LifeBar();
    coinBar = new CoinBar();
    poisonBar = new PoisonBar();
    throwableObjects = [];

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
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
            this.checkCollisions();
            this.checkThrowObjects();
        }, 1000)
    }

    /**
     * Checks for collisions between the character and enemies.
     * Applies damage if collision is detected.
     */
    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy)) {
                this.character.hit();
                this.lifeBar.setPercentage(this.character.energy);
                console.log('Collision with Character, energy', this.character.energy);
            }
        })
    }

    /**
     * Checks if the player pressed the 'D' key and throws a bubble if so.
     */
    checkThrowObjects() {
        if (this.keyboard.D) {
            let bubble = new ThrowableObject(this.character.positionX, this.character.positionY);
            this.throwableObjects.push(bubble);
        }
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
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addToMap(this.character);
        this.ctx.translate(-this.cameraX, 0);
        //  Space for fixed objects
        this.addToMap(this.lifeBar);
        this.addToMap(this.coinBar);
        this.addToMap(this.poisonBar);
        this.ctx.translate(this.cameraX, 0);
        this.ctx.translate(-this.cameraX, 0);
        //draw() wird immer wieder aufgerufen. Durch requestAnimationFrame() wird die Leistung der Grafikkarte berücksichtig.
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