"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// MIDIFile.js
// Model for storing our music in the form of MIDI files
// straight binary data
const Schema = _mongoose.default.Schema;
const MIDISchema = new Schema({
  title: {
    type: String,
    required: true
  },
  library: {
    type: Boolean,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  data: Buffer
});

const MIDIFile = _mongoose.default.model('MIDIFile', MIDISchema);

var _default = MIDIFile;
exports.default = _default;
//# sourceMappingURL=MIDIFile.js.map