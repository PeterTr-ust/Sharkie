class PufferFish extends MovableObject {
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
    damage = 5;
    currentImage = 0;

    constructor() {
        super().loadImg('img/enemies/puffer-fish/idle/puffer-fish-idle-1.png');
        this.positionX = 300 + Math.random() * 500;
        this.positionY = 400 - Math.random() * 350;
        this.loadImgs(this.IMAGES_IDLE);
        this.speed = 0.15 + Math.random() * 0.25;
        this.setDefaultOffset();
        this.animate();
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
     * Overrides the animation to adjust offset dynamically.
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let currentImagePath = images[i];
        this.img = this.imageCache[currentImagePath];
        this.currentImage++;

        const inflatedFrames = new Set([
            'img/enemies/puffer-fish/idle/puffer-fish-idle-11.png',
            'img/enemies/puffer-fish/idle/puffer-fish-idle-12.png',
            'img/enemies/puffer-fish/idle/puffer-fish-idle-13.png',
            'img/enemies/puffer-fish/idle/puffer-fish-idle-14.png',
            'img/enemies/puffer-fish/idle/puffer-fish-idle-15.png'
        ]);

        if (inflatedFrames.has(currentImagePath)) {
            this.setInflatedOffset();
        } else {
            this.setDefaultOffset();
        }
    }

    /**
     * Animates movement and sprite cycling.
     */
    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);

        setInterval(() => {
            this.playAnimation(this.IMAGES_IDLE);
        }, 150);
    }
}
