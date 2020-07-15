
const MongoClient = require('mongodb').MongoClient;

class Database {
    constructor(user, password){

        // check for credentials (always needed)
        if (!user){ throw "Use a USER to connect ot the db"}
        if (!password){ throw "Use a PASSWORD to connect to the database"}
        
        const db_name = "personal_db"
        this.uri = `mongodb+srv://${user}:${password}@cluster0-qvs2p.gcp.mongodb.net/${db_name}?retryWrites=true&w=majority`;
        this.client = null

    }
    async connect(){
        //this.client = await MongoClient.connect(this.uri, { useNewUrlParser: true });
        //if (!this.client) {
        //    throw "Error connecting to mongo db"
        //}

        this.client = new MongoClient(this.uri, { useUnifiedTopology: true } );

        return new Promise((fulfill, reject) =>  {
            this.client.connect( (err) => {
                if(err) { 
                    console.log(`Error connecting mongodb: ${err}`)
                    reject(`Error connecting mongodb: ${err}`)
                }else{
                    fulfill(true)
                }
            });
        })
    }

    close(){
        this.client.close();
    }
    
    get_urls(params) {
        return
    }


}

module.exports = Database