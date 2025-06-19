const level1 = new Level(
    [
        new PufferFish(),
        new PufferFish(),
        new PufferFish(),
        new JellyFish(820, 400),
        new JellyFish(920, 400),
        new JellyFish(1020, 400),
        new DangerousJellyFish(1300, 400),
        new Endboss(),
    ],
    [
        new Light()
    ],
    [
        new BackgroundObject('img/game-background/game-background-1.png', 0),
        new BackgroundObject('img/game-background/game-background-element-1.png', 0),
        new BackgroundObject('img/game-background/game-background-element-2.png', 0),
        new BackgroundObject('img/game-background/game-background-element-3.png', 0),

        new BackgroundObject('img/game-background/game-background-2.png', 720),
        new BackgroundObject('img/game-background/game-background-element-4.png', 720),
        new BackgroundObject('img/game-background/game-background-element-5.png', 720),
        new BackgroundObject('img/game-background/game-background-element-6.png', 720),

        new BackgroundObject('img/game-background/game-background-3.png', 720 * 2),
        new BackgroundObject('img/game-background/game-background-element-1.png', 720 * 2),
        new BackgroundObject('img/game-background/game-background-element-2.png', 720 * 2),
        new BackgroundObject('img/game-background/game-background-element-3.png', 720 * 2),
    ]
);