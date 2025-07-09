/**
 * Initializes resize handling logic after the HTML document has fully loaded.
 * 
 * Attaches event listeners to handle window resizing and orientation changes,
 * ensuring that canvas and related layout elements remain responsive
 * across different device sizes and orientations.
 */
window.addEventListener('DOMContentLoaded', () => {
    setupResizeHandling();
});

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

/**
 * Sets up a listener that synchronizes canvas and button layout
 * whenever the window is resized (including orientation changes).
 */
function setupResizeHandling() {
    window.addEventListener('resize', () => {
        adjustCanvasLayout();
    });
}

/**
 * Positions the game options element at the bottom-right corner
 * within the canvas-area container. Clears conflicting top/left styles.
 */
function positionGameOptions() {
    const canvasArea = document.getElementById('canvas-area');
    const options = document.querySelector('.game-options');

    if (!canvasArea || !options) return;

    options.style.position = 'absolute';
    options.style.bottom = '8px';
    options.style.right = '8px';
    options.style.top = '';
    options.style.left = '';
}

/**
 * Synchronizes the height of the canvas and its parent containers (`canvas-wrapper` and `canvas-area`)
 * based on the current canvas width to maintain a 3:2 aspect ratio.
 * Ensures proper layout across orientations and responsive changes.
 */
function syncCanvasContainerSize() {
    const height = getCanvasHeight();
    const wrapper = document.getElementById('canvas-wrapper');
    const area = document.getElementById('canvas-area');

    if (!wrapper || !area) return;

    wrapper.style.height = `${height}px`;
    area.style.height = `${height}px`;
}

/**
 * Adjusts the canvas and related layout elements to maintain visual consistency.
 * 
 * This includes:
 * - Resizing the canvas to preserve a 3:2 aspect ratio based on current width.
 * - Synchronizing the height of canvas wrapper and canvas area containers.
 * - Repositioning game option buttons relative to the updated canvas layout.
 * 
 * Should be triggered on page load, orientation change, or window resize events.
 */
function adjustCanvasLayout() {
    resizeCanvasHeight();
    syncCanvasContainerSize();
    positionGameOptions();
}