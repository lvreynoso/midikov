// transform-midi.js

import midiFile from 'midifile'
import midiEvents from 'midievents'

// ALL EVENT NUMBERS ARE IN HEX
// even though console.log() displays decimal numbers

// don't forget to keep track of how many channels there are too

const transformMIDI = (midi) => {

    let trackNotes = {};

    for (let index = 0; index < midi.tracks.length; index++) {
        let notes = [];
        let noteTracker = {};
        let deltaTime = 0x000000;
        // keep track of delta between note on events
        let alpha = 0x000000;
        let trackEvents = midi.getTrackEvents(index);
        let newTrackEvents = trackEvents.map(event => {
            // first update the delta time.
            deltaTime += event.delta;
            alpha += event.delta;
            // console.log(`Added ${event.delta} of delta time.`);
            // change of instrument events are called "midi program" events.
            // they are of event type 0x8 and subtype 0xc.
            if (event.type == midiEvents.EVENT_MIDI && event.subtype == midiEvents.EVENT_MIDI_PROGRAM_CHANGE) {
                return event;
            } else if (event.type == midiEvents.EVENT_MIDI && (event.subtype == midiEvents.EVENT_MIDI_NOTE_ON || event.subtype == midiEvents.EVENT_MIDI_NOTE_OFF)) {
                // midi notes are played by a "note on" event and they end when a "note off" event is called.
                // they are of event type 0x8 and subtypes 0x9 for 'note on' and 0x8 for 'note off'.

                // first we check if there is a note for this pitch in the note tracker;
                // if so, we end that note and start a new one
                let noteFound = false;
                let trackerKeys = Object.keys(noteTracker);
                for (let i = 0; i < trackerKeys.length; i++) {
                    if (trackerKeys[i] == event.param1) {
                        noteFound = true;
                    }
                }
                // if there is already a note for that pitch, end it
                if (noteFound == true) {
                    let finishedNote = noteTracker[event.param1];
                    finishedNote.off(deltaTime);
                    notes.push(finishedNote);
                    delete noteTracker[event.param1];
                }

                // put a new note in the tracker
                if (event.subtype == midiEvents.EVENT_MIDI_NOTE_ON) {
                    let newNote = new Note(event, deltaTime, alpha);
                    noteTracker[event.param1] = newNote;
                    alpha = 0x000000;
                }

                return event;
            } else if (event.type == midiEvents.EVENT_MIDI && event.subtype == midiEvents.EVENT_MIDI_CONTROLLER){
                // synthesizer effects are applied by midi controller events. they are of type 0x8
                // and subtype 0xb, and affect all tracks.
                return event;
            } else if (event.type == midiEvents.EVENT_META && event.subtype == midiEvents.EVENT_META_END_OF_TRACK) {
                // the end of a track is signalled by an event of type 0xff and subtype 0x2f.
                return event;
            } else if (event.type == midiEvents.EVENT_META && event.subtype == midiEvents.EVENT_META_SET_TEMPO) {
                // this is a meta midi event that sets the tempo (bpm) of the entire song (all tracks).
                // they are of type 0xff and subtype 0x51.
                // the tempo parameter is the number of microseconds per quarter note.
                // Divide 60,000,000 / this parameter and you get the bpm of the song.
                // TRACK 0
                return event;
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
            } else {
                console.log(event);
                return event;
            }
        });
        // console.log(`Track ${index} has ${newTrackEvents.length} events.`);
        // let leftovers = Object.keys(noteTracker);
        // console.log(`Note tracker has ${leftovers.length} leftovers.`)
        // console.log(notes);
        trackNotes[index] = notes;
    }
    // console.log(trackNotes);
    // trim empty tracks
    let tracks = Object.keys(trackNotes);
    tracks.forEach(track => {
        if (trackNotes[track].length == 0) {
            delete trackNotes[track];
            // console.log(`Deleted track ${track}`);
        }
    });

    return trackNotes;
}

class Note {
    constructor(event, time, alpha) {
        this.pitch = event.param1;
        this.velocity = event.param2;
        this.alpha = alpha;
        this.channel = event.channel;
        this.startIndex = time;
        this.endIndex = 0x000000;
        this.duration = 0x000000;
    }

    off(time) {
        this.endIndex = time;
        this.duration = this.endIndex - this.startIndex;
    }
}

export default transformMIDI;
