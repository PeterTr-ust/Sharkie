class LifeBar extends StatusBar {
    IMAGES = [
        'img/4. Marcadores/green/Life/0_  copia 3.png',
        'img/4. Marcadores/green/Life/20_ copia 4.png',
        'img/4. Marcadores/green/Life/40_  copia 3.png',
        'img/4. Marcadores/green/Life/60_  copia 3.png',
        'img/4. Marcadores/green/Life/80_  copia 3.png',
        'img/4. Marcadores/green/Life/100_  copia 2.png',
    ];

    constructor(x, y, width, height) {
        super().loadImg(this.IMAGES[5]);
        
        this.positionX = x || 20;
        this.positionY = y || 10;
        this.width = width || 200;
        this.height = height || 60;
        
        this.loadImgs(this.IMAGES);
        this.setPercentage(100);
    }
}