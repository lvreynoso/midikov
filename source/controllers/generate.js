// generate.js

// app
import express from 'express'
const generate = express.Router()

// disk i/o
import fs from 'fs'

// models
import MIDIFile from '../models/MIDIFile.js'

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

export default generate;
