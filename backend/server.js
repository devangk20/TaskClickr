const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const dailyActivityRoutes = require("./routes/dailyActivityRoutes");
const app = express();
app.use(cors());
app.use(express.json());

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes); // ✅ Corrected path for user routes
app.use("/api/daily-activity", dailyActivityRoutes);
const taskRoutes = require("./routes/taskRoutes"); // Adjust path if needed
app.use("/api", taskRoutes);


const workTypeRoutes = require("./routes/workTypeRoute");
const employeeRoutes = require("./routes/employeeRoute");

app.use("/api/work-types", workTypeRoutes); // Register the work-types route
app.use("/api/employees", employeeRoutes);  // Register the employees route

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
