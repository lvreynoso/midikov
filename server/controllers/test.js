"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/web.dom.iterable");

var _express = _interopRequireDefault(require("express"));

var _fs = _interopRequireDefault(require("fs"));

var _MIDIFile = _interopRequireDefault(require("../models/MIDIFile.js"));

var _midifile = _interopRequireDefault(require("midifile"));

var _midievents = _interopRequireDefault(require("midievents"));

var _readMidi = _interopRequireDefault(require("../lib/read-midi.js"));

var _writeMidi = _interopRequireDefault(require("../lib/write-midi.js"));

var _transformMidi = _interopRequireDefault(require("../lib/transform-midi.js"));

var _generateMidi = _interopRequireDefault(require("../lib/generate-midi.js"));

var _analyze = _interopRequireDefault(require("../lib/analyze.js"));

var _assemble = _interopRequireDefault(require("../lib/assemble.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// test.js
// app
const test = _express.default.Router(); // disk i/o


// landing page
test.get('/', (req, res) => {
  res.render('test');
});
test.get('/assemble', async (req, res) => {
  // pull test midi from the data base
  const testCategory = 'test';
  const query = {
    category: testCategory
  };
  const testMidiDBObjects = await _MIDIFile.default.find(query).catch(err => {
    console.log(err);
  });
  let testMidi = (0, _readMidi.default)(testMidiDBObjects[0].data);
  let testNotes = (0, _transformMidi.default)(testMidi);
  let assembledMidi = (0, _assemble.default)(testNotes); // the 'assembled' midi

  let filename = `assemble_test`;
  let binaryMidiData = Buffer.from(assembledMidi.getContent());
  (0, _writeMidi.default)(binaryMidiData, filename); // the original midi

  let originalMidiData = Buffer.from(testMidi.getContent());
  (0, _writeMidi.default)(originalMidiData, 'original_test');
  res.redirect('/test');
});
test.get('/transform', async (req, res) => {
  // pull test midi from the data base
  const testCategory = 'test';
  const query = {
    category: testCategory
  };
  const testMidiDBObjects = await _MIDIFile.default.find(query).catch(err => {
    console.log(err);
  });
  let testMidi = (0, _readMidi.default)(testMidiDBObjects[0].data);
  let testNotes = (0, _transformMidi.default)(testMidi);
  testNotes.forEach(notes => {
    console.log(notes.length);
  }); // console.log(testNotes);

  res.redirect('/test');
});
test.get('/analyze', async (req, res) => {
  // pull test midi from the data base
  const testCategory = 'test';
  const query = {
    category: testCategory
  };
  const testMidiDBObjects = await _MIDIFile.default.find(query).catch(err => {
    console.log(err);
  });
  let testMidi = (0, _readMidi.default)(testMidiDBObjects[0].data);
  let analyzedMIDI = (0, _analyze.default)(testMidi);
  res.redirect('/test');
}); // testing:
// --> read midi from database
// --> write midi to file

test.get('/write', async (req, res) => {
  // pull test midi from the data base
  const testCategory = 'test';
  const query = {
    category: testCategory
  };
  const testMidiDBObjects = await _MIDIFile.default.find(query).catch(err => {
    console.log(err);
  });
  let name = '_pianized_';
  let counter = 1;
  testMidiDBObjects.forEach(midi => {
    let filename = `${counter}${name}${midi.title}`;
    (0, _writeMidi.default)(midi.data, filename);
    counter += 1;
  }); // let testMidi = readMIDI(testMidiDBObjects[0].data);
  // let transformedMIDI = transformMIDI(testMidi);
  // writeMIDI(testMIDI);

  res.redirect('/test');
});
var _default = test;
exports.default = _default;
//# sourceMappingURL=test.js.map