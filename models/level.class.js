/**
 * Represents a game level containing enemies, lights, and background objects.
 */
class Level {
    enemies;
    lights;
    coins;
    poisonBottles;
    backgroundObjects;
    levelEndX = 1425;

    constructor(enemies, lights, coins, poisonBottles, backgroundObjects) {
        this.enemies = enemies;
        this.lights = lights;
        this.coins = coins;
        this.poisonBottles = poisonBottles;
        this.backgroundObjects = backgroundObjects;
    }
}