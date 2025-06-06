class Character extends MovableObject {
    positionX = 20;
    positionY = 150;
    height = 200;
    width = 200;
    speed = 3;
    IMAGES_WALKING = [
        'img/1.Sharkie/1.IDLE/1.png',
        'img/1.Sharkie/1.IDLE/2.png',
        'img/1.Sharkie/1.IDLE/3.png',
        'img/1.Sharkie/1.IDLE/4.png',
        'img/1.Sharkie/1.IDLE/5.png',
        'img/1.Sharkie/1.IDLE/6.png',
        'img/1.Sharkie/1.IDLE/7.png',
        'img/1.Sharkie/1.IDLE/8.png',
        'img/1.Sharkie/1.IDLE/9.png',
        'img/1.Sharkie/1.IDLE/10.png',
        'img/1.Sharkie/1.IDLE/11.png',
        'img/1.Sharkie/1.IDLE/12.png',
        'img/1.Sharkie/1.IDLE/13.png',
        'img/1.Sharkie/1.IDLE/14.png',
        'img/1.Sharkie/1.IDLE/15.png',
        'img/1.Sharkie/1.IDLE/16.png',
        'img/1.Sharkie/1.IDLE/17.png',
        'img/1.Sharkie/1.IDLE/18.png'
    ];
    world;

    constructor() {
        super().loadImg('img/1.Sharkie/1.IDLE/1.png');
        this.loadImgs(this.IMAGES_WALKING);
        this.animate();
    }

    animate() {
        setInterval(() => {
            if (this.world.keyboard.RIGHT && this.positionX < this.world.level.levelEndX) {
                this.positionX += this.speed;
                this.otherDirection = false;
            }

            if (this.world.keyboard.LEFT && this.positionX > 0) {
                this.positionX -= this.speed;
                this.otherDirection = true;
            }
            this.world.cameraX = -this.positionX;
        }, 1000 / 60);

        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 150);
    }

    jump() {


    }
}