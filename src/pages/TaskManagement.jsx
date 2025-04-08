import React, { useEffect, useState } from "react";
import { Modal, Button, Table } from "react-bootstrap";
import Select from "react-select";
import { fetchEmployees } from "../services/employeeService";
import { fetchTasks, createTask, updateTask, deleteTask } from "../services/taskService";
import { fetchWorkTypes } from "../services/workTypeService";

const TaskManagement = () => {
  const [task, setTask] = useState({
    title: "",
    description: "",
    is_internal: true,
    sub_company: "",
    client_name: "",
    client_details: "",
    work_type_id: "",
    assigned_to: [],
    start_date: "",
    deadline: "",
    status: "Not Started",
    assigned_by: "",
  });

  const [userId, setUserId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [workTypes, setWorkTypes] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const subCompanyOptions = [
    { value: "Clickr ", label: "Clickr Services Pvt." },
    { value: "Softech ", label: "Softech Solution" },
    { value: "Shriram ", label: "Shriram Enterprise" },
  ];

  // Helper function to format ISO date to YYYY-MM-DD
  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }

    fetchEmployees()
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching employees:", error));

    fetchWorkTypes()
      .then((data) => setWorkTypes(data))
      .catch((error) => console.error("Error fetching work types:", error));

    fetchTasks()
      .then((data) => {
        console.log("Fetched tasks:", data);
        setTasks(data);
      })
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTask({ ...task, [name]: type === "checkbox" ? checked : value });
  };

  const handleTaskTypeChange = (e) => {
    const value = Number(e.target.value);
    setTask({
      ...task,
      is_internal: value,
      sub_company: value ? task.sub_company : "",
      client_name: value ? "" : task.client_name,
      client_details: value ? "" : task.client_details,
    });
  };

  const handleEmployeeChange = (selectedOptions) => {
    setTask({
      ...task,
      assigned_to: selectedOptions ? selectedOptions.map((opt) => opt.value) : [],
    });
  };

  const handleWorkTypeChange = (selectedOption) => {
    setTask({
      ...task,
      work_type_id: selectedOption ? selectedOption.value : null,
    });
  };

  const handleStatusChange = (e) => {
    setTask({ ...task, status: e.target.value });
  };

  const validateDates = () => {
    const startDate = new Date(task.start_date);
    const deadline = new Date(task.deadline);
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

    if (startDate < fifteenDaysAgo) {
      alert("Start date cannot be more than 15 days in the past.");
      return false;
    }

    if (deadline < startDate) {
      alert("Deadline cannot be before start date.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userId) {
      console.error("UserId is undefined. Ensure user is logged in.");
      return;
    }

    if (!validateDates()) return;

    const taskData = {
      title: task.title,
      description: task.description,
      is_internal: task.is_internal ? 1 : 0,
      sub_company: task.is_internal ? task.sub_company : null,
      client_name: !task.is_internal ? task.client_name : null,
      client_details: !task.is_internal ? task.client_details : null,
      work_type_id: task.work_type_id,
      assigned_to: task.assigned_to,
      start_date: task.start_date,
      deadline: task.deadline,
      status: task.status,
      assigned_by: userId,
    };

    try {
      await createTask(taskData);
      alert("Task created successfully!");
      
      // Reset form
      setTask({
        title: "",
        description: "",
        is_internal: true,
        sub_company: "",
        client_name: "",
        client_details: "",
        work_type_id: "",
        assigned_to: [],
        start_date: "",
        deadline: "",
        status: "Not Started",
        assigned_by: userId,
      });

      setShowTaskModal(false);
      fetchTasks().then((data) => setTasks(data));
    } catch (error) {
      console.error("Error creating task:", error);
      alert(`Error creating task: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setTask({
      title: task.title,
      description: task.description,
      is_internal: task.is_internal === 1,
      sub_company: task.sub_company || "",
      client_name: task.client_name || "",
      client_details: task.client_details || "",
      work_type_id: task.work_type_id || "",
      assigned_to: Array.isArray(task.assigned_to) ? task.assigned_to : [task.assigned_to].filter(Boolean),
      start_date: formatDate(task.start_date),
      deadline: formatDate(task.deadline),
      status: task.status,
      assigned_by: task.assigned_by || userId,
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateDates()) return;

    const updatedTaskData = {
      title: task.title,
      description: task.description,
      is_internal: task.is_internal ? 1 : 0,
      sub_company: task.is_internal ? task.sub_company : null,
      client_name: !task.is_internal ? task.client_name : null,
      client_details: !task.is_internal ? task.client_details : null,
      work_type_id: task.work_type_id,
      assigned_to: task.assigned_to,
      start_date: task.start_date,
      deadline: task.deadline,
      status: task.status,
      assigned_by: userId,
    };

    try {
      await updateTask(editingTask.task_id, updatedTaskData);
      alert("Task updated successfully!");
      setShowEditModal(false);
      fetchTasks().then((data) => setTasks(data));
    } catch (error) {
      console.error("Error updating task:", error);
      alert(`Error updating task: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDelete = async (taskId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;

    try {
      await deleteTask(taskId);
      alert("Task deleted successfully!");
      fetchTasks().then((data) => setTasks(data));
    } catch (error) {
      console.error("Error deleting task:", error);
      alert(`Error deleting task: ${error.response?.data?.message || error.message}`);
    }
  };

  const getUserName = (userId) => {
    const user = users.find((u) => u.value === userId);
    return user ? user.label : `User ${userId}`;
  };

  const getWorkTypeName = (workTypeId) => {
    if (!workTypeId) return "N/A";
    const workType = workTypes.find((w) => w.value === workTypeId);
    return workType ? workType.label : `Work Type ${workTypeId}`;
  };

  return (
    <div className="container mt-5 pt-5">
      <h2 className="mb-4">Task Management</h2>

      <Button variant="primary" onClick={() => setShowTaskModal(true)}>
        Create Task
      </Button>

      {/* Task Table */}
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Client/Company</th>
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
              <td>{task.is_internal === 1 ? task.sub_company : task.client_name}</td>
              <td>{getWorkTypeName(task.work_type_id)}</td>
              <td>
                {task.assigned_to && task.assigned_to.length > 0 
                  ? task.assigned_to.map((id) => getUserName(id)).join(", ")
                  : "Unassigned"}
              </td>
              <td>{task.assigned_by_name || "N/A"}</td>
              <td>{task.status}</td>
              <td>{task.start_date ? formatDate(task.start_date) : ""}</td>
              <td>{task.deadline ? formatDate(task.deadline) : ""}</td>
              <td>
                <Button variant="primary" size="sm" onClick={() => handleEdit(task)}>
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(task.task_id)}
                  className="ms-2"
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Task Creation Modal */}
      <Modal show={showTaskModal} onHide={() => setShowTaskModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Task Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={task.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={task.description}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Task Type</label>
                  <select
                    className="form-control"
                    name="is_internal"
                    value={task.is_internal}
                    onChange={handleTaskTypeChange}
                  >
                    <option value={1}>Internal</option>
                    <option value={0}>External</option>
                  </select>
                </div>
                {task.is_internal && (
                  <div className="mb-3">
                    <label className="form-label">Sub-Company</label>
                    <Select
                      options={subCompanyOptions}
                      value={subCompanyOptions.find((opt) => opt.value === task.sub_company)}
                      onChange={(opt) => setTask({ ...task, sub_company: opt ? opt.value : "" })}
                    />
                  </div>
                )}
                {!task.is_internal && (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Client Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="client_name"
                        value={task.client_name}
                        onChange={handleChange}
                        required={!task.is_internal}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Client Details</label>
                      <textarea
                        className="form-control"
                        name="client_details"
                        value={task.client_details}
                        onChange={handleChange}
                        required={!task.is_internal}
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Work Type</label>
                  <Select
                    options={workTypes}
                    value={workTypes.find((opt) => opt.value === task.work_type_id)}
                    onChange={handleWorkTypeChange}
                    isClearable
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Assign To</label>
                  <Select
                    options={users}
                    value={users.filter((user) => task.assigned_to.includes(user.value))}
                    onChange={handleEmployeeChange}
                    isMulti
                    isClearable
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="start_date"
                    value={task.start_date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Deadline</label>
                  <input
                    type="date"
                    className="form-control"
                    name="deadline"
                    value={task.deadline}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Create Task
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* Task Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleEditSubmit}>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Task Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={task.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={task.description}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Task Type</label>
                  <select
                    className="form-control"
                    name="is_internal"
                    value={task.is_internal}
                    onChange={handleTaskTypeChange}
                  >
                    <option value={1}>Internal</option>
                    <option value={0}>External</option>
                  </select>
                </div>
                {task.is_internal && (
                  <div className="mb-3">
                    <label className="form-label">Sub-Company</label>
                    <Select
                      options={subCompanyOptions}
                      value={subCompanyOptions.find((opt) => opt.value === task.sub_company)}
                      onChange={(opt) => setTask({ ...task, sub_company: opt ? opt.value : "" })}
                    />
                  </div>
                )}
                {!task.is_internal && (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Client Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="client_name"
                        value={task.client_name}
                        onChange={handleChange}
                        required={!task.is_internal}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Client Details</label>
                      <textarea
                        className="form-control"
                        name="client_details"
                        value={task.client_details}
                        onChange={handleChange}
                        required={!task.is_internal}
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Work Type</label>
                  <Select
                    options={workTypes}
                    value={workTypes.find((opt) => opt.value === task.work_type_id)}
                    onChange={handleWorkTypeChange}
                    isClearable
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Assign To</label>
                  <Select
                    options={users}
                    value={users.filter((user) => task.assigned_to.includes(user.value))}
                    onChange={handleEmployeeChange}
                    isMulti
                    isClearable
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select
                    className="form-control"
                    name="status"
                    value={task.status}
                    onChange={handleChange}
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="Started">Started</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="start_date"
                    value={task.start_date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Deadline</label>
                  <input
                    type="date"
                    className="form-control"
                    name="deadline"
                    value={task.deadline}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Update Task
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default TaskManagement;