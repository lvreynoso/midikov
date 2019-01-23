// admin.js

import express from 'express'
import multer from 'multer'
const admin = express.Router()
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// model
import MIDIFile from '../models/MIDIFile.js'
import Category from '../models/Category.js'

import readMIDI from '../lib/read-midi.js'
import pianize from '../lib/pianize.js'
import midiFile from 'midifile'

admin.get('/', (req, res) => {
    const currentUser = req.user;
    res.render('admin', { currentUser })
})

admin.post('/upload', upload.array('midis', 64), async (req, res) => {
    const category = req.body.category;

    // update category master list
    let categoryMasterList = await Category.findOne({}).catch(err => { console.log(err) });
    let categorySet = new Set(categoryMasterList.entries);
    categorySet.add(category);
    let newCategories = Array.from(categorySet);
    categoryMasterList.entries = newCategories;
    categoryMasterList.save().catch(err => {console.log(err) });

    // process files
    req.files.forEach( async file => {
        let newMidi = new MIDIFile();
        console.log(`Processing ${file.originalname}`);
        // let re = /^(.+)(\.[^ .]+)?$/g;
        let re = /(\.[^ .]+)?$/g;
        let regexedTitle = file.originalname.replace(re, '');
        newMidi.title = regexedTitle;
        newMidi.library = true;
        newMidi.category = category;

        // pianize the MIDI file
        let midiJS = readMIDI(file.buffer);
        let pianoVersion = pianize(midiJS);
        newMidi.data = Buffer.from(pianoVersion.getContent());

        newMidi.save().catch(err => { console.log(err); })
    });
    res.redirect('/admin')
})

export default admin;
