class SoundManager {
    constructor() {
        this.sounds = {
            swim: new Audio('audio/swim.mp3'),
            collectedCoin: new Audio('audio/collect-coin.mp3'),
            collectedPoison: new Audio('audio/collect-poison.mp3'),
            snoring: new Audio('audio/snoring.mp3'),
            finSlap: new Audio('audio/hit.mp3'),
            bubbleAttack: new Audio('audio/bubble.mp3'),
            
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

    playLoop(name) {
        const sound = this.sounds[name];
        if (!sound) return;
        if (!sound.isPlaying) {
            sound.loop = true;
            sound.currentTime = 0;
            sound.play();
            sound.isPlaying = true;
        }
    }

    stop(name) {
        const sound = this.sounds[name];
        if (!sound) return;
        sound.pause();
        sound.currentTime = 0;
        sound.isPlaying = false;
    }

}
