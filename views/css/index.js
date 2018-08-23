var express = require('express');
var app = express();
var mongoose = require('mongoose');
var Promise = require('promise');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


var url = "mongodb://localhost:27017/users";
mongoose.connect('mongodb://localhost/users');
const Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
const UserDetail = new Schema({
      username: String,
      password: String
    });
const FacultyDetail = new Schema({
      _id : ObjectId, 
      name : String,
      department : String,
      workshops : Array


})    
const UserDetails = mongoose.model('loginData', UserDetail, 'loginData');
const FacultyDetails= mongoose.model('faculty',FacultyDetail,'faculty');
var details
var recordDetails
var myresult
var result

app.set('view engine', 'pug');
app.set('views','./views');  
app.use(passport.initialize());
app.use(passport.session());

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("users");  
  dbo.collection("faculty").find({}).toArray(function(err, result) {
    return new Promise((resolve, reject) =>{  
    if (err) throw err;
    // console.log(result);
    // resolve(result)
    // details = result[0].workshops ;
    // return details;
    // console.log(result); 
    db.close();
   }); 
  });
  // console.log(result);
  
});
// console.log(result);
app.get('/index',function(req,res){

    res.render('home');
         
    


});

app.get('/login',function(req,res){

    res.render("login");

    // res.send("This is login page");


});

app.get('/profile',function(req,resabc){
    var abc = FacultyDetails.findOne({},function(err,res){
      var hjk= res.workshops
      console.log(res);
      resabc.render("profile",{
        name:JSON.stringify(hjk),        
      } );
    
  }) 
    
    
});

app.get('/hello',function(req,res){

    res.send("Hello World");
});

app.get('/edit',function(req,res){
  res.send("edit")
})

app.get('/success', (req, res) => res.send("Welcome "+req.query.username+"!!"));
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  User.findById(id, function(err, user) {
    cb(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    UserDetails.findOne({
        username: username
      }, function(err, user) {
        console.log(1332);
        if (err) {
          return done(err);
        }

        if (!user) {
          return done(null, false);
        }

        if (user.password !== password) {
          return done(null, false);
        }
        return done(null, user);
      });
  }
));

app.post('/',
  passport.authenticate('local', { failureRedirect: '/error' }),
  function(req, res) {
    res.redirect('/success?username='+req.user.username);
  });

app.get('*', function(req, res){
   res.send('Sorry, this is an invalid URL.');
});



app.listen(3000);
