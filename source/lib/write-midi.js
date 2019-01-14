// write-midi.js
// convert a sequence of events into binary MIDI format

import midiFile from 'midifile'
import fs from 'fs'

const writeMIDI = (midi, filename) => {
    let binaryData = midi;
    let path = `public/temp/${filename}.midi`;
    let writeStream = fs.createWriteStream(path);
    writeStream.write(binaryData, 'hex');
    writeStream.on('finish', () => {
        console.log('Wrote data to file.');
    })
    writeStream.close();
}

export default writeMIDI;
