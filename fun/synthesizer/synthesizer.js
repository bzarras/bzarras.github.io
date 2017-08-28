'use strict';

// Elements
let keyElement = document.querySelector('.key-button');
let frequencySlider = document.querySelector("#frequency-slider");
let frequencyDisplay = document.querySelector('#frequency-display');
let waveSelector = document.querySelector('#wave-selector');
let volumeSlider = document.querySelector('#volume-slider');
let attackSlider = document.querySelector('#attack-slider');
let decaySlider = document.querySelector('#decay-slider');
let sustainSlider = document.querySelector('#sustain-slider');
let releaseSlider = document.querySelector('#release-slider');

let FULL_GAIN = volumeSlider.value
let ATTACK_MS = attackSlider.value;
let DECAY_MS = decaySlider.value;
let SUSTAIN_PERC = sustainSlider.value;
let RELEASE_MS = releaseSlider.value;

// Need these intervals as globals because they need
// to be able to be set and cleared from anywhere
let attackInterval;
let decayInterval;
let releaseInterval;

let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let gainNode = audioContext.createGain();
let oscillator; // Oscillator as a global kinda sucks, but not sure how to avoid it.
gainNode.connect(audioContext.destination);
gainNode.gain.value = volumeSlider.value;

keyElement.innerHTML = 'PLAY';
keyElement.addEventListener('mousedown', e => {
  if (e.which === 1) { // left mouse button
    if (oscillator) {
      oscillator.stop();
      oscillator = null; // Double triple make sure the old oscillator is gone before creating a new one
    }
    playNote();
  }
});
keyElement.addEventListener('mouseup', e => {
  if (e.which === 1) {
    releaseNote(oscillator);
  }
});

// Update global variables when sliders move
frequencyDisplay.innerHTML = frequencySlider.value + ' Hz';
frequencySlider.addEventListener('input', e => frequencyDisplay.innerHTML = frequencySlider.value + ' Hz');
volumeSlider.addEventListener('input', e => FULL_GAIN = volumeSlider.value);
attackSlider.addEventListener('input', e => ATTACK_MS = attackSlider.value);
decaySlider.addEventListener('input', e => DECAY_MS = decaySlider.value);
sustainSlider.addEventListener('input', e => SUSTAIN_PERC = sustainSlider.value);
releaseSlider.addEventListener('input', e => RELEASE_MS = releaseSlider.value);

function playNote () {
  [attackInterval, decayInterval, releaseInterval].forEach(interval => clearInterval(interval));
  oscillator = audioContext.createOscillator();
  oscillator.frequency.value = frequencySlider.value;
  oscillator.type = waveSelector.value;
  oscillator.connect(gainNode);
  gainNode.gain.value = 0;
  const sustainGain = FULL_GAIN * SUSTAIN_PERC;
  const attackGainTick = FULL_GAIN / (ATTACK_MS / 10);
  const decayGainTick = (FULL_GAIN - sustainGain) / (DECAY_MS / 10);
  let attackProgress = 0;
  let decayProgress = 0;
  attackInterval = setInterval(() => {
    attackProgress += 10;
    if (attackProgress >= ATTACK_MS) {
      clearInterval(attackInterval);
      decayInterval = setInterval(() => {
        decayProgress += 10;
        if (decayProgress >= DECAY_MS) {
          clearInterval(decayInterval);
          gainNode.gain.value = sustainGain;
        }
        gainNode.gain.value -= decayGainTick;
      }, 10);
    }
    gainNode.gain.value += attackGainTick;
  }, 10);
  oscillator.start();
}

function releaseNote () {
  [attackInterval, decayInterval, releaseInterval].forEach(interval => clearInterval(interval));
  const currentGain = gainNode.gain.value;
  const releaseGainTick = currentGain / (RELEASE_MS / 10);
  let releaseProgress = 0;
  releaseInterval = setInterval(() => {
    releaseProgress += 10;
    if (releaseProgress >= RELEASE_MS) {
      oscillator.stop();
      oscillator = null; // Make sure the old oscillator is gone before creating a new one
      clearInterval(releaseInterval);
    }
    gainNode.gain.value -= releaseGainTick;
  }, 10);
}
