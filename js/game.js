let canvas;
let soundManager;
let world;
let keyboard = new Keyboard();
let gameStarted = false;
let gameLoopId = null; // Store animation frame ID for cleanup

/**
 * Initializes the game by setting up the canvas and world.
 */
function init() {
    canvas = document.getElementById('canvas');
    soundManager = new SoundManager();
    world = new World(canvas, keyboard, soundManager);
    console.log('My Character is', world.character);
    
    gameStarted = true;
    world.start();
}

/**
 * Resets the game to initial state
 */
function gameReset() {
    console.log('Resetting game...');
    
    // 1. Stop the current game loop
    if (world && world.stopGame) {
        world.stopGame();
    }
    
    // 2. Clear any running intervals/timeouts
    if (gameLoopId) {
        cancelAnimationFrame(gameLoopId);
        gameLoopId = null;
    }
    
    // 3. Reset game state variables
    gameStarted = false;
    
    // 4. Reset keyboard state
    keyboard.RIGHT = false;
    keyboard.LEFT = false;
    keyboard.UP = false;
    keyboard.DOWN = false;
    keyboard.SPACE = false;
    keyboard.D = false;
    
    // 5. Clear canvas
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    // 6. Reset world and sound manager
    if (soundManager && soundManager.stopAllSounds) {
        soundManager.stopAllSounds();
    }
    
    world = null;
    soundManager = null;
    
    // 7. Hide game elements and show start screen
    document.getElementById('canvas-wrapper').style.display = 'none';
    document.getElementById('game-end-screen').classList.add('d-none');
    document.getElementById('start-screen').style.display = 'block';
    
    console.log('Game reset complete');
}

/**
 * Restarts the game (reset + immediate start)
 */
function gameRestart() {
    gameReset();
    
    // Small delay to ensure cleanup is complete
    setTimeout(() => {
        document.getElementById('start-screen').style.display = 'none';
        document.getElementById('canvas-wrapper').style.display = 'block';
        init();
    }, 100);
}

/**
 * Adds event listeners for keydown events.
 */
window.addEventListener('keydown', (event) => {
    if (!gameStarted) return;
    
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
        case 82: // R key for quick restart
            event.preventDefault();
            gameRestart();
            break;
    }
});

/**
 * Adds event listeners for keyup events.
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