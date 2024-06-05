const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  courseCateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CourseCate",
    required: true,
  },
  title: {
    type: String,
    required: true
  },
  imageCourse: {
    type: String,
    default: "https://d2.violet.vn/uploads/thumbnails/present/4/550/343/thumbnail.jpg"
  },
  document: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Course", CourseSchema);
