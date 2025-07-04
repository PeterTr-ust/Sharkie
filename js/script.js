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
 * Executes UI setup logic once the HTML document has been fully loaded and parsed.
 * This includes binding event listeners to UI elements and updating the mute icon
 * to reflect the current sound state from localStorage.
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
 * Handles the play button click by hiding the start screen,
 * showing the canvas, and starting the game.
 */
function handlePlayButtonClick() {
  hideElement('start-screen');
  showElement('canvas-wrapper');
  init();
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

/**
 * Toggles fullscreen mode for the game canvas.
 */
function toggleFullscreen() {
  const wrapper = document.getElementById('canvas-wrapper');
  if (!wrapper || !canvas) return;

  document.fullscreenElement
    ? exitFullscreen(wrapper, canvas)
    : enterFullscreen(wrapper, canvas);
}

/**
 * Enters fullscreen mode for a given wrapper and resizes the canvas.
 * 
 * @param {HTMLElement} wrapper - The canvas wrapper element.
 * @param {HTMLCanvasElement} canvas - The game canvas element.
 */
function enterFullscreen(wrapper, canvas) {
  wrapper.requestFullscreen?.();

  document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement === wrapper) {
      wrapper.classList.add('fullscreen-active');
      resizeCanvasToFullscreen(canvas);
    }
  }, { once: true });
}

/**
 * Exits fullscreen mode and restores canvas dimensions.
 * 
 * @param {HTMLElement} wrapper - The canvas wrapper element.
 * @param {HTMLCanvasElement} canvas - The game canvas element.
 */
function exitFullscreen(wrapper, canvas) {
  document.exitFullscreen?.();

  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
      wrapper.classList.remove('fullscreen-active');
      canvas.style.width = '720px';
      canvas.style.height = '480px';
    }
  }, { once: true });
}

/**
 * Resizes the canvas element to maintain the desired aspect ratio
 * when entering fullscreen mode.
 * 
 * @param {HTMLCanvasElement} canvas - The canvas element to resize.
 * @param {number} desiredAspect - Aspect ratio (width / height). Default: 1.5.
 */
function resizeCanvasToFullscreen(canvas, desiredAspect = 720 / 480) {
  const container = getFullscreenContainer();
  const { width: screenW, height: screenH } = getScreenDimensions(container);
  const canvasSize = calculateCanvasSize(screenW, screenH, desiredAspect);
  applyCanvasSize(canvas, canvasSize);
}

/**
 * Determines the fullscreen container element.
 * 
 * @returns {Element} The fullscreen element or the document element.
 */
function getFullscreenContainer() {
  return document.fullscreenElement || document.webkitFullscreenElement || document.documentElement;
}

/**
 * Calculates the current screen width, height and aspect ratio.
 * 
 * @param {Element} container - The fullscreen container element.
 * @returns {{ width: number, height: number, aspect: number }}
 */
function getScreenDimensions(container) {
  const width = container.clientWidth;
  const height = container.clientHeight;
  const aspect = width / height;
  return { width, height, aspect };
}

/**
 * Calculates the optimal canvas size for fullscreen based on aspect ratio.
 * 
 * @param {number} screenW - Screen width.
 * @param {number} screenH - Screen height.
 * @param {number} desiredAspect - Target aspect ratio.
 * @returns {{ width: number, height: number }}
 */
function calculateCanvasSize(screenW, screenH, desiredAspect) {
  const screenAspect = screenW / screenH;

  return screenAspect > desiredAspect
    ? { width: screenH * desiredAspect, height: screenH }
    : { width: screenW, height: screenW / desiredAspect };
}

/**
 * Applies the calculated size to the canvas element.
 * 
 * @param {HTMLCanvasElement} canvas 
 * @param {{ width: number, height: number }} size 
 */
function applyCanvasSize(canvas, size) {
  canvas.style.width = `${size.width}px`;
  canvas.style.height = `${size.height}px`;
}