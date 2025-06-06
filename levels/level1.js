const level1 = new Level(
    [
        new PufferFish(),
        new PufferFish(),
        new PufferFish(),
        new Endboss(),
    ],
    [
        new Light()
    ],
    [
        new BackgroundObject('img/3. Background/Legacy/Layers/5. Water/D1.png', 0),
        new BackgroundObject('img/3. Background/Layers/3.Fondo 1/D1.png', 0),
        new BackgroundObject('img/3. Background/Layers/4.Fondo 2/L1.png', 0),
        new BackgroundObject('img/3. Background/Legacy/Layers/2. Floor/D1.png', 0),

        new BackgroundObject('img/3. Background/Legacy/Layers/5. Water/D2.png', 720),
        new BackgroundObject('img/3. Background/Layers/3.Fondo 1/D2.png', 720),
        new BackgroundObject('img/3. Background/Layers/4.Fondo 2/L2.png', 720),
        new BackgroundObject('img/3. Background/Legacy/Layers/2. Floor/D2.png', 720),

        new BackgroundObject('img/3. Background/Legacy/Layers/5. Water/D3.png', 720 * 2),
        new BackgroundObject('img/3. Background/Layers/3.Fondo 1/D1.png', 720 * 2),
        new BackgroundObject('img/3. Background/Layers/4.Fondo 2/L1.png', 720 * 2),
        new BackgroundObject('img/3. Background/Legacy/Layers/2. Floor/D1.png', 720 * 2),
    ]
);