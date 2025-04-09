import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import {
  getAssignedTasks,
  createAdhocTask,
  logDailyActivity
} from "../services/dailyActivityService";

const DailyActivity = () => {
  const [showModal, setShowModal] = useState(false);
  const [isExistingTask, setIsExistingTask] = useState(true);
  const [taskOptions, setTaskOptions] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [adhocTask, setAdhocTask] = useState({ title: "", description: "" });
  const [activity, setActivity] = useState({
    report_date: "",
    activities: "",
    actual_work: "",
    payment_status: "Not Paid",
    assigned_team: "",
    remarks: "",
    payment_amount: "",
    payment_date: "",
    status: "Pending"
  });

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchTasks = async () => {
      if (userId && isExistingTask) {
        try {
          const tasks = await getAssignedTasks(userId);
          const options = Array.isArray(tasks)
            ? tasks.map((task) => ({
                label: task.title,
                value: task.task_id
              }))
            : [];
          setTaskOptions(options);
        } catch (error) {
          console.error("Failed to fetch tasks:", error);
        }
      }
    };

    fetchTasks();
  }, [isExistingTask, userId]);

  const handleAdhocChange = (e) => {
    const { name, value } = e.target;
    setAdhocTask({ ...adhocTask, [name]: value });
  };

  const handleToggleChange = () => {
    setIsExistingTask(!isExistingTask);
    setSelectedTask(null);
  };

  const handleActivityChange = (e) => {
    const { name, value } = e.target;
    setActivity({ ...activity, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      let taskId = selectedTask?.value || null;
      let adhocTaskId = null;

      if (!isExistingTask) {
        const adhocTaskRes = await createAdhocTask({
          ...adhocTask,
          assigned_by: userId
        });
        adhocTaskId = adhocTaskRes.task_id;
      }

      const payload = {
        ...activity,
        task_id: isExistingTask ? taskId : null,
        adhoc_task_id: isExistingTask ? null : adhocTaskId,
        user_id: userId
      };

      await logDailyActivity(payload);
      alert("Activity logged successfully");
      setShowModal(false);
    } catch (error) {
      console.error("Failed to log activity:", error);
      alert("Failed to log activity");
    }
  };

  return (
    <div className="p-3">
      <Button onClick={() => setShowModal(true)}>Log Daily Activity</Button>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Log Daily Activity</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Check
              type="switch"
              label="Existing Task"
              checked={isExistingTask}
              onChange={handleToggleChange}
              className="mb-3"
            />

            <Row>
              <Col md={6}>
                {isExistingTask ? (
                  <Form.Group className="mb-3">
                    <Form.Label>Select Task</Form.Label>
                    <Select
                      options={taskOptions}
                      value={selectedTask}
                      onChange={setSelectedTask}
                    />
                  </Form.Group>
                ) : (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label>Task Title</Form.Label>
                      <Form.Control
                        name="title"
                        value={adhocTask.title}
                        onChange={handleAdhocChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Task Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="description"
                        value={adhocTask.description}
                        onChange={handleAdhocChange}
                      />
                    </Form.Group>
                  </>
                )}

                <Form.Group className="mb-3">
                  <Form.Label>Report Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="report_date"
                    value={activity.report_date}
                    onChange={handleActivityChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Activities</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="activities"
                    value={activity.activities}
                    onChange={handleActivityChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Actual Work</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="actual_work"
                    value={activity.actual_work}
                    onChange={handleActivityChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Assigned Team</Form.Label>
                  <Form.Control
                    name="assigned_team"
                    value={activity.assigned_team}
                    onChange={handleActivityChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Remarks</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="remarks"
                    value={activity.remarks}
                    onChange={handleActivityChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Payment Status</Form.Label>
                  <Form.Select
                    name="payment_status"
                    value={activity.payment_status}
                    onChange={handleActivityChange}
                  >
                    <option value="Not Paid">Not Paid</option>
                    <option value="Paid">Paid</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Payment Amount</Form.Label>
                  <Form.Control
                    type="number"
                    name="payment_amount"
                    value={activity.payment_amount}
                    onChange={handleActivityChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Payment Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="payment_date"
                    value={activity.payment_date}
                    onChange={handleActivityChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={activity.status}
                    onChange={handleActivityChange}
                  >
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DailyActivity;
