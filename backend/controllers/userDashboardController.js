const pool = require("../config/db");

const getUserTaskStats = async (req, res) => {
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

  try {
    const [results] = await pool.query(sql, [userId]);
    res.json(results[0]); // Return single stats object
  } catch (err) {
    console.error("❌ Error fetching user task stats:", err);
    res.status(500).json({ error: "Database error" });
  }
};

module.exports = {
  getUserTaskStats,
};
