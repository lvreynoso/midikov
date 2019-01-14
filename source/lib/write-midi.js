// write-midi.js
// convert a sequence of events into binary MIDI format

import midiFile from 'midifile'
import fs from 'fs'

const writeMIDI = (midi) => {
    let binaryData = Buffer.from(midi.getContent());
    let path = 'public/temp/transform.midi';
    let writeStream = fs.createWriteStream(path);
    writeStream.write(binaryData, 'hex');
    writeStream.on('finish', () => {
        console.log('Wrote data to file.');
    })
    writeStream.close();
}

export default writeMIDI;
