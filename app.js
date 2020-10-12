const express = require("express");
const mongoose = require("mongoose");
require("dotenv/config");
var bodyparser = require("body-parser");
var passport = require("passport");
const app = express();
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
const auth = require("./routes/User");
const notes = require("./routes/Notes");
const allNotes = require("./models/notes");
//Passport middleware
app.use(passport.initialize());
//Config for JWT strategy
require("./strategies/jsonwtStrategy")(passport);
mongoose.connect(process.env.DB_CONNECTION_STRING, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

app.use("/api", auth);
app.use("/api", notes);
app.get(
  "/viewNotes",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    allNotes.find().then((notes) => {
      res.status(200).json({
        name: req.user.name,
        id: req.user.id,
        notes: notes,
      });
    });
  }
);
app.get(
  "/search",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
      allNotes.findOne
  }
);
app.get(
  "/main",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req);
    res.json({
      id: req.user.id,
      name: req.user.name,
    });
  }
);

app.listen(5000, () => {});
