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
import generateMap from '../lib/generate-map.js'

generate.post('/', async (req, res) => {
    // pull the midi from the database
    const category = req.body.category;
    const order = parseInt(req.body.order.split(' ')[1], 10);
    console.log(order);
    const query = {
        category: category
    }

    const categoryMidiDBObjects = await MIDIFile.find(query).catch(err => { console.log(err) });
    const midiObjects = categoryMidiDBObjects.map(dbEntry => {
        const convertedMidi = readMIDI(dbEntry.data);
        const deconstructedMidi = transformMIDI(convertedMidi);
        return deconstructedMidi;
    });
    let failed = false;
    let errorMessage = '';
    let generatedHex = '';
    try {
        // console.log(midiObjects);
        let markovData = generateMap(midiObjects, order, category);
        let generatedSong = generateMIDI(markovData, order, category);
        let generatedMidi = assembleMIDI(generatedSong);

        const generatedBinary = Buffer.from(generatedMidi.getContent());
        generatedHex = generatedBinary.toString('hex');

        // write it to a file
        // let path = 'public/temp/test.midi';
        // let writeStream = fs.createWriteStream(path);
        // writeStream.write(generatedHex, 'hex');
        // writeStream.on('finish', () => {
        //     console.log('Wrote data to file.');
        // })
        // writeStream.close();

    } catch (error) {
        console.log(error);
        failed = true;
    } finally {
        if (failed) {
            res.status(500);
        } else {
            // send the data
            const generatedObject = {
                title: `${category} - Generated Order ${order}`,
                hex: generatedHex,
                path: '/temp/test.midi'
            }
            const generatedJSON = JSON.stringify(generatedObject);
            res.status(200).send(generatedJSON);
        }
    }

});


export default generate;
