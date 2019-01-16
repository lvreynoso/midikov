"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.regexp.split");

var _midifile = _interopRequireDefault(require("midifile"));

var _midievents = _interopRequireDefault(require("midievents"));

var _fs = _interopRequireDefault(require("fs"));

var _queue = _interopRequireDefault(require("./queue.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// generate-midi.js
const START_TOKEN = 'START_TOKEN';
const STOP_TOKEN = 'STOP_TOKEN'; // markov data will be an object with "map" and "meta" properties.
// the values of these properties will be a markov map of notes
// and a histogram for metadata, respectively.
// the markov data is generated by generate-map.js

const generate = (markovData, order, category) => {
  // let sampleObject = {
  //     "ticksPerBeat": {
  //         "96":2,
  //         "120":38,
  //         "192":8,
  //         "240":3,
  //         "384":6,
  //         "480":2,
  //         "960":2,
  //         "1024":2
  //     }
  // }
  // let beat = weightedChoice(sampleObject, 'ticksPerBeat');
  // first, let's build the metadata.
  let metaData = {
    ticksPerBeat: undefined,
    SMPTEFrames: undefined,
    ticksPerFrame: undefined,
    keySignature: undefined,
    timeSignature: undefined,
    tempo: undefined // first, the simple properties.
    // prefer ticks per beat.

  };

  if (Object.getOwnPropertyNames(markovData.meta['ticksPerBeat']).length > 0) {
    metaData.ticksPerBeat = weightedChoice(markovData.meta['ticksPerBeat']);
  }

  if (Object.getOwnPropertyNames(markovData.meta['SMPTEFrames']).length > 0) {
    metaData.ticksPerBeat = weightedChoice(markovData.meta['SMPTEFrames']);
  }

  if (Object.getOwnPropertyNames(markovData.meta['ticksPerFrame']).length > 0) {
    metaData.ticksPerBeat = weightedChoice(markovData.meta['ticksPerFrame']);
  } // now to build events for the key and time signatures, and the tempo.
  // key signature


  let codedKeySignature = '';

  if (Object.getOwnPropertyNames(markovData.meta['keySignature']).length > 0) {
    codedKeySignature = weightedChoice(markovData.meta['keySignature']);
  } // console.log(codedKeySignature);


  let keySignature = {
    delta: 0x00,
    type: 0xff,
    subtype: 0x59,
    length: 0x02,
    key: 0x00,
    // default 0x00
    scale: 0x00 // default 0x00

  };
  let keyScaleArray = codedKeySignature.split('-'); // console.log(keyScaleArray);

  keySignature.key = parseInt(keyScaleArray[0], 10);
  keySignature.scale = parseInt(keyScaleArray[1], 10);
  metaData.keySignature = keySignature; // time signature

  let codedTimeSignature = '';

  if (Object.getOwnPropertyNames(markovData.meta['timeSignature']).length > 0) {
    codedTimeSignature = weightedChoice(markovData.meta['timeSignature']);
  }

  console.log(codedTimeSignature);
  let timeSignature = {
    delta: 0x00,
    type: 0xff,
    subtype: 0x58,
    length: 0x04,
    data: [0x00, 0x00, 0x00, 0x00],
    param1: 0x00,
    param2: 0x00,
    param3: 0x00,
    param4: 0x00
  };
  let timeDataStringArray = codedTimeSignature.split('-');
  let timeDataArray = timeDataStringArray.map(element => {
    return parseInt(element, 10);
  });
  timeSignature.data = timeDataArray;
  timeSignature.param1 = timeDataArray[0];
  timeSignature.param2 = timeDataArray[1];
  timeSignature.param3 = timeDataArray[2];
  timeSignature.param4 = timeDataArray[3];
  metaData.timeSignature = timeSignature; // tempo event

  let codedTempo = '';

  if (Object.getOwnPropertyNames(markovData.meta['tempo']).length > 0) {
    codedTempo = weightedChoice(markovData.meta['tempo']);
  }

  console.log(codedTempo);
  let tempo = {
    delta: 0x00,
    type: 0xff,
    subtype: 0x51,
    length: 0x03,
    tempo: 0x000000
  };
  tempo.tempo = parseInt(codedTempo, 10);
  metaData.tempo = tempo;
  console.log(metaData); // that finishes the metadata

  let tracks = {
    1: undefined,
    2: undefined,
    3: undefined // now we generate each track
    // let firstTrack = generateTrack(markovData.map, order, 450)
    // tracks[1] = firstTrack;
    // console.log('1 track written');
    // console.log(tracks);

  };

  for (let i = 1; i < 4; i++) {
    tracks[i] = generateTrack(markovData.map, order, 450);
  }

  let generatedSong = {
    trackNotes: tracks,
    metaData: metaData
  };
  return generatedSong;
};

function generateTrack(noteMap, markovOrder, distance) {
  let trackNotes = [];
  let stateQueue = new _queue.default(markovOrder); // get our first Markov state. find all the keys that start with
  // a start token, then randomly select from them.

  let markovKeys = Object.keys(noteMap);
  let startingPossibilities = [];
  markovKeys.forEach(markovKey => {
    let decodedKey = markovKey.split('|');

    if (decodedKey[0] == START_TOKEN) {
      startingPossibilities.push(markovKey);
    }
  });
  console.log(startingPossibilities);
  let state = startingPossibilities[Math.floor(Math.random() * startingPossibilities.length)];
  state = state.split('|');
  console.log(state);
  state.forEach(token => {
    stateQueue.enqueue(token);
  }); // now walk the path

  for (let step = 0; step <= distance; step++) {
    // save the queue state
    state = stateQueue.items(); // step through the queue

    let currentNote = stateQueue.dequeue(); // find another word to start the queue

    if (currentNote == STOP_TOKEN) {
      let allKeys = Object.keys(noteMap);
      let newStartingPossibilities = [];
      allKeys.forEach(allKey => {
        let decodedKey = allKey.split('|');

        if (decodedKey[0] == START_TOKEN) {
          newStartingPossibilities.push(allKey);
        }
      });
      state = newStartingPossibilities[Math.floor(Math.random() * newStartingPossibilities.length)];
      state = state.split('|');
      state.forEach(token => {
        stateQueue.enqueue(token);
      });
      currentNote = stateQueue.dequeue;
    } // start tokens aren't written


    if (currentNote == START_TOKEN) {
      let setOfPossibilities = noteMap[state];
      let nextNote = weightedChoice(setOfPossibilities);
      stateQueue.enqueue(nextNote);
      state = stateQueue.items();
      currentNote = stateQueue.dequeue();
    } // enqueue our next token


    let setOfPossibilities = noteMap[state];
    let nextNote = weightedChoice(setOfPossibilities);
    stateQueue.enqueue(nextNote); // turn the current note into an event

    let decodedNote = nextNote.split('-');
    let note = {
      pitch: undefined,
      velocity: undefined,
      alpha: undefined,
      duration: undefined
    };
    note.pitch = parseInt(decodedNote[0], 10);
    note.velocity = parseInt(decodedNote[1], 10);
    note.alpha = parseInt(decodedNote[2], 10);
    note.duration = parseInt(decodedNote[3], 10);
    trackNotes.push(note); // debugging

    if (trackNotes.length == 1) {
      console.log(trackNotes);
    }
  }

  return trackNotes;
} // need a random weighted choice function


function weightedChoice(histogram) {
  // let histogram = hashMap[property];
  let choice = '';
  let weightSum = Object.values(histogram).reduce((sum, element) => {
    return sum + element;
  }); // console.log(weightSum);

  let randomWeight = Math.floor(Math.random() * weightSum); // console.log(randomWeight);

  let keys = Object.keys(histogram); // console.log(keys);

  let chosen = false;
  keys.forEach(key => {
    if (randomWeight - histogram[key] <= 0 && chosen == false) {
      choice = key;
      chosen = true;
    } else if (chosen == false) {
      randomWeight -= histogram[key];
    }
  });
  return choice;
}

var _default = generate;
exports.default = _default;
//# sourceMappingURL=generate-midi.js.map