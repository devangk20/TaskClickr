import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { fetchUserTaskStats } from "../services/userDashboardService"; // use the service file

const UserDashboard = () => {
  const [taskStats, setTaskStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchTaskStats(userId);
    }
  }, [userId]);

  const fetchTaskStats = async (userId) => {
    try {
      const data = await fetchUserTaskStats(userId); // <-- now using the service
      console.log("Task Data:", data);
      setTaskStats(data);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5 pt-4">
        <h1 className="dashboard-title text-center">User Dashboard</h1>
        <p className="dashboard-subtitle text-center">
          View your assigned tasks and daily progress.
        </p>

        {loading ? (
          <p className="text-center">Loading task data...</p>
        ) : error ? (
          <p className="text-center text-danger">{error}</p>
        ) : (
          <div className="row mt-4">
            <div className="col-md-4">
              <div className="info-box">
                <h5>Today's Tasks</h5>
                <h2>{taskStats?.todays_tasks || 0}</h2>
              </div>
            </div>
            <div className="col-md-4">
              <div className="info-box">
                <h5>Pending Tasks</h5>
                <h2>{taskStats?.pending_tasks || 0}</h2>
              </div>
            </div>
            <div className="col-md-4">
              <div className="info-box">
                <h5>Completed Tasks</h5>
                <h2>{taskStats?.completed_tasks || 0}</h2>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>
        {`
          .dashboard-title {
            font-size: 2rem;
            font-weight: bold;
            color: #0056b3; 
          }

          .dashboard-subtitle {
            font-size: 1.1rem;
            color: #666;
          }

          .info-box {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 30px;
            text-align: center;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
            height: 140px;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }

          .info-box h5 {
            font-size: 1.2rem;
            color: #444;
          }

          .info-box h2 {
            font-size: 2rem;
            font-weight: bold;
            color: #007bff;
          }
        `}
      </style>
    </>
  );
};

export default UserDashboard;
