const express = require('express');
const mongodb = require('mongodb');

const router = express.Router();
const Database = require("../../modules/Database.js")

// Get Posts
router.get('/', async (req, res) => {
  const posts = await loadPostsCollection();
  res.send(await posts.find({}).toArray());
});

// Add Post
router.post('/', async (req, res) => {
  const posts = await loadPostsCollection();
  await posts.insertOne({
    text: req.body.text,
    createdAt: new Date()
  });
  res.status(201).send();
});

// Delete Post
router.delete('/:id', async (req, res) => {
  const posts = await loadPostsCollection();
  await posts.deleteOne({ _id: new mongodb.ObjectID(req.params.id) });
  res.status(200).send({});
});

async function loadPostsCollection() {

  // get the secret data
  const secrets_path = path.normalize(__dirname+"/../../../credentials/secrets.json")
  const secrets = JSON.parse(fs.readFileSync(secrets_path))

  // initialize the manager and helper shared vars
  const database = new Database(secrets.db_user, secrets.db_password)

  const client = await mongodb.MongoClient.connect(
    'mongodb://YOUR_OWN_MONGODB',
    {
      useNewUrlParser: true
    }
  );

  return client.db('vue_express').collection('posts');
}

module.exports = router;
