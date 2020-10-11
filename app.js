const express = require("express");
const mongoose = require("mongoose");
require("dotenv/config");
var bodyparser = require("body-parser");
var passport = require("passport");
const app = express();
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
const auth = require('./routes/User');
//Passport middleware
app.use(passport.initialize());
//Config for JWT strategy
require("./jsonwtStrategy")(passport);
mongoose.connect(
  process.env.DB_CONNECTION_STRING,
  { useUnifiedTopology: true, useNewUrlParser: true },
  (req, res) => {
    console.log("DB");
  }
);
app.use('/api',auth);

app.listen(5000, () => {});
