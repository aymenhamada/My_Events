const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const router = require('./routes');
const passport = require("passport");
const axios = require("axios");
const FacebookStrategy = require("passport-facebook").Strategy;
const mongoose = require("mongoose");
const User = mongoose.model("User");
const app = express();

require('dotenv').config({path: 'variables.env'})

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

passport.use(new FacebookStrategy({
    clientID: process.env.APP_ID,
    clientSecret: process.env.APP_SECRET,
    callbackURL: "http://localhost:4242/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, cb) {
        const url = `https://graph.facebook.com/me?fields=id,name,email,birthday,hometown&access_token=${accessToken}`;
        axios.get(url, {method: 'GET'})
        .then(async function(Response){
          try{
            const facebookData = Response.data;
            const user = await User.findOne({ facebookId: facebookData.id});
            if(!user){
              const user = await (new User({facebookId: facebookData.id, name: facebookData.name, email: facebookData.email, hometown: facebookData.hometown.name})).save();
            }
            cb(null, user);
          }catch(error){
            console.log(error);
          }
        });
      }
));

app.use(passport.initialize());
app.use(passport.session());


app.use('/', router);

module.exports = app;


