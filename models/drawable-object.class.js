class DrawableObject {
    positionX = 120;
    positionY = 300;
    height = 100;
    width = 100;
    img;
    imageCache = {};
    currentImage = 0;

    loadImg(path) {
        this.img = new Image();
        this.img.src = path;
    }

    loadImgs(arr) {
        arr.forEach(path => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.positionX, this.positionY, this.width, this.height);
    }

    drawFrame(ctx) {
        if (this instanceof Character || this instanceof PufferFish) {
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