const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ MySQL Pool Connection Error:", err);
    return;
  }
  console.log("✅ MySQL Pool Connected...");
  connection.release(); // Don't forget to release after checking
});

module.exports = pool.promise(); // This already gives us promise-based interface

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const dailyActivityRoutes = require("./routes/dailyActivityRoutes");
const taskRoutes = require("./routes/taskRoutes");
const adminDashboardRoutes = require("./routes/adminDashboardRoutes");
const workTypeRoutes = require("./routes/workTypeRoute");
const employeeRoutes = require("./routes/employeeRoute");

// Route registration
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/daily-activity", dailyActivityRoutes);
app.use("/api", taskRoutes);
app.use("/api", adminDashboardRoutes);
app.use("/api/work-types", workTypeRoutes);
app.use("/api/employees", employeeRoutes);

// 👇 This should be your user dashboard data route
const userDashboardRoutes = require("./routes/userDashboardRoutes");
app.use("/api/user", userDashboardRoutes); // e.g., /api/user/tasks?userId=8

// Server start       
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});