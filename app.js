const MongoDB = require("mongodb");
const { exit } = require("process");

require("dotenv").config();

const url = process.env.MONGO_URI;

const dbName = "easylife_dev"   // later try to iterate over a list of all db names

const client1 = new MongoDB.MongoClient(url);
const client2 = new MongoDB.MongoClient("mongodb://localhost");

let localhost_promise = client2.connect();
client1.connect()
    .then(() => {
        const dbRef = client1.db( dbName );

        dbRef.collections().then(
            (collections) => {
                const flags = []

                collections.forEach( (collection, index) => {
                    flags.push(false);

                    collection.find({}).toArray()
                    .then((docs) => {
                        console.log(`Received ${docs.length} from ${collection.collectionName}`);

                        localhost_promise.then( () => {
                            client2.db( dbName ).collection( collection.collectionName ).insertMany(docs, (err, res) => {
                                flags[index] = true;

                                if(err){
                                    console.error("Error 3", err.code);
                                    return;
                                }

                                if( flags.every( (flag) => flag ) ){
                                    client1.close();
                                    client2.close();                                                        
                                }
                                console.log(`Inserted ${res.insertedCount} into ${collection.collectionName}`);
                            })

                        })
                    }).catch(err => {
                        if( flags.every( (flag) => flag ) ){
                            client1.close();
                            client2.close();                                                        
                        }

                        console.error("Error 1", err);
                        return;
                    })
                })

            }
        )
    })
