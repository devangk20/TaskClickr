import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import AdminDashboard from "./components/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import TaskManagement from "./pages/TaskManagement";
import DailyActivity from "./components/DailyActivity";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Ensure Bootstrap JS is loaded
import Profile from "./pages/Profile";
import UserManagement from "./components/UserManagement"; // Adjust if needed
import UserTaskManagement from "./pages/UserTaskManagement";

const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbar = location.pathname === "/" || location.pathname === "/forgot-password";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <div className="mt-5">{children}</div> {/* Add margin-top to avoid content overlapping navbar */}
    </>
  );
};

function App() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Retrieve userId (Replace with actual authentication logic)
    const storedUserId = localStorage.getItem("userId") || "defaultUserId";
    setUserId(storedUserId);
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          {/* Authentication Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Admin Routes (Only Accessible by Admins) */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />

          {/* User Routes (Only Accessible by Users) */}
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/daily-activity" element={<DailyActivity />} />
          <Route path="/task-management" element={<TaskManagement />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/user-management" element={<UserManagement />} />

          {/* Pass `userId` to UserTaskManagement */}
          {userId && <Route path="/tasks" element={<UserTaskManagement userId={userId} />} />}

          {/* Default Redirect for Unmatched Routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
