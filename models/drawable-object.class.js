/**
 * Represents a drawable object in the game.
 * Provides functionality for loading images and rendering them on a canvas.
 */
class DrawableObject {
    positionX = 120;
    positionY = 300;
    height = 100;
    width = 100;
    img;
    imageCache = {};
    currentImage = 0;

    /**
    * Loads a single image into the object.
    * @param {string} path - The path to the image file.
    */
    loadImg(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Loads multiple images into the image cache.
     * @param {string[]} arr - Array of image paths to load.
     */
    loadImgs(arr) {
        arr.forEach(path => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Draws the image onto the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.positionX, this.positionY, this.width, this.height);
    }

    /**
     * Draws a frame (bounding box) around the object.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    drawFrame(ctx) {
        if (this instanceof Character || this instanceof PufferFish || this instanceof JellyFish) {
            const o = this.offset || { top: 0, left: 0, right: 0, bottom: 0 };

            const x = this.positionX - o.left;
            const y = this.positionY - o.top;
            const width = this.width + o.left + o.right;
            const height = this.height + o.top + o.bottom;

            ctx.beginPath();
            ctx.lineWidth = '1';
            ctx.strokeStyle = 'blue';
            ctx.rect(x, y, width, height);
            ctx.stroke();
        }
    }
}