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
    outputMidi.header.setTicksPerBeat(384);

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
        tempo: 0x6e237,
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
    outputMidi.setTrackEvents(0, trackZeroEvents);

    // *********************
    // Track 1: The Music
    // *********************
    outputMidi.addTrack(1);
    let trackOneChannel = notes[0].channel;
    console.log(trackOneChannel);
    let trackOneEvents = [];
    // Key signature
    let trackOneKeySignature = {
        delta: 0x00,
        type: 0xff,
        subtype: 0x59,
        length: 0x02,
        key: 0x00,
        scale: 0x00
    }
    // Program Change (Set the instrument)
    let trackOneProgram = {
        delta: 0x00,
        type: 0x08,
        subtype: 0x0c,
        channel: 0x02,
        param1: 0x00
    }
    trackOneEvents.push(trackOneKeySignature);

    // convert each 'Note' to a pair of MIDI events: note on and note off.
    // this way might be kind of convoluted
    // get the total number of delta ticks from the last note;
    // then start at zero, count up to that tick;
    // everytime a note on event fires, track the delta so that a note off
    // event is created at the appropriate time.

    // let lastEventIndex = notes.length - 1;
    // console.log(notes[lastEventIndex].endIndex);
    // let deltaMax = notes[lastEventIndex].endIndex;
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
    let ticks = 0x000000;
    // for the note tracker,
    // keys are delta ticks;
    // values are an array of note off objects
    let noteTracker = {};
    // let convertedEvents = [];
    let runningDelta = 0x00;
    for (let index = 0; index < notes.length; index++) {
        // get the Note
        let keyPress = notes[index];
        // check the delta; move up ticks if necessary
        if (keyPress.delta > 0x00) {
            // time to move up ticks;
            for (let i = ticks; i <= (ticks + keyPress.delta); i++) {
                if (noteTracker[i] != undefined) {
                    // there are note off events that need to fire
                    noteTracker[i].forEach(event => {
                        event.delta = runningDelta;
                        trackOneEvents.push(event);
                        runningDelta = 0x00;
                    })
                }
                runningDelta += 0x01;
            }
        }
        // create a note on event
        let noteOn = Object.assign({}, noteOnTemplate);
        noteOn.delta = runningDelta;
        noteOn.channel = keyPress.channel;
        noteOn.param1 = keyPress.pitch;
        noteOn.param2 = keyPress.velocity;
        // push the event to the tracklist
        trackOneEvents.push(noteOn);
        runningDelta = 0x00;
        // create the corresponding note off event;
        let noteOff = Object.assign({}, noteOffTemplate);
        noteOff.channel = keyPress.channel;
        noteOff.param1 = keyPress.pitch;
        noteOff.param2 = keyPress.velocity;
        // add the note off event to the note tracker;
        let fireTime = ticks + keyPress.duration;
        if (noteTracker[fireTime] != undefined) {
            noteTracker[fireTime].push(noteOff);
        } else {
            noteTracker[fireTime] = [noteOff];
        }
        // then on to the next event...
    }
    // finish any remaining note off events
    let remainingTicks = Object.keys(noteTracker);
    remainingTicks.sort((a, b) => {
        return parseInt(a) - parseInt(b);
    });
    remainingTicks.forEach(tick => {
        runningDelta += parseInt(tick, 16) - ticks;
        noteTracker[tick].forEach(event => {
            event.delta = runningDelta;
            trackOneEvents.push(event);
            runningDelta = 0x00;
        })
        ticks = tick;
    });

    // finally, end the track
    let endOfTrackOne = Object.assign({}, endOfTrackZero);
    trackOneEvents.push(endOfTrackOne);
    outputMidi.setTrackEvents(1, trackOneEvents);

    return outputMidi;
}

export default assemble;
