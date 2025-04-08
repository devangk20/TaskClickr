import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { fetchTasks, deleteTask } from "../services/taskService";
import TaskForm from "./TaskForm"; // We'll create this next

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks()
      .then((data) => setTasks(data))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  const handleDelete = async (taskId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;

    try {
      await deleteTask(taskId);
      alert("Task deleted successfully!");
      fetchTasks().then((data) => setTasks(data));
    } catch (error) {
      console.error("❌ Error deleting task:", error);
      alert("Error deleting task. Please try again.");
    }
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="container mt-5 pt-5">
      <h2 className="mb-4">Task Management</h2>

      <Button variant="primary" onClick={() => setShowTaskModal(true)}>
        Create Task
      </Button>

      <TaskForm
        show={showTaskModal}
        onHide={() => setShowTaskModal(false)}
        editingTask={editingTask}
        setEditingTask={setEditingTask}
        refreshTasks={() => fetchTasks().then((data) => setTasks(data))}
      />

      <table className="mt-4 table table-striped table-bordered table-hover">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Type</th>
            <th>Work Type</th>
            <th>Assigned To</th>
            <th>Assigned By</th>
            <th>Status</th>
            <th>Start Date</th>
            <th>Deadline</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.task_id}>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>{task.is_internal === 1 ? "Internal" : "External"}</td>
              <td>{task.work_type_id}</td>
              <td>{task.assigned_to}</td>
              <td>{task.assigned_by}</td>
              <td>{task.status}</td>
              <td>{task.start_date ? formatDate(task.start_date) : ""}</td>
              <td>{task.deadline ? formatDate(task.deadline) : ""}</td>
              <td>
                <Button variant="primary" size="sm" onClick={() => setEditingTask(task)}>
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(task.task_id)}
                  style={{ marginLeft: "5px" }}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;