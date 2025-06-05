class PufferFish extends MovableObject {

    constructor() {
        super().loadImg('img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/2.swim1.png');
        this.positionX = 200 + Math.random() * 500;
    }
}