var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/users"; 

MongoClient.connect(url,function(err,db){
if(err) throw err;
var dbo = db.db("users");
var insertObj =  {
                    Title     : "RST 2",
                    Duration  : "3 months",
                    Organized : "ABC 2",
                    Sponsored : "HJKL 2",
                    Fee       : 5000 
                } ;

dbo.collection("faculty").update(
   { name: "XYZ" },
   { $push:{workshops: insertObj  }}
)


})



