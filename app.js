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
app.delete('/delete/:id',passport.authenticate('jwt',{session:false}),function(req,res){
  allNotes.deleteOne({_id:req.params.id}).then((result)=>{
    res.status(200).json({message:'Successfully Deleted'})
  }).catch((err)=>{
    console.warn(err)
  });
});

app.put('/updateNotes/:id',passport.authenticate('jwt',{session:false}),function(req,res){
  allNotes.updateOne({_id:req.params.id},{$set:{
    data:req.body.data
  }}).then((result)=>{
    res.status(200).json({message:'Successfully Updated'})
  }).catch((err)=>{
    res.status(401).json(err)
  });
});
app.get(
  "/search/:name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    var regex = new RegExp(req.params.name,'i');
  allNotes.find({data:regex}).then((result)=>{
    res.status(200).json(result)
  })
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
      emailAddress:req.user.emailAddress
    });
  }
);
app.get('/',(req,res)=>{
res.send('ok server is running');
})

app.listen(5000, () => {});
