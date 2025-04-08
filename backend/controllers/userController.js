const db = require("../config/db");

// Get all users (excluding soft-deleted users)
const getAllUsers = (req, res) => {
  const query = "SELECT * FROM master_user WHERE is_deleted = FALSE";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ error: "Failed to fetch users" });
    }
    res.json(results);
  });
};

// Add a new user
const addUser = (req, res) => {
  const { first_name, middle_name, last_name, email, mobile_number, password, role_id, position } = req.body;

  const query = `
    INSERT INTO master_user (first_name, middle_name, last_name, email, mobile_number, password, role_id, position)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    query,
    [first_name, middle_name, last_name, email, mobile_number, password, role_id, position],
    (err, results) => {
      if (err) {
        console.error("Error adding user:", err);
        return res.status(500).json({ error: "Failed to add user" });
      }
      res.status(201).json({ id: results.insertId, ...req.body });
    }
  );
};

// Update a user
const updateUser = (req, res) => {
  const { id } = req.params;
  const { first_name, middle_name, last_name, email, mobile_number, role_id, position } = req.body;

  const query = `
    UPDATE master_user 
    SET first_name = ?, middle_name = ?, last_name = ?, email = ?, 
        mobile_number = ?, role_id = ?, position = ?
    WHERE user_id = ?`;

  db.query(
    query,
    [first_name, middle_name, last_name, email, mobile_number, role_id, position, id],
    (err, results) => {
      if (err) {
        console.error("Error updating user:", err);
        return res.status(500).json({ error: "Failed to update user" });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ id, ...req.body });
    }
  );
};

// Soft delete a user
const deleteUser = (req, res) => {
  const { id } = req.params;
  const query = "UPDATE master_user SET is_deleted = TRUE WHERE user_id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error deleting user:", err);
      return res.status(500).json({ error: "Failed to delete user" });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(204).send(); // No content to send back
  });
};

module.exports = {
  getAllUsers,
  addUser,
  updateUser,
  deleteUser,
};