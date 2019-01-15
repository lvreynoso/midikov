"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _midifile = _interopRequireDefault(require("midifile"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// read-midi.js
// convert the binary data of a MIDI file into a sequence of events
// that we can manipulate
const readMIDI = binaryData => {
  let decodedFile = new _midifile.default(binaryData); // console.log(decodedFile);

  console.log(`Track count: ${decodedFile.header.getTracksCount()}`);
  let events = decodedFile.getMidiEvents(); // console.log(events[0]);

  return decodedFile;
};

var _default = readMIDI;
exports.default = _default;
//# sourceMappingURL=read-midi.js.map