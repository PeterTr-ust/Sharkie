let canvas;
let soundManager;
let world;
let keyboard = new Keyboard();

/**
 * Initializes the game by setting up the canvas and world.
 */
function init() {
    canvas = document.getElementById('canvas');
    soundManager  = new SoundManager();
    world = new World(canvas, keyboard, soundManager);
    console.log('My Character is', world.character);
}

/**
 * Adds event listeners for keydown events.
 * Updates the keyboard object based on key presses.
 */
window.addEventListener('keydown', (event) => {
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

// Helper to create a fresh level1 instance
function createLevel1() {
    return new Level(
        [
            new PufferFish(),
            new PufferFish(),
            new PufferFish(),
            new JellyFish(820, 400),
            new JellyFish(920, 400),
            new JellyFish(1020, 400),
            new DangerousJellyFish(1300, 400),
            new Endboss(),
        ],
        [ new Light() ],
        [
            new Coin(400, 200), new Coin(450, 180), new Coin(500, 200), new Coin(700, 300), new Coin(900, 180),
            new Coin(1000, 180), new Coin(1330, 100), new Coin(1330, 200), new Coin(1330, 300), new Coin(1550, 350)
        ],
        [
            new Poison(445, 210), new Poison(695, 100), new Poison(945, 160), new Poison(1325, 130), new Poison(1325, 230)
        ],
        [
            new BackgroundObject('img/game-background/game-background-1.png', 0),
            new BackgroundObject('img/game-background/game-background-element-1.png', 0),
            new BackgroundObject('img/game-background/game-background-element-2.png', 0),
            new BackgroundObject('img/game-background/game-background-element-3.png', 0),
            new BackgroundObject('img/game-background/game-background-2.png', 720),
            new BackgroundObject('img/game-background/game-background-element-4.png', 720),
            new BackgroundObject('img/game-background/game-background-element-5.png', 720),
            new BackgroundObject('img/game-background/game-background-element-6.png', 720),
            new BackgroundObject('img/game-background/game-background-3.png', 720 * 2),
            new BackgroundObject('img/game-background/game-background-element-1.png', 720 * 2),
            new BackgroundObject('img/game-background/game-background-element-2.png', 720 * 2),
            new BackgroundObject('img/game-background/game-background-element-3.png', 720 * 2)
        ]
    );
}

// End Screen Logic
let endScreenTimeout = null;
function showEndScreen({ win, coins }) {
    if (window.world && window.world.soundManager) {
        // Stop all sounds
        Object.keys(window.world.soundManager.sounds).forEach(key => {
            window.world.soundManager.stop(key);
        });
    }
    if (endScreenTimeout) clearTimeout(endScreenTimeout);
    // If win, show after 750ms (death animation), then 4s delay
    let delay = win ? 750 : 0;
    endScreenTimeout = setTimeout(() => {
        const overlay = document.getElementById('end-screen');
        const title = document.getElementById('end-screen-title');
        const coinsText = document.getElementById('end-screen-coins');
        const image = document.getElementById('end-screen-image');
        const restartBtn = document.getElementById('end-screen-restart');

        if (win) {
            title.textContent = 'You Win!';
            image.src = 'img/6.Botones/Tittles/You win/Mesa de trabajo 1.png';
            image.alt = 'You Win';
        } else {
            title.textContent = 'Game Over';
            image.src = 'img/6.Botones/Tittles/Game Over/Recurso 10.png';
            image.alt = 'Game Over';
        }
        coinsText.textContent = `Coins Collected: ${coins}`;
        overlay.style.display = 'flex';
        restartBtn.onclick = () => {
            hideEndScreen();
            resetGame();
        };
    }, delay + 4000);
}

function hideEndScreen() {
    if (endScreenTimeout) clearTimeout(endScreenTimeout);
    document.getElementById('end-screen').style.display = 'none';
}

function resetGame() {
    // Hide overlay immediately
    hideEndScreen();
    // Reset the world and all state with a fresh level1
    if (window.world) {
        if (window.world._pendingEndScreen) {
            clearTimeout(window.world._pendingEndScreen);
        }
        window.world._endScreenTriggered = false;
        window.world._pendingEndScreen = null;
        window.world = null;
    }
    if (endScreenTimeout) {
        clearTimeout(endScreenTimeout);
        endScreenTimeout = null;
    }
    window.level1 = createLevel1();
    // Clear the canvas
    const canvas = document.getElementById('canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx && ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    // Create a new World instance and assign to global 'world'
    world = new World(canvas, keyboard);
}