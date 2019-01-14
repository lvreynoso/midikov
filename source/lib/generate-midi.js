// generate-midi.js

import midiFile from 'midifile'
import midiEvents from 'midievents'

const generate = (sourceArray) => {

}

function makeMidiNoteMarkovMap(tokenList, order) {
    let markovMap = {};
    
}

class Queue {
    constructor(size) {
        this.data = [];
        this.limit = size;
    }

    length() {
        return this.data.length;
    }

    enqueue(item) {
        if (this.length() == this.limit) {
            this.data.pop();
        }
        this.data.unshift(item);
    }

    dequeue(item) {
        if (this.length() == 0) {
            return undefined;
        } else {
            let item = this.data.pop();
            return item;
        }
    }

    items() {
        let allItemsArray = []
        for (let i = 0; i < this.data.length; i++) {
            allItemsArray.push(this.data[i]);
        }
        return allItemsArray;
    }
}

export default generate;
