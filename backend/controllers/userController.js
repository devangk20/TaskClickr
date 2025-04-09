const pool = require("../config/db");

// Get all users (excluding soft-deleted users)
const getAllUsers = async (req, res) => {
  const query = "SELECT * FROM master_user WHERE is_deleted = FALSE";
  try {
    const [results] = await pool.query(query);
    res.json(results);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// Add a new user
const addUser = async (req, res) => {
  const {
    first_name, middle_name, last_name,
    email, mobile_number, password,
    role_id, position
  } = req.body;

  const query = `
    INSERT INTO master_user 
    (first_name, middle_name, last_name, email, mobile_number, password, role_id, position)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  try {
    const [results] = await pool.query(query, [
      first_name, middle_name, last_name,
      email, mobile_number, password,
      role_id, position
    ]);
    res.status(201).json({ id: results.insertId, ...req.body });
  } catch (err) {
    console.error("Error adding user:", err);
    res.status(500).json({ error: "Failed to add user" });
  }
};

// Update a user
const updateUser = async (req, res) => {
  const { id } = req.params;
  const {
    first_name, middle_name, last_name,
    email, mobile_number, role_id, position
  } = req.body;

  const query = `
    UPDATE master_user 
    SET first_name = ?, middle_name = ?, last_name = ?, email = ?, 
        mobile_number = ?, role_id = ?, position = ?
    WHERE user_id = ?`;

  try {
    const [results] = await pool.query(query, [
      first_name, middle_name, last_name,
      email, mobile_number, role_id, position,
      id
    ]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ id, ...req.body });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Failed to update user" });
  }
};

// Soft delete a user
const deleteUser = async (req, res) => {
  const { id } = req.params;
  const query = "UPDATE master_user SET is_deleted = TRUE WHERE user_id = ?";

  try {
    const [results] = await pool.query(query, [id]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(204).send(); // No content
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

module.exports = {
  getAllUsers,
  addUser,
  updateUser,
  deleteUser,
};
