import React from "react";
import Navbar from "./Navbar";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminDashboard = () => {
  return (
    <>
      <Navbar />
      <div className="container mt-5 pt-4">
        <h1 className="dashboard-title text-center">Admin Dashboard</h1>
        <p className="dashboard-subtitle text-center">Monitor and manage ISP-related tasks efficiently.</p>

        {/* Stats Section */}
        <div className="row mt-4">
          <div className="col-md-4">
            <div className="info-box">
              <h5>Active Clients</h5>
              <h2>230</h2>
            </div>
          </div>

          <div className="col-md-4">
            <div className="info-box">
              <h5>Today's Tasks</h5>
              <h2>15</h2>
            </div>
          </div>

          <div className="col-md-4">
            <div className="info-box">
              <h5>Pending Tasks</h5>
              <h2>5</h2>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="row mt-4">
          <div className="col-md-4">
            <div className="info-box">
              <h5>Completed Tasks</h5>
              <h2>42</h2>
            </div>
          </div>

          <div className="col-md-4">
            <div className="info-box">
              <h5>Client Queries</h5>
              <h2>8</h2>
            </div>
          </div>

          <div className="col-md-4">
            <div className="info-box">
              <h5>Ongoing Tasks</h5>
              <h2>12</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Styling for Dashboard */}
      <style>
        {`
          .dashboard-title {
            font-size: 2rem;
            font-weight: bold;
            color: #0056b3; /* Deep Blue */
          }

          .dashboard-subtitle {
            font-size: 1.1rem;
            color: #666; /* Muted Grey */
          }

          .info-box {
            background: #f8f9fa; /* Light Grey */
            border-radius: 12px;
            padding: 40px;
            text-align: center;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
            transition: transform 0.3s ease-in-out;
            height: 160px;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }

          .info-box h5 {
            font-size: 1.3rem;
            color: #444; /* Dark Grey */
          }

          .info-box h2 {
            font-size: 2.5rem;
            font-weight: bold;
            color: #007bff; /* Professional Blue */
          }

          .info-box:hover {
            transform: scale(1.05);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
          }

          .container {
            margin-top: 80px; /* Fix navbar overlap */
          }
        `}
      </style>
    </>
  );
};

export default AdminDashboard;
