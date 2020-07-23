"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var client;
var Database = (function () {
    function Database(user, password) {
        if (!user) {
            throw "Use a USER to connect ot the db";
        }
        if (!password) {
            throw "Use a PASSWORD to connect to the database";
        }
        if (process.env.NODE_ENV === 'production') {
            var db_name = "personal_db";
            this._uri = "mongodb+srv://" + user + ":" + password + "@cluster0-qvs2p.gcp.mongodb.net/" + db_name + "?retryWrites=true&w=majority";
        }
        else {
            var db_name = "personal_db";
            this._uri = "mongodb+srv://" + user + ":" + password + "@cluster0-qvs2p.gcp.mongodb.net/" + db_name + "?retryWrites=true&w=majority";
        }
    }
    Database.prototype.isConnected = function () {
        if (!!client) {
            return client.db('personal_db').serverConfig.isConnected();
        }
        else {
            return false;
        }
    };
    Database.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.isConnected()) {
                    return [2];
                }
                client = new MongoClient(this._uri, { useUnifiedTopology: true });
                return [2, new Promise(function (fulfill, reject) {
                        client.connect(function (err) {
                            if (err) {
                                console.log("Error connecting mongodb: " + err);
                                reject("Error connecting mongodb: " + err);
                            }
                            else {
                                fulfill();
                            }
                        });
                    })];
            });
        });
    };
    Database.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isConnected()) {
                            return [2];
                        }
                        return [4, client.close()];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    Database.prototype.create_url_entry = function (userId, urlId, url) {
        return __awaiter(this, void 0, void 0, function () {
            var document, op_result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isConnected()) {
                            throw "Connect first to the database";
                        }
                        document = {
                            urlId: urlId,
                            url: url,
                            userId: userId,
                            createdAt: new Date()
                        };
                        return [4, client.db('personal_db').collection('urlShortened').insertOne(document)];
                    case 1:
                        op_result = _a.sent();
                        return [2, op_result];
                }
            });
        });
    };
    Database.prototype.delete_url_entry = function (doc_id) {
        return __awaiter(this, void 0, void 0, function () {
            var op_result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isConnected()) {
                            throw "Connect first to the database";
                        }
                        return [4, client.db('personal_db').collection('urlShortened').deleteOne({ _id: new mongodb.ObjectID(doc_id) })];
                    case 1:
                        op_result = _a.sent();
                        return [2, op_result];
                }
            });
        });
    };
    Database.prototype.get_all_urls = function (maximumNumberOfResults) {
        return __awaiter(this, void 0, void 0, function () {
            var cursor;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isConnected()) {
                            throw "Connect first to the database";
                        }
                        cursor = client.db('personal_db').collection("urlShortened")
                            .find({})
                            .sort({ createdAt: -1 })
                            .limit(maximumNumberOfResults);
                        return [4, cursor.toArray()];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Database.prototype.get_urls_by_user_id = function (user_id, maximumNumberOfResults) {
        return __awaiter(this, void 0, void 0, function () {
            var cursor;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (user_id == "undefined") {
                            throw new Error("You must specify a user_id to get the data");
                        }
                        cursor = client.db('personal_db').collection("urlShortened")
                            .find({ userId: user_id })
                            .sort({ createdAt: -1 })
                            .limit(maximumNumberOfResults);
                        return [4, cursor.toArray()];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    return Database;
}());
exports.default = Database;
