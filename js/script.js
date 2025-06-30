function toggleFullscreen() {
    const canvas = document.getElementById('canvas');
    const icon = document.getElementById('fullscreen-icon');

    if (!document.fullscreenElement) {
        // Fullscreen aktivieren für das Canvas
        if (canvas.requestFullscreen) {
            canvas.requestFullscreen();
        } else if (canvas.webkitRequestFullscreen) {
            canvas.webkitRequestFullscreen();
        } else if (canvas.msRequestFullscreen) {
            canvas.msRequestFullscreen();
        }
    } else {
        // Fullscreen verlassen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
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

  if (soundManager.muted) {
    muteIcon.src = 'img/icons/sound-off.png';
    muteIcon.alt = 'Sound aus';
  } else {
    muteIcon.src = 'img/icons/sound-on.png';
    muteIcon.alt = 'Sound an';
  }

  muteBtn.blur();
});