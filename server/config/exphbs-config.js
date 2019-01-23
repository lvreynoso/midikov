"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/web.dom.iterable");

// helpers.js
let exphbsConfig = {
  defaultLayout: 'main',
  helpers: {
    // helpers go here
    categoryGenerator: function categoryGenerator(context) {
      console.log(context);
      console.log(context.data.root.categories);
      let elements = context.data.root.categories;
      let output = '';

      if (elements.length > 0) {
        elements.forEach((element, index) => {
          output += `<a href="#" name="category" id="category${index}">${element}</a>`;
        });
      }

      return output;
    }
  }
};
var _default = exphbsConfig;
exports.default = _default;
//# sourceMappingURL=exphbs-config.js.map