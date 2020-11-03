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
const fileUpload = require('express-fileupload');
app.use(fileUpload());
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
    var notes = [];
    allNotes.find().then((result) => {
      for (i = 0; i < result.length; i++) {
        if (result[i].createdBy.toString() == req.user.id.toString()) {
          notes.push(result[i]);
        } else {
          console.log("not found");
        }
      }
      res.status(200).json(notes);
    });
  }
);
app.delete(
  "/delete/:noteId",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    allNotes
      .deleteOne({ _id: req.params.noteId })
      .then((result) => {
        res.status(200).json({ message: "Successfully Deleted" });
      })
      .catch((err) => {
        console.warn(err);
      });
  }
);

app.put(
  "/updateNotes/:id",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    allNotes
      .updateOne(
        { _id: req.params.id },
        {
          $set: {
            data: req.body.data,
          },
        }
      )
      .then((result) => {
        res.status(200).json({
          message: "Successfully Updated",
        });
      })
      .catch((err) => {
        res.status(401).json({ message: err.toString() });
      });
  }
);
app.get(
  "/search/:name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    var userNotes = [];

    var regex = req.params.name;
    allNotes.find().then((result) => {
      for (i = 0; i < result.length; i++) {
        if (result[i].createdBy.toString() == req.user.id.toString()) {
          result[i].data.includes(regex)
            ? userNotes.push(result[i])
            : res.send(400).json({ message: "Not Found" });
        }
      }
      res.status(200).json(userNotes);
    });
  }
);
app.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req);
    res.json({
      id: req.user.id,
      name: req.user.name,
      emailAddress: req.user.emailAddress,
    });
  }
);


app.get("/", (req, res) => {
  res.send("ok server is running");
});

app.listen(5000, () => {});
