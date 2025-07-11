import {
  flipImage,
  flipImageBack,
  drawCollectableCounter
} from './uiUtils.js';

/**
    * Clears the canvas, draws the world (background, enemies, player, etc.) 
    * with the current camera offset, then draws the UI (status bars).
    * This method schedules itself on the next animation frame.
    *
    * @returns {void}
    */
export function draw(world) {
    const { ctx, canvas, cameraX, level, throwableObjects, character, lifeBar, coinBar, poisonBar } = world;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(cameraX, 0);

    addObjectsToMap(world, level.backgroundObjects);
    addObjectsToMap(world, level.lights);
    level.enemies = level.enemies.filter(e => !e.markedForRemoval);
    addObjectsToMap(world, level.enemies);
    addObjectsToMap(world, throwableObjects);
    addObjectsToMap(world, level.coins);
    addObjectsToMap(world, level.poisonBottles);
    addToMap(world, character);

    ctx.restore();
    addToMap(world, lifeBar);
    addToMap(world, coinBar);
    drawCollectableCounter(ctx, coinBar, 310, 42);
    addToMap(world, poisonBar);
    drawCollectableCounter(ctx, poisonBar, 515, 42);

    return requestAnimationFrame(() => draw(world));
}

/**
 * Adds multiple drawable objects to the canvas.
 * @param {DrawableObject[]} objects - The objects to draw.
 */
function addObjectsToMap(world, objects) {
    objects.forEach(object => {
        addToMap(world, object);
    });
}

/**
* Adds a single object to the canvas, respecting orientation.
* @param {DrawableObject} objectToAdd - Object to render.
*/
function addToMap(world, objectToAdd) {
    const { ctx } = world;

    if (objectToAdd.otherDirection) {
        flipImage(ctx, objectToAdd);
    }

    objectToAdd.draw(ctx);
    objectToAdd.drawFrame(ctx);

    if (objectToAdd.otherDirection) {
        flipImageBack(ctx, objectToAdd);
    }
}