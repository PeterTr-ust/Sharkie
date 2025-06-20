class SoundManager {
    constructor() {
        this.sounds = {
            swim: new Audio('audio/swim.mp3'),
            collectedCoin: new Audio('audio/collect-coin.mp3'),
        };

        for (const key in this.sounds) {
            this.sounds[key].volume = 0.3;
            this.sounds[key].preload = 'auto';
        }

        this.cooldowns = {
            swim: 0,
            jump: 500,
            hurt: 500
        };

        this.lastPlayed = {};
    }

    play(name) {
        const sound = this.sounds[name];
        if (!sound) return;

        const now = Date.now();
        const lastTime = this.lastPlayed[name] || 0;
        const cooldown = this.cooldowns[name] || 0;

        if (now - lastTime >= cooldown) {
            sound.currentTime = 0;
            sound.play();
            this.lastPlayed[name] = now;
        }
    }
}
