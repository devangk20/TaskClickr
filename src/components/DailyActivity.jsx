import React, { useState, useEffect } from "react";
import { fetchUserActivities, addDailyActivity } from "../services/dailyActivityService"; // ✅ Corrected path
import { Table, Button, Form, Container, Alert } from "react-bootstrap";

const DailyActivity = ({ user }) => {
  const [activities, setActivities] = useState([]);
  const [formData, setFormData] = useState({
    task_id: "",
    report_date: "",
    activities: "",
    actual_work: "",
    payment_status: "",
    assigned_team: "",
  });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (user && user.user_id) {
      fetchUserActivities(user.user_id, localStorage.getItem("token"))
        .then((data) => setActivities(data)) // ✅ Directly set data
        .catch((error) => console.error("Error fetching activities", error));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDailyActivity(formData, localStorage.getItem("token"));
      setMessage("Activity logged successfully!");
      setFormData({ task_id: "", report_date: "", activities: "", actual_work: "", payment_status: "", assigned_team: "" });
      
      // Refresh the activity list
      fetchUserActivities(user.user_id, localStorage.getItem("token"))
        .then((data) => setActivities(data));
    } catch (error) {
      console.error("Error adding activity", error);
      setMessage("Failed to log activity.");
    }
  };

  return (
    <Container className="mt-4">
      <h2>Daily Activity Log</h2>
      
      {message && <Alert variant="success">{message}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Task ID</Form.Label>
          <Form.Control type="text" name="task_id" value={formData.task_id} onChange={handleChange} required />
        </Form.Group>

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
            <option value="Pending">Pending</option>
          </Form.Control>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Assigned Team</Form.Label>
          <Form.Control type="text" name="assigned_team" value={formData.assigned_team} onChange={handleChange} required />
        </Form.Group>

        <Button variant="primary" type="submit">Log Activity</Button>
      </Form>

      <h3 className="mt-4">Activity History</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Task ID</th>
            <th>Date</th>
            <th>Activities</th>
            <th>Actual Work</th>
            <th>Payment</th>
            <th>Team</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity, index) => (
            <tr key={activity.id}>
              <td>{index + 1}</td>
              <td>{activity.task_id}</td>
              <td>{activity.report_date}</td>
              <td>{activity.activities}</td>
              <td>{activity.actual_work}</td>
              <td>{activity.payment_status}</td>
              <td>{activity.assigned_team}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default DailyActivity;
