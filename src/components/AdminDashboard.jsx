import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { fetchAdminTaskStats } from "../services/adminDashboardService";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminDashboard = () => {
  const [viewMyTasks, setViewMyTasks] = useState(true);
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
      const fetchTaskStats = async () => {
        try {
          setLoading(true);
          const data = await fetchAdminTaskStats(userId);
          console.log("Fetched data:", data); // Debug log
          setTaskStats(data);
        } catch (err) {
          console.error("Fetch error:", err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchTaskStats();
    }
  }, [userId]);

  return (
    <>
      <Navbar />
      <div className="container mt-5 pt-4">
        <h1 className="dashboard-title text-center">Admin Dashboard</h1>
        <p className="dashboard-subtitle text-center">
          Manage your tasks and monitor company-wide tasks efficiently.
        </p>

        <div className="text-center mb-4">
          <button
            className={`btn ${viewMyTasks ? "btn-primary" : "btn-outline-primary"} mx-2`}
            onClick={() => setViewMyTasks(true)}
          >
            View My Tasks
          </button>
          <button
            className={`btn ${!viewMyTasks ? "btn-primary" : "btn-outline-primary"} mx-2`}
            onClick={() => setViewMyTasks(false)}
          >
            View Company Tasks
          </button>
        </div>

        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Loading task data...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center">{error}</div>
        ) : taskStats ? (
          <>
            {viewMyTasks ? (
              <div className="task-section">
                <h3 className="section-title">Your Task Summary</h3>
                <div className="row">
                  <div className="col-md-4">
                    <div className="info-box card p-3">
                      <h5>Today's Tasks</h5>
                      <h2 className="display-5">{taskStats.adminTasks?.todays_tasks || 0}</h2>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="info-box card p-3">
                      <h5>Pending Tasks</h5>
                      <h2 className="display-5">{taskStats.adminTasks?.pending_tasks || 0}</h2>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="info-box card p-3">
                      <h5>Completed Tasks</h5>
                      <h2 className="display-5">{taskStats.adminTasks?.completed_tasks || 0}</h2>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="task-section">
                <h3 className="section-title">Company Task Summary</h3>
                <div className="row">
                  <div className="col-md-3">
                    <div className="info-box card p-3">
                      <h5>Today's Tasks</h5>
                      <h2 className="display-5">{taskStats.companyTasks?.todays_tasks || 0}</h2>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="info-box card p-3">
                      <h5>Pending Tasks</h5>
                      <h2 className="display-5">{taskStats.companyTasks?.pending_tasks || 0}</h2>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="info-box card p-3">
                      <h5>Completed Tasks</h5>
                      <h2 className="display-5">{taskStats.companyTasks?.completed_tasks || 0}</h2>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="info-box card p-3">
                      <h5>Total Tasks</h5>
                      <h2 className="display-5">{taskStats.companyTasks?.total_tasks || 0}</h2>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="alert alert-info text-center">No task data available</div>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;