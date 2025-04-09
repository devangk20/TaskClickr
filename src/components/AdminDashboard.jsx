import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { fetchAdminTaskStats } from "../services/adminDashboardService";
import "bootstrap/dist/css/bootstrap.min.css";

const StatCard = ({ title, value }) => (
  <div className="flex-fill bg-white rounded-4 shadow-sm text-center p-4 mx-2 mb-4">
    <h6 className="text-muted mb-2">{title}</h6>
    <h2 className="fw-bold text-primary mb-0">{value}</h2>
  </div>
);

const ProgressBar = ({ label, value, max }) => {
  const percentage = max ? Math.round((value / max) * 100) : 0;
  return (
    <div className="mb-3">
      <div className="d-flex justify-content-between mb-1">
        <span>{label}</span>
        <span>{percentage}%</span>
      </div>
      <div className="progress" style={{ height: "10px" }}>
        <div
          className="progress-bar bg-success"
          role="progressbar"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

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
          setTaskStats(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchTaskStats();
    }
  }, [userId]);

  const renderStats = (stats, isCompanyView) => {
    const totalTasks = isCompanyView ? stats.total_tasks :
      (stats.todays_tasks || 0) + (stats.pending_tasks || 0) + (stats.completed_tasks || 0);

    return (
      <>
        <div className="d-flex flex-wrap justify-content-center">
          <StatCard title="Today's Tasks" value={stats.todays_tasks || 0} />
          <StatCard title="Pending Tasks" value={stats.pending_tasks || 0} />
          <StatCard title="Completed Tasks" value={stats.completed_tasks || 0} />
          {isCompanyView && <StatCard title="Total Tasks" value={stats.total_tasks || 0} />}
        </div>

        <div className="bg-white rounded-4 shadow-sm p-4 mt-3">
          <h6 className="text-muted mb-3">Task Completion Progress</h6>
          <ProgressBar label="Completed" value={stats.completed_tasks || 0} max={totalTasks} />
          <ProgressBar label="Pending" value={stats.pending_tasks || 0} max={totalTasks} />
        </div>
      </>
    );
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5 pt-4">
        <div className="text-center mb-4">
          <h2 className="fw-bold">Admin Dashboard</h2>
          <p className="text-muted">Efficiently manage and monitor tasks</p>
          <div className="btn-group mt-3">
            <button
              className={`btn ${viewMyTasks ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setViewMyTasks(true)}
            >
              My Tasks
            </button>
            <button
              className={`btn ${!viewMyTasks ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setViewMyTasks(false)}
            >
              Company Tasks
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading task data...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center">{error}</div>
        ) : taskStats ? (
          <div className="task-section">
            {viewMyTasks
              ? renderStats(taskStats.adminTasks, false)
              : renderStats(taskStats.companyTasks, true)}
          </div>
        ) : (
          <div className="alert alert-info text-center">No task data available</div>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
