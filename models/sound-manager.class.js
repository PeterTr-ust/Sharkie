/**
 * Manages all sound playback and mute states for the game.
 * Provides utilities for playing, stopping, and looping sound effects.
 */
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
            hurt: new Audio('audio/hurt.mp3'),
        };

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
    * Sets the global mute state and applies it to all sounds.
    * Also persists the state in localStorage.
    * If unmuted, automatically restarts ambient background sound.
    * 
    * @param {boolean} muted - Whether sounds should be muted.
    */
    setMute(muted) {
        this.muted = muted;
        localStorage.setItem('sharkie-muted', muted);

        Object.values(this.sounds).forEach(s => {
            s.muted = muted;

            if (muted) {
                s.pause();
                s.currentTime = 0;
                s.isPlaying = false;
            }

            if (!muted) {
                this.playLoop('ambient');
            }
        });
    }

    /**
     * Toggles the mute state between muted and unmuted.
     */
    toggleMute() {
        this.setMute(!this.muted);
    }

    /**
    * Mutes all sounds and resets their playback and loop states.
    * Forces mute without toggling.
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
     * Stops and rewinds all sounds completely.
     */
    stopAllSounds() {
        Object.keys(this.sounds).forEach(name => this.stop(name));
    }

    /**
     * Plays the specified sound if not muted and not on cooldown.
     * 
     * @param {string} name - The key of the sound to be played.
     */
    play(name) {
        const s = this.sounds[name];
        if (!s || this.muted) return;

        const now = Date.now();
        if ((now - (this.lastPlayed[name] || 0)) < (this.cooldowns[name] || 0)) {
            return;
        }

        s.currentTime = 0;
        const playPromise = s.play();
        this.handlePlayPromise(playPromise, name);

        this.lastPlayed[name] = now;
    }

    /**
     * Starts looping playback of the specified sound if not muted.
     * Prevents re-triggering if already playing.
     * 
     * @param {string} name - The key of the sound to be looped.
     */
    playLoop(name) {
        const s = this.sounds[name];
        if (!s || this.muted || s.isPlaying) return;

        s.loop = true;
        s.currentTime = 0;
        const playPromise = s.play();
        this.handlePlayPromise(playPromise, name);

        s.isPlaying = true;
    }

    /**
     * Handles errors during sound playback to prevent unhandled promise rejections.
     * Logs any playback error except 'AbortError'.
     * 
     * @param {Promise} playPromise - Promise returned by Audio.play().
     * @param {string} name - The key of the sound being played.
     */
    handlePlayPromise(playPromise, name) {
        if (playPromise instanceof Promise) {
            playPromise.catch(err => {
                if (err.name !== 'AbortError') {
                    console.error(`Sound "${name}" playback error:`, err);
                }
            });
        }
    }

    /**
     * Stops playback of the specified sound and resets its loop and position.
     * 
     * @param {string} name - The key of the sound to be stopped.
     */
    stop(name) {
        const s = this.sounds[name];
        if (!s) return;
        s.pause();
        s.currentTime = 0;
        s.isPlaying = false;
        s.loop = false;
    }
}