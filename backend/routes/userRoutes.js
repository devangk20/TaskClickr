const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController"); // Ensure this path is correct
const { isAdminOrSuperAdmin } = require("../middleware/authMiddleware");

// Check if userController is correctly imported
console.log("userController:", userController);

// Get all users (Admin & Super Admin)
router.get("/users", isAdminOrSuperAdmin, userController.getAllUsers);

// Add a new user
router.post("/users", isAdminOrSuperAdmin, userController.addUser);

// Update a user
router.put("/users/:id", isAdminOrSuperAdmin, userController.updateUser);

// Soft delete a user
router.delete("/users/:id", isAdminOrSuperAdmin, userController.deleteUser);

module.exports = router;
