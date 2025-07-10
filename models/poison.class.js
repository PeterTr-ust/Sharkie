/**
 * Represents a collectible poison bottle in the game.
 *
 * Inherits from {@link CollectableObject} and provides animation and collection behavior.
 * The poison animates continuously and can be collected by the player, triggering a float-up animation.
 */
class Poison extends CollectableObject {
    height = 60;
    width = 50;
    isBeingCollected = false;
    offset = {
        top: -25,
        left: -10,
        right: -10,
        bottom: 0
    };
    IMAGES = [
        'img/collectables/poison/poison-1.png',
        'img/collectables/poison/poison-2.png',
        'img/collectables/poison/poison-3.png',
        'img/collectables/poison/poison-4.png',
        'img/collectables/poison/poison-5.png',
        'img/collectables/poison/poison-6.png',
        'img/collectables/poison/poison-7.png',
        'img/collectables/poison/poison-8.png',
    ];

    constructor(x, y) {
        super();
        this.loadImg(this.IMAGES[0]);
        this.positionX = x;
        this.positionY = y;
        this.loadImgs(this.IMAGES);
        this.animate();
    }

    /**
    * Starts the poison's idle animation loop.
    */
    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES);
        }, 150);
    }

    /**
       * Executes the collection animation and then hides the poison.
       */
    async collect() {
        if (this.isBeingCollected) return;
        await this.collectAnimation();
    }
}
