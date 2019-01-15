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
import generateMIDI from '../lib/generate-midi.js'
import assembleMIDI from '../lib/assemble.js'

generate.post('/', async (req, res) => {
    // pull the midi from the database
    const category = req.body.category;
    const query = {
        category: category
    }
    // get all midis from a category
    const categoryMidis = await MIDIFile.find(query).catch(err => { console.log(err) });

    // fake it until you make it...
    const randomMidi = categoryMidis[Math.floor(Math.random() * categoryMidis.length)]
    const sacrificedMidi = readMIDI(randomMidi.data);
    const transformMIDIdata = transformMIDI(sacrificedMidi);
    const frankenSong = assembleMIDI(transformMIDIdata);
    const frankenSongBinary = Buffer.from(frankenSong.getContent());

    const generatedHex = frankenSongBinary.toString('hex');

    // write it to a file
    let path = 'public/temp/test.midi';
    let writeStream = fs.createWriteStream(path);
    writeStream.write(generatedHex, 'hex');
    writeStream.on('finish', () => {
        console.log('Wrote data to file.');
    })
    writeStream.close();

    // send the data
    const generatedObject = {
        title: randomMidi.title,
        hex: generatedHex,
        path: '/temp/test.midi'
    }
    const generatedJSON = JSON.stringify(generatedObject);
    res.status(200).send(generatedJSON);
});

// test Markov generation
generate.get('/test', async (req, res) => {
    // pull test midi from the data base
    const testCategory = 'test';
    const query = {
        category: testCategory
    };
    const testMidiDBObjects = await MIDIFile.find(query).catch(err => { console.log(err) });
    let markovSources = testMidiDBObjects.map(midi => {
        let midiJSON = readMIDI(midi.data);
        return midiJSON;
    })

    let generatedMidi = generateMIDI(markovSources);
    let generatedMidiBinary = Buffer.from(generatedMidi.getContent());
    writeMIDI(generatedMidiBinary, 'test_generate')

    res.render('test');

})

// testing:
// --> read midi from database
// --> write midi to file
generate.get('/write-test', async (req, res) => {
    // pull test midi from the data base
    const testCategory = 'test';
    const query = {
        category: testCategory
    };
    const testMidiDBObjects = await MIDIFile.find(query).catch(err => { console.log(err) });
    let name = '_pianized_';
    let counter = 1;
    testMidiDBObjects.forEach(midi => {
        let filename = `${counter}${name}${midi.title}`;
        writeMIDI(midi.data, filename);
        counter += 1;
    })
    // let testMidi = readMIDI(testMidiDBObjects[0].data);
    // let transformedMIDI = transformMIDI(testMidi);
    // writeMIDI(testMIDI);

    res.render('test');

})

export default generate;
