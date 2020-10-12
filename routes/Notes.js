const express = require("express");
const { Mongoose, mongo } = require("mongoose");
const app = express();
const Notes = require("../models/notes");
app.use(express.json());
var router = express.Router();
require("dotenv/config");

router.post("/newNote", async (req, res) => {
  try {
      var newPost = new Notes({
          data: req.body.data,
          
      });
      await newPost.save().then(()=>{
          res.status(200).send(newPost);
      });
  } catch (err) {
    res.send({
      message: err,
    });
  }
});

module.exports = router;