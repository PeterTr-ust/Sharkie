/**
 * Displays the game end screen with a message based on the outcome.
 *
 * Updates the title and message elements to reflect a win or loss,
 * and makes the end screen visible by removing the 'd-none' class.
 *
 * @param {string} type - The outcome of the game; either `'win'` or `'lose'`.
 * @returns {void}
 */
export function showGameEndScreen(type) {
    const screen = document.getElementById('game-end-screen');
    const title = document.getElementById('end-title');
    const message = document.getElementById('end-message');

    if (type === 'win') {
        title.textContent = 'Victory!';
        message.textContent = 'You defeated the endboss – Sharkie is the hero!';
    } else {
        title.textContent = 'Game Over';
        message.textContent = 'Sharkie was defeated… Try again!';
    }

    screen.classList.remove('d-none');
}

/**
 * Renders a collectable counter text (e.g., "3 / 10") onto the canvas.
 * The counter displays current collected items versus total available.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context used for drawing.
 * @param {{ collected: number, max: number }} bar - An object containing current and max collectable counts.
 * @param {number} x - The horizontal (x) position on the canvas.
 * @param {number} y - The vertical (y) position on the canvas.
 */
export function drawCollectableCounter(ctx, bar, x, y) {
    const text = `${bar.collected} / ${bar.max}`;

    ctx.font = '18px Luckiest Guy';
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
}

/**
* Displays a temporary power-up notification on the screen.
*
* - Reveals the notification element by removing the 'd-none' class.
* - Automatically hides it again after 3 seconds.
* - Does nothing if the notification element is not found in the DOM.
*
* @returns {void}
*/
export function showPowerUpNotification() {
    const notification = document.getElementById('powerup-notification');
    if (!notification) return;

    notification.classList.remove('d-none');

    setTimeout(() => {
        notification.classList.add('d-none');
    }, 3000);
}

/**
* Flips an object's image horizontally on the canvas.
* This is typically used to mirror sprites when changing direction.
*
* @param {CanvasRenderingContext2D} ctx - The canvas rendering context to apply transformations to.
* @param {DrawableObject} objectToAdd - The drawable game object whose image will be flipped.
*/
export function flipImage(ctx, objectToAdd) {
    ctx.save();
    ctx.translate(objectToAdd.width, 0);
    ctx.scale(-1, 1);
    objectToAdd.positionX = objectToAdd.positionX * -1;
}

/**
 * Restores the canvas orientation after horizontal flip.
 * Must be called immediately after drawing the flipped object.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context to restore.
 * @param {DrawableObject} objectToAdd - The same object that was previously flipped.
 */
export function flipImageBack(ctx, objectToAdd) {
    objectToAdd.positionX = objectToAdd.positionX * -1;
    ctx.restore();
}