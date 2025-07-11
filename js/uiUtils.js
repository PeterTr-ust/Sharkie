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
    * Renders a collectable counter (e.g., "3 / 10") on the canvas at a specified position.
    * Displays the current collected count out of the total available.
    *
    * @param {Object} bar - The bar object containing the collectable status.
    * @param {number} bar.collected - The current number of collected items.
    * @param {number} bar.max - The total number of collectable items.
    * @param {number} x - The x-coordinate on the canvas where the text is drawn.
    * @param {number} y - The y-coordinate on the canvas where the text is drawn.
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
     * Flips an object's image horizontally.
     * @param {DrawableObject} objectToAdd - Object to flip.
     */
    export function flipImage(ctx, objectToAdd) {
        ctx.save();
        ctx.translate(objectToAdd.width, 0);
        ctx.scale(-1, 1);
        objectToAdd.positionX = objectToAdd.positionX * -1;
    }

    /**
     * Restores the object's original orientation.
     * @param {DrawableObject} objectToAdd - Object to unflip.
     */
    export function flipImageBack(ctx, objectToAdd) {
        objectToAdd.positionX = objectToAdd.positionX * -1;
        ctx.restore();
    }