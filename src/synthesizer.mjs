const audio = new AudioContext() || new webkitAudioContext();
let oscillators = {};

// Wait for user interaction https://developers.google.com/web/updates/2017/09/autoplay-policy-changes#webaudio
document.querySelector('#consent').addEventListener('change', (ev) => (
  ev.target.checked ? audio.resume() : audio.suspend()
));

// Frequency values equation https://en.wikipedia.org/wiki/MIDI_tuning_standard
function MIDINoteToFrequency(note) {
  return Math.pow(2, ((note - 69) / 12)) * 440;
}

export function noteOn(note) {
  const frequency = MIDINoteToFrequency(note);

  const osci = audio.createOscillator();
  osci.frequency.value = frequency;
  osci.connect(audio.destination);
  osci.start(audio.currentTime);
  // Save oscillator to be stoppable on noteOff
  oscillators[frequency] = osci;
}

export function noteOff(note) {
  const frequency = MIDINoteToFrequency(note);
  oscillators[frequency]?.stop(audio.currentTime);
  oscillators[frequency]?.disconnect();
}