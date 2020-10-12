const mongoose = require("mongoose");

var notesSchema = mongoose.Schema({
  data: {
    type: String,
  },
});

module.exports = mongoose.model('notes', notesSchema);