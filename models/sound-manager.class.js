class SoundManager {
    constructor() {
        this.sounds = {
            ambient: new Audio('audio/underwater-ambient-sound.mp3'),
            swim: new Audio('audio/swim.mp3'),
            collectedCoin: new Audio('audio/collect-coin.mp3'),
            collectedPoison: new Audio('audio/collect-poison.mp3'),
            snoring: new Audio('audio/snoring.mp3'),
            finSlap: new Audio('audio/hit.mp3'),
            bubbleAttack: new Audio('audio/bubble.mp3'),
            allPoisenCollected: new Audio('audio/all-poisen-collected.mp3'),
            bubbleHit: new Audio('audio/bubble-hit.mp3'),
            endbossBite: new Audio('audio/endboss-bite.mp3'),
        };

        // Initialisiere mit dem localStorage-Wert
        this.muted = localStorage.getItem('sharkie-muted') === 'true';

        Object.values(this.sounds).forEach(s => {
            s.volume = 0.3;
            s.preload = 'auto';
            s.loop = false;
            s.isPlaying = false;
            s.muted = this.muted;
        });

        this.cooldowns = {
            swim: 0,
            hurt: 500
        };

        this.lastPlayed = {};
    }

    /**
     * Setzt den globalen Mute-Zustand und wendet ihn auf alle Sounds an.
     */
    setMute(muted) {
        this.muted = muted;
        
        // Synchronisation mit localStorage
        localStorage.setItem('sharkie-muted', muted);

        Object.values(this.sounds).forEach(s => {
            s.muted = muted;
            // Bei Mute alle Sounds stoppen
            if (muted) {
                s.pause();
                s.currentTime = 0;
                s.isPlaying = false;
            }
        });
    }

    /**
     * Wechselt zwischen stumm/an.
     */
    toggleMute() {
        this.setMute(!this.muted);
    }

    /**
     * Pausiert und stoppt alle Sounds, setzt Loops zurück.
     */
    muteAll() {
        this.setMute(true);
        Object.values(this.sounds).forEach(s => {
            s.pause();
            s.currentTime = 0;
            s.isPlaying = false;
            s.loop = false;
        });
    }

    /**
     * Stoppt und rewound alle Sounds vollständig.
     */
    stopAllSounds() {
        Object.keys(this.sounds).forEach(name => this.stop(name));
    }

    play(name) {
        const s = this.sounds[name];
        if (!s || this.muted) return;
        const now = Date.now();
        if ((now - (this.lastPlayed[name] || 0)) >= (this.cooldowns[name] || 0)) {
            s.currentTime = 0;
            s.play();
            this.lastPlayed[name] = now;
        }
    }

    playLoop(name) {
        const s = this.sounds[name];
        if (!s || this.muted) return;
        if (!s.isPlaying) {
            s.loop = true;
            s.currentTime = 0;
            s.play();
            s.isPlaying = true;
        }
    }

    stop(name) {
        const s = this.sounds[name];
        if (!s) return;
        s.pause();
        s.currentTime = 0;
        s.isPlaying = false;
        s.loop = false;
    }
}