  const mongoose = require("mongoose");
  const Schema = mongoose.Schema;
  const CarsSchema = new Schema({
    categoryID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    imagePath: {
      type: String,
      default: ""
    },
    image1: {
      type: String,
      default: ""
    },
    image2: {
      type: String,
      default: ""
    },
    image3: {
      type: String,
      default: ""
    },
    location: {
      type: String,
      default: "Lâm Đồng"
    },
    chair: {
      type: Number,
      minlength: 1,
      maxlength: 2,
    },
    fuel: {
      type: String,
    },
    flash: {
      type: String,
      default: "Giáo Viên",
    },
    star: {
      type: Number,
      default: "Nothing"
    },
    usage: {
      type: String,
      default: "0"
    },
    tax: {
      type: String,
      default: "Giáo Viên"
    },
    tax2: {
      type: String,
      default: "Giáo Viên"
    },
    status: {
      type: String,
      enum: ['active', 'deleted'],
      default: "active"
    },
    isAvailable: {
      type: Boolean,
      default: true
  },
  numberPhone: {
  type: String,
  minlength: 10,
  default: "0123456789"
  },
  email:{
  type: String,
  default: "example@gmail.com"
  },
    reviews: [{
      type: Schema.Types.ObjectId,
      ref: 'reviews'
    }]
  });

  module.exports = mongoose.model("Car", CarsSchema);