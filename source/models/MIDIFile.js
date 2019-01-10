// MIDIFile.js
// Model for storing our music in the form of MIDI files
// straight binary data

import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const MIDISchema = new Schema({
    title: { type: String, required: true },
    library: { type: Boolean, required: true},
    category: { type: String, required: true },
    data: Buffer
});

const MIDIFile = mongoose.model('MIDIFile', MIDISchema);
export default MIDIFile;
