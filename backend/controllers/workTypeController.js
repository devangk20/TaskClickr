const pool = require("../config/db"); // renamed to match your promise pool

// Get all work types
exports.getAllWorkTypes = async (req, res) => {
  try {
    const [results] = await pool.query("SELECT * FROM master_work_type");
    res.json(results);
  } catch (err) {
    console.error("❌ Error fetching work types:", err);
    res.status(500).json({ error: "Database error" });
  }
};
