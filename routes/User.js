const express = require("express");
const app = express();
const jsonwt = require("jsonwebtoken");
var passport = require("passport");
const User = require("../models/user");
app.use(express.json());
var bcrypt = require("bcrypt");
var saltRouds = 10;
var router = express.Router();

router.post("/signUp", async (req, res) => {
    try {
      var newUser = new User({
        name: req.body.name,
        emailAddress: req.body.emailAddress,
        password: req.body.password,
      });
      await User.findOne({ emailAddress: newUser.emailAddress }).then(
        async (profile) => {
          if (!profile) {
            bcrypt.hash(newUser.password, saltRouds, async (err, hash) => {
              if (err) {
                console.log("Error is", err.message);
              } else {
                newUser.password = hash;
                await newUser
                  .save()
                  .then(() => {
                    res.status(200).send("User Registerd");
                  })
                  .catch(err);
                {
                  console.log(err);
                }
              }
            });
          } else {
            res.status(401).send("User already exists");
          }
        }
      );
    } catch (err) {
      res.send({
        message: err,
      });
    }
  });
  router.post("/login", async (req, res) => {
    var newUser = {};
    newUser.emailAddress = req.body.emailAddress;
    newUser.password = req.body.password;
    await User.findOne({ emailAddress: newUser.emailAddress })
      .then((profile) => {
        if (!profile) {
          res.send("User does not exist");
        } else {
          bcrypt.compare(
              newUser.password, profile.password, async (err, result)=>{
                  if(err){
                      console.log("Error is", err.message);
                  }else if(result==true){
                      res.status(200).send('User authenticated');
                  }else{
                      res.status(401).send('Unauthorized Access');
                  }
              }
          );
        }
      })
      .catch((err) => {
        console.log("Error is", err.message);
      });
  });
  module.exports = router;