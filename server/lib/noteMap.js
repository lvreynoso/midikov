"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es6.regexp.to-string");

// noteMap.js
// midi note mapping
let midiNoteMap = {
  0x00: 'C',
  0x01: 'C#',
  0x02: 'D',
  0x03: 'D#',
  0x04: 'E',
  0x05: 'F',
  0x06: 'F#',
  0x07: 'G',
  0x08: 'G#',
  0x09: 'A',
  0xa: 'Bb',
  0xb: 'B'
};

const hexToNote = inputByte => {
  let hex = inputByte;
  let multiplier = Math.floor(hex / 0xc);
  let octave = multiplier - 0x2;
  octave = octave.toString(10);

  if (multiplier > 0) {
    hex = hex - multiplier * 0xc;
  }

  let note = midiNoteMap[hex];
  return `${note}${octave}`;
};

var _default = hexToNote;
exports.default = _default;
//# sourceMappingURL=noteMap.js.map