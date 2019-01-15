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

// landing page
test.get('/', (req, res) => {
    res.render('test');
})

test.get('/assemble', async (req, res) => {
    // pull test midi from the data base
    const testCategory = 'test';
    const query = {
        category: testCategory
    };
    const testMidiDBObjects = await MIDIFile.find(query).catch(err => { console.log(err) });
    let testMidi = readMIDI(testMidiDBObjects[0].data);
    let testNotes = transformMIDI(testMidi);
    // // find the longest track
    // let longestTrackIndex = 0;
    // let longestLength = 0;
    // for (let i = 0; i < testNotes.length; i++) {
    //     if (testNotes[i].length > longestLength) {
    //         longestTrackIndex = i;
    //         longestLength = testNotes[i].length;
    //     }
    // }
    // console.log(testNotes);
    let assembledMidi = assembleMIDI(testNotes);

    // debugging
    // for (let i = 0; i < assembledMidi.tracks.length; i++) {
    //     let trackEvents = assembledMidi.getTrackEvents(i);
    //     console.log(trackEvents);
    // }

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
        console.log(notes.length);
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
