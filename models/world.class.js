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
        new BackgroundObject('img/3. Background/Legacy/Layers/5. Water/D2.png', 0),
        new BackgroundObject('img/3. Background/Layers/3.Fondo 1/D1.png', 400),
        new BackgroundObject ('img/3. Background/Layers/4.Fondo 2/L2.png', 0),
        new BackgroundObject ('img/3. Background/Legacy/Layers/2. Floor/D3.png', 0),
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
        
        this.addObjectsToMap(this.backgroundObjects);
        this.addObjectsToMap(this.lights);
        this.addObjectsToMap(this.enemies);
        this.addToMap(this.character);

        //draw() wird immer wieder aufgerufen. Durch requestAnimationFrame() wird die Leistung der Grafikkarte berücksichtig.
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    };

    addObjectsToMap(objects) {
        objects.forEach(object => {
            this.addToMap(object);
        });
    }

    addToMap(objectToAdd) {
        this.ctx.drawImage(objectToAdd.img, objectToAdd.positionX, objectToAdd.positionY, objectToAdd.width, objectToAdd.height);
    }
}