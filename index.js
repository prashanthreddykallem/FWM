var express = require('express');
var app = express();
var mongoose = require('mongoose');
var Promise = require('promise');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var formidable = require('formidable'); 
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var ObjectID = require('mongodb').ObjectID;


app.use(flash());
app.use(session({secret: "Secret Cat!" , resave: true,
    saveUninitialized: true
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));




var url = "mongodb://localhost:27017/users";
mongoose.connect('mongodb://localhost/users');
const Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var workshopSchema = new Schema({ 
                  Title: String,
                  Duration :String,
                  Organized : String,
                  Sponsored : String,
                  Fee : String,                  
                              });


const UserDetail = new Schema({
      username: String,
      password: String
    });
const FacultyDetail = new Schema({
      // _id : ObjectId, 
      name : String,
      username:String,
      department : String,
      workshops : [workshopSchema]


})    
const UserDetails = mongoose.model('loginData', UserDetail, 'loginData');
const FacultyDetails= mongoose.model('faculty',FacultyDetail,'faculty');
// var Fdetails = new Facultydetails; 
var recordDetails
var myresult
var result

app.set('view engine', 'pug');
app.set('views','./views');  
app.use(passport.initialize());
app.use(passport.session());


app.get('/index',function(req,res){

    res.render('home');
         
    


});

app.get('/login',function(req,res){

    res.render("login");

    // res.send("This is login page");


});

app.get('/register',function(req,res){

  res.render("register")

});

app.post('/submitRegister',function(req,res){
  
  
  var newUser = UserDetails({username:req.body.username,
                         password:req.body.password })
                          

  var newFaculty= FacultyDetails({
    username   : req.body.username,
    name       : req.body.name,
    department : req.body.dept,  
    workshops : []
  })
   newFaculty.save(); 
   newUser.save();    
   res.send("Submitted Successfully");

                         

});
// app.get('/profile',function(req,resabc){
//     var abc = FacultyDetails.findOne({},function(err,res){
//       var hjk= res
//       // console.log(res);
//       resabc.render("profile",{
//         name:JSON.stringify(hjk),        
//       } );
    
//   }) 
    
    
// });

app.get('/hello',function(req,res){

    res.send("Hello World");
});

app.get('/addDetails/:user',function(req,res){
    var user = req.params.user ;

    res.render("addDetails",{
        name:JSON.stringify(user),        
      } );



})

app.post('/submitAdd',function(req,res){
  var insertObj =  {
                    _id       : new ObjectID(),   
                    Title     : req.body.title,
                    Duration  : req.body.duration,
                    Organized : req.body.organized,
                    Sponsored : req.body.sponsored,
                    Fee       : req.body.fees 
                } ;
 console.log(insertObj)               

  //  Fdetails.name("ABC").workshops.push(insertObj)             

MongoClient.connect(url,function(err,db){
if(err) throw err;
var dbo = db.db("users");


dbo.collection("faculty").update(
   { name: req.body.username },
   { $push:{workshops: insertObj  }}
)


})

res.send("Hello")

})

app.get('/edit/:user/:title',function(req,resEdit){
  var title = req.params.title
  var uid = req.params.user
  console.log(title);
  var abc = FacultyDetails.find({ username: uid},{ workshops: { $elemMatch: { Title: title } } },function(err,res){
      var hjk= res[0].workshops[0]
      console.log(hjk);
      resEdit.render("edit",{
        workshopDetails:JSON.stringify(hjk),
        username:uid
      })
      // resabc.render("profile",{
      //   name:JSON.stringify(hjk),        
      // } );
    
  }) 

});

app.get('/upload/:user/:id',function(req,resUpl){
  var Wid = req.params.id
  var abc = FacultyDetails.find({$or:[{UID : Wid}]},function(err,res){
      var hjk= res[0].workshops[0]
      console.log(hjk);
      resUpl.render("upl",{
        workshopDetails:JSON.stringify(hjk)
      })
  })

});
app.post('/submitEdit',function(req,res){
  var editObj =  {
                    // _id       : new ObjectID(),   
                    Title     : req.body.title,
                    Duration  : req.body.duration,
                    Organized : req.body.organized,
                    Sponsored : req.body.sponsored,
                    Fee       : req.body.fees 
                } ;
//  console.log(insertObj)               

  //  Fdetails.name("ABC").workshops.push(insertObj)             

MongoClient.connect(url,function(err,db){
if(err) throw err;
var dbo = db.db("users");

console.log(req.body.id)
dbo.collection("faculty").update(
   { name: req.body.username,"workshops.Title":req.body.title },
   { $set:{"workshops.$.Title"      : req.body.title,
            "workshops.$.Duration"  : req.body.duration,
            "workshops.$.Organized" : req.body.organized,
            "workshops.$.Sponsored" : req.body.sponsored,
            "workshops.$.Fee"       : req.body.fees                              }}
)
   
  
});
res.send("Hello World")
})

app.post('/fileUpload',function(req,res){
  var form = new formidable.IncomingForm();

    form.parse(req);

    form.on('fileBegin', function (name, file){
        file.path = __dirname + '/uploads/' + file.name;
    });

    form.on('file', function (name, file){
        console.log('Uploaded ' + file.name);
    });

    res.render('uplSuccess');


});


app.get('/success', (req, res) => res.send("Welcome "+req.query.username+"!!"));
app.get('/error', (req, res) =>res.send("Fail") );// res.send("error logging in"));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  UserDetails.findById(id, function(err, user) {
    cb(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    UserDetails.findOne({
        username: username
      }, function(err, user) {
        
        if (err) {
          return done(err);
        }

        if (!user) {
          return done(null, false,{message:'Incorrect Username'});
        }

        if (user.password != password) {
          return done(null, false,{message:'Incorrect Password'});
        }
        return done(null, user);
      });
  }
));

app.post('/loginT',
  passport.authenticate('local', { failureRedirect: '/error' }),
  function(req, resabc) {
    if((req.user.username)=='admin'){
      var abc = FacultyDetails.find({},function(err,res){
         var hjk= res
      var abc = req.user.username
      console.log(hjk);
      resabc.render("profile",{
        name:JSON.stringify(hjk),        
      } );

    } )
   }
   else { 
   var abc = FacultyDetails.findOne({$or:[{username : req.user.username}]},function(err,res){
      var hjk= res
      var abc = req.user.username
      console.log(hjk);
      resabc.render("profile",{
        name:JSON.stringify(hjk),        
      } );
   
  }) 
    
   }  
});

  

app.get('*', function(req, res){
   res.send('Sorry, this is an invalid URL.');
});



app.listen(3000);
