const db = require("../config/db");
const bcrypt = require("bcrypt");

// Get all users (Admin & Super Admin)
exports.getAllUsers = (req, res) => {
  const sql = "SELECT user_id, first_name, last_name, email, role_id FROM master_user WHERE is_deleted = 0";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// Add a new user
exports.addUser = async (req, res) => {
  const { first_name, last_name, email, password, role_id } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = "INSERT INTO master_user (first_name, last_name, email, password, role_id) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [first_name, last_name, email, hashedPassword, role_id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "User added successfully" });
  });
};

// Update a user
exports.updateUser = (req, res) => {
  const { first_name, last_name, email, role_id } = req.body;
  const { id } = req.params;

  const sql = "UPDATE master_user SET first_name = ?, last_name = ?, email = ?, role_id = ? WHERE user_id = ?";
  db.query(sql, [first_name, last_name, email, role_id, id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "User updated successfully" });
  });
};

// Soft delete a user
exports.deleteUser = (req, res) => {
  const { id } = req.params;

  const sql = "UPDATE master_user SET is_deleted = 1 WHERE user_id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "User deleted successfully" });
  });
};
