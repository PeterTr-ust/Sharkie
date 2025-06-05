class World {

    character = new Character();

    enemies = [
        new PufferFish(),
        new PufferFish(),
        new PufferFish(),
    ];

    lights = [
        new Light()
    ];

    backgroundObjects = [
        new BackgroundObject('img/3. Background/Layers/3.Fondo 1/L2.png')
    ];

    canvas;

    ctx;

    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.draw();
    }


    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.character.img, this.character.positionX, this.character.positionY, this.character.width, this.character.height);
        
        this.enemies.forEach(enemy => {
           this.addToMap(enemy);
        });

         this.lights.forEach(light => {
            this.addToMap(light);
        });

          this.backgroundObjects.forEach(background => {
            this.addToMap(background);
        });

        //draw() wird immer wieder aufgerufen. Durch requestAnimationFrame() wird die Leistung der Grafikkarte berücksichtig.
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    };

    addToMap(objectToAdd) {
         this.ctx.drawImage(objectToAdd.img, objectToAdd.positionX, objectToAdd.positionY, objectToAdd.width, objectToAdd.height);
    }
}