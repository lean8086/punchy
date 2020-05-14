const audio = new AudioContext() || new webkitAudioContext();
let sources = {};
let buffers = {};

const soundsByNote = {
  60: 'sounds/13.wav', 61: 'sounds/14.wav', 62: 'sounds/15.wav', 63: 'sounds/16.wav',
  56: 'sounds/9.wav', 57: 'sounds/10.wav', 58: 'sounds/11.wav', 59: 'sounds/12.wav',
  52: 'sounds/5.wav', 53: 'sounds/6.wav', 54: 'sounds/7.wav', 55: 'sounds/8.wav',
  48: 'sounds/1.wav', 49: 'sounds/2.wav', 50: 'sounds/3.wav', 51: 'sounds/4.wav',
};

// Initialization
Object.keys(soundsByNote).forEach(note => loadSound(note, soundsByNote[note]));

// Wait for user interaction https://developers.google.com/web/updates/2017/09/autoplay-policy-changes#webaudio
document.querySelector('#consent').addEventListener('change', (ev) => (
  ev.target.checked ? audio.resume() : audio.suspend()
));

function loadSound(note, file) {
  const req = new XMLHttpRequest();
  req.open('GET', file, true);
  req.responseType = 'arraybuffer';
  req.onload = () => (
    audio.decodeAudioData(req.response, buffer => buffers[note] = buffer)
  );
  req.send();
}

export function noteOn(note) {
  const source = audio.createBufferSource();
  source.buffer = buffers[note];
  source.connect(audio.destination);
  source.start(audio.currentTime);
  // Save source to be stoppable on noteOff
  sources[note] = source;
}

export function noteOff(note) {
  sources[note]?.stop(audio.currentTime);
  sources[note]?.disconnect();
}