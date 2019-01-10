// admin.js

import express from 'express'
import multer from 'multer'
const admin = express.Router()
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// model
import MIDIFile from '../models/MIDIFile.js'

admin.get('/', (req, res) => {
    const currentUser = req.user;
    res.render('admin', { currentUser })
})

admin.post('/upload', upload.array('midis', 24), async (req, res) => {
    const category = req.body.category;
    req.files.forEach( async file => {
        let newMidi = new MIDIFile();
        newMidi.title = file.originalname;
        newMidi.library = true;
        newMidi.category = category;
        newMidi.data = file.buffer;

        const savedMidi = await newMidi.save().catch(err => { console.log(err); })
        console.log(savedMidi);
    });
    res.redirect('/admin')
})

export default admin;
