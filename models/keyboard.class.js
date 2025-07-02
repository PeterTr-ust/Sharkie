/**
 * Represents the standard state of keyboard inputs for the game.
 */
class Keyboard {
    LEFT = false;
    RIGHT = false;
    UP = false;
    DOWN = false;
    SPACE = false;
    D = false;

    reset() {
        this.RIGHT = this.LEFT = this.UP = this.DOWN =
            this.SPACE = this.D = false;
    }
}