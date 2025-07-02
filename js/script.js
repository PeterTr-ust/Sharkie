// script.js

// Clone the original start-screen DOM for full reset
let startTemplate = null;

// Load saved mute state
const savedMuted = localStorage.getItem('sharkie-muted') === 'true';

window.addEventListener('DOMContentLoaded', () => {
    // 1) Clone start-screen for later restores
    const startScreen = document.getElementById('start-screen');
    startTemplate = startScreen.cloneNode(true);

    // 2) Bind all UI listeners
    bindUIListeners();

    // 3) Once SoundManager exists, apply saved mute setting
    const waitSM = setInterval(() => {
        if (typeof soundManager !== 'undefined' && soundManager.sounds) {
            soundManager.muted = savedMuted;
            Object.values(soundManager.sounds).forEach(s => s.muted = savedMuted);
            updateMuteIcon();
            clearInterval(waitSM);
        }
    }, 50);
});

/**
 * Attach UI event listeners: play, instructions, try again, back to start, mute, esc.
 */
function bindUIListeners() {
    const startScreen = document.getElementById('start-screen');
    const canvasWrapper = document.getElementById('canvas-wrapper');
    const instructionsDialog = document.getElementById('instructions-dialog');
    const playBtn = document.getElementById('play-button');
    const instructionsBtn = document.getElementById('instructions-button');
    const closeInstrBtn = document.getElementById('close-instructions');
    const tryAgainBtn = document.getElementById('try-again-button');
    const backToStartBtn = document.getElementById('back-to-start-button');
    const muteBtn = document.getElementById('mute-button');

    // PLAY: hide menu, show game, start
    playBtn?.addEventListener('click', () => {
        startScreen.style.display = 'none';
        canvasWrapper.style.display = 'block';
        init();
    });

    // INSTRUCTIONS dialog
    instructionsBtn?.addEventListener('click', () => {
        instructionsDialog.classList.remove('hide');
        instructionsDialog.classList.add('show');
    });
    closeInstrBtn?.addEventListener('click', closeInstructionsDialog);
    instructionsDialog?.addEventListener('click', e => {
        if (e.target === instructionsDialog) closeInstructionsDialog();
    });

    // TRY AGAIN: reset + immediate restart
    tryAgainBtn?.addEventListener('click', e => {
        e.preventDefault();
        gameRestart();
    });

    // BACK TO START: reset + restore original start screen
    backToStartBtn?.addEventListener('click', e => {
        e.preventDefault();
        gameReset();
        restoreStartScreen();
    });

    // MUTE toggle: use global soundManager var
    muteBtn?.addEventListener('click', () => {
        if (typeof soundManager === 'undefined' || !soundManager) return;
        soundManager.toggleMute();
        Object.values(soundManager.sounds).forEach(s => s.muted = soundManager.muted);
        localStorage.setItem('sharkie-muted', soundManager.muted);
        updateMuteIcon();
        muteBtn.blur();
    });

    // ESC closes instructions
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && !instructionsDialog.classList.contains('hide')) {
            closeInstructionsDialog();
        }
    });
}

/**
 * Replace #start-screen with its original clone and rebind listeners.
 */
function restoreStartScreen() {
    const old = document.getElementById('start-screen');
    const clone = startTemplate.cloneNode(true);
    old.replaceWith(clone);
    bindUIListeners();
}

/** Fade-out the instructions dialog. */
function closeInstructionsDialog() {
    const dlg = document.getElementById('instructions-dialog');
    dlg.classList.remove('show');
    setTimeout(() => dlg.classList.add('hide'), 300);
}

/** Update the mute-button icon based on current mute state. */
function updateMuteIcon() {
    const icon = document.getElementById('mute-icon');
    if (!icon || typeof soundManager === 'undefined' || !soundManager) return;
    icon.src = soundManager.muted ? 'img/icons/sound-off.png' : 'img/icons/sound-on.png';
    icon.alt = soundManager.muted ? 'Sound off' : 'Sound on';
}

function toggleFullscreen() {
    const wrapper = document.getElementById('canvas-wrapper');
    if (!document.fullscreenElement) {
        wrapper.requestFullscreen?.();
        document.addEventListener('fullscreenchange', () => {
            if (document.fullscreenElement === wrapper) {
                wrapper.classList.add('fullscreen-active');
                resizeCanvasToFullscreen(canvas);
            }
        }, { once: true });
    } else {
        document.exitFullscreen?.();
        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement) {
                wrapper.classList.remove('fullscreen-active');
                canvas.style.width = '720px';
                canvas.style.height = '480px';
            }
        }, { once: true });
    }
}

function resizeCanvasToFullscreen(canvas, desiredAspect = 720 / 480) {
    const fullscreenEl = document.fullscreenElement || document.webkitFullscreenElement;
    const screenW = fullscreenEl ? fullscreenEl.clientWidth : window.innerWidth;
    const screenH = fullscreenEl ? fullscreenEl.clientHeight : window.innerHeight;
    const screenAspect = screenW / screenH;

    let newWidth, newHeight;
    if (screenAspect > desiredAspect) {
        newHeight = screenH;
        newWidth = newHeight * desiredAspect;
    } else {
        newWidth = screenW;
        newHeight = newWidth / desiredAspect;
    }

    canvas.style.width = `${newWidth}px`;
    canvas.style.height = `${newHeight}px`;
}

function resetCanvasSize(canvas) {
    canvas.width = 720;
    canvas.height = 480;
}