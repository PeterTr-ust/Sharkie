let canvas;
let world;
let keyboard = new Keyboard();
let gameStarted = false;
let gameLoopId = null; // Store animation frame ID for cleanup

/**
 * Initializes the game by setting up the canvas and world.
 */
function init(forceMute = null) {
    canvas = document.getElementById('canvas');
    resetCanvasSize(canvas);
    // 2) Mute-Status ermitteln und anwenden
    const muteState = forceMute !== null
        ? forceMute
        : localStorage.getItem('sharkie-muted') === 'true';
    soundManager.setMute(muteState);
    updateMuteIcon();

    // 3) Welt und Game-Loop starten
    const level = createLevel1();
    world = new World(canvas, keyboard, soundManager, level);
    gameStarted = true;
    world.start();
}


/**
 * Resets the game to initial state
 */
function gameReset() {
    console.log('Resetting game…');

    // 1) Stoppe alle laufenden Loops, Animationen und lösche Endgame-Timeout
    if (world) {
        clearTimeout(world.endGameTimeout);
        world.stopGame();
    }

    // 2) Spiel-Status & Keyboard resetten
    gameStarted = false;
    keyboard.reset();

    // 3) Status-Bars zurücksetzen
    if (world) {
        world.lifeBar.setPercentage(100);
        world.coinBar.max = 10;
        world.coinBar.reset();
        world.poisonBar.max = 5;
        world.poisonBar.reset();
    }

    // 4) Canvas leeren
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // 5) Sounds stoppen
    soundManager?.stopAllSounds();

    // 6) Alte Referenzen löschen
    world = null;

    // 7) UI auf Start-Screen umschalten
    document.getElementById('canvas-wrapper').style.display = 'none';
    document.getElementById('game-end-screen').classList.add('d-none');
    document.getElementById('start-screen').style.display = 'block';

    console.log('Game reset complete');
}


/**
 * Restarts the game (reset + immediate start)
 */
function gameRestart() {
    const wasMuted = soundManager.muted;
    gameReset();

    setTimeout(() => {
        document.getElementById('start-screen').style.display = 'none';
        document.getElementById('canvas-wrapper').style.display = 'block';
        init(wasMuted);
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