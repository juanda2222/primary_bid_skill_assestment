

var allowedOrigins = [
    'http://localhost:5000', //back port
    'http://localhost:8080', //front start port
    'https://myurl.com' //my domain name
]; 

module.exports = {
  
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    origin: (origin, callback) => {
        // allow requests with no origin (like mobile apps or curl requests)
        if(!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('The CORS policy for this site does not ' +
            'allow access from the specified Origin.'))
        }
    }
}