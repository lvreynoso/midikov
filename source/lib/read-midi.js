// read-midi.js
// convert the binary data of a MIDI file into a sequence of events
// that we can manipulate

import midiFile from 'midifile'

const readMIDI = (binaryData) => {
    let decodedFile = new midiFile(binaryData);
    // console.log(decodedFile);
    console.log(`Track count: ${decodedFile.header.getTracksCount()}`);
    let events = decodedFile.getMidiEvents();
    // console.log(events[0]);
    return decodedFile;
}

export default readMIDI;
