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

    /**
    * Resets all keyboard input states to false.
     *
    * This method clears the directional and action keys (RIGHT, LEFT, UP, DOWN, SPACE, D),
     * typically used to stop all movement and actions when the game is paused or restarted.
    */
    reset() {
        this.RIGHT = this.LEFT = this.UP = this.DOWN =
            this.SPACE = this.D = false;
    }
}