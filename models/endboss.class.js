class Endboss extends MovableObject {
    height = 400;
    width = 400;
    positionX = 1750;
    positionY = 0;
    IMAGES_SPAWNING = [
        'img/2.Enemy/3 Final Enemy/1.Introduce/1.png',
        'img/2.Enemy/3 Final Enemy/1.Introduce/2.png',
        'img/2.Enemy/3 Final Enemy/1.Introduce/3.png',
        'img/2.Enemy/3 Final Enemy/1.Introduce/4.png',
        'img/2.Enemy/3 Final Enemy/1.Introduce/5.png',
        'img/2.Enemy/3 Final Enemy/1.Introduce/6.png',
        'img/2.Enemy/3 Final Enemy/1.Introduce/7.png',
        'img/2.Enemy/3 Final Enemy/1.Introduce/8.png',
        'img/2.Enemy/3 Final Enemy/1.Introduce/9.png',
        'img/2.Enemy/3 Final Enemy/1.Introduce/10.png',
    ];
    IMAGES_SWIMMING = [
        'img/2.Enemy/3 Final Enemy/2.floating/1.png',
        'img/2.Enemy/3 Final Enemy/2.floating/2.png',
        'img/2.Enemy/3 Final Enemy/2.floating/3.png',
        'img/2.Enemy/3 Final Enemy/2.floating/4.png',
        'img/2.Enemy/3 Final Enemy/2.floating/5.png',
        'img/2.Enemy/3 Final Enemy/2.floating/6.png',
        'img/2.Enemy/3 Final Enemy/2.floating/7.png',
        'img/2.Enemy/3 Final Enemy/2.floating/8.png',
        'img/2.Enemy/3 Final Enemy/2.floating/9.png',
        'img/2.Enemy/3 Final Enemy/2.floating/10.png',
        'img/2.Enemy/3 Final Enemy/2.floating/11.png',
        'img/2.Enemy/3 Final Enemy/2.floating/12.png',
        'img/2.Enemy/3 Final Enemy/2.floating/13.png',
    ];
    hadFirstContact = false;
    spawnAnimationCompleted = false;

    constructor() {
        super().loadImg('');
        this.loadImgs(this.IMAGES_SPAWNING);
        this.loadImgs(this.IMAGES_SWIMMING);
        this.animate();
    }

    animate() {
        let i = 0;

        setInterval(() => {
            if (world.character.positionX > 1250 && !this.hadFirstContact) {
                i = 0;
                this.hadFirstContact = true;
            }
            if (i < 10 && this.hadFirstContact) {
                this.playAnimation(this.IMAGES_SPAWNING);
            } else if (i >= 10 && this.hadFirstContact) {
                this.spawnAnimationCompleted = true;
                this.playAnimation(this.IMAGES_SWIMMING);
            } else if (this.spawnAnimationCompleted) {
                this.playAnimation(this.IMAGES_SWIMMING);
            }

            i++;
        }, 150);
    }
}
