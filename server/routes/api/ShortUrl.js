"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Database_js_1 = __importDefault(require("../../modules/Database.js"));
var express = require('express');
var uuidv4 = require('uuid').v4;
var router = express.Router();
router.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var url_list, byUser, database, formatted_urls, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                byUser = req.query.byUser;
                return [4, loadUrlDatabase(req.app.locals.secrets)];
            case 1:
                database = _a.sent();
                if (!(byUser === "true")) return [3, 3];
                return [4, database.get_urls_by_user_id(req.session.user_id, 20)];
            case 2:
                url_list = _a.sent();
                return [3, 5];
            case 3: return [4, database.get_all_urls(20)];
            case 4:
                url_list = _a.sent();
                _a.label = 5;
            case 5:
                formatted_urls = url_list.map(function (url_object) { return (__assign(__assign({}, url_object), { short_url: "https://pbid.io/" + url_object.urlId })); });
                response = {
                    UserId: req.session.user_id,
                    Timestamp: Date.now(),
                    UrlList: formatted_urls,
                };
                res.send(response);
                return [2];
        }
    });
}); });
router.post('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var url_id, database, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.session.user_id) {
                    res.status(500).send({ error: "Error, session user_id not defined" });
                    throw new Error("Error, session user_id not defined");
                }
                else if (!req.body.url) {
                    res.status(500).send({ error: "Error, request body.url is not defined" });
                    throw new Error("Error, request body.url is not defined");
                }
                url_id = uuidv4().substring(0, 8);
                return [4, loadUrlDatabase(req.app.locals.secrets)];
            case 1:
                database = _a.sent();
                return [4, database.create_url_entry(req.session.user_id, url_id, req.body.url)];
            case 2:
                result = _a.sent();
                res.status(201).send(result.ops[0]);
                return [2];
        }
    });
}); });
router.delete('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var database;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.params.id) {
                    return [2, res.status(500).send({ error: "Specify an id to delete" })];
                }
                return [4, loadUrlDatabase(req.app.locals.secrets)];
            case 1:
                database = _a.sent();
                return [4, database.delete_url_entry(req.params.id)];
            case 2:
                _a.sent();
                res.status(200).send({});
                return [2];
        }
    });
}); });
function loadUrlDatabase(secrets) {
    return __awaiter(this, void 0, void 0, function () {
        var database;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    database = new Database_js_1.default(secrets.db_user, secrets.db_password);
                    return [4, database.connect()];
                case 1:
                    _a.sent();
                    return [2, database];
            }
        });
    });
}
module.exports = router;
exports.default = router;
