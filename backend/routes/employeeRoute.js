const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");

// Get all employees
router.get("/", employeeController.getAllEmployees);

module.exports = router;
