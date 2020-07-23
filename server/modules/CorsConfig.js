"use strict";
var allowedOrigins = [
    'http://localhost:5000',
    'http://localhost:8080',
    'https://myurl.com'
];
module.exports = {
    optionsSuccessStatus: 200,
    origin: function (origin, callback) {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        }
        else {
            callback(new Error('The CORS policy for this site does not ' +
                'allow access from the specified Origin.'));
        }
    }
};
