const soundManager = new SoundManager();
const savedMuted = localStorage.getItem('sharkie-muted') === 'true';
soundManager.muted = savedMuted;

// Auch alle Audio-Objekte korrekt muten
for (const key in soundManager.sounds) {
    soundManager.sounds[key].muted = savedMuted;
}
updateMuteIcon();


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



const startBtn = document.getElementById('start-button');
const playBtn = document.getElementById('play-button');
const nextBtn = document.getElementById('next-button');
const controls = document.getElementById('controls-info');
const explanation = document.getElementById('explanation-info');
const logo = document.getElementById('logo');

startBtn.addEventListener('click', () => {
    startBtn.classList.add('d-none');
    controls.classList.remove('d-none');
    nextBtn.classList.remove('d-none');
    logo.classList.add('d-none');
    nextBtn.focus();
});

nextBtn.addEventListener('click', () => {
    controls.classList.add('d-none');
    nextBtn.classList.add('d-none');
    explanation.classList.remove('d-none');
    playBtn.classList.remove('d-none');
    playBtn.focus();
});

const muteBtn = document.getElementById('mute-button');
const muteIcon = document.getElementById('mute-icon');

muteBtn.addEventListener('click', () => {
    soundManager.toggleMute();

    // Speichern im localStorage
    localStorage.setItem('sharkie-muted', soundManager.muted);

    // Icon updaten
    updateMuteIcon();
    muteBtn.blur();
});

function updateMuteIcon() {
    if (soundManager.muted) {
        muteIcon.src = 'img/icons/sound-off.png';
        muteIcon.alt = 'Sound aus';
    } else {
        muteIcon.src = 'img/icons/sound-on.png';
        muteIcon.alt = 'Sound an';
    }
}
