import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import logo from "../assets/logo.png";
import taskIcon from "../assets/task-icon.png";
import activityIcon from "../assets/activity-icon.png";
import profileIcon from "../assets/profile-icon.png";
import logoutIcon from "../assets/logout-icon.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("name") || "User";

    const storedRole = localStorage.getItem("role") || "2";
    
    setUsername(storedName);
    setRole(storedRole);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white fixed-top shadow-sm px-3">
      <div className="container-fluid">
        <Link
          className="navbar-brand d-flex align-items-center"
          to={role === "1" || role === "3" ? "/admin-dashboard" : "/user-dashboard"}
        >
          <img src={logo} alt="Logo" width="35" height="35" className="me-2" />
          <span className="fw-bold text-uppercase text-dark brand-font">
            CL!CKR SERVICES
          </span>
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="mainNavbar">
          <ul className="navbar-nav align-items-center">
            {(role === "1" || role === "3") && (
              <>
                <li className="nav-item">
                  <Link className="nav-link nav-hover d-flex align-items-center" to="/task-management">
                    <img src={taskIcon} alt="Tasks" width="20" height="20" className="me-2" /> Task Management
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link nav-hover d-flex align-items-center" to="/daily-activity">
                    <img src={activityIcon} alt="Activity" width="20" height="20" className="me-2" /> Daily Activity
                  </Link>
                </li>
                <li className="nav-item">
  {(role === "1" || role === "3") && (
    <Link className="nav-link nav-hover d-flex align-items-center" to="/user-management">
      <img src={profileIcon} alt="User Management" width="20" height="20" className="me-2" /> User Management
    </Link>
  )}
</li>

                
              </>
            )}

            {role === "2" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link nav-hover d-flex align-items-center" to="/tasks">
                    <img src={taskIcon} alt="Tasks" width="20" height="20" className="me-2" /> Tasks
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link nav-hover d-flex align-items-center" to="/daily-activity">
                    <img src={activityIcon} alt="Activity" width="20" height="20" className="me-2" /> Daily Activity
                  </Link>
                </li>
              </>
            )}

            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown">
                {username} ({role === "1" ? "Super Admin" : role === "3" ? "Admin" : "User"})
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                 <Link className="dropdown-item d-flex align-items-center" to="/profile">
                    <img src={profileIcon} alt="Profile" width="20" height="20" className="me-2" /> Profile
                </Link>
                </li>
                <li>
                  <button className="dropdown-item d-flex align-items-center" onClick={handleLogout}>
                    <img src={logoutIcon} alt="Logout" width="20" height="20" className="me-2" /> Logout
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>

      {/* Bootstrap Styling */}
      <style>
        {`
          .brand-font {
            font-family: 'Poppins', sans-serif;
            font-size: 18px;
            letter-spacing: 0.5px;
          }

          .nav-hover {
            padding: 5px 10px;
            border-radius: 4px;
            transition: background-color 0.3s ease-in-out;
          }

          .nav-hover:hover {
            background-color: #007bff !important;
            color: white !important;
          }

          .dropdown-menu {
            border-radius: 8px;
            box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
          }
        `}
      </style>
    </nav>
  );
};

export default Navbar;
