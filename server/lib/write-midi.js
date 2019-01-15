"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _midifile = _interopRequireDefault(require("midifile"));

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// write-midi.js
// convert a sequence of events into binary MIDI format
const writeMIDI = (midi, filename) => {
  let binaryData = midi;
  let path = `public/temp/${filename}.midi`;

  let writeStream = _fs.default.createWriteStream(path);

  writeStream.write(binaryData, 'hex');
  writeStream.on('finish', () => {
    console.log('Wrote data to file.');
  });
  writeStream.close();
};

var _default = writeMIDI;
exports.default = _default;
//# sourceMappingURL=write-midi.js.map