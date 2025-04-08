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
app.use("/api/tasks", taskRoutes);
app.use("/api/admin-dashboard", adminDashboardRoutes);
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
