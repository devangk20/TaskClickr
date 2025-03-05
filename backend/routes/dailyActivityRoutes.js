const express = require("express");
const router = express.Router();
const dailyActivityController = require("../controllers/dailyActivityController");

// Ensure that the controller is correctly referenced
router.post("/add", dailyActivityController.addDailyActivity);
router.get("/", dailyActivityController.getAllDailyActivities);

module.exports = router;
