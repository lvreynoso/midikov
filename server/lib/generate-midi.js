"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _midifile = _interopRequireDefault(require("midifile"));

var _midievents = _interopRequireDefault(require("midievents"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// generate-midi.js
const generate = sourceArray => {
  return sampleMidi();
};

function sampleMidi() {}

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
    let allItemsArray = [];

    for (let i = 0; i < this.data.length; i++) {
      allItemsArray.push(this.data[i]);
    }

    return allItemsArray;
  }

}

var _default = generate;
exports.default = _default;
//# sourceMappingURL=generate-midi.js.map