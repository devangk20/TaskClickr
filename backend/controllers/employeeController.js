const db = require("../config/db");

// Get all employees
exports.getAllEmployees = (req, res) => {
  const sql = "SELECT * FROM master_user";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error fetching employees:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
};
