import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const UserTaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch tasks for the logged-in user
  const fetchUserTasks = useCallback(() => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please log in.");
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:5000/api/usertasks", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (Array.isArray(response.data)) {
          setTasks(response.data);
        } else {
          setError("Unexpected response format.");
        }
      })
      .catch((error) => {
        console.error("Error fetching user tasks:", error);
        setError("Failed to fetch tasks. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchUserTasks();
  }, [fetchUserTasks]);

  const handleEdit = (task) => {
    setEditingTask({ ...task });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (!editingTask || !editingTask.task_id) {
      console.error("No valid task ID found!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    axios
      .put(
        `http://localhost:5000/api/tasks/${editingTask.task_id}/status`,
        { status: editingTask.status, description: editingTask.description },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        fetchUserTasks();
        setEditingTask(null);
      })
      .catch((error) => {
        console.error("Error updating task:", error);
        setError("Failed to update task. Please try again.");
      });
  };

  return (
    <div className="container mt-5 pt-5">
      <h2 className="mb-3 text-center">User Task Management</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="text-center"><strong>Loading tasks...</strong></div>}
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="thead-light" style={{ backgroundColor: "#343a40", color: "#ffffff" }}>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Title</th>
              <th scope="col">Description</th>
              <th scope="col">Client Name</th>
              <th scope="col">Assigned By</th>
              <th scope="col">Deadline</th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length > 0 ? (
              tasks.map((task, index) => (
                <tr key={task.task_id}>
                  <th scope="row">{index + 1}</th>
                  <td>{task.title}</td>
                  <td>
                    {editingTask?.task_id === task.task_id ? (
                      <input
                        type="text"
                        className="form-control"
                        name="description"
                        value={editingTask.description}
                        onChange={handleInputChange}
                      />
                    ) : (
                      task.description
                    )}
                  </td>
                  <td>{task.client_name || "N/A"}</td>
                  <td>{task.assigned_by_name || "N/A"}</td>
                  <td>{task.deadline ? new Date(task.deadline).toLocaleDateString() : "N/A"}</td>
                  <td>
                    {editingTask?.task_id === task.task_id ? (
                      <select
                        className="form-control"
                        name="status"
                        value={editingTask.status}
                        onChange={handleInputChange}
                      >
                        <option value="Not Started">Not Started</option>
                        <option value="Started">Started</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Completed</option>
                      </select>
                    ) : (
                      task.status
                    )}
                  </td>
                  <td>
                    {editingTask?.task_id === task.task_id ? (
                      <>
                        <button className="btn btn-success btn-sm mx-1" onClick={handleSave}>
                          <i className="fas fa-check"></i> Save
                        </button>
                        <button className="btn btn-secondary btn-sm mx-1" onClick={() => setEditingTask(null)}>
                          <i className="fas fa-times"></i> Cancel
                        </button>
                      </>
                    ) : (
                      <button className="btn btn-primary btn-sm mx-1" onClick={() => handleEdit(task)}>
                        <i className="fas fa-edit"></i> Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">No tasks found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTaskManagement;
