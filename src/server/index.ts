
import { Express } from "./types/ExpressTypes"


var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var cors = require('cors');
var { v4: uuidv4 } = require('uuid');

//configuration:
import ConfigureServer from "./modules/ConfigureServer"
var CorsConfig = require("./modules/CorsConfig")
var ShortUrl = require('./routes/api/ShortUrl');
var app = express();

//configure the app:
var isConfigured = ConfigureServer.configureSecretFiles(app)
var router = express.Router();

// Middleware
var sesion_config = {
  secret: "secret text hoo",
  genid: function() {
    return uuidv4().replace(/-/gi,"") // use UUIDs for session IDs
  },
  //user_id: uuidv4().replace(/-/gi,""), //replace all the - symbols with nothing
  resave: false,
  saveUninitialized: true,
  cookie: {  
    sameSite: false, // (process.env.NODE_ENV === 'production'), 
    secure: false, // (process.env.NODE_ENV === 'production'), //while dev allow http
    maxAge: 120000 /* miliseconds */ 
  } 
}
app.use(session(sesion_config))
app.use(express.json());
app.use(cors(CorsConfig));

//on any request:
app.use(async function (req:Express.Request, res:Express.Response, next:any) {
  
  await isConfigured;

  if (!req.session) {
    return next(new Error('Session not defined')) // handle error
  }

  // initialize user if not available
  if (!req.session.user_id){
    req.session.user_id = uuidv4()
    console.debug("New user in the town!: ", req.session.user_id)
  }

  var { url } = req
  console.debug("Session id:", req.session.id)
  console.debug({ url });
  next() // otherwise continue
})

// rutes
app.use('/api/shorturl', ShortUrl);

if ((process.argv[2] == "-T") || (process.argv[2] == "--test")) {process.env.NODE_ENV = 'test_production'}

// Handle production
if ((process.env.NODE_ENV === 'production') || (process.env.NODE_ENV === 'test_production')){

  console.log("Production env detected")

  // production middleware
  app.set('trust proxy', 1) // trust first proxy
  
  // Static folder
  app.use(express.static(__dirname + '/../public/'));

  // Handle SPA
  app.get(/.*/, (req:Express.Request, res:Express.Response) => res.sendFile(__dirname + '/../public/index.html'));

}


//start server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));

export default {} //required for typescript compatibility