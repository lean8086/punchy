const audio = window.AudioContext ? new window.AudioContext() : new window.webkitAudioContext();
let sources = {};
let buffers = {};

// Wait for user interaction https://developers.google.com/web/updates/2017/09/autoplay-policy-changes#webaudio
document.querySelector('#consent').addEventListener('change', (ev) => (
  ev.target.checked ? audio.resume() : audio.suspend()
));

// Assing an audio file to each note
[].forEach.call(document.querySelectorAll('.soundFile'), (el, i) => (
  el.addEventListener('change', () => {
    const reader = new FileReader();
    reader.onload = (ev) => (
      // Notes starts at 48 (C3)
      audio.decodeAudioData(ev.target.result, buffer => buffers[i + 48] = buffer)
    );
    reader.readAsArrayBuffer(el.files[0]);
  })
));

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