/**
 * Represents a game object that can move and interact with gravity and collisions.
 * Inherits drawing functionality from DrawableObject.
 */
class MovableObject extends DrawableObject {
    speed = 0.01;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    offset = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    };
    energy = 100;
    lastHit = 0;
    floatingInterval;
    hasDied = false;

    /**
    * Checks whether the object is above the ground level.
    * @returns {boolean}
    */
    isOnBottom() {
        return this.positionY < 300;
    }

    /**
   * Checks whether the object is under the top level.
   * @returns {boolean}
   */
    isOnTop() {
        return this.positionY > - 30;
    }

    /**
     * Moves the object to the right.
     */
    moveRight() {
        this.positionX += this.speed;
    }

    /**
     * Moves the object to the left.
     */
    moveLeft() {
        this.positionX -= this.speed;
    }

    /**
     * Moves the object up.
     */
    moveUp() {
        this.positionY -= this.speed;
    }

    /**
     * Moves the object down.
     */
    moveDown() {
        this.positionY += this.speed;
    }

    /**
     * Plays an animation by cycling through an array of images.
     * @param {string[]} imagesToPlay - List of image paths.
     */
    playAnimation(imagesToPlay) {
        let index = this.currentImage % imagesToPlay.length;
        let path = imagesToPlay[index];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Makes the object jump by setting vertical speed.
     */
    jump() {
        this.speedY = 30;
    }

    /**
     * Checks if this object collides with another movable object.
     * @param {MovableObject} mo - The other object.
     * @returns {boolean}
     */
    isColliding(mo) {
        const a = this.getCollisionFrame();
        const b = mo.getCollisionFrame();

        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        );
    }

    /**
     * Calculates the collision bounding box with applied offset.
     * @returns {{x: number, y: number, width: number, height: number}}
     */
    getCollisionFrame() {
        const o = this.offset || { top: 0, left: 0, right: 0, bottom: 0 };
        return {
            x: this.positionX - o.left,
            y: this.positionY - o.top,
            width: this.width + o.left + o.right,
            height: this.height + o.top + o.bottom
        };
    }

    /**
    * Determines whether the object is currently able to take damage.
    * The object becomes temporarily invulnerable after being hit,
    * based on the duration of the hurt animation.
    *
    * @returns {boolean} True if the object can take damage, otherwise false.
    */
    canTakeDamage() {
        const now = Date.now();
        const timeSinceLastHit = now - (this.lastHit || 0);
        const hurtAnimationDuration = 2000;

        return timeSinceLastHit > hurtAnimationDuration;
    }

    /**
     * Applies damage to the object. If damage is taken, the object's energy is reduced,
     * the time of the hit is recorded, and the source of the damage (enemy) is remembered.
     *
     * @param {number} damage - The amount of damage to apply.
     * @param {Object|null} enemy - The enemy object responsible for the hit (optional).
     */
    hit(damage, enemy = null) {
        if (!this.canTakeDamage()) return;

        console.log('Enemy:', enemy, 'Damage:', enemy?.damage);

        this.energy -= damage;
        if (this.energy < 0) {
            this.energy = 0;
            this.die();
        } else {
            this.lastHit = Date.now();
        }

        if (enemy) {
            this.lastHitByEnemy = enemy;
        }
    }

    /**
    * Triggers the enemy's death animation by making it fly upwards,
    * rotate, and fade out gradually over time.
    *
    * - Prevents re-triggering if already in animation.
    * - Applies upward velocity and simulates gravity.
    * - Gradually reduces opacity and increases rotation.
    * - Once fully faded or off-screen, marks the enemy for removal.
    * - Overrides the draw method to render rotation and transparency.
    */
    playPufferDeathAnimation() {
        if (this.isFlyingAway) return;
        this.isFlyingAway = true;
        this.markedForRemoval = false;

        this.speedY = -10;
        this.opacity = 1;
        let rotation = 0;
        const gravity = 1;

        const interval = setInterval(() => {
            this.positionY += this.speedY;
            this.speedY += gravity;
            rotation += 10;
            this.opacity -= 0.05;

            if (this.opacity <= 0 || this.positionY > 600) {
                clearInterval(interval);
                this.markedForRemoval = true;
            }
        }, 30);

        this.draw = function (ctx) {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.translate(this.positionX + this.width / 2, this.positionY + this.height / 2);
            ctx.rotate(rotation * Math.PI / 180);
            ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);
            ctx.restore();
        };
    }

    /**
    * Plays the jellyfish death animation sequence and triggers upward movement.
    *
    * - Prevents re-execution if the animation is already running or if no images are provided.
    * - Iterates through the provided death animation frames at 150ms intervals.
    * - After the animation completes, moves the jellyfish upward continuously until it exits the screen.
    * - Marks the object for removal once it has left the visible area.
    *
    * @param {string[]} imagesDead - Array of image paths representing the death animation frames.
    */
    playJellyDeathAnimation(imagesDead) {
        if (this.isFlyingAway || !imagesDead?.length) return;

        this.isFlyingAway = true;
        this.isDead = true;
        let frameIndex = 0;

        const deadInterval = setInterval(() => {
            if (frameIndex < imagesDead.length) {
                this.img = this.imageCache[imagesDead[frameIndex]];
                frameIndex++;
            } else {
                clearInterval(deadInterval);

                const flyInterval = setInterval(() => {
                    this.positionY -= 5;
                    if (this.positionY < -100) {
                        clearInterval(flyInterval);
                        this.markedForRemoval = true;
                    }
                }, 1000 / 60);
            }
        }, 150);
    }

    /**
     * Plays an animation sequence once and triggers an optional callback after completion.
    * @param {string[]} images - Array of image paths.
    * @param {Function} [onFinish] - Callback function after animation ends.
    */
    playAnimationOnce(images, onFinish) {
        if (!images?.length) return;
        let frame = 0;

        const interval = setInterval(() => {
            this.img = this.imageCache[images[frame]];
            frame++;

            if (frame >= images.length) {
                clearInterval(interval);
                if (onFinish) onFinish();
            }
        }, 150);
    }

    /**
     * Checks if the object is dead (energy depleted).
     * @returns {boolean}
     */
    isDead() {
        return this.energy <= 0;
    }

    /**
     * Checks if the object was recently hit.
     * @returns {boolean}
     */
    isHurt() {
        let timePassed = new Date().getTime() - this.lastHit
        timePassed = timePassed / 1000;
        return timePassed < 1;
    }

    /**
     * Triggers the death animation and floating logic.
     * Subclasses must set this.IMAGES_DEAD and this.finalDeadImage.
     */
    die() {
        if (this.hasDied) return;
        this.hasDied = true;

        this.energy = 0;
        this.playAnimationOnce(this.IMAGES_DEAD, () => {
            if (this.finalDeadImage) {
                this.loadImg(this.finalDeadImage);
            }
            this.startFloating();
        });
    }

    /**
     * Makes the object float up and down smoothly after death.
     */
    startFloating() {
        const amplitude = 10;
        const frequency = 0.05;
        const baseY = this.positionY;
        let time = 0;

        this.floatingInterval = setInterval(() => {
            this.positionY = baseY + Math.sin(time) * amplitude;
            time += frequency;
        }, 30);
    }
}