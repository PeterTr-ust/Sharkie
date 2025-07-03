// script.js

let startTemplate = null;

window.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    startTemplate = startScreen.cloneNode(true);

    bindUIListeners();
    updateMuteIcon();
});

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

    playBtn?.addEventListener('click', () => {
        startScreen.style.display = 'none';
        canvasWrapper.style.display = 'block';
        init();
    });

    instructionsBtn?.addEventListener('click', () => {
        instructionsDialog.classList.remove('hide');
        instructionsDialog.classList.add('show');
    });

    closeInstrBtn?.addEventListener('click', closeInstructionsDialog);
    instructionsDialog?.addEventListener('click', e => {
        if (e.target === instructionsDialog) closeInstructionsDialog();
    });

    tryAgainBtn?.addEventListener('click', e => {
        e.preventDefault();
        gameRestart();
    });

    backToStartBtn?.addEventListener('click', e => {
        e.preventDefault();
        gameReset();
        restoreStartScreen();
    });

    muteBtn?.addEventListener('click', () => {
        toggleMute();
        muteBtn.blur();
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && !instructionsDialog.classList.contains('hide')) {
            closeInstructionsDialog();
        }
    });
}

function restoreStartScreen() {
    const old = document.getElementById('start-screen');
    const clone = startTemplate.cloneNode(true);
    old.replaceWith(clone);
    bindUIListeners();
    updateMuteIcon();
}

function closeInstructionsDialog() {
    const dlg = document.getElementById('instructions-dialog');
    dlg.classList.remove('show');
    setTimeout(() => dlg.classList.add('hide'), 300);
}

/**
 * Zentrale Funktion für das Mute-Toggle
 */
function toggleMute() {
    const currentMuted = localStorage.getItem('sharkie-muted') === 'true';
    const newMuteState = !currentMuted;
    
    // Status in localStorage speichern
    localStorage.setItem('sharkie-muted', newMuteState);
    
    // SoundManager aktualisieren, falls vorhanden
    if (typeof soundManager !== 'undefined' && soundManager) {
        soundManager.setMute(newMuteState);
    }
    
    // Icon aktualisieren
    updateMuteIcon();
}

/**
 * Aktualisiert das Mute-Icon basierend auf dem localStorage-Status
 */
function updateMuteIcon() {
    const icon = document.getElementById('mute-icon');
    if (!icon) return;
    
    const isMuted = localStorage.getItem('sharkie-muted') === 'true';
    icon.src = isMuted ? 'img/icons/sound-off.png' : 'img/icons/sound-on.png';
    icon.alt = isMuted ? 'Sound off' : 'Sound on';
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