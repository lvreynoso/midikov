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
import disassembleMIDI from '../lib/disassemble.js'
import generateMIDI from '../lib/generate-midi.js'
import assembleMIDI from '../lib/assemble.js'
import generateMap from '../lib/generate-map.js'

generate.post('/', async (req, res) => {
    let success = true;
    // pull the midi from the database
    const category = req.body.category;
    const order = parseInt(req.body.order.split(' ')[1], 10);
    console.log(order);
    const query = {
        category: category
    }

    const categoryMidiDBObjects = await MIDIFile.find(query).catch(err => {
        console.log(err)
    });
    let generatedHex = '';
    try {
        const midiObjects = categoryMidiDBObjects.map(dbEntry => {
            const convertedMidi = readMIDI(dbEntry.data);
            const deconstructedMidi = disassembleMIDI(convertedMidi);
            return deconstructedMidi;
        });
        // console.log(midiObjects);
        const markovData = generateMap(midiObjects, order, category);
        const generatedSong = generateMIDI(markovData, order, category);
        const generatedMidi = assembleMIDI(generatedSong);

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
        return res.status(500).send({
            message: "500 Error - Something went wrong."
        })
    }
    const generatedObject = {
        title: `${category} Song - Order ${order}`,
        hex: generatedHex,
        path: '/temp/test.midi'
    }
    const generatedJSON = JSON.stringify(generatedObject);
    return res.status(200).send(generatedJSON);
});


export default generate;
