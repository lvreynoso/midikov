"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TEST PAD PLEASE IGNORE
const testFunction = () => {
  let object1 = {
    first: 'meow',
    second: 99,
    third: 0xDEADBEEF,
    fourth: 0xff
  };
  let object2 = {
    first: 'meow',
    second: 99,
    third: 0xDEADBEEF,
    fourth: 0xff
  };
  let object3 = {
    first: 'pow',
    second: 98,
    third: 0xDEADBEE,
    fourth: 0xee
  };

  let firstComparison = _lodash.default.isEqual(object1, object2);

  let secondComparison = _lodash.default.isEqual(object1, object3);

  console.log(`Lodash result should be true: ${firstComparison}`);
  console.log(`Lodash result should be false: ${secondComparison}`);
};

var _default = testFunction;
exports.default = _default;
//# sourceMappingURL=testpad.js.map