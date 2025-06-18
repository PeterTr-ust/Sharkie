/**
 * Represents a game level containing enemies, lights, and background objects.
 */
class Level {
    enemies;
    lights;
    backgroundObjects;
    levelEndX = 1425;

    constructor(enemies, lights, backgroundObjects) {
        this.enemies = enemies;
        this.lights = lights;
        this.backgroundObjects = backgroundObjects;
    }
}