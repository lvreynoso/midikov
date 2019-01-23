'use strict'; // environment setup

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dotenv = _interopRequireDefault(require("dotenv"));

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _expressHandlebars = _interopRequireDefault(require("express-handlebars"));

var _expressValidator = _interopRequireDefault(require("express-validator"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _index = _interopRequireDefault(require("./controllers/index.js"));

var _admin = _interopRequireDefault(require("./controllers/admin.js"));

var _generate = _interopRequireDefault(require("./controllers/generate.js"));

var _test = _interopRequireDefault(require("./controllers/test.js"));

var _database = _interopRequireDefault(require("./database/database.js"));

var _exphbsConfig = _interopRequireDefault(require("./config/exphbs-config.js"));

var _checkAuth = _interopRequireDefault(require("./lib/check-auth.js"));

var _checkCookie = _interopRequireDefault(require("./lib/check-cookie.js"));

var _checkCategoryList = _interopRequireDefault(require("./lib/check-category-list"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const result = process.env.NODE_ENV == 'development' ? _dotenv.default.config() : false; // dependencies

const exphbs = _expressHandlebars.default.create(_exphbsConfig.default); // middleware


// set our express options
const app = (0, _express.default)();
app.set('port', process.env.PORT || 3000);
app.use(_bodyParser.default.urlencoded({
  extended: true
}));
app.use(_bodyParser.default.json());
app.use(_express.default.static('public'));
_express.default.static.mime.types['wasm'] = 'application/wasm';
app.use((0, _expressValidator.default)());
app.use((0, _cookieParser.default)());
app.use(_checkCookie.default); // set our view engine

app.engine('handlebars', exphbs.engine);
app.set('view engine', 'handlebars'); // routes

app.use('/', _index.default);
app.use('/admin', _admin.default);
app.use('/generate', _generate.default);
app.use('/test', _test.default); // face the world

const hotPort = app.get('port');
const server = app.listen(hotPort, () => {
  console.log(`App listening on port ${hotPort}!`);
}); // check for a master category list

(0, _checkCategoryList.default)(); // for Mocha/Chai test purposes

var _default = server;
exports.default = _default;
//# sourceMappingURL=server.js.map