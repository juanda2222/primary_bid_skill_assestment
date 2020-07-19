const express = require('express');
const mongodb = require('mongodb');
const path = require("path")

const { v4: uuidv4 } = require('uuid');

const Database = require("../../modules/Database.js")

const router = express.Router();

// Get URLs
router.get('/', async (req, res) => {
  console.log("Session id:", req.session.id)

  if (!req.session.user_id){
    req.session.user_id = uuidv4()
    console.log("New user in the town!: ", req.session.user_id)
  }
  const database = await loadUrlDatabase(req.app.locals.secrets);
  const url_list = await database.get_all_urls(20)
  const formatted_urls = url_list.map(( url_object )=>({
    ...url_object,
    short_url: `https://pbid.io/${url_object.urlId}`
  }))
  res.send(formatted_urls);

});

// Add URL
router.post('/', async (req, res) => {
  console.log("Session id:", req.session.id)

  if (!req.session.user_id){
    req.session.user_id = uuidv4()
    console.log("New user in the town!: ", req.session.user_id)
  }

  // extract the part that uses the fastest digits of the time to create the url_id
  const url_id = uuidv4().substring(0, 8) 

  //check if the uuid is already present in a document (unlikely to happen)

  //save to the database the entry
  const database = await loadUrlDatabase(req.app.locals.secrets);
  const result = await database.create_url_entry(req.session.user_id, url_id, req.body.url)
  res.status(201).send(result.ops[0]);

});

// Delete URL
router.delete('/:id', async (req, res) => {

  const database = await loadUrlDatabase(req.app.locals.secrets);
  await database.delete_url_entry(req.params.id);
  res.status(200).send({});
  
});

async function loadUrlDatabase(secrets) {

  // initialize the manager and helper shared vars
  const database = new Database(secrets.db_user, secrets.db_password)
  await database.connect()
  return database

}

module.exports = router;
