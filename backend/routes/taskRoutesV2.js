const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskControllerV2");

// Get all tasks
router.get("/tasks", taskController.getAllTasks);

// Create a new task
router.post("/create-task", taskController.createTask);

module.exports = router;
