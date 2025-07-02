function createLevel1() {
    return new Level(
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
            new Coin(400, 200),
            new Coin(450, 180),
            new Coin(500, 200),
            new Coin(700, 300),
            new Coin(900, 180),
            new Coin(1000, 180),
            new Coin(1330, 100),
            new Coin(1330, 200),
            new Coin(1330, 300),
            new Coin(1550, 350),
        ],
        [
            new Poison(445, 210),
            new Poison(695, 100),
            new Poison(945, 160),
            new Poison(1325, 130),
            new Poison(1325, 230),
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
    )
}