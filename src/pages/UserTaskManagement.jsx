import { useEffect, useState } from "react";
import axios from "axios";

const UserTaskManagement = () => {
    const [tasks, setTasks] = useState([]);
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = () => {
        axios.get("http://localhost:5000/api/tasks")
            .then((response) => {
                console.log("✅ API Response:", response.data);
                if (Array.isArray(response.data)) {
                    setTasks(response.data);
                } else {
                    console.error("❌ Unexpected response format:", response.data);
                }
            })
            .catch((error) => console.error("❌ Error fetching tasks:", error));
    };

    const handleEdit = (task) => {
        console.log("🟢 Editing Task:", task);
        setEditingTask(task);
    };

    const handleSave = () => {
        if (!editingTask || !editingTask.task_id) {
            console.error("❌ No valid task ID found!", editingTask);
            return;
        }

        console.log("🟢 Sending PUT request for Task ID:", editingTask.task_id);
        console.log("🟢 Payload:", {
            status: editingTask.status,
            description: editingTask.description,
        });

        axios.put(`http://localhost:5000/api/tasks/${editingTask.task_id}`, {
            status: editingTask.status,
            description: editingTask.description,
        })
        .then((response) => {
            console.log("✅ Task updated successfully:", response.data);
            fetchTasks(); // Refresh the task list
            setEditingTask(null); // Clear the editing state
        })
        .catch((error) => {
            console.error("❌ Error updating task:", error);
            if (error.response) {
                console.error("🔴 Response Status:", error.response.status);
                console.error("🔴 Response Data:", error.response.data);
                alert(`Error: ${error.response.data.message || "Failed to update task"}`);
            } else {
                alert("Network error. Please try again.");
            }
        });
    };

    return (
        <div className="container mt-5 pt-5">
            <h2 className="mb-3 text-center">Task Management</h2>
            <div className="table-responsive">
                <table className="table table-striped table-hover table-bordered">
                    <thead className="thead-dark">
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Client Name</th>
                            <th>Assigned To</th>
                            <th>Assigned By</th>
                            <th>Deadline</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.length > 0 ? (
                            tasks.map((task) => (
                                <tr key={task.task_id}>
                                    <td>{task.task_id}</td>
                                    <td>{task.title}</td>
                                    <td>
                                        {editingTask?.task_id === task.task_id ? (
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editingTask.description}
                                                onChange={(e) =>
                                                    setEditingTask({ ...editingTask, description: e.target.value })
                                                }
                                            />
                                        ) : (
                                            task.description
                                        )}
                                    </td>
                                    <td>{task.client_name || "N/A"}</td>
                                    <td>{task.assigned_to || "Unassigned"}</td>
                                    <td>{task.assigned_by || "N/A"}</td>
                                    <td>{new Date(task.deadline).toLocaleDateString()}</td>
                                    <td>
                                        {editingTask?.task_id === task.task_id ? (
                                            <select
                                                className="form-control"
                                                value={editingTask.status}
                                                onChange={(e) =>
                                                    setEditingTask({ ...editingTask, status: e.target.value })
                                                }
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
                                                    Save
                                                </button>
                                                <button className="btn btn-secondary btn-sm mx-1" onClick={() => setEditingTask(null)}>
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <button className="btn btn-primary btn-sm mx-1" onClick={() => handleEdit(task)}>
                                                Edit
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="text-center">No tasks found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserTaskManagement;
