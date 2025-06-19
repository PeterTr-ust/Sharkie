/**
 * Represents a game level containing enemies, lights, and background objects.
 */
class Level {
    enemies;
    lights;
    coins;
    backgroundObjects;
    levelEndX = 1425;

    constructor(enemies, lights, coins, backgroundObjects) {
        this.enemies = enemies;
        this.lights = lights;
        this.coins = coins;
        this.backgroundObjects = backgroundObjects;
    }
}