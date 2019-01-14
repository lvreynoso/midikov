// pianize.js

import midiFile from 'midifile'
import midiEvents from 'midievents'
import hexToNote from './noteMap.js'

const pianize = (midi) => {
    // copy the midi data
    let outputMidi = new midiFile();
    outputMidi.header.setFormat(midi.header.getFormat());
    console.log(`MIDI File Format Type: ${midi.header.getFormat()}`);
    // outputMidi.header.setTicksPerBeat(midi.header.getTicksPerBeat());
    // outputMidi.header.setSMPTEDivision(midi.header.getSMPTEFrames(), midi.header.getTicksPerFrame());
    if (midi.header.getTimeDivision() === midiFile.Header.TICKS_PER_BEAT) {
        outputMidi.header.setTicksPerBeat(midi.header.getTicksPerBeat());
    } else {
        outputMidi.header.setSMPTEDivision(midi.header.getSMPTEFrames(), midi.header.getTicksPerFrame());
    }

    for (let index = 0; index < midi.tracks.length; index++) {
        outputMidi.addTrack(index);
        let trackEvents = midi.getTrackEvents(index);
        let newTrackEvents = trackEvents.map(event => {
            // change of instrument events are called "midi program" events.
            // they are of event type 0x8 and subtype 0xc.
            if (event.type == midiEvents.EVENT_MIDI && event.subtype == midiEvents.EVENT_MIDI_PROGRAM_CHANGE) {
                event.param1 = 0;
                return event;
            } else if (event.channel == 0x9) {
                // percussion instruments live in event channel 0x9.
                return 99;
            } else if (event.type == midiEvents.EVENT_MIDI && (event.subtype == midiEvents.EVENT_MIDI_NOTE_OFF || event.subtype == midiEvents.EVENT_MIDI_NOTE_ON)) {
                // midi notes are played by a "note on" event and they end when a "note off" event is called.
                // they are of event type 0x8 and subtypes 0x9 for 'note on' and 0x8 for 'note off'.
                if (event.subtype == midiEvents.EVENT_MIDI_NOTE_ON) {
                    let indexHex = parseInt(event.index, 16);
                    let indexString = indexHex.toString(10)
                    console.log(`Event at time ${indexString}`);
                    let note = hexToNote(event.param1);
                    console.log(`${note} played ${event.delta} clocks after the preceding event.`);
                }
                return event;
            } else if (event.type == midiEvents.EVENT_MIDI && event.subtype == midiEvents.EVENT_MIDI_CONTROLLER) {
                // synthesizer effects are applied by midi controller events. they are of type 0x8
                // and subtype 0xb, and affect all tracks.
                return event;
            } else if (event.type == midiEvents.EVENT_META && event.subtype == midiEvents.EVENT_META_END_OF_TRACK) {
                // the end of a track is signalled by an event of type 0xff and subtype 0x2f.
                return event;
            } else if (event.type == midiEvents.EVENT_META && event.subtype == midiEvents.EVENT_META_TRACK_NAME) {
                // track names are in events of type 0xff and subtype 0x3.
                return 99;
            } else if (event.type == midiEvents.EVENT_META && event.subtype == midiEvents.EVENT_META_SET_TEMPO) {
                // this is a meta midi event that sets the tempo (bpm) of the entire song (all tracks).
                // they are of type 0xff and subtype 0x51.
                // the tempo parameter is the number of microseconds per quarter note.
                // Divide 60,000,000 / this parameter and you get the bpm of the song.
                // TRACK 0
                return event;
            } else if (event.type == midiEvents.EVENT_META && event.subtype == midiEvents.EVENT_META_MARKER) {
                // this midi 'meta' marker event is simply a marker - it does the same function
                // for a midi file as comments do for software code.
                // type 0xff, subtype 0x06.
                return 99;
            } else if (event.type == midiEvents.EVENT_META && event.subtype == midiEvents.EVENT_META_COPYRIGHT_NOTICE) {
                // a copyright notice. type 0xff, subtype 0x02.
                return 99;
            } else if (event.type == midiEvents.EVENT_META && event.subtype == midiEvents.EVENT_META_TIME_SIGNATURE) {
                // used to change the time signature of a track. parameters are as follows:
                // 1: numerator of the time signature
                // 2: denominator of the time signature, as a negative power of 2. i.e. 2 represents a quarter note, 3 an eighth note, etc.
                // 3: number of MIDI clocks between metronome clicks. (???)
                // 4: number of notated 32nd notes in a MIDI quarter-note. usually 8.
                // type: 0xff, subtype: 0x58
                // TRACK 0
                return event;
            } else if (event.type == midiEvents.EVENT_META && event.subtype == midiEvents.EVENT_META_KEY_SIGNATURE) {
                // this event has two properties: key and scale. the key property specifies
                // the number of flats (negative number) or number of sharps (positive). a key of
                // 0 is the key of C.
                // the scale property is 0 for a major key, and 1 for a minor key.
                // type: 0xff, subtype: 0x59
                // TRACK 0
                return event;
            } else if (event.type == midiEvents.EVENT_MIDI && event.subtype == midiEvents.EVENT_MIDI_PITCH_BEND) {
                // fancy pitch bending. type 0x08, subtype 0xe.
                return event;
            } else if (event.type == midiEvents.EVENT_MIDI && event.subtype == midiEvents.EVENT_MIDI_NOTE_AFTERTOUCH) {
                // fancy note aftertouches. type 0x08, subtype 0xa.
                return event;
            } else if (event.type == midiEvents.EVENT_MIDI && event.subtype == midiEvents.EVENT_MIDI_CHANNEL_AFTERTOUCH) {
                // fancy channel aftertouches. type 0x08, subtype 0xd.
                return event;
            } else if (event.type == midiEvents.EVENT_META) {
                // all other meta events
                return 99;
            } else if (event.type == midiEvents.EVENT_SYSEX || event.type == midiEvents.EVENT_DIVSYSEX) {
                // drop all system exclusive messages
                return 99;
            } else {
                // TODO: drop 0xff-0x20, 0xff-0x7f
                console.log(event);
                return event;
            }
        });
        let filteredTrackEvents = newTrackEvents.filter(element => {
            if (element == 99) {
                return false
            } else {
                return true
            }
        })
        console.log(`Track ${index} has ${filteredTrackEvents.length} events.`);
        // if (index == 0 || index == 4 || index == 5) {
        //     filteredTrackEvents.forEach(element => {
        //         console.log(element);
        //     })
        // }
        outputMidi.setTrackEvents(index, filteredTrackEvents);
    }
    return outputMidi;
}

export default pianize;
