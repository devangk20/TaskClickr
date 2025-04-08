// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminDashboardController");

router.get("/admin-tasks/:adminId", adminController.getCombinedTaskSummary);

module.exports = router;
