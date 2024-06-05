const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseCatesSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  imageCategory: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['active', 'deleted'],
    default: "active"
  }
});

module.exports = mongoose.model("CourseCate", CourseCatesSchema);
