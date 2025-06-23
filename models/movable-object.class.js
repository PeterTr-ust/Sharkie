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

    /**
    * Applies gravity by updating vertical position and speed at intervals.
    */
    // applyGravity() {
    //     setInterval(() => {
    //         if (this.isAboveGround() || this.speedY > 0) {
    //             this.positionY -= this.speedY;
    //             this.speedY -= this.acceleration;
    //         }
    //     }, 1000 / 25);
    // }

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
    } 0

    /**
    * Applies damage to the object, updates the hit timestamp,
    * and remembers the enemy that caused the hit.
    */
    hit(damage, enemy = null) {
        this.energy -= damage;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
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
    enemyDeathAnimation() {
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
     * Checks if the object is dead (energy depleted).
     * @returns {boolean}
     */
    isDead() {
        return this.energy == 0;
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
}