const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// ✅ Define Routes and Link to Controller
router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-otp", authController.verifyOtp);
router.post("/reset-password", authController.resetPassword);
router.post("/login", authController.login);

module.exports = router;
