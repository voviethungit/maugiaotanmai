const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Car = require('../models/Car');
const Category = require('../models/Category');
const Course = require('../models/Course');
const RentalHistory = require('../models/RentalHistory');
const verifyToken = require("../middleware/auth");
const checkAdmin = require("../middleware/checkAdmin");
router.get('/countAll', verifyToken, checkAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCars = await Car.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalPrices = await RentalHistory.countDocuments();
    const totalCourse = await Course.countDocuments();
    res.json({ totalUsers, totalCars, totalCategories , totalPrices, totalCourse });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi lấy thông tin thống kê' });
  }
});
router.get('/countAvailableCars', async (req, res) => {
  try {
    const countAvailableCars = await Car.countDocuments({ isAvailable: true });
    res.json({ countAvailableCars });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi đếm số lượng xe có trạng thái isAvailable là true' });
  }
});

router.get('/countUnavailableCars', async (req, res) => {
  try {
    const countUnavailableCars = await Car.countDocuments({ isAvailable: false });
    res.json({ countUnavailableCars });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi đếm số lượng xe có trạng thái isAvailable là false' });
  }
});
module.exports = router;
