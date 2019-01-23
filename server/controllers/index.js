"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/web.dom.iterable");

var _express = _interopRequireDefault(require("express"));

var _Category = _interopRequireDefault(require("../models/Category.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// index.js
const index = _express.default.Router(); // model


index.get('/', async (req, res) => {
  const currentUser = req.user;
  let categoryList = await _Category.default.findOne({}).catch(err => {
    console.log(err);
  });
  let categories = categoryList.entries;
  res.render('index', {
    currentUser,
    categories
  });
});
var _default = index;
exports.default = _default;
//# sourceMappingURL=index.js.map