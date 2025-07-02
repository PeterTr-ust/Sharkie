window.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-button');
    const playBtn = document.getElementById('play-button');
    const nextBtn = document.getElementById('next-button');
    const controls = document.getElementById('controls-info');
    const explanation = document.getElementById('explanation-info');
    const logo = document.getElementById('logo');
    const muteBtn = document.getElementById('mute-button');
    const muteIcon = document.getElementById('mute-icon');
    const savedMuted = localStorage.getItem('sharkie-muted') === 'true';

    // Intro Navigation
    startBtn?.addEventListener('click', () => {
        startBtn.classList.add('d-none');
        controls.classList.remove('d-none');
        nextBtn.classList.remove('d-none');
        logo.classList.add('d-none');
        nextBtn.focus();
    });

    nextBtn?.addEventListener('click', () => {
        controls.classList.add('d-none');
        nextBtn.classList.add('d-none');
        explanation.classList.remove('d-none');
        playBtn.classList.remove('d-none');
        playBtn.focus();
    });

    // Mute-Button
    muteBtn?.addEventListener('click', () => {
        if (typeof soundManager !== 'undefined') {
            soundManager.toggleMute();

            for (const key in soundManager.sounds) {
                soundManager.sounds[key].muted = soundManager.muted;
            }

            localStorage.setItem('sharkie-muted', soundManager.muted);
            updateMuteIcon();
            muteBtn.blur();
        }
    });

    function updateMuteIcon() {
        if (typeof soundManager === 'undefined') return;

        if (soundManager.muted) {
            muteIcon.src = 'img/icons/sound-off.png';
            muteIcon.alt = 'Sound aus';
        } else {
            muteIcon.src = 'img/icons/sound-on.png';
            muteIcon.alt = 'Sound an';
        }
    }

    // Warten, bis soundManager verfügbar ist
    const waitForSoundManager = setInterval(() => {
        if (typeof soundManager !== 'undefined' && soundManager.sounds) {
            soundManager.muted = savedMuted;

            for (const key in soundManager.sounds) {
                soundManager.sounds[key].muted = savedMuted;
            }

            updateMuteIcon();
            clearInterval(waitForSoundManager);
        }
    }, 100);
});


// =====================
// Vollbild-Funktionalität
// =====================

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