import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import Select from "react-select";
import { fetchEmployees } from "../services/employeeService";
import { fetchWorkTypes } from "../services/workTypeService";
import { createTask, updateTask } from "../services/taskService";

const TaskForm = ({ show, onHide, editingTask, setEditingTask, refreshTasks }) => {
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
    assigned_by: "John Doe", // Replace with actual user from authentication
  });

  const [users, setUsers] = useState([]);
  const [workTypes, setWorkTypes] = useState([]);

  const subCompanyOptions = [
    { value: "Clickr ", label: "Clickr Services Pvt." },
    { value: "Softech ", label: "Softech Solution" },
    { value: "Shriram ", label: "Shriram Enterprise" },
  ];

  useEffect(() => {
    if (editingTask) {
      setTask({
        title: editingTask.title,
        description: editingTask.description,
        is_internal: editingTask.is_internal,
        sub_company: editingTask.sub_company,
        client_name: editingTask.client_name,
        client_details: editingTask.client_details,
        work_type_id: editingTask.work_type_id,
        assigned_to: editingTask.assigned_to,
        start_date: editingTask.start_date,
        deadline: editingTask.deadline,
        status: editingTask.status,
      });
    } else {
      setTask({
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
        assigned_by: "John Doe",
      });
    }
  }, [editingTask]);

  useEffect(() => {
    fetchEmployees()
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching employees:", error));

    fetchWorkTypes()
      .then((data) => setWorkTypes(data))
      .catch((error) => console.error("Error fetching work types:", error));
  }, []);
  const handleClose = () => {
    setEditingTask(null);
    onHide();
  };
  
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

  const handleEmployeeChange = (selectedOption) => {
    setTask({ ...task, assigned_to: selectedOption ? selectedOption.value : null });
  };

  const handleWorkTypeChange = (selectedOption) => {
    setTask({
      ...task,
      work_type_id: selectedOption ? selectedOption.value : null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
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
      assigned_by: task.assigned_by,
    };
  
    try {
      if (editingTask) {
        await updateTask(editingTask.task_id, taskData);
        alert("Task updated successfully!");
      } else {
        await createTask(taskData);
        alert("Task created successfully!");
      }
      setEditingTask(null);  // Reset editing state after submission
      onHide();
      refreshTasks();
    } catch (error) {
      alert(`Error ${editingTask ? "updating" : "creating"} task. Please try again.`);
    }
  };
  

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{editingTask ? "Edit Task" : "Create Task"}</Modal.Title>
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
                ></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label">Task Type</label>
                <select
                  className="form-control"
                  name="is_internal"
                  value={task.is_internal}
                  onChange={handleTaskTypeChange}
                >
                  <option value="1">Internal</option>
                  <option value="0">External</option>
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
                  value={users.find((user) => user.value === task.assigned_to)}
                  onChange={handleEmployeeChange}
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
          <div className="row">
            <div className="col-md-12">
              <button type="submit" className="btn btn-primary w-100">
                {editingTask ? "Update Task" : "Create Task"}
              </button>
            </div>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default TaskForm;