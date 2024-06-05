const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  title: {
    type: String,
    required: true, 
  },
  image:{
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true, 
  }
});

module.exports = mongoose.model("Event", EventSchema );