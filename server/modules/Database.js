
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;


const root_url = "https://pbid.io/"

class Database {

    constructor(user, password){

        // check for credentials (always needed)
        if (!user){ throw "Use a USER to connect ot the db"}
        if (!password){ throw "Use a PASSWORD to connect to the database"}
        
        // use 2 databases to test data flow before production
        if (process.env.NODE_ENV === 'production'){
            const db_name = "personal_db"
            this._uri = `mongodb+srv://${user}:${password}@cluster0-qvs2p.gcp.mongodb.net/${db_name}?retryWrites=true&w=majority`;                
        
        // use test credentials to connect to the test db
        } else{
            const db_name = "personal_db"
            this._uri = `mongodb+srv://${user}:${password}@cluster0-qvs2p.gcp.mongodb.net/${db_name}?retryWrites=true&w=majority`;                
        }
        
        this.client = null
        this._db = null

    }
    isConnected(){
        return this._db.serverConfig.isConnected()
    }
    async connect(){

        this.client = new MongoClient(this._uri, { useUnifiedTopology: true } );

        return new Promise((fulfill, reject) =>  {

            // this operation is safe to call various times
            this.client.connect( (err) => {
                if(err) { 
                    console.log(`Error connecting mongodb: ${err}`)
                    reject(`Error connecting mongodb: ${err}`)
                }else{
                    this._db = this.client.db('personal_db')
                    //this._urlCollection = this.client.db('personal_db').collection('urlShortened')
                    fulfill()
                }
            });
        })
    }

    async close (){
        // this operation is safe to call various times
        await this.client.close();
    }
    
    async create_url_entry( userId, urlId, url ) {
        if (!this.isConnected){ throw "Connect first to the database"}

        // url prototype data
        var document = { 
            urlId: urlId, 
            url: url,
            userId: userId,
            createdAt: new Date()
        };

        // insert one doc
        const op_result = await this._db.collection('urlShortened').insertOne(document);
        return op_result

    }

    async delete_url_entry(doc_id) {
        if (!this.isConnected){ throw "Connect first to the database"}
        
        // del the doc
        const op_result = await this._db.collection('urlShortened').deleteOne({ _id: new mongodb.ObjectID(doc_id) });
        return op_result
    }

    async get_all_urls(maximumNumberOfResults) {
        if (!this.isConnected){ throw "Connect first to the database"}
        
        // get all the documents as an array:
        const cursor = this._db.collection("urlShortened")
        .find({})
        .sort({ createdAt: -1 }) // sort by date
        .limit(maximumNumberOfResults);

        return await cursor.toArray();
    }


}

module.exports = Database