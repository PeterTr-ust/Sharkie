class ThrowableObject extends MovableObject {
    height = 70;
    width = 70;

    constructor(positionX, positionY) {
        super().loadImg('img/1.Sharkie/4.Attack/Bubble trap/Bubble.png');
        this.positionX = positionX;
        this.positionY = positionY;
        this.throw();
    }

    throw() {
        this.positionX = positionX;
        this.positionY = positionY;
        setInterval( () => {
            this.positionX += 4;
        }, 10)
    }
}