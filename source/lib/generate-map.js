// generate-map.js
// take an array of midi info and turn it into
// a markov map usable for generating songs

import midiFile from 'midifile'
import midiEvents from 'midievents'
import fs from 'fs'
import _ from 'lodash'

import Queue from './queue.js'

const START_TOKEN = 'START_TOKEN'
const STOP_TOKEN = 'STOP_TOKEN'

// midiArray will be an array of midiData objects, as described in
// transform-midi.js. order and category will be passed by the controller

const generateMap = (midiArray, order, category) => {
    // generate a map of notes.
    // and the first part of that - shove all the notes together.
    let tokenArray = [];
    midiArray.forEach(song => {
        // get a list of tracks
        let trackNumbers = Object.keys(song.trackNotes);
        trackNumbers.sort((a, b) => {
            return parseInt(a) - parseInt(b);
        });
        // go through each track and push notes to the tokenArray
        trackNumbers.forEach(track => {
            let notes = song.trackNotes[track];
            tokenArray.push(START_TOKEN);
            notes.forEach(note => {
                let noteToken = tokenate(note);
                tokenArray.push(noteToken);
            })
            tokenArray.push(STOP_TOKEN);
        })
    })
    // now we should have an array of note tokens.
    // console.log(tokenArray);
    // indeed we do.

    // second - we go through the tokens and build up a markov map.
    // it's better in the original python.
    let markovMap = {};
    let startingItems = [];

    for (let n = 0; n < order; n++) {
        startingItems.push(tokenArray[n]);
    }

    let stateTracker = new Queue(order);
    startingItems.forEach(item => {
        stateTracker.enqueue(item);
    });
    let state = stateTracker.items();
    markovMap[state] = {};

    // this is a very big loop.
    for (let index = order; index < tokenArray.length; index++) {
        let newToken = tokenArray[index];
        stateTracker.enqueue(newToken);
        let newState = stateTracker.items();

        // add the new state to the markov map
        if (markovMap[newState] == undefined) {
            markovMap[newState] = {}
        }

        // update the token count for the current state
        if (markovMap[state][newToken] == undefined) {
            markovMap[state][newToken] = 1;
        } else {
            markovMap[state][newToken] += 1;
        }
        state = newState;
    }

    // write map to disk
    let stringMap = JSON.stringify(markovMap);
    let filename = `${category}_${order}.markov`
    let path = `public/temp/${filename}`;
    let writeStream = fs.createWriteStream(path);
    writeStream.write(stringMap, 'utf8');
    writeStream.on('finish', () => {
        console.log('Wrote data to file.');
    })
    writeStream.close();

    // did it work?
    // yes it did. wow.
}

function tokenate(note) {
    let token = `${note.pitch}-${note.velocity}-${note.alpha}-${note.duration}`
    return token;
}

// class NoteToken {
//     constructor(note) {
//         this.pitch = note.pitch;
//         this.velocity = note.velocity;
//         this.alpha = note.alpha;
//         this.duration = note.duration;
//     }
// }

export default generateMap;
