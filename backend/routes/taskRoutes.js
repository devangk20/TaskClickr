const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authMiddleware");
const taskController = require("../controllers/taskController");

// Get all tasks
router.get("/tasks", taskController.getAllTasks);

// Update task
router.put("/tasks/:id", taskController.updateTask);

module.exports = router;
