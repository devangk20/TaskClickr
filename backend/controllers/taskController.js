const db = require("../config/db");

// Get all tasks
exports.getAllTasks = (req, res) => {
  const sql = "SELECT * FROM transaction_task";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error fetching tasks:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
};

// Update task
exports.updateTask = (req, res) => {
  const taskId = req.params.id;
  const { status, description } = req.body;

  const sql = "UPDATE transaction_task SET status = ?, description = ? WHERE task_id = ?";

  db.query(sql, [status, description, taskId], (err, result) => {
    if (err) {
      console.error("❌ Error updating task:", err);
      return res.status(500).json({ error: "Server error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "✅ Task updated successfully" });
  });
};
