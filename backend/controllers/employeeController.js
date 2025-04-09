const pool = require("../config/db"); // use the promise-based pool

// Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const [results] = await pool.query("SELECT * FROM master_user");
    res.json(results);
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
