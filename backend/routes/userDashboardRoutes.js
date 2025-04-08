const express = require("express");
const router = express.Router();
const { getUserTaskStats } = require("../controllers/userDashboardController");

router.get("/tasks", getUserTaskStats);

module.exports = router;
