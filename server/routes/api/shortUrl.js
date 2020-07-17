const express = require('express');
const mongodb = require('mongodb');
const path = require("path")
const { v4: uuidv4 } = require('uuid');

const Database = require("../../modules/Database.js")

const router = express.Router();

// Get Posts
router.get('/', async (req, res) => {

  if (!req.session.user_id){
    req.session.user_id = uuidv4()
  }
  const database = await loadUrlDatabase(req.app.locals.secrets);
  res.send(await database.get_all_urls(20));

});

// Add Post
router.post('/', async (req, res) => {

  if (!req.session.user_id){
    req.session.user_id = uuidv4()
  }

  // extract the part that uses the fastest digits of the time to create the url_id
  const url_id = uuidv4().substring(0, 8) 

  //check if the uuid is already present in a document (unlikely to happen)

  //save to the database the entry
  const database = await loadUrlDatabase(req.app.locals.secrets);
  await database.create_url_entry(req.session.user_id, url_id, req.body.url)
  res.status(201).send();

});

// Delete Post
router.delete('/:id', async (req, res) => {
  
  if (!req.session.user_id){
    res.status(501).send({error: "user_id session unset"})
    return
  }

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
