class MovableObject {
    positionX = 120;
    positionY = 300;
    img;
    height = 100;
    width = 100;
    imageCache = {};
    currentImage = 0;
    speed = 0.01;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;

    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.positionY -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    isAboveGround() {
        return this.positionY < 200;
    }

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
        ctx.beginPath();
        ctx.lineWidth = '1';
        ctx.strokeStyle = 'blue';
        ctx.rect(this.positionX, this.positionY, this.width, this.height);
        ctx.stroke();
    }

    moveRight() {
        this.positionX += this.speed;
    }

    moveLeft() {
        this.positionX -= this.speed;
    }

    playAnimation(imagesToPlay) {
        let index = this.currentImage % this.IMAGES_WALKING.length;
        let path = imagesToPlay[index];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    jump() {
        this.speedY = 30;
    }
}