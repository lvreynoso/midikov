// test.js

// app
import express from 'express'
const test = express.Router()

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
import analyzeMIDI from '../lib/analyze.js'
import assembleMIDI from '../lib/assemble.js'
import testpad from '../lib/testpad.js'
import generateMap from '../lib/generate-map.js'

// landing page
test.get('/', (req, res) => {
    res.render('test');
})

test.get('/generate', async (req, res) => {
    // pull test midis from the data base
    const testCategory = 'Pokemon';
    const query = {
        category: testCategory
    };
    const testMidiDBObjects = await MIDIFile.find(query).catch(err => { console.log(err) });
    const midiObjects = testMidiDBObjects.map(dbEntry => {
        const convertedMidi = readMIDI(dbEntry.data);
        const deconstructedMidi = transformMIDI(convertedMidi);
        return deconstructedMidi;
    });
    // test with order 1
    let markovData = generateMap(midiObjects, 1, testCategory);
    let generatedSong = generateMIDI(markovData, 1, testCategory);
    let generatedMidi = assembleMIDI(generatedSong);

    // the 'assembled' midi
    let filename = `generate_test`;
    let binaryMidiData = Buffer.from(generatedMidi.getContent());
    writeMIDI(binaryMidiData, filename);

    res.redirect('/test');
})

test.get('/map', async (req, res) => {
    // pull test midis from the data base
    const testCategory = 'Pokemon';
    const query = {
        category: testCategory
    };
    const testMidiDBObjects = await MIDIFile.find(query).catch(err => { console.log(err) });
    const midiObjects = testMidiDBObjects.map(dbEntry => {
        const convertedMidi = readMIDI(dbEntry.data);
        const deconstructedMidi = transformMIDI(convertedMidi);
        return deconstructedMidi;
    });
    // test with order 1
    generateMap(midiObjects, 1, testCategory);

    res.redirect('/test');
})

test.get('/scratch', (req, res) => {
    testpad();

    res.redirect('/test');
})

test.get('/assemble', async (req, res) => {
    // pull test midis from the data base
    const testCategory = 'test';
    const query = {
        category: testCategory
    };
    const testMidiDBObjects = await MIDIFile.find(query).catch(err => { console.log(err) });
    let testMidi = readMIDI(testMidiDBObjects[0].data);
    let testNotes = transformMIDI(testMidi);

    let assembledMidi = assembleMIDI(testNotes);

    // the 'assembled' midi
    let filename = `assemble_test`;
    let binaryMidiData = Buffer.from(assembledMidi.getContent());
    writeMIDI(binaryMidiData, filename);

    // the original midi
    let originalMidiData = Buffer.from(testMidi.getContent());
    writeMIDI(originalMidiData, 'original_test')

    res.redirect('/test');
})

test.get('/transform', async (req, res) => {
    // pull test midi from the data base
    const testCategory = 'test';
    const query = {
        category: testCategory
    };
    const testMidiDBObjects = await MIDIFile.find(query).catch(err => { console.log(err) });
    let testMidi = readMIDI(testMidiDBObjects[0].data);
    let testNotes = transformMIDI(testMidi);
    testNotes.forEach(notes => {
        // console.log(notes.length);
    })
    // console.log(testNotes);

    res.redirect('/test');
})

test.get('/analyze', async (req, res) => {
    // pull test midi from the data base
    const testCategory = 'test';
    const query = {
        category: testCategory
    };
    const testMidiDBObjects = await MIDIFile.find(query).catch(err => { console.log(err) });
    let testMidi = readMIDI(testMidiDBObjects[0].data);
    let analyzedMIDI = analyzeMIDI(testMidi);

    res.redirect('/test');
})

// testing:
// --> read midi from database
// --> write midi to file
test.get('/write', async (req, res) => {
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

    res.redirect('/test');
})

export default test;
