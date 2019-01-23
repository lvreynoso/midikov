"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Category.js
// just a list of categories
const Schema = _mongoose.default.Schema;
const CategorySchema = new Schema({
  entries: [String]
});

const Category = _mongoose.default.model('Category', CategorySchema);

var _default = Category;
exports.default = _default;
//# sourceMappingURL=Category.js.map