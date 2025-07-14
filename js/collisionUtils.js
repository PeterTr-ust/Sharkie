import { createBubble, getBubbleOffsetX } from './bubbleUtils.js';

/** * Checks for collisions between the character and enemies. 
 * 
 * Applies damage only if the character is not currently attacking
 * and the enemy is not already flying away. 
 */
export function checkEnemyCollisions(world) {
    world.level.enemies.forEach((enemy) => {
        const isColliding = world.character.isColliding(enemy);
        const characterNotAttacking = !world.character.isAttacking;
        const enemyNotFlyingAway = !enemy.isFlyingAway;

        if (isColliding && characterNotAttacking && enemyNotFlyingAway) {
            world.character.hit(enemy.damage, enemy);
            world.lifeBar.setPercentage(world.character.energy);
        }
    });
}

/**
 * Checks collisions between bubbles and jellyfish enemies.
 */
export function checkBubbleEnemyCollision(world) {
    world.throwableObjects.forEach(bubble => {
        world.level.enemies.forEach(enemy => {
            if (
                (enemy instanceof JellyFish || enemy instanceof DangerousJellyFish) &&
                !enemy.isFlyingAway &&
                bubble.isColliding(enemy)
            ) {
                enemy.dead();
                bubble.markForRemoval = true;
            }
        });
    });
}

/**
 * Checks collisions between poisoned bubbles and the endboss.
 */
export function checkBubbleEndbossCollision(world) {
    const endboss = world.level.enemies.find(e => e instanceof Endboss);
    if (!endboss || endboss.isDead()) return;

    world.throwableObjects.forEach(bubble => {
        if (bubble.isPoisoned && bubble.isColliding(endboss)) {
            endboss.hit(20);
            bubble.markForRemoval = true;
            world.soundManager.play?.('bubbleHit');
        }
    });
}

/**
 * Handles collection of coins and poison bottles.
 */
export function checkCollectablesCollisions(world, handlePoisonCollection) {
    checkCollection(
        world,
        world.level.coins,
        'collectedCoin',
        world.coinBar.addCoin.bind(world.coinBar)
    );

    checkCollection(
        world,
        world.level.poisonBottles,
        'collectedPoison',
        handlePoisonCollection
    );
}

/**
 * Generic method for collectable pickup collision.
 */
export function checkCollection(world, objects, soundKey, onCollect) {
    for (let i = objects.length - 1; i >= 0; i--) {
        const obj = objects[i];
        if (!obj.isBeingCollected && world.character.isColliding(obj)) {
            world.soundManager.play(soundKey);
            onCollect();
            obj.collectAnimation().then(() => {
                objects.splice(i, 1);
            });
        }
    }
}

/**
 * Removes throwable objects marked for deletion.
 */
export function removeMarkedThrowables(world) {
    world.throwableObjects = world.throwableObjects.filter(obj => !obj.markForRemoval);
}

/**
 * Handles bubble throw when 'D' key is pressed.
 */
export function checkThrowObjects(world) {
    if (world.keyboard.D && !world.character.isAttacking) {
        const directionRight = !world.character.otherDirection;
        const offsetX = getBubbleOffsetX(directionRight);
        const offsetY = 90;

        world.character.bubbleAttack(() => {
            const bubble = createBubble(world.character, offsetX, offsetY);
            world.throwableObjects.push(bubble);
        });
    }
}

/**
 * Handles melee attack when SPACE is pressed.
 */
export function checkAttack(world) {
    if (world.keyboard.SPACE && !world.spaceKeyPressed && !world.character.isAttacking) {
        world.spaceKeyPressed = true;
        world.character.finAttack();
    }

    if (!world.keyboard.SPACE) {
        world.spaceKeyPressed = false;
    }
}