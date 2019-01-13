// generate.js

// app
import express from 'express'
const generate = express.Router()

// disk i/o
import fs from 'fs'

// models
import MIDIFile from '../models/MIDIFile.js'

// midi manipulation
import readMIDI from '../lib/read-midi.js'

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
    const testCategory = 'TestConversion'
    const query = {
        category: testCategory
    }
    const testMidi = await MIDIFile.findOne(query).catch(err => { console.log(err) });
    let testEvents = readMIDI(testMidi.data);
    console.log(testEvents);
    // testEvents.forEach(midiEvent => {
    //     console.log('Event:');
    //     console.log(`Subtype: ${midiEvent.subtype}`);
    //     console.log(`Play time: ${midiEvent.playTime}`);
    //     console.log(`Param 1: ${midiEvent.param1}`);
    //     console.log(`Param 2: ${midiEvent.param2}`);
    //     console.log('------');
    // })

    res.render('test', { testEvents })

})

export default generate;
