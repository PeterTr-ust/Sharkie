let canvas;
let soundManager;
let world;
let keyboard = new Keyboard();
let gameStarted = false;

/**
 * Initializes the game by setting up the canvas and world.
 * Called directly from script.js when play button is clicked.
 */
function init() {
    canvas = document.getElementById('canvas');
    soundManager = new SoundManager();
    world = new World(canvas, keyboard, soundManager);
    console.log('My Character is', world.character);
    
    gameStarted = true; // Set flag BEFORE starting world
    world.start();
}

/**
 * Adds event listeners for keydown events.
 * Updates the keyboard object based on key presses.
 */
window.addEventListener('keydown', (event) => {
    if (!gameStarted) return; // Prevent input before game starts
    
    switch (event.keyCode) {
        case 39:
            keyboard.RIGHT = true;
            break;
        case 37:
            keyboard.LEFT = true;
            break;
        case 38:
            keyboard.UP = true;
            break;
        case 40:
            keyboard.DOWN = true;
            break;
        case 32:
            keyboard.SPACE = true;
            break;
        case 68:
            keyboard.D = true;
            break;
    }
});

/**
 * Adds event listeners for keyup events.
 * Updates the keyboard object when keys are released.
 */
window.addEventListener('keyup', (event) => {
    if (!gameStarted) return;
    
    switch (event.keyCode) {
        case 39:
            keyboard.RIGHT = false;
            break;
        case 37:
            keyboard.LEFT = false;
            break;
        case 38:
            keyboard.UP = false;
            break;
        case 40:
            keyboard.DOWN = false;
            break;
        case 32:
            keyboard.SPACE = false;
            break;
        case 68:
            keyboard.D = false;
            break;
    }
});