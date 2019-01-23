"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es6.regexp.replace");

require("core-js/modules/web.dom.iterable");

var _express = _interopRequireDefault(require("express"));

var _multer = _interopRequireDefault(require("multer"));

var _MIDIFile = _interopRequireDefault(require("../models/MIDIFile.js"));

var _Category = _interopRequireDefault(require("../models/Category.js"));

var _readMidi = _interopRequireDefault(require("../lib/read-midi.js"));

var _pianize = _interopRequireDefault(require("../lib/pianize.js"));

var _midifile = _interopRequireDefault(require("midifile"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// admin.js
const admin = _express.default.Router();

const storage = _multer.default.memoryStorage();

const upload = (0, _multer.default)({
  storage: storage
}); // model

admin.get('/', (req, res) => {
  const currentUser = req.user;
  res.render('admin', {
    currentUser
  });
});
admin.post('/upload', upload.array('midis', 64), async (req, res) => {
  const category = req.body.category; // update category master list

  let categoryMasterList = await _Category.default.findOne({}).catch(err => {
    console.log(err);
  });
  let categorySet = new Set(categoryMasterList.entries);
  categorySet.add(category);
  let newCategories = Array.from(categorySet);
  categoryMasterList.entries = newCategories;
  categoryMasterList.save().catch(err => {
    console.log(err);
  }); // process files

  req.files.forEach(async file => {
    let newMidi = new _MIDIFile.default();
    console.log(`Processing ${file.originalname}`); // let re = /^(.+)(\.[^ .]+)?$/g;

    let re = /(\.[^ .]+)?$/g;
    let regexedTitle = file.originalname.replace(re, '');
    newMidi.title = regexedTitle;
    newMidi.library = true;
    newMidi.category = category; // pianize the MIDI file

    let midiJS = (0, _readMidi.default)(file.buffer);
    let pianoVersion = (0, _pianize.default)(midiJS);
    newMidi.data = Buffer.from(pianoVersion.getContent());
    newMidi.save().catch(err => {
      console.log(err);
    });
  });
  res.redirect('/admin');
});
var _default = admin;
exports.default = _default;
//# sourceMappingURL=admin.js.map