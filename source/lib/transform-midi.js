// transform-midi.js

import midiFile from 'midifile'
import midiEvents from 'midievents'

const transformMIDI = (midi) => {
    // copy the midi data
    let outputMidi = new midiFile();
    outputMidi.header.setFormat(midi.header.getFormat());
    outputMidi.header.setTicksPerBeat(midi.header.getTicksPerBeat());
    // outputMidi.header.setSMPTEDivision(midi.header.getSMPTEFrames(), midi.header.getTicksPerFrame());

    for (let index = 0; index < midi.tracks.length; index++) {
        outputMidi.addTrack(index);
        let trackEvents = midi.getTrackEvents(index);
        for (let i = 0; i < trackEvents.length; i++) {
            let event = trackEvents[i];
            if (event.type == midiEvents.EVENT_MIDI && (event.subtype == midiEvents.EVENT_MIDI_NOTE_OFF || event.subtype == midiEvents.EVENT_MIDI_NOTE_ON)) {
                // event.param1 = 127 - event.param1;
            } else if (event.type == midiEvents.EVENT_MIDI && event.subtype == midiEvents.EVENT_MIDI_PROGRAM_CHANGE) {
                event.param1 = 0;
            } else if (event.channel == 0x9) {
                console.log(event);
            }
        }
        outputMidi.setTrackEvents(index, trackEvents);
    }
    return outputMidi;
}

export default transformMIDI;
