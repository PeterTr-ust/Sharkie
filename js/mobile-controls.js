window.addEventListener('DOMContentLoaded', () => {
    setupMobileControls(keyboard);
    hideMobileControlsIfKeyboardPresent();
});

/**
 * Sets up mobile control buttons to simulate keyboard input for the game.
 *
 * This function maps touch and mouse events on on-screen buttons to the corresponding
 * properties of the Keyboard input handler. It supports directional movement (up, down,
 * left, right) as well as attack actions (fin slap and bubble attack).
 *
 * @param {Keyboard} keyboard - The keyboard input handler instance used by the game.
 */
function setupMobileControls(keyboard) {
    const map = {
        'btn-up': 'UP',
        'btn-down': 'DOWN',
        'btn-left': 'LEFT',
        'btn-right': 'RIGHT',
        'mobile-fin-attack': 'SPACE',
        'mobile-bubble-attack': 'D'
    };

    for (const [id, key] of Object.entries(map)) {
        const btn = document.getElementById(id);
        if (!btn) continue;

        ['touchstart', 'mousedown'].forEach(evt =>
            btn.addEventListener(evt, (e) => {
                e.preventDefault();
                keyboard[key] = true;
            })
        );

        ['touchend', 'mouseup', 'mouseleave'].forEach(evt =>
            btn.addEventListener(evt, (e) => {
                e.preventDefault();
                keyboard[key] = false;
            })
        );
    }
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