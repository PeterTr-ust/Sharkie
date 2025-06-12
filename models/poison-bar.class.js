class PoisonBar extends StatusBar {
    IMAGES = [
        'img/4. Marcadores/orange/0_ copia.png',
        'img/4. Marcadores/orange/20_ copia.png',
        'img/4. Marcadores/orange/40_ copia.png',
        'img/4. Marcadores/orange/60_ copia.png',
        'img/4. Marcadores/orange/80_ copia.png',
        'img/4. Marcadores/orange/100_ copia.png'
    ];

    constructor(x, y, width, height) {
        super().loadImg(this.IMAGES[5]);
        
        this.positionX = x || 20;
        this.positionY = y || 110;
        this.width = width || 200;
        this.height = height || 60;
        
        this.loadImgs(this.IMAGES);
        this.setPercentage(100);
    }
}