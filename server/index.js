
const express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

//custom modules:
const ConfigureServer = require("./modules/ConfigureServer.js")

const app = express();

//configure the app:
ConfigureServer.configureSecretFiles(app)

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

var sesion_config = {
  secret: "secret text",
  //user_id: uuidv4().replace(/-/gi,""), //replace all the - symbols with nothing
  saveUninitialized: true,
  resave: false,
  cookie: {}
}

// Handle production
if (process.env.NODE_ENV === 'production') {

  // production middleware
  app.set('trust proxy', 1) // trust first proxy
  sesion_config.cookie.secure = true // serve secure cookies
  
  // Static folder
  app.use(express.static(__dirname + '/public/'));

  // Handle SPA
  app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
}

// more Middleware
app.use(session(sesion_config))

// rutes
const ShortUrl = require('./routes/api/ShortUrl.js');
app.use('/api/ShortUrl', ShortUrl);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
