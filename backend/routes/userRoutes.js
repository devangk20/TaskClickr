const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Get all users
router.get("/users", userController.getAllUsers);

// Add a new user
router.post("/users", userController.addUser);

// Update a user
router.put("/users/:id", userController.updateUser);

// Soft delete a user
router.delete("/users/:id", userController.deleteUser);

module.exports = router;