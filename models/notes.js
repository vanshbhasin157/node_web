const mongoose = require("mongoose");
const User = require("../models/user");
var notesSchema = mongoose.Schema({
  data: {
    type: String,
    require: true,
  },
  createdBy:{
    type:mongoose.Schema.Types.ObjectId,
    require:true,
    ref: "User"
  },
  fileUpload:{
    type:String
  }
  
});

module.exports = mongoose.model("notes", notesSchema);
