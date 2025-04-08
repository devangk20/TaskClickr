import React, { useState, useEffect } from "react";
import { fetchUserActivities, addDailyActivity, fetchTaskDetails, fetchUsers } from "../services/dailyActivityService";
import { Table, Button, Form, Container, Alert, Modal } from "react-bootstrap";

const DailyActivity = ({ user }) => {
  const [activities, setActivities] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    task_id: "",
    adhoc_task_name: "",
    report_date: "",
    activities: "",
    actual_work: "",
    payment_status: "",
    assigned_team: [],
    payment_amount: "",
    payment_date: "",
    remarks: "",
    status: "",
  });
  const [message, setMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [taskExists, setTaskExists] = useState(false);

  useEffect(() => {
    if (user && user.user_id) {
      fetchUserActivities(user.user_id, localStorage.getItem("token"))
        .then((data) => setActivities(data))
        .catch((error) => console.error("Error fetching activities", error));
      
      fetchUsers(localStorage.getItem("token"))
        .then((data) => setUsers(data))
        .catch((error) => console.error("Error fetching users", error));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "task_id") {
      checkTaskExists(value);
    }
  };

  const handleMultiSelect = (e) => {
    const selectedValues = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData({ ...formData, assigned_team: selectedValues });
  };

  const checkTaskExists = async (task_id) => {
    if (task_id.trim() === "") {
      setTaskExists(false);
      return;
    }

    try {
      const taskDetails = await fetchTaskDetails(task_id, localStorage.getItem("token"));
      if (taskDetails) {
        setTaskExists(true);
        setFormData({ ...formData, ...taskDetails });
      } else {
        setTaskExists(false);
        setFormData({
          ...formData,
          adhoc_task_name: "",
          activities: "",
          actual_work: "",
        });
      }
    } catch (error) {
      console.error("Error fetching task details", error);
      setTaskExists(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDailyActivity({ ...formData, user_id: user.user_id }, localStorage.getItem("token"));
      setMessage("Activity logged successfully!");
      setFormData({
        task_id: "",
        adhoc_task_name: "",
        report_date: "",
        activities: "",
        actual_work: "",
        payment_status: "",
        assigned_team: [],
        payment_amount: "",
        payment_date: "",
        remarks: "",
        status: "",
      });
      setShowModal(false);
      fetchUserActivities(user.user_id, localStorage.getItem("token")).then((data) => setActivities(data));
    } catch (error) {
      console.error("Error adding activity", error);
      setMessage("Failed to log activity.");
    }
  };

  return (
    <Container className="mt-4">
      <h2>Daily Activity Log</h2>

      {message && <Alert variant="success">{message}</Alert>}

      <Button variant="primary" onClick={() => setShowModal(true)}>
        Create Log
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Log New Activity</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Task ID</Form.Label>
              <Form.Control type="text" name="task_id" value={formData.task_id} onChange={handleChange} required />
            </Form.Group>

            {!taskExists && (
              <Form.Group className="mb-3">
                <Form.Label>Adhoc Task Name</Form.Label>
                <Form.Control type="text" name="adhoc_task_name" value={formData.adhoc_task_name} onChange={handleChange} required />
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Report Date</Form.Label>
              <Form.Control type="date" name="report_date" value={formData.report_date} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Activities</Form.Label>
              <Form.Control type="text" name="activities" value={formData.activities} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Actual Work</Form.Label>
              <Form.Control type="text" name="actual_work" value={formData.actual_work} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Payment Status</Form.Label>
              <Form.Control as="select" name="payment_status" value={formData.payment_status} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Paid">Paid</option>
                <option value="Not Paid">Not Paid</option>
              </Form.Control>
            </Form.Group>

            {formData.payment_status === "Paid" && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Payment Amount</Form.Label>
                  <Form.Control type="number" name="payment_amount" value={formData.payment_amount} onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Payment Date</Form.Label>
                  <Form.Control type="date" name="payment_date" value={formData.payment_date} onChange={handleChange} required />
                </Form.Group>
              </>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Assigned Team</Form.Label>
              <Form.Control as="select" multiple name="assigned_team" onChange={handleMultiSelect}>
                {users.map((user) => (
                  <option key={user.user_id} value={user.user_id}>
                    {user.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Remarks</Form.Label>
              <Form.Control type="text" name="remarks" value={formData.remarks} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Control as="select" name="status" value={formData.status} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </Form.Control>
            </Form.Group>

            <Button variant="success" type="submit">
              Log Activity
            </Button>
            <Button variant="secondary" className="ms-2" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default DailyActivity;
