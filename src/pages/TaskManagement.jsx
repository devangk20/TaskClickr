import React, { useEffect, useState } from "react";
import { Modal, Button, Table } from "react-bootstrap";
import Select from "react-select";
import { fetchEmployees } from "../services/employeeService";
import { fetchTasks, createTask } from "../services/taskService";
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
    assigned_to: null,
    start_date: "",
    deadline: "",
    status: "Not Started",
  });

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [workTypes, setWorkTypes] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const subCompanyOptions = [
    { value: "Clickr Services Pvt.", label: "Clickr Services Pvt." },
    { value: "Softech Solution", label: "Softech Solution" },
    { value: "Shriram Enterprise", label: "Shriram Enterprise" },
  ];

  useEffect(() => {
    // Fetch employees
    fetchEmployees()
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching employees:", error));

    // Fetch work types
    fetchWorkTypes()
      .then((data) => setWorkTypes(data))
      .catch((error) => console.error("Error fetching work types:", error));

    // Fetch tasks
    fetchTasks()
    .then((data) => {
      console.log("Fetched tasks:", data); // Debugging
      setTasks(data);
    })
    .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTask({ ...task, [name]: type === "checkbox" ? checked : value });
  };

  const handleTaskTypeChange = (e) => {
    setTask({ ...task, is_internal: e.target.value === "true" });
  };

  const handleEmployeeChange = (selectedOption) => {
    setTask({ ...task, assigned_to: selectedOption ? selectedOption.value : null });
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const taskData = {
      title: task.title,
      description: task.description,
      is_internal: task.is_internal,
      sub_company: task.is_internal ? task.sub_company : null,
      client_name: !task.is_internal ? task.client_name : null,
      client_details: !task.is_internal ? task.client_details : null,
      work_type_id: task.work_type_id,
      assigned_to: task.assigned_to,
      start_date: task.start_date,
      deadline: task.deadline,
      status: task.status,
    };

    try {
      await createTask(taskData);
      alert("Task created successfully!");
      setShowTaskModal(false);
      fetchTasks().then((data) => setTasks(data)); // Refresh tasks
    } catch (error) {
      alert("Error creating task. Please try again.");
    }
  };

  // Helper function to get user name from ID
  const getUserName = (userId) => {
    const user = users.find((u) => u.value === userId);
    return user ? user.label : `User ${userId}`;
  };

  // Helper function to get work type name from ID
  const getWorkTypeName = (workTypeId) => {
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
            <th>Type</th>
            <th>Work Type</th>
            <th>Assigned To</th>
            <th>Status</th>
            <th>Start Date</th>
            <th>Deadline</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.task_id}>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>{task.is_internal ? "Internal" : "External"}</td>
              <td>{getWorkTypeName(task.work_type_id)}</td>
              <td>{getUserName(task.assigned_to)}</td>
              <td>{task.status}</td>
              <td>{task.start_date ? task.start_date.slice(0, 10) : ""}</td>
<td>{task.deadline ? task.deadline.slice(0, 10) : ""}</td>
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
              {/* Left Column */}
              <div className="col-md-6">
                {/* Task Title & Description */}
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
                  ></textarea>
                </div>

                {/* Task Type (Internal/External) */}
                <div className="mb-3">
                  <label className="form-label">Task Type</label>
                  <select
                    className="form-control"
                    name="is_internal"
                    value={task.is_internal}
                    onChange={handleTaskTypeChange}
                  >
                    <option value="true">Internal</option>
                    <option value="false">External</option>
                  </select>
                </div>

                {/* Internal Task: Sub-Company Selection */}
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

                {/* External Task: Client Details */}
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
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Client Details</label>
                      <textarea
                        className="form-control"
                        name="client_details"
                        value={task.client_details}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </div>
                  </>
                )}
              </div>

              {/* Right Column */}
              <div className="col-md-6">
                {/* Work Type Selection */}
                <div className="mb-3">
                  <label className="form-label">Work Type</label>
                  <Select
                    options={workTypes}
                    value={workTypes.find((opt) => opt.value === task.work_type_id)}
                    onChange={handleWorkTypeChange}
                    isClearable
                  />
                </div>

                {/* Assigned Employee (Single Select) */}
                <div className="mb-3">
                  <label className="form-label">Assign To</label>
                  <Select
                    options={users}
                    value={users.find((user) => user.value === task.assigned_to)}
                    onChange={handleEmployeeChange}
                    isClearable
                  />
                </div>

                {/* Task Status */}
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

                {/* Start Date & Deadline */}
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

            {/* Submit Button */}
            <div className="row">
              <div className="col-md-12">
                <button type="submit" className="btn btn-primary w-100">
                  Create Task
                </button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default TaskManagement;