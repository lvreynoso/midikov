"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.regexp.split");

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
  const order = parseInt(req.body.order.split(' ')[1], 10);
  console.log(order);
  const query = {
    category: category
  };
  const categoryMidiDBObjects = await _MIDIFile.default.find(query).catch(err => {
    console.log(err);
  });
  const midiObjects = categoryMidiDBObjects.map(dbEntry => {
    const convertedMidi = (0, _readMidi.default)(dbEntry.data);
    const deconstructedMidi = (0, _transformMidi.default)(convertedMidi);
    return deconstructedMidi;
  });
  let failed = false;
  let generatedHex = '';

  try {
    // console.log(midiObjects);
    const markovData = (0, _generateMap.default)(midiObjects, order, category);
    const generatedSong = (0, _generateMidi.default)(markovData, order, category);
    const generatedMidi = (0, _assemble.default)(generatedSong);
    const generatedBinary = Buffer.from(generatedMidi.getContent());
    generatedHex = generatedBinary.toString('hex'); // write it to a file
    // let path = 'public/temp/test.midi';
    // let writeStream = fs.createWriteStream(path);
    // writeStream.write(generatedHex, 'hex');
    // writeStream.on('finish', () => {
    //     console.log('Wrote data to file.');
    // })
    // writeStream.close();
  } catch (error) {
    console.log(error);
    failed = true;
  } finally {
    if (failed) {
      res.status(500);
    } else {
      // send the data
      const generatedObject = {
        title: `${category} - Generated Order ${order}`,
        hex: generatedHex,
        path: '/temp/test.midi'
      };
      const generatedJSON = JSON.stringify(generatedObject);
      res.status(200).send(generatedJSON);
    }
  }
});
var _default = generate;
exports.default = _default;
//# sourceMappingURL=generate.js.map