window.addEventListener('DOMContentLoaded', () => {
    const playInitialBtn = document.getElementById('play-button');
    const instructionsBtn = document.getElementById('instructions-button');
    const startScreen = document.getElementById('start-screen');
    const canvasWrapper = document.getElementById('canvas-wrapper');
    const muteBtn = document.getElementById('mute-button');
    const muteIcon = document.getElementById('mute-icon');
    const savedMuted = localStorage.getItem('sharkie-muted') === 'true';
    const instructionsDialog = document.getElementById('instructions-dialog');
    const closeInstructionsBtn = document.getElementById('close-instructions');
    const tryAgainBtn = document.getElementById('try-again-button');

    // Play button functionality
    playInitialBtn?.addEventListener('click', () => {
        startScreen.style.display = 'none';
        canvasWrapper.style.display = 'block';
        init();
    });

    // Instructions dialog functionality
    instructionsBtn?.addEventListener('click', () => {
        instructionsDialog.classList.remove('hide');
        instructionsDialog.classList.add('show');
    });

    closeInstructionsBtn?.addEventListener('click', () => {
        closeInstructionsDialog();
    });

    instructionsDialog?.addEventListener('click', (event) => {
        if (event.target === instructionsDialog) {
            closeInstructionsDialog();
        }
    });

    // Try Again button functionality (improved)
    tryAgainBtn?.addEventListener('click', (event) => {
        event.preventDefault();
        gameRestart(); // Use our custom restart function instead of location.reload()
    });

    // Mute functionality
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

    // Helper function to close instructions dialog
    function closeInstructionsDialog() {
        instructionsDialog.classList.remove('show');
        setTimeout(() => {
            instructionsDialog.classList.add('hide');
        }, 300);
    }

    // Helper function to update mute icon
    function updateMuteIcon() {
        if (typeof soundManager === 'undefined') return;
        muteIcon.src = soundManager.muted ? 'img/icons/sound-off.png' : 'img/icons/sound-on.png';
        muteIcon.alt = soundManager.muted ? 'Sound aus' : 'Sound an';
    }

    // Wait for sound manager initialization
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

    // Add keyboard shortcuts for better UX
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            if (!instructionsDialog.classList.contains('hide')) {
                closeInstructionsDialog();
            }
        }
    });
});

// Fullscreen functionality
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