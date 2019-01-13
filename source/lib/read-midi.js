// read-midi.js
// convert the binary data of a MIDI file into a sequence of events
// that we can manipulate

import midifile from 'midifile'

const readMIDI = (binaryData) => {
    let decodedFile = new midifile(binaryData);
    let events = decodedFile.getMidiEvents();
    return events;
}

export default readMIDI;
