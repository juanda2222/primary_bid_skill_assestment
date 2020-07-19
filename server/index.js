
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var cors = require('cors');
var { v4: uuidv4 } = require('uuid');

//configuration:
const ConfigureServer = require("./modules/ConfigureServer.js")
const CorsConfig = require("./modules/CorsConfig.js")
const ShortUrl = require('./routes/api/ShortUrl.js');
const app = express();

//configure the app:
ConfigureServer.configureSecretFiles(app)

// Middleware
var sesion_config = {
  secret: "secret text hoo",
  genid: function(req) {
    return uuidv4().replace(/-/gi,"") // use UUIDs for session IDs
  },
  //user_id: uuidv4().replace(/-/gi,""), //replace all the - symbols with nothing
  resave: false,
  saveUninitialized: true,
  cookie: {  
    sameSite: (process.env.NODE_ENV === 'production'), 
    secure: (process.env.NODE_ENV === 'production'),//while dev allow http
    maxAge: 120000 /* miliseconds */ 
  } 
}
app.use(session(sesion_config))
app.use(bodyParser.json());
app.use(cors(CorsConfig));



// Handle production
if (process.env.NODE_ENV === 'production') {

  console.log("Production env detected")

  // production middleware
  app.set('trust proxy', 1) // trust first proxy
  
  // Static folder
  app.use(express.static(__dirname + '/public/'));

  // Handle SPA
  app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));

}

app.use(function (req, res, next) {
  if (!req.session) {
    return next(new Error('oh no')) // handle error
  }
  const { url } = req;
  const isCookieSent = req.headers.cookie;
  console.log({ url });
  console.log({ isCookieSent });
  next() // otherwise continue
})


// rutes
app.use('/api/shorturl', ShortUrl);

//start server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
