const express = require("express");
const router = express.Router();
const workTypeController = require("../controllers/workTypeController");

// Get all work types
router.get("/", workTypeController.getAllWorkTypes);

module.exports = router;
