const express = require("express");
const { Mongoose, mongo } = require("mongoose");
const app = express();
const Notes = require("../models/notes");
const fileUpload = require('express-fileupload');
var passport = require("passport");
app.use(fileUpload());
app.use(express.json());
var router = express.Router();
require("dotenv/config");

router.post("/:createdById/newNote", async (req, res) => {
  try {
    var newPost = new Notes({
      data: req.body.data,
      createdBy: { _id: req.params.createdById },
    });
    await newPost.save().then(() => {
      res.status(200).send(newPost);
    });
  } catch (err) {
    res.send({
      message: "error aagya bro",
    });
  }
});
app.post(
  "/uploadFile/:id",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    console.log(req.files);
    allNotes
      .updateOne(
        { _id: req.params.id },
        {
          $set: {
            fileUpload: req.files.file,
          },
        }
      )
      .then((result) => {
        res.status(200).json({
          message: "File Uploaded",
        });
      })
      .catch((err) => {
        res.status(401).json({ message: err.toString() });
      });
  }
);
module.exports = router;
