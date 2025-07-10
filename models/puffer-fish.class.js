/**
 * Represents a hostile pufferfish enemy in the game.
 *
 * Inherits from {@link MovableObject} and includes behavior for movement,
 * collision detection, and death animation. The pufferfish can interact with
 * the player character and trigger specific animations when defeated.
 */
class PufferFish extends MovableObject {
    damage = 10;
    currentImage = 0;
    direction = 'left';
    animationIntervals = [];
    animationsPaused = true;
    IMAGES_IDLE = [
        'img/enemies/puffer-fish/idle/puffer-fish-idle-1.png',
        'img/enemies/puffer-fish/idle/puffer-fish-idle-2.png',
        'img/enemies/puffer-fish/idle/puffer-fish-idle-3.png',
        'img/enemies/puffer-fish/idle/puffer-fish-idle-4.png',
        'img/enemies/puffer-fish/idle/puffer-fish-idle-5.png',
        'img/enemies/puffer-fish/idle/puffer-fish-idle-6.png',
        'img/enemies/puffer-fish/idle/puffer-fish-idle-7.png',
        'img/enemies/puffer-fish/idle/puffer-fish-idle-8.png',
        'img/enemies/puffer-fish/idle/puffer-fish-idle-9.png',
        'img/enemies/puffer-fish/idle/puffer-fish-idle-10.png',
        'img/enemies/puffer-fish/idle/puffer-fish-idle-11.png',
        'img/enemies/puffer-fish/idle/puffer-fish-idle-12.png',
        'img/enemies/puffer-fish/idle/puffer-fish-idle-13.png',
        'img/enemies/puffer-fish/idle/puffer-fish-idle-14.png',
        'img/enemies/puffer-fish/idle/puffer-fish-idle-15.png',
        'img/enemies/puffer-fish/idle/puffer-fish-idle-16.png',
        'img/enemies/puffer-fish/idle/puffer-fish-idle-17.png',
        'img/enemies/puffer-fish/idle/puffer-fish-idle-18.png',
        'img/enemies/puffer-fish/idle/puffer-fish-idle-19.png',
        'img/enemies/puffer-fish/idle/puffer-fish-idle-20.png',
    ];

    constructor() {
        super().loadImg('img/enemies/puffer-fish/idle/puffer-fish-idle-1.png');
        this.positionX = 300 + Math.random() * 500;
        this.positionY = 400 - Math.random() * 350;
        this.loadImgs(this.IMAGES_IDLE);
        this.speed = 0.15 + Math.random() * 0.25;
        this.setDefaultOffset();
    }

    /**
     * Sets the default offset for the puffer fish.
     */
    setDefaultOffset() {
        this.offset = {
            top: -15,
            left: -15,
            right: -30,
            bottom: -35
        };
    }

    /**
     * Sets the inflated offset for the puffer fish when puffed up.
     */
    setInflatedOffset() {
        this.offset = {
            top: -5,
            left: -15,
            right: -30,
            bottom: -5
        };
    }

    /**
    * Plays the next frame in the animation sequence and adjusts the offset if needed.
    *
    * @param {string[]} images - Array of image paths for the animation sequence.
    */
    playAnimation(images) {
        const nextImagePath = this.getNextAnimationFrame(images);
        this.img = this.imageCache[nextImagePath];
        this.adjustOffsetForFrame(nextImagePath);
    }

    /**
     * Retrieves the next image path in the animation sequence.
     *
     * @param {string[]} images - Array of image paths.
     * @returns {string} The path of the next image to display.
     */
    getNextAnimationFrame(images) {
        const index = this.currentImage % images.length;
        this.currentImage++;
        return images[index];
    }

    /**
     * Adjusts the object's collision offset based on the current animation frame.
     *
     * @param {string} imagePath - The path of the current animation frame.
     */
    adjustOffsetForFrame(imagePath) {
        const inflatedFrames = new Set([
            'img/enemies/puffer-fish/idle/puffer-fish-idle-11.png',
            'img/enemies/puffer-fish/idle/puffer-fish-idle-12.png',
            'img/enemies/puffer-fish/idle/puffer-fish-idle-13.png',
            'img/enemies/puffer-fish/idle/puffer-fish-idle-14.png',
            'img/enemies/puffer-fish/idle/puffer-fish-idle-15.png'
        ]);

        if (inflatedFrames.has(imagePath)) {
            this.setInflatedOffset();
        } else {
            this.setDefaultOffset();
        }
    }

    /**
     * Animates movement and sprite cycling.
     */
    animate() {
        if (this.animationsPaused) return;
        this.createAnimationInterval(() => {
            this.updateDirection();
            this.move();
        }, 1000 / 60);

        this.createAnimationInterval(() => {
            this.playAnimation(this.IMAGES_IDLE);
        }, 150);
    }

    /**
     * Moves the fish based on current direction.
     */
    move() {
        if (this.direction === 'left') {
            this.moveLeft();
        } else {
            this.moveRight();
        }
    }

    /**
    * Checks canvas boundaries and updates movement direction if limits are reached.
    */
    updateDirection() {
        const canvasMin = 50;
        const canvasMax = 720;

        if (this.isBeyondLeftBoundary(canvasMin)) {
            this.setDirectionRight();
        }

        if (this.isBeyondRightBoundary(canvasMax)) {
            this.setDirectionLeft();
        }
    }

    /**
     * Checks if the object has moved beyond the left canvas boundary.
     *
     * @param {number} minX - The minimum allowed X position.
     * @returns {boolean} True if the object is beyond the left boundary.
     */
    isBeyondLeftBoundary(minX) {
        return this.positionX < minX;
    }

    /**
     * Checks if the object has moved beyond the right canvas boundary.
     *
     * @param {number} maxX - The maximum allowed X position.
     * @returns {boolean} True if the object is beyond the right boundary.
     */
    isBeyondRightBoundary(maxX) {
        return this.positionX > maxX - this.width;
    }

    /**
     * Sets the movement direction to right and flips the sprite if needed.
     */
    setDirectionRight() {
        this.direction = 'right';
        this.otherDirection = true;
    }

    /**
     * Sets the movement direction to left and resets sprite orientation.
     */
    setDirectionLeft() {
        this.direction = 'left';
        this.otherDirection = false;
    }
}