var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/users";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
//   console.log("Database created!");
  var dbo = db.db("users");
  var myobj = { name: "XYZ", department:"CSE" , workshops : [
                {
                    Title     : "PQR",
                    Duration  : "3 months",
                    Organized : "ABC",
                    Sponsored : "HJK",
                    Fee       : 3000 
                },
                {
                    Title     : "RST",
                    Duration  : "3 months",
                    Organized : "ABC",
                    Sponsored : "HJKL",
                    Fee       : 4000 
                }




   ]
 };
  dbo.collection("faculty").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });  
  db.close();
});