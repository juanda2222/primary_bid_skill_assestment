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
var path = require("path");
var fs = require('fs');
var AwsCli = require('aws-sdk');
var REGION = 'us-east-1';
AwsCli.config.update({ region: REGION });
var s3 = new AwsCli.S3({ apiVersion: '2006-03-01' });
var cloudformation = new AwsCli.CloudFormation({ apiVersion: '2010-05-15' });
var iam = new AwsCli.IAM({ apiVersion: '2010-05-08' });
var AwsAdmin = (function () {
    function AwsAdmin() {
    }
    AwsAdmin.config_project = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                AwsCli.config.loadFromPath(path.resolve(__dirname + "/../../credentials/aws_config.json"));
                return [2, true];
            });
        });
    };
    AwsAdmin.get_buckets_list = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (fulfill, reject) {
                        s3.listBuckets(function (err, data) {
                            if (err) {
                                console.log("Error", err);
                                reject("Error! " + err);
                            }
                            else {
                                console.log("Buckets retrieved! info:", data);
                                fulfill(data.Buckets);
                            }
                        });
                    })];
            });
        });
    };
    AwsAdmin.create_bucket = function (bucket_name) {
        return __awaiter(this, void 0, void 0, function () {
            var bucketParams;
            return __generator(this, function (_a) {
                bucketParams = {
                    Bucket: bucket_name
                };
                return [2, new Promise(function (fulfill, reject) {
                        s3.createBucket(bucketParams, function (err, data) {
                            if (err) {
                                console.log("Error", err);
                                reject(false);
                            }
                            else {
                                console.log("Success creating! info:", data);
                                fulfill(true);
                            }
                        });
                    })];
            });
        });
    };
    AwsAdmin.delete_bucket = function (bucket_name) {
        return __awaiter(this, void 0, void 0, function () {
            var bucketParams;
            return __generator(this, function (_a) {
                bucketParams = {
                    Bucket: bucket_name
                };
                return [2, new Promise(function (fulfill, reject) {
                        s3.deleteBucket(bucketParams, function (err, data) {
                            if (err) {
                                console.log("Error", err);
                                reject(false);
                            }
                            else {
                                console.log("Success deleting!", data);
                                fulfill(true);
                            }
                        });
                    })];
            });
        });
    };
    AwsAdmin.upload_file = function (file_path, bucket_name) {
        return __awaiter(this, void 0, void 0, function () {
            var uploadParams, fileStream;
            return __generator(this, function (_a) {
                uploadParams = { Bucket: bucket_name, Key: '', Body: '' };
                fileStream = fs.createReadStream(file_path);
                fileStream.on('error', function (err) {
                    console.log('File Error', err);
                });
                uploadParams.Body = fileStream;
                uploadParams.Key = path.basename(file_path);
                return [2, new Promise(function (fulfill, reject) {
                        s3.upload(uploadParams, function (err, data) {
                            if (err) {
                                console.log("Error", err);
                                reject(false);
                            }
                            if (data) {
                                console.log("File info", data);
                                fulfill(true);
                            }
                        });
                    })];
            });
        });
    };
    AwsAdmin.read_file_from_bucket = function (file_basename, bucket_name) {
        return __awaiter(this, void 0, void 0, function () {
            var downloadParams;
            return __generator(this, function (_a) {
                downloadParams = {
                    Bucket: bucket_name,
                    Key: file_basename
                };
                return [2, new Promise(function (fulfill, reject) {
                        s3.getObject(downloadParams, function (err, data) {
                            if (err) {
                                console.log(err);
                                reject(err);
                            }
                            else {
                                console.log("File readed!");
                                console.log(data);
                                fulfill(data.Body.toString("utf-8"));
                            }
                        });
                    })];
            });
        });
    };
    return AwsAdmin;
}());
if (module === require.main) {
    AwsAdmin.config_project();
    AwsAdmin.create_bucket("personal-secret-files");
    AwsAdmin.create_bucket("unique-testbucket-12345");
    var secrets_file_path = path.normalize(__dirname + "/../../credentials/secrets.json");
    AwsAdmin.upload_file(secrets_file_path, "personal-secret-files");
}
module.exports = AwsAdmin;
