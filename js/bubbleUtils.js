/**
 * Creates a new throwable bubble at the character's current position.
 * The bubble inherits direction and poison status from the character.
 *
 * @param {Character} character - The character object creating the bubble.
 * @param {number} offsetX - Horizontal offset relative to the character's X position.
 * @param {number} offsetY - Vertical offset relative to the character's Y position.
 * @returns {ThrowableObject} A new instance of a throwable bubble object.
 */
export function createBubble(character, offsetX, offsetY) {
    const hasAllPoison = character.hasAllPoisonBottles();
    return new ThrowableObject(
        character.positionX + offsetX,
        character.positionY + offsetY,
        character.otherDirection !== true,
        hasAllPoison
    );
}

/**
* Calculates the horizontal offset for the bubble based on direction.
*
* @param {boolean} directionRight - Whether the character is facing right.
* @returns {number} The X offset for bubble spawn position.
*/
export function getBubbleOffsetX(directionRight) {
    return directionRight ? 120 : -10;
}