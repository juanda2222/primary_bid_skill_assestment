
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

//custom modules:
const ConfigureServer = require("./modules/ConfigureServer.js")

const app = express();

//configure the app:
ConfigureServer.configureSecretFiles(app)

// Middleware
app.use(bodyParser.json());
app.use(cors());

// rutes
const shortUrl = require('./routes/api/shortUrl');
app.use('/api/shortUrl', shortUrl);

// Handle production
if (process.env.NODE_ENV === 'production') {
  
  // Static folder
  app.use(express.static(__dirname + '/public/'));

  // Handle SPA
  app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
