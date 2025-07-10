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
    animationIntervals = [];
    animationsPaused = true;

    /**
    * Checks whether the object is above the ground level.
    * @returns {boolean} True if object can fall further.
    */
    isOnBottom() {
        return this.positionY < 300;
    }

    /**
     * Checks whether the object is below the upper bound.
     * @returns {boolean} True if object can move up.
     */
    isOnTop() {
        return this.positionY > -30;
    }

    /** @returns {void} Moves the object to the right. */
    moveRight() { this.positionX += this.speed; }

    /** @returns {void} Moves the object to the left. */
    moveLeft() { this.positionX -= this.speed; }

    /** @returns {void} Moves the object upward. */
    moveUp() { this.positionY -= this.speed; }

    /** @returns {void} Moves the object downward. */
    moveDown() { this.positionY += this.speed; }

    /**
     * Plays a looping animation by cycling through image frames.
     * @param {string[]} imagesToPlay - Array of image URLs to cycle.
     */
    playAnimation(imagesToPlay) {
        const index = this.currentImage % imagesToPlay.length;
        this.img = this.imageCache[imagesToPlay[index]];
        this.currentImage++;
    }

    /** @returns {void} Makes the object jump by setting vertical speed. */
    jump() {
        this.speedY = 30;
    }

    /**
     * Checks collision with another MovableObject using bounding boxes.
     * @param {MovableObject} mo - The other object to test.
     * @returns {boolean} True if collision detected.
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
     * Calculates the collision bounding box, adjusted by offset.
     * @returns {{x: number, y: number, width: number, height: number}}
     */
    getCollisionFrame() {
        const o = this.offset;
        return {
            x: this.positionX - o.left,
            y: this.positionY - o.top,
            width: this.width + o.left + o.right,
            height: this.height + o.top + o.bottom
        };
    }

    /**
     * Determines if the object is invulnerable (recently hit).
     * @returns {boolean} True if time since last hit < hurt duration.
     */
    canTakeDamage() {
        const now = Date.now();
        return now - this.lastHit > 2000;
    }

    /**
     * Applies damage, updates energy, and triggers death or hit state.
     * @param {number} damage - Amount of damage to apply.
     * @param {Object|null} enemy - The source enemy (optional).
     */
    hit(damage, enemy = null) {
        if (!this.canTakeDamage()) return;
        this.energy -= damage;
        if (this.energy <= 0) {
            this.energy = 0;
            this.die();
        } else {
            this.lastHit = Date.now();
        }
        if (enemy) this.lastHitByEnemy = enemy;
    }

    /**
    * Plays the puffer-fish death animation (spiral fly-away + fade).
    * Stores its interval so it can be cleared on reset.
    *
    * @returns {void}
    */
    playPufferDeathAnimation() {
        if (this.isFlyingAway) return;

        this.prepareForDeathAnimation();

        const interval = this.startDeathAnimationInterval();
        this.animationIntervals.push(interval);

        this.overrideDrawWithSpiralFade();
    }

    /**
     * Prepares the object for the death animation by setting initial values.
     */
    prepareForDeathAnimation() {
        this.isFlyingAway = true;
        this.markedForRemoval = false;
        this.speedY = -10;
        this.opacity = 1;
    }

    /**
     * Starts the interval that animates the spiral fly-away and fade-out effect.
     *
     * @returns {number} The interval ID for later clearing.
     */
    startDeathAnimationInterval() {
        let rotation = 0;
        const gravity = 1;

        return setInterval(() => {
            this.positionY += this.speedY;
            this.speedY += gravity;
            rotation += 10;
            this.opacity -= 0.05;

            if (this.opacity <= 0 || this.positionY > 600) {
                clearInterval(this.getLastAnimationInterval());
                this.markedForRemoval = true;
            }

            this.currentRotation = rotation;
        }, 30);
    }

    /**
     * Returns the most recently added animation interval.
     * Assumes the interval is pushed immediately after creation.
     *
     * @returns {number} The last interval ID.
     */
    getLastAnimationInterval() {
        return this.animationIntervals[this.animationIntervals.length - 1];
    }

    /**
     * Overrides the draw method to apply spiral rotation and fading effect.
     */
    overrideDrawWithSpiralFade() {
        this.draw = function (ctx) {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.translate(
                this.positionX + this.width / 2,
                this.positionY + this.height / 2
            );
            ctx.rotate((this.currentRotation * Math.PI) / 180);
            ctx.drawImage(
                this.img,
                -this.width / 2,
                -this.height / 2,
                this.width,
                this.height
            );
            ctx.restore();
        };
    }

    /**
    * Plays a jellyfish death animation, then floats it upward until removal.
    *
    * @param {string[]} imagesDead - Frames for the death animation.
    * @returns {void}
    */
    playJellyDeathAnimation(imagesDead) {
        if (this.isFlyingAway || !imagesDead?.length) return;

        this.isFlyingAway = true;
        this.isDead = true;

        this.startDeathFrameSequence(imagesDead);
    }

    /**
     * Plays the sequence of death animation frames.
     *
     * @param {string[]} images - The array of image paths for the death animation.
     */
    startDeathFrameSequence(images) {
        let frameIndex = 0;

        const interval = setInterval(() => {
            if (frameIndex < images.length) {
                this.img = this.imageCache[images[frameIndex++]];
            } else {
                clearInterval(interval);
                this.startFloatUpwardAfterDeath();
            }
        }, 150);

        this.animationIntervals.push(interval);
    }

    /**
     * Starts the upward floating animation after the death animation completes.
     */
    startFloatUpwardAfterDeath() {
        const interval = setInterval(() => {
            this.positionY -= 5;

            if (this.positionY < -100) {
                clearInterval(interval);
                this.markedForRemoval = true;
            }
        }, 1000 / 60);

        this.animationIntervals.push(interval);
    }

    /**
     * Plays a one-off animation sequence, then calls onFinish callback.
     * @param {string[]} images - Frames to display.
     * @param {Function} [onFinish] - Callback after last frame.
     */
    playAnimationOnce(images, onFinish) {
        if (!images?.length) return;
        let frame = 0;
        const interval = setInterval(() => {
            this.img = this.imageCache[images[frame++]];
            if (frame >= images.length) {
                clearInterval(interval);
                if (onFinish) onFinish();
            }
        }, 150);
        this.animationIntervals.push(interval);
    }

    /** @returns {boolean} True if energy is depleted. */
    isDead() {
        return this.energy <= 0;
    }

    /** @returns {boolean} True if object was hit in last second. */
    isHurt() {
        return (Date.now() - this.lastHit) / 1000 < 1;
    }

    /**
     * Triggers death animation and then floating motion.
     * Subclasses must define IMAGES_DEAD and finalDeadImage.
     */
    die() {
        if (this.hasDied) return;
        this.hasDied = true;
        this.energy = 0;
        this.playAnimationOnce(this.IMAGES_DEAD, () => {
            if (this.finalDeadImage) this.loadImg(this.finalDeadImage);
            this.startFloating();
        });
    }

    /**
     * Begins a gentle up-and-down floating effect after death.
     * Interval is tracked for cleanup.
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
        this.animationIntervals.push(this.floatingInterval);
    }

    /**
     * Pauses all animations by skipping callbacks in intervals.
     * @returns {void}
     */
    pauseAnimations() {
        this.animationsPaused = true;
    }

    /**
     * Resumes animations; if none are running, triggers animate().
     * @returns {void}
     */
    resumeAnimations() {
        this.animationsPaused = false;
        if (!this.animationIntervals.length) {
            this.animate();
        }
    }

    /**
     * Sets up a managed interval and tracks its ID for cleanup.
     * @param {Function} callback - Function to run each tick.
     * @param {number} delay - Milliseconds between ticks.
     * @returns {number} The interval ID.
     */
    createAnimationInterval(callback, delay) {
        const id = setInterval(() => {
            if (!this.animationsPaused) callback();
        }, delay);
        this.animationIntervals.push(id);
        return id;
    }

    /**
     * Clears and removes all tracked intervals (animations, floats).
     * @returns {void}
     */
    clearAllAnimationIntervals() {
        this.animationIntervals.forEach(clearInterval);
        this.animationIntervals.length = 0;

    }
}