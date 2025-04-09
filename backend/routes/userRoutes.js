const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Get all users
router.get("/", userController.getAllUsers);

// Add a new user
router.post("/", userController.addUser);

// Update a user
router.put("/:id", userController.updateUser);   // ✅ Corrected

// Soft delete a user
router.delete("/:id", userController.deleteUser); // ✅ Corrected

module.exports = router;
