// generate.js

// app
import express from 'express'
const generate = express.Router()

// disk i/o
import fs from 'fs'

// models
import MIDIFile from '../models/MIDIFile.js'

// midi manipulation
import midiFile from 'midifile'
import midiEvents from 'midievents'
import readMIDI from '../lib/read-midi.js'
import writeMIDI from '../lib/write-midi.js'
import transformMIDI from '../lib/transform-midi.js'

generate.post('/', async (req, res) => {
    // pull the midi from the database
    const category = req.body.category;
    const query = {
        category: category
    }
    const sampleMIDI = await MIDIFile.findOne(query).catch(err => { console.log(err) });
    const sampleHex = sampleMIDI.data.toString('hex');

    // write it to a file
    let path = 'public/temp/test.midi';
    let writeStream = fs.createWriteStream(path);
    writeStream.write(sampleHex, 'hex');
    writeStream.on('finish', () => {
        console.log('Wrote data to file.');
    })
    writeStream.close();

    // send the data
    const sampleObject = {
        title: sampleMIDI.title,
        hex: sampleHex,
        path: '/temp/test.midi'
    }
    const sampleJSON = JSON.stringify(sampleObject);
    res.status(200).send(sampleJSON);
});

// testing:
// --> read midi from database
// --> convert midi to json
// --> change instrument to piano
// --> convert back to midi
// --> write midi to file
generate.get('/test', async (req, res) => {
    // pull test midi from the data base
    const testCategory = 'Testing';
    const query = {
        category: testCategory
    };
    const testMidiDBObjects = await MIDIFile.find(query).catch(err => { console.log(err) });
    let name = 'test_pianized_';
    let counter = 1;
    testMidiDBObjects.forEach(midi => {
        let filename = `${name}${counter}`;
        writeMIDI(midi.data, filename);
        counter += 1;
    })
    // let testMidi = readMIDI(testMidiDBObjects[0].data);
    // let transformedMIDI = transformMIDI(testMidi);
    // writeMIDI(testMIDI);

    res.render('test');

})

export default generate;