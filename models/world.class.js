class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    cameraX = 0;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
    }

    setWorld() {
        this.character.world = this;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.cameraX, 0);

        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.lights);
        this.addObjectsToMap(this.level.enemies);
        this.addToMap(this.character);

        this.ctx.translate(-this.cameraX, 0);

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
        if (objectToAdd.otherDirection) {
            this.ctx.save();
            this.ctx.translate(objectToAdd.width, 0);
            this.ctx.scale(-1, 1);
            objectToAdd.positionX = objectToAdd.positionX * -1;
        }

        this.ctx.drawImage(objectToAdd.img, objectToAdd.positionX, objectToAdd.positionY, objectToAdd.width, objectToAdd.height);

        if (objectToAdd.otherDirection) {
            objectToAdd.positionX = objectToAdd.positionX * -1;
            this.ctx.restore();
        }
    }
}