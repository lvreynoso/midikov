"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.regexp.to-string");

var _express = _interopRequireDefault(require("express"));

var _fs = _interopRequireDefault(require("fs"));

var _MIDIFile = _interopRequireDefault(require("../models/MIDIFile.js"));

var _midifile = _interopRequireDefault(require("midifile"));

var _midievents = _interopRequireDefault(require("midievents"));

var _readMidi = _interopRequireDefault(require("../lib/read-midi.js"));

var _writeMidi = _interopRequireDefault(require("../lib/write-midi.js"));

var _transformMidi = _interopRequireDefault(require("../lib/transform-midi.js"));

var _generateMidi = _interopRequireDefault(require("../lib/generate-midi.js"));

var _assemble = _interopRequireDefault(require("../lib/assemble.js"));

var _generateMap = _interopRequireDefault(require("../lib/generate-map.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// generate.js
// app
const generate = _express.default.Router(); // disk i/o


generate.post('/', async (req, res) => {
  // pull the midi from the database
  const category = req.body.category;
  const query = {
    category: category
  };
  const testMidiDBObjects = await _MIDIFile.default.find(query).catch(err => {
    console.log(err);
  });
  const midiObjects = testMidiDBObjects.map(dbEntry => {
    const convertedMidi = (0, _readMidi.default)(dbEntry.data);
    const deconstructedMidi = (0, _transformMidi.default)(convertedMidi);
    return deconstructedMidi;
  }); // test with order 1

  let markovData = (0, _generateMap.default)(midiObjects, 1, category);
  let generatedSong = (0, _generateMidi.default)(markovData, 1, category);
  let generatedMidi = (0, _assemble.default)(generatedSong); // get all midis from a category
  // const categoryMidis = await MIDIFile.find(query).catch(err => { console.log(err) });
  // fake it until you make it...
  // const randomMidi = categoryMidis[Math.floor(Math.random() * categoryMidis.length)]
  // const sacrificedMidi = readMIDI(randomMidi.data);
  // const transformMIDIdata = transformMIDI(sacrificedMidi);
  // const frankenSong = assembleMIDI(transformMIDIdata);
  // const frankenSongBinary = Buffer.from(frankenSong.getContent());
  //
  // const generatedHex = frankenSongBinary.toString('hex');

  const generatedBinary = Buffer.from(generatedMidi.getContent());
  const generatedHex = generatedBinary.toString('hex'); // write it to a file
  // let path = 'public/temp/test.midi';
  // let writeStream = fs.createWriteStream(path);
  // writeStream.write(generatedHex, 'hex');
  // writeStream.on('finish', () => {
  //     console.log('Wrote data to file.');
  // })
  // writeStream.close();

  let randomInt = Math.floor(Math.random() * 100); // send the data

  const generatedObject = {
    title: `${category} - Generated id${randomInt}`,
    hex: generatedHex,
    path: '/temp/test.midi'
  };
  const generatedJSON = JSON.stringify(generatedObject);
  res.status(200).send(generatedJSON);
}); // test Markov generation

generate.get('/test', async (req, res) => {
  // pull test midi from the data base
  const testCategory = 'test';
  const query = {
    category: testCategory
  };
  const testMidiDBObjects = await _MIDIFile.default.find(query).catch(err => {
    console.log(err);
  });
  let markovSources = testMidiDBObjects.map(midi => {
    let midiJSON = (0, _readMidi.default)(midi.data);
    return midiJSON;
  });
  let generatedMidi = (0, _generateMidi.default)(markovSources);
  let generatedMidiBinary = Buffer.from(generatedMidi.getContent());
  (0, _writeMidi.default)(generatedMidiBinary, 'test_generate');
  res.render('test');
}); // testing:
// --> read midi from database
// --> write midi to file

generate.get('/write-test', async (req, res) => {
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

  res.render('test');
});
var _default = generate;
exports.default = _default;
//# sourceMappingURL=generate.js.map