//jshint esversion:6
require('dotenv').config()
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// variables
const saltRounds = 10;

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect('mongodb://localhost:27017/userDB', { useUnifiedTopology: true, useNewUrlParser: true});

const userSchema = new mongoose.Schema({
  email : String,
  password : String
});

const User = mongoose.model("User", userSchema);

app.get("/", function(req, res){
  res.render("home");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/logout", function(req, res){
  res.redirect("/");
});

app.post("/register", function(req, res){

  // Added bcrypt hash function to store hash
  bcrypt.hash(req.body.password, saltRounds, function(err, hash){
    const newUser = new User({
      email : req.body.username,
      password : hash
    });

    newUser.save(function(err){
      if(!err){
        res.render("secrets");
      }else{
        res.render(err);
      }
    });
  });
});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.find({email:username}, function(err, resultUser){
    if(err){
      console.log(err);
    }else{

      bcrypt.compare(password, resultUser[0].password, function(err, result){
        if(result){
          res.render("secrets");
        }else{
          res.redirect("/login");
        }
      });

    }
  });
});

app.listen(3000, function(){
  console.log("Server started on 3000");
});
