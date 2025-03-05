const db = require("../config/db");

// Get all work types
exports.getAllWorkTypes = (req, res) => {
  const sql = "SELECT * FROM master_work_type";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error fetching work types:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
};
