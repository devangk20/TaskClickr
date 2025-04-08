const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authMiddleware");
const taskController = require("../controllers/taskController"); // ✅ Correct import

// Get all tasks
router.get("/tasks", taskController.getAllTasks);
router.get("/usertasks", authenticateUser, taskController.getUserTasks);

// Create a new task
router.post("/tasks", taskController.createTask);

// Update task
router.put("/tasks/:id", taskController.updateTask);
router.put("/tasks/:id/status", taskController.updateTaskStatus);

// ✅ Add Delete Task Route
router.delete("/tasks/:id", taskController.deleteTask);



module.exports = router;
