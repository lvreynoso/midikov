"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Category = _interopRequireDefault(require("../models/Category.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// check-category-list.js
const checkCategoryList = async () => {
  const masterList = await _Category.default.findOne({});

  if (!masterList) {
    console.log("No master category list found, initializing...");
    let newMasterList = new _Category.default({
      entries: []
    });
    let result = await newMasterList.save().catch(err => {
      console.log(err);
    });
    console.log('New master list created!');
    console.log(result);
  } else {
    console.log('Master category list found!');
  }
};

var _default = checkCategoryList;
exports.default = _default;
//# sourceMappingURL=check-category-list.js.map