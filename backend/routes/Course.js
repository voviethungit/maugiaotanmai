const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Course");
const Course = mongoose.model("Course");
const verifyToken = require("../middleware/auth");
const checkAdmin = require("../middleware/checkAdmin");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/x-rar-compressed',
    'application/octet-stream',
    'application/vnd.rar',
    'application/x-rar',
    'application/rar',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('File type not supported'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// Get all courses
router.get("/get-all-course", async (req, res) => {
  try {
    const courses = await Course.find({});
    res.send({ status: "ok", data: courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/get-courses-by-cate/:cateId", async (req, res) => {
  try {
    const courses = await Course.find({ courseCateId: req.params.cateId });
    res.send({ status: "ok", data: courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Get a single course by ID
router.get("/get-course/:id", getCourse, (req, res) => {
  res.json(res.course);
});

// Upload a new course
router.post('/upload-course', upload.single('file'), async (req, res) => {
  const { title, courseCateId } = req.body;
  const document = req.file.filename;

  try {
    const course = new Course({ title, courseCateId, document });
    await course.save();
    res.send({ status: 'ok' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all files
router.get("/get-files", async (req, res) => {
  try {
    const courses = await Course.find({});
    res.send({ status: "ok", data: courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Edit a course by ID
router.put("/edit-course/:id", getCourse, verifyToken, checkAdmin, async (req, res) => {
  const { title, coursecateId, document } = req.body;
  if (title != null) {
    res.course.title = title;
  }
  if (document != null) {
    res.course.document = document;
  }
  if (coursecateId != null) {
    res.course.coursecateId = coursecateId; // Update coursecateId
  }

  try {
    const updatedCourse = await res.course.save();
    res.json(updatedCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a course by ID
router.delete("/delete-course/:id", getCourse, verifyToken, checkAdmin, async (req, res) => {
  try {
    await res.course.remove();
    res.json({ message: "Course deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Middleware function to get a course by ID
async function getCourse(req, res, next) {
  try {
    const course = await Course.findById(req.params.id);
    if (course == null) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.course = course;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = router;
