/**
* Creates a new bubble object at the character's position.
*
* @param {number} offsetX - Horizontal offset from the character.
* @param {number} offsetY - Vertical offset from the character.
* @returns {ThrowableObject} The newly created bubble object.
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