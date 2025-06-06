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

    moveRight() {
        console.log('Moving-Right');
    }

    moveLeft() {
        setInterval(() => {
            this.positionX -= this.speed;
        }, 1000 / 60);
    }

    playAnimation(imagesToPlay) {
        let index = this.currentImage % this.IMAGES_WALKING.length;
        let path = imagesToPlay[index];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
}