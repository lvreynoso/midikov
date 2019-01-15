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
        tempo: 0x61a8,
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
            channel: 0x02,
            param1: 0x00,
            param2: 0x00
        }
        let noteOffTemplate = {
            delta: 0x00,
            type: 0x08,
            subtype: 0x08,
            channel: 0x02,
            param1: 0x00,
            param2: 0x00
        }

        // algorithm the second
        // use a hashmap of ticks
        // create all the events at the proper 'tick'
        // THEN go through the hashmap and assemble events
        // calculate deltas by the distance between ticks
        let noteTracker = {};
        let ticks = 0x000000;
        trackNotes.forEach(note => {
            ticks += note.alpha;
            // add the on event
            let noteOn = Object.assign({}, noteOnTemplate);
            noteOn.param1 = note.pitch;
            noteOn.param2 = note.velocity;
            if (noteTracker[ticks] == undefined) {
                noteTracker[ticks] = [noteOn];
            } else {
                noteTracker[ticks].push(noteOn);
            }
            // add the off event
            let noteOff = Object.assign({}, noteOffTemplate);
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
        let previousTick = 0x000000;
        let times = Object.keys(noteTracker);
        times.sort((a, b) => {
            return parseInt(a, 16) - parseInt(b, 16);
        })
        times.forEach(time => {
            let currentTime = parseInt(time, 16);
            noteTracker[time].forEach(event => {
                event.delta = currentTime - previousTick;
                trackEvents.push(event);
                previousTick = currentTime;
            })
        })

        // console.log(noteTracker);


        // algorithm the first
        // flawed
        // let ticks = 0x000000;
        // for the note tracker,
        // keys are delta ticks;
        // values are an array of note off events
        // let noteTracker = {};
        // let runningDelta = 0x00;
        // for (let index = 0; index < notes[trackIndex].length; index++) {
        //     // get the Note
        //     let keyPress = notes[trackIndex][index];
        //     // check the delta; move up ticks if necessary
        //     if (keyPress.delta > 0x00) {
        //         // time to move up ticks;
        //         for (let i = ticks; i <= (ticks + keyPress.delta); i++) {
        //             if (noteTracker[i] != undefined) {
        //                 // there are note off events that need to fire
        //                 noteTracker[i].forEach(event => {
        //                     event.delta = runningDelta;
        //                     trackEvents.push(event);
        //                     runningDelta = 0x00;
        //                 })
        //             }
        //             runningDelta += 0x01;
        //         }
        //     }
        //     // create a note on event
        //     let noteOn = Object.assign({}, noteOnTemplate);
        //     noteOn.delta = runningDelta;
        //     noteOn.channel = keyPress.channel;
        //     noteOn.param1 = keyPress.pitch;
        //     noteOn.param2 = keyPress.velocity;
        //     // push the event to the tracklist
        //     trackEvents.push(noteOn);
        //     runningDelta = 0x00;
        //     // create the corresponding note off event;
        //     let noteOff = Object.assign({}, noteOffTemplate);
        //     noteOff.channel = keyPress.channel;
        //     noteOff.param1 = keyPress.pitch;
        //     noteOff.param2 = keyPress.velocity;
        //     // add the note off event to the note tracker;
        //     let fireTime = ticks + keyPress.duration;
        //     if (noteTracker[fireTime] != undefined) {
        //         noteTracker[fireTime].push(noteOff);
        //     } else {
        //         noteTracker[fireTime] = [noteOff];
        //     }
        //     // then on to the next event...
        // }
        // // finish any remaining note off events
        // let remainingTicks = Object.keys(noteTracker);
        // remainingTicks.sort((a, b) => {
        //     return parseInt(a) - parseInt(b);
        // });
        // remainingTicks.forEach(tick => {
        //     runningDelta += parseInt(tick, 16) - ticks;
        //     noteTracker[tick].forEach(event => {
        //         event.delta = runningDelta;
        //         trackEvents.push(event);
        //         runningDelta = 0x00;
        //     })
        //     ticks = tick;
        // });

        // finally, end the track
        let endOftrack = Object.assign({}, endOfTrackZero);
        trackEvents.push(endOftrack);
        outputMidi.setTrackEvents(trackIndex, trackEvents);
    });

    return outputMidi;
}

export default assemble;
