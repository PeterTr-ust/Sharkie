/**
 * The HTML canvas element used for rendering the game.
 * @type {HTMLCanvasElement|null}
 */
let canvas = null;

/**
 * The current game world instance.
 * @type {World|null}
 */
let world = null;

/**
 * Handles player input through keyboard events.
 * @type {Keyboard}
 */
let keyboard = new Keyboard();

/**
 * Indicates whether the game has started.
 * @type {boolean}
 */
let gameStarted = false;

/**
 * Holds the ID of the active game loop interval or requestAnimationFrame.
 * @type {number|null}
 */
let gameLoopId = null;

/**
 * Initializes the game by configuring canvas, audio, and world.
 * 
 * @param {boolean|null} forceMute - Optional mute override for sound settings.
 */
function init(forceMute = null) {
    canvas = setupCanvas('canvas');
    const muteState = getMuteState(forceMute);
    soundManager.setMute(muteState);
    updateMuteIcon();
    world = setupWorld(canvas, keyboard, soundManager);
    gameStarted = true;
    world.start();
}

/**
 * Sets up the canvas element and adjusts its size.
 * 
 * @param {string} id - The ID of the canvas element in the DOM.
 * @returns {HTMLCanvasElement} The configured canvas element.
 */
function setupCanvas(id) {
    const canvas = document.getElementById(id);
    resetCanvasSize(canvas);
    return canvas;
}

/**
 * Resets the size of the given canvas element to a fixed width and height.
 *
 * @param {HTMLCanvasElement} canvas - The canvas element whose dimensions will be reset.
 */
function resetCanvasSize(canvas) {
    canvas.width = 720;
    canvas.height = 480;
}

/**
 * Determines the mute state based on the provided value or local storage.
 * 
 * @param {boolean|null} forceMute - Optional override for mute setting.
 * @returns {boolean} True if muted, false otherwise.
 */
function getMuteState(forceMute) {
    return forceMute !== null
        ? forceMute
        : localStorage.getItem('sharkie-muted') === 'true';
}

/**
 * Creates and returns a new game world.
 * 
 * @param {HTMLCanvasElement} canvas - The canvas element for rendering.
 * @param {Keyboard} keyboard - The keyboard input handler.
 * @param {SoundManager} soundManager - The sound manager for game audio.
 * @returns {World} The initialized game world object.
 */
function setupWorld(canvas, keyboard, soundManager) {
    const level = createLevel1();
    return new World(canvas, keyboard, soundManager, level);
}

/**
 * Resets the game to its initial state by clearing game logic,
 * resetting HUD and canvas, and updating UI elements.
 */
function gameReset() {
    console.log('Resetting game…');

    if (world) {
        stopRunningGame(world);
        world.level.enemies.length = 0;
    }

    resetGameState();

    if (world) resetStatusBars(world);

    if (canvas) clearCanvas(canvas);

    stopAllGameSounds(soundManager);

    world = null;

    updateUiOnGameReset();

    console.log('Game reset complete');
}

/**
 * Stops the current game logic and clears any scheduled actions.
 */
function stopRunningGame(world) {
    clearTimeout(world.endGameTimeout);
    world.stopGame();
}

/**
 * Resets game flags and input handlers.
 */
function resetGameState() {
    gameStarted = false;
    keyboard.reset();
}

/**
 * Resets the HUD elements (life, coin, poison bars) to default values.
 * 
 * @param {World} world - The current game world instance.
 */
function resetStatusBars(world) {
    world.lifeBar.setPercentage(100);
    world.coinBar.max = 10;
    world.coinBar.reset();
    world.poisonBar.max = 5;
    world.poisonBar.reset();
}

/**
 * Clears the canvas drawing area.
 * 
 * @param {HTMLCanvasElement} canvas - The canvas to be cleared.
 */
function clearCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Stops all active game sounds.
 * 
 * @param {SoundManager} soundManager - The game's sound manager.
 */
function stopAllGameSounds(soundManager) {
    soundManager?.stopAllSounds();
}

/**
 * Updates the visibility of main UI elements during game reset.
 */
function updateUiOnGameReset() {
    document.getElementById('canvas-wrapper').classList.add('d-none');
    document.getElementById('game-end-screen').classList.add('d-none');
    document.getElementById('start-screen').classList.remove('d-none');
}

/**
 * Restarts the game (reset + immediate start)
 */
function gameRestart() {
    const wasMuted = soundManager.muted;

    gameReset();
    handlePlayButtonClick();
    soundManager.setMute(wasMuted);
    updateMuteIcon();
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