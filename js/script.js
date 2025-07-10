/**
 * Manages game sound functionality such as muting and playing sounds.
 * Global access is provided through the `window` object.
 * 
 * @type {SoundManager}
 */
const soundManager = new SoundManager();

/**
 * Exposes the sound manager instance globally.
 */
window.soundManager = soundManager;

/**
 * Executes initial UI setup once the HTML document has been fully loaded.
 * 
 * Tasks performed:
 * - Binds all event listeners to UI elements.
 * - Updates the mute icon to reflect the saved sound state.
 * - Sets up window resize handling to dynamically adjust canvas and button layout.
 */
window.addEventListener('DOMContentLoaded', () => {
  bindUIListeners();
  updateMuteIcon();
});

/**
 * Retrieves and returns all relevant UI elements by their DOM IDs.
 * 
 * @returns {{
 *   startScreen: HTMLElement,
 *   canvasWrapper: HTMLElement,
 *   instructionsDialog: HTMLElement,
 *   playBtn: HTMLElement,
 *   instructionsBtn: HTMLElement,
 *   closeInstrBtn: HTMLElement,
 *   tryAgainBtn: HTMLElement,
 *   backToStartBtn: HTMLElement,
 *   muteBtn: HTMLElement
 * }}
 */
function getUiElements() {
  return {
    startScreen: document.getElementById('start-screen'),
    canvasWrapper: document.getElementById('canvas-wrapper'),
    instructionsDialog: document.getElementById('instructions-dialog'),
    playBtn: document.getElementById('play-button'),
    instructionsBtn: document.getElementById('instructions-button'),
    closeInstrBtn: document.getElementById('close-instructions'),
    tryAgainBtn: document.getElementById('try-again-button'),
    backToStartBtn: document.getElementById('back-to-start-button'),
    muteBtn: document.getElementById('mute-button'),
  };
}

/**
 * Binds all main UI button event listeners to their respective actions.
 */
function bindUIListeners() {
  const {
    startScreen,
    canvasWrapper,
    instructionsDialog,
    playBtn,
    instructionsBtn,
    closeInstrBtn,
    tryAgainBtn,
    backToStartBtn,
    muteBtn
  } = getUiElements();

  playBtn?.addEventListener('click', () => handlePlayButtonClick(startScreen, canvasWrapper));
  instructionsBtn?.addEventListener('click', () => handleInstructionsButtonClick(instructionsDialog));
  closeInstrBtn?.addEventListener('click', handleCloseInstructionsClick);
  instructionsDialog?.addEventListener('click', e => handleDialogClickOutside(e, instructionsDialog));
  tryAgainBtn?.addEventListener('click', handleTryAgainClick);
  backToStartBtn?.addEventListener('click', handleBackToStartClick);
  muteBtn?.addEventListener('click', () => handleMuteButtonClick(muteBtn));
  document.addEventListener('keydown', e => handleEscapeKeyPress(e, instructionsDialog));
}

/**
 * Hides an element by adding the 'd-none' class.
 * 
 * @param {string} id - The ID of the element to hide.
 */
function hideElement(id) {
  document.getElementById(id)?.classList.add('d-none');
}

/**
 * Shows an element by removing the 'd-none' class.
 * 
 * @param {string} id - The ID of the element to show.
 */
function showElement(id) {
  document.getElementById(id)?.classList.remove('d-none');
}

/**
 * Starts the game after the Play button is clicked.
 * 
 * Steps:
 * 1. Hides the start screen.
 * 2. Reveals the canvas wrapper.
 * 3. Waits for the next frame and applies a short delay to ensure layout is fully rendered.
 * 4. Synchronizes canvas and container sizes.
 * 5. Correctly positions game option buttons within the canvas area.
 * 6. Initializes and starts the game.
 */
function handlePlayButtonClick() {
  hideElement('start-screen');
  showElement('canvas-wrapper');
  init();
  checkOrientationAndShowWarning();
  enableOrientationMonitoring();

  requestAnimationFrame(() => {
    setTimeout(() => {
      adjustCanvasLayout();
    }, 100);
  });
}

/**
 * Dynamically adjusts the canvas height to maintain a 3:2 aspect ratio 
 * based on its current rendered width.
 *
 * This ensures consistent layout across different device sizes 
 * and orientations. Should be called after the canvas becomes visible.
 */
function resizeCanvasHeight() {
  const canvas = document.getElementById('canvas');
  if (!canvas) return;

  const height = getCanvasHeight();
  canvas.style.height = `${height}px`;
}

/**
 * Calculates the optimal height for the game canvas based on its width and the viewport height.
 *
 * This function retrieves the canvas element by its ID and calculates its height
 * using a 2:3 aspect ratio (height = width * 2 / 3). If the calculated height exceeds
 * the available viewport height, it returns the maximum allowed height instead.
 *
 * @returns {number} The calculated canvas height in pixels, or 0 if the canvas is not found.
 */
function getCanvasHeight() {
  const canvas = document.getElementById('canvas');
  if (!canvas) return 0;

  const width = canvas.clientWidth;
  const maxHeight = window.innerHeight;
  let height = width * 2 / 3;

  return height > maxHeight ? maxHeight : height;
}

/**
 * Opens the instructions dialog by updating visibility classes.
 * 
 * @param {HTMLElement} dialog - The instructions dialog element.
 */
function handleInstructionsButtonClick(dialog) {
  dialog.classList.remove('hide');
  dialog.classList.add('show');
}

/**
 * Closes the instructions dialog.
 */
function handleCloseInstructionsClick() {
  const { instructionsDialog } = getUiElements();
  closeInstructionsDialog(instructionsDialog);
}

/**
 * Closes instructions dialog if the user clicks outside the content area.
 * 
 * @param {MouseEvent} event - The click event on the dialog.
 * @param {HTMLElement} dialog - The instructions dialog element.
 */
function handleDialogClickOutside(event, dialog) {
  if (event.target === dialog) {
    closeInstructionsDialog(dialog);
  }
}

/**
 * Handles the try again button click by restarting the game.
 * 
 * @param {MouseEvent} event - The click event.
 */
function handleTryAgainClick(event) {
  event.preventDefault();
  gameRestart();
}

/**
 * Handles the back-to-start button click by resetting the game.
 * 
 * @param {MouseEvent} event - The click event.
 */
function handleBackToStartClick(event) {
  event.preventDefault();
  gameReset();
}

/**
 * Toggles the mute state and removes focus from the button.
 */
function handleMuteButtonClick(muteBtn) {
  toggleMute();
  muteBtn.blur();
}

/**
 * Closes the instructions dialog when Escape key is pressed.
 * 
 * @param {KeyboardEvent} event - The keydown event.
 * @param {HTMLElement} dialog - The instructions dialog element.
 */
function handleEscapeKeyPress(event, dialog) {
  if (event.key === 'Escape' && !dialog.classList.contains('hide')) {
    closeInstructionsDialog(dialog);
  }
}

/**
 * Closes the instructions dialog by removing the 'show' class immediately 
 * and adding the 'hide' class after a short delay for exit animations.
 * 
 * @param {HTMLElement} dialog - The instructions dialog element to close.
 */
function closeInstructionsDialog(dialog) {
  dialog.classList.remove('show');
  setTimeout(() => dialog.classList.add('hide'), 300);
}

/**
 * Toggles the mute state of the game.
 * Reads the current mute setting from localStorage, inverts it,
 * stores the new state, updates the sound system accordingly,
 * and refreshes the mute icon to reflect the change.
 */
function toggleMute() {
  const currentMuted = localStorage.getItem('sharkie-muted') === 'true';
  const newMuteState = !currentMuted;

  localStorage.setItem('sharkie-muted', newMuteState);
  soundManager.setMute(newMuteState);
  updateMuteIcon();
}

/**
 * Updates the mute icon element based on the current mute state.
 * Retrieves the 'sharkie-muted' flag from localStorage and sets the
 * icon source and alternative text accordingly. Does nothing if the 
 * icon element is not found in the DOM.
 */
function updateMuteIcon() {
  const icon = document.getElementById('mute-icon');
  if (!icon) return;

  const isMuted = localStorage.getItem('sharkie-muted') === 'true';
  icon.src = isMuted ? 'img/icons/sound-off.png' : 'img/icons/sound-on.png';
  icon.alt = isMuted ? 'Sound off' : 'Sound on';
}