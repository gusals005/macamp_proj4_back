var express = require('express');
var router = express.Router();

var mongoClient = require('mongodb').MongoClient;
var db_name = 'madcamp_project4';
var mydb = null;
var collection_name = null;
var collection;

/* GET home page. */
router.get('/', function(req, res, next) {
  collection_name = 'test'

    mongoClient.connect('mongodb://localhost/', function(error, client){
        if (error) {
            console.log(error);
        } else {
            console.log("connected: " + db_name);
            mydb = client.db(db_name);

            collection = mydb.collection(collection_name);
            collection.find({}).toArray(function(err, results){
                res.status(200).json({'myCollection' : results});
              });

            //////////// For DEBUG //////
            var cursor = mydb.collection(collection_name).find();
            cursor.each(function (err, doc) {
                if (err) {
                    console.log(err);
                }
                else {
                    if (doc != null) {
                        console.log(doc);
                    }
                    else {
                        console.log("END");
                    }
                }
            });
            /////////////////////////////

        } 
    });
  
});

module.exports = router;
