"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var cors = require('cors');
var uuidv4 = require('uuid').v4;
var ConfigureServer_1 = __importDefault(require("./modules/ConfigureServer"));
var CorsConfig = require("./modules/CorsConfig");
var ShortUrl = require('./routes/api/ShortUrl');
var app = express();
ConfigureServer_1.default.configureSecretFiles(app);
var router = express.Router();
var sesion_config = {
    secret: "secret text hoo",
    genid: function () {
        return uuidv4().replace(/-/gi, "");
    },
    resave: false,
    saveUninitialized: true,
    cookie: {
        sameSite: false,
        secure: false,
        maxAge: 120000
    }
};
app.use(session(sesion_config));
app.use(express.json());
app.use(cors(CorsConfig));
app.use(function (req, res, next) {
    if (!req.session) {
        return next(new Error('Session not defined'));
    }
    if (!req.session.user_id) {
        req.session.user_id = uuidv4();
        console.debug("New user in the town!: ", req.session.user_id);
    }
    var url = req.url;
    console.debug("Session id:", req.session.id);
    console.debug({ url: url });
    next();
});
app.use('/api/shorturl', ShortUrl);
if ((process.argv[2] == "-T") || (process.argv[2] == "--test")) {
    process.env.NODE_ENV = 'test_production';
}
if ((process.env.NODE_ENV === 'production') || (process.env.NODE_ENV === 'test_production')) {
    console.log("Production env detected");
    app.set('trust proxy', 1);
    app.use(express.static(__dirname + '/public/'));
    app.get(/.*/, function (req, res) { return res.sendFile(__dirname + '/public/index.html'); });
}
var port = process.env.PORT || 5000;
app.listen(port, function () { return console.log("Server started on port " + port); });
exports.default = {};
