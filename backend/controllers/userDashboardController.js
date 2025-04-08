const db = require("../config/db");

const getUserTaskStats = (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId in query" });
  }

  const sql = `
    SELECT 
      SUM(CASE WHEN DATE(t.start_date) = CURDATE() THEN 1 ELSE 0 END) AS todays_tasks,
      SUM(CASE WHEN t.status = 'pending' THEN 1 ELSE 0 END) AS pending_tasks,
      SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END) AS completed_tasks
    FROM transaction_task t
    JOIN task_assignees ta ON t.task_id = ta.task_id
    WHERE ta.user_id = ? AND t.is_deleted = FALSE
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("❌ Error fetching user task stats:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(results[0]); // Send object, not array
  });
};

module.exports = {
  getUserTaskStats
};
