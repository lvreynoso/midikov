// assemble.js

// try and make a MIDI file out of some notes.

import midiFile from 'midifile'
import midiEvents from 'midievents'

// 384 ticks per beat
// time signature = [4, 2, 96, 8]
// tempo 451127
// key: 0, scale: 0 (C Major)

const assemble = (notes) => {
    let outputMidi = new midiFile();
    // Using MIDI Format Type 1
    outputMidi.header.setFormat(1);
    // Set ticks per beat
    outputMidi.header.setTicksPerBeat(0x0180);

    // *********************
    // Track 0: Meta stuff
    // *********************
    outputMidi.addTrack(0);
    let trackZeroEvents = [];
    // Time signature
    let timeSignature = {
        delta: 0x00,
        type: 0xff,
        subtype: 0x58,
        length: 0x04,
        data: [0x04, 0x02, 0x60, 0x08],
        param1: 0x04,
        param2: 0x02,
        param3: 0x60,
        param4: 0x08
    }
    // MIDI Tempo (bpm)
    let tempoEvent = {
        delta: 0x00,
        type: 0xff,
        subtype: 0x51,
        length: 0x03,
        tempo: 0x06e237,
    }
    let trackZeroProgram = {
        delta: 0x00,
        type: 0x08,
        subtype: 0x0c,
        channel: 0x02,
        param1: 0x00
    }
    // End the track
    let endOfTrackZero = {
        delta: 0x00,
        type: 0xff,
        subtype: 0x2f,
        length: 0x00
    }
    trackZeroEvents.push(timeSignature);
    trackZeroEvents.push(tempoEvent);
    trackZeroEvents.push(endOfTrackZero);
    outputMidi.setTrackEvents(0, trackZeroEvents)

    // *********************
    // Tracks 1+: The Music
    // *********************

    // first figure out how many tracks are in the input object
    // then loop through and write the tracks
    let trackNumbers = Object.keys(notes);
    console.log(`Tracks to write: ${trackNumbers}`);
    trackNumbers.sort((a, b) => {
        return parseInt(a, 10) - parseInt(b, 10);
    });

    trackNumbers.forEach(trackIndex => {
        console.log(`Writing track ${trackIndex}`);
        outputMidi.addTrack(trackIndex);
        let trackNotes = notes[trackIndex];
        // gets the wrong channel for some reason
        let trackChannel = trackNotes[0].channel;
        console.log(`Instrument Channel: ${trackChannel}`);
        // all track events
        let trackEvents = [];
        // Key signature
        let trackKeySignature = {
            delta: 0x00,
            type: 0xff,
            subtype: 0x59,
            length: 0x02,
            key: 0x00,
            scale: 0x00
        }
        // Program Change (Set the instrument)
        let trackProgram = {
            delta: 0x00,
            type: 0x08,
            subtype: 0x0c,
            channel: trackChannel,
            param1: 0x00
        }
        trackEvents.push(trackKeySignature);
        trackEvents.push(trackProgram);

        // convert each 'Note' to a pair of MIDI events: note on and note off.

        let noteOnTemplate = {
            delta: 0x00,
            type: 0x08,
            subtype: 0x09,
            channel: 0x00,
            param1: 0x00,
            param2: 0x00
        }
        let noteOffTemplate = {
            delta: 0x00,
            type: 0x08,
            subtype: 0x08,
            channel: 0x00,
            param1: 0x00,
            param2: 0x00
        }

        // algorithm the second
        // use a hashmap of ticks
        // create all the events at the proper 'tick'
        // THEN go through the hashmap and assemble events
        // calculate deltas by the distance between ticks
        let noteTracker = {};
        let ticks = 0;
        trackNotes.forEach(note => {
            // if (note.alpha > 0x300) {
            //     note.alpha = 0x300;
            // }
            // if (note.duration > 0x300) {
            //     note.duration = 0x300;
            // }
            ticks += note.alpha;
            // add the on event
            let noteOn = Object.assign({}, noteOnTemplate);
            noteOn.channel = note.channel;
            noteOn.param1 = note.pitch;
            noteOn.param2 = note.velocity;
            if (noteTracker[ticks] == undefined) {
                noteTracker[ticks] = [noteOn];
            } else {
                noteTracker[ticks].push(noteOn);
            }
            // add the off event
            let noteOff = Object.assign({}, noteOffTemplate);
            noteOff.channel = note.channel;
            noteOff.param1 = note.pitch;
            noteOff.param2 = note.velocity;
            let offPosition = ticks + note.duration;
            if (noteTracker[offPosition] == undefined) {
                noteTracker[offPosition] = [noteOff];
            } else {
                noteTracker[offPosition].push(noteOff);
            }
        })
        // now go through the hashmap in order and calculate deltas
        let previousTick = 0;
        let times = Object.keys(noteTracker);
        times.sort((a, b) => {
            return parseInt(a, 10) - parseInt(b, 10);
        })
        times.forEach(time => {
            let currentTime = parseInt(time, 10);
            noteTracker[time].forEach(event => {
                event.delta = currentTime - previousTick;
                if (event.delta > 0x300) {
                    console.log(event);
                }
                trackEvents.push(event);
                previousTick = currentTime;
            })
        })

        // console.log(noteTracker);

        // finally, end the track
        let endOftrack = Object.assign({}, endOfTrackZero);
        trackEvents.push(endOftrack);
        outputMidi.setTrackEvents(trackIndex, trackEvents);
    });
    // for (let k = 0; k < outputMidi.tracks.length; k++) {
    //     let trackEventsLog = outputMidi.getTrackEvents(k);
    //     console.log(`Track ${k}`);
    //     console.log(trackEventsLog[0]);
    //     console.log(trackEventsLog[1]);
    //     console.log(trackEventsLog[2]);
    //     console.log(trackEventsLog[3]);
    //     console.log(trackEventsLog[4]);
    //     console.log(trackEventsLog[5]);
    // }


    return outputMidi;
}

export default assemble;
