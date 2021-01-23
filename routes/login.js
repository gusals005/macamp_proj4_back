var express = require('express');
var router = express.Router();

var mongoClient = require('mongodb').MongoClient;
var db_name = 'madcamp_project4';
var mydb = null;
var collection_name = null;
var collection;

/*
    post로 입력한 id와 password 받아와서
    success or fail 로 response 보내면 됨.
    api(post) : /login
*/
router.post('/', function(req, res, next) {
  collection_name = 'user'
    mongoClient.connect('mongodb://localhost/', function(error, client){
        if (error) {
            console.log(error);
        } else {
            console.log("connected: " + db_name);
            mydb = client.db(db_name);

            collection = mydb.collection(collection_name);
            console.log(req.body.id);
            console.log(req.body.password);
            collection.find({"id":req.body.id, "password":req.body.password}).toArray(function(err, result){
                if(err){
                    res.send({"Message":"err"});
                }
                if(result.length > 0){
                    res.send({"Message":"verified"});
                }
                else{
                    res.send({"Message":"fail"});
                }
                
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
