/**
 * Initializes mobile controls and hides them if a physical keyboard is detected.
 *
 * This event listener waits for the DOM to be fully loaded before executing setup routines.
 * It sets up touch-based mobile controls for gameplay and hides them automatically
 * if a physical keyboard is detected via a keydown event.
 *
 * @listens DOMContentLoaded
 */
window.addEventListener('DOMContentLoaded', () => {
    setupMobileControls(keyboard);
    hideMobileControlsIfKeyboardPresent();
});

/**
 * Sets up mobile control buttons to simulate keyboard input for the game.
 *
 * @param {Keyboard} keyboard - The keyboard input handler instance used by the game.
 */
function setupMobileControls(keyboard) {
    const controlMap = {
        'btn-up': 'UP',
        'btn-down': 'DOWN',
        'btn-left': 'LEFT',
        'btn-right': 'RIGHT',
        'mobile-fin-attack': 'SPACE',
        'mobile-bubble-attack': 'D'
    };

    for (const [elementId, keyCode] of Object.entries(controlMap)) {
        const button = document.getElementById(elementId);
        if (!button) continue;

        registerPressEvents(button, keyboard, keyCode);
        registerReleaseEvents(button, keyboard, keyCode);
    }
}

/**
 * Registers touchstart and mousedown events to simulate key press.
 *
 * @param {HTMLElement} button - The button element to attach events to.
 * @param {Keyboard} keyboard - The keyboard input handler instance.
 * @param {string} keyCode - The key code to simulate.
 */
function registerPressEvents(button, keyboard, keyCode) {
    ['touchstart', 'mousedown'].forEach(eventType => {
        button.addEventListener(eventType, (event) => {
            event.preventDefault();
            keyboard[keyCode] = true;
        });
    });
}

/**
 * Registers touchend, mouseup, and mouseleave events to simulate key release.
 *
 * @param {HTMLElement} button - The button element to attach events to.
 * @param {Keyboard} keyboard - The keyboard input handler instance.
 * @param {string} keyCode - The key code to simulate.
 */
function registerReleaseEvents(button, keyboard, keyCode) {
    ['touchend', 'mouseup', 'mouseleave'].forEach(eventType => {
        button.addEventListener(eventType, (event) => {
            event.preventDefault();
            keyboard[keyCode] = false;
        });
    });
}

/**
 * Hides the mobile control buttons if a physical keyboard is detected.
 *
 * This function listens for the first keydown event and hides the mobile controls,
 * assuming that the user is using a physical keyboard instead of touch input.
 */
function hideMobileControlsIfKeyboardPresent() {
    const mobileControls = document.getElementById('mobile-controls');
    if (!mobileControls) return;

    window.addEventListener('keydown', () => {
        mobileControls.style.display = 'none';
    }, { once: true });
}

/**
 * Checks the current screen orientation and displays a warning if the device
 * is in portrait mode and the game is currently running.
 * Hides the warning when in landscape mode or if the start screen is visible.
 */
function checkOrientationAndShowWarning() {
  const warning = document.getElementById('rotate-warning');
  const startScreen = document.getElementById('start-screen');
  const isPortrait = window.matchMedia("(orientation: portrait)").matches;
  const isGameRunning = startScreen?.classList.contains('d-none');

  if (isPortrait && isGameRunning) {
    warning.classList.remove('d-none');
  } else {
    warning.classList.add('d-none');
  }
}

/**
 * Enables continuous monitoring of device orientation changes.
 *
 * This function sets up event listeners for orientation and resize events
 * to dynamically show or hide the rotation warning and control game state.
 */
function enableOrientationMonitoring() {
    window.addEventListener('orientationchange', checkOrientationAndShowWarning);
    window.addEventListener('resize', checkOrientationAndShowWarning);
}