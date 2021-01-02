if (!navigator.requestMIDIAccess) {
  alert('This browser doesn\'t support requestMIDIAccess');
}
if (!window.AudioContext && !window.webkitAudioContext) {
  alert('This browser doesn\'t support AudioContext');
}

import * as synth from './synthesizer.mjs';
import * as sampler from './sampler.mjs';

let mode = 'synth';
[].forEach.call(document.querySelectorAll('[name="tabs"]'), (tab) => {
  tab.addEventListener('change', ev => mode = ev.target.value);
});
let playing = {};

/**
 * Initialize WebMIDI
 */
navigator?.requestMIDIAccess()?.then(MIDISuccess, MIDIFailure);

function MIDIFailure() {
  console.error('Could not access MIDI devices.');
}

function MIDISuccess(MIDIAccess) {
  // Log connected/disconnected MIDI inputs
  MIDIAccess.onstatechange = ev => document.getElementById('status').innerHTML = `${ev.port.name} ${ev.port.state}.`;
  // Listen for every message from every MIDI input
  for (const input of MIDIAccess.inputs.values()) {
    input.onmidimessage = processMIDIMessage;
  }
}

function processMIDIMessage(message) {
  // Destructure message data. A velocity value might not be included with a noteOff command
  const [command, note, velocity = 0] = message.data;
  const { noteOn, noteOff } = mode === 'synth' ? synth : sampler;
  // 144 is note ON only when it has a defined velocity
  if (command === 144 && velocity && !playing[note]) {
    playing[note] = true;
    noteOn(note, velocity);
  }
  // 128 is always note OFF
  if (command === 128) {
    playing[note] = false;
    noteOff(note);
  }
}