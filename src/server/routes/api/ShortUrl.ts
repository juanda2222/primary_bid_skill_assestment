
import {Express, secrets } from "../../types/ExpressTypes"
import Database from "../../modules/Database"

var express = require('express')
var { v4: uuidv4 } = require('uuid');

var router = express.Router();

// Get URLs
router.get('/', async (req:Express.Request, res:Express.Response) => {
  
  let url_list
  let byUser = req.query.byUser;
  const database = await loadUrlDatabase(req.app.locals.secrets);

  //query by user:
  if (byUser==="true"){
    url_list = await database.get_urls_by_user_id(req.session.user_id, 20)

  // full query
  } else {
    url_list = await database.get_all_urls(20)
  }

  //format the url:
  const formatted_urls = url_list.map(( url_object )=>({
    ...url_object,
    short_url: `https://pbid.io/${url_object.urlId}`
  }))

  const response = {
    UserId: req.session.user_id,
    Timestamp: Date.now(),
    UrlList:formatted_urls,
  }
  //console.debug(response)
  res.send(response);

});

// Add URL
router.post('/', async (req:Express.Request, res:Express.Response)  => {
  
  if (!req.session.user_id) {
    res.status(500).send({ error: "Error, session user_id not defined" })
    throw new Error("Error, session user_id not defined");
  } else if (!req.body.url) {
    res.status(500).send({ error: "Error, request body.url is not defined" })
    throw new Error("Error, request body.url is not defined");
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
router.delete('/:id', async (req:Express.Request, res:Express.Response) => {

  if(!req.params.id){return res.status(500).send({error: "Specify an id to delete"})}
  const database = await loadUrlDatabase(req.app.locals.secrets);
  await database.delete_url_entry(req.params.id);
  res.status(200).send({});

});

async function loadUrlDatabase(secrets: secrets ): Promise<Database> {

  // initialize the manager and helper shared vars
  const database = new Database(secrets.db_user, secrets.db_password)
  await database.connect()
  return database

}

module.exports = router;
export default router