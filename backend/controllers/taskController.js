const db = require("../config/db");

// Get all tasks with assigned users
const getAllTasks = (req, res) => {
  const sql = `
    SELECT 
      t.*, 
      GROUP_CONCAT(CONCAT(u.first_name, ' ', u.last_name)) AS assigned_to_names,
      GROUP_CONCAT(u.user_id) AS assigned_user_ids,
      CONCAT(assigner.first_name, ' ', assigner.last_name) AS assigned_by_name
    FROM transaction_task t
    LEFT JOIN task_assignees ta ON t.task_id = ta.task_id
    LEFT JOIN master_user u ON ta.user_id = u.user_id
    LEFT JOIN master_user assigner ON t.assigned_by = assigner.user_id
    WHERE t.is_deleted = FALSE
    GROUP BY t.task_id;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error fetching tasks:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
};

// Get tasks assigned to a specific user
const getUserTasks = (req, res) => {
  const userId = req.user.userId;

  const sql = `
    SELECT 
      t.*, 
      GROUP_CONCAT(CONCAT(u.first_name, ' ', u.last_name)) AS assigned_to_names,
      GROUP_CONCAT(u.user_id) AS assigned_user_ids,
      CONCAT(assigner.first_name, ' ', assigner.last_name) AS assigned_by_name
    FROM transaction_task t
    JOIN task_assignees ta ON t.task_id = ta.task_id
    JOIN master_user u ON ta.user_id = u.user_id
    LEFT JOIN master_user assigner ON t.assigned_by = assigner.user_id
    WHERE ta.user_id = ? AND t.is_deleted = FALSE
    GROUP BY t.task_id;
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("❌ Error fetching user tasks:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
};

// Create a task
const createTask = (req, res) => {
  const {
    title, description, is_internal, work_type_id, client_name,
    client_details, assigned_to = [], start_date, deadline,
    status, assigned_by, sub_company
  } = req.body;

  const taskSql = `
    INSERT INTO transaction_task (
      title, description, is_internal, work_type_id, client_name,
      client_details, assigned_to, start_date, deadline, status, assigned_by, sub_company
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const taskValues = [
    title, description, is_internal, work_type_id, client_name,
    client_details, JSON.stringify(assigned_to),
    start_date, deadline, status, assigned_by,
    is_internal ? sub_company : null
  ];

  db.query(taskSql, taskValues, (err, result) => {
    if (err) {
      console.error("❌ Error creating task:", err);
      return res.status(500).json({ error: "Task creation failed" });
    }

    const taskId = result.insertId;

    if (!assigned_to.length) {
      return res.status(201).json({ message: "✅ Task created", taskId });
    }

    const assigneeSql = `INSERT INTO task_assignees (task_id, user_id) VALUES ?`;
    const assigneeValues = assigned_to.map(userId => [taskId, userId]);

    db.query(assigneeSql, [assigneeValues], (err) => {
      if (err) {
        console.error("❌ Error assigning users:", err);
        return res.status(500).json({ error: "Task created, but failed to assign users" });
      }

      res.status(201).json({ message: "✅ Task created with assignees", taskId });
    });
  });
};

// Update task
const updateTask = (req, res) => {
  const taskId = req.params.id;
  const {
    title, description, is_internal, work_type_id, client_name,
    client_details, assigned_to = [], start_date, deadline,
    status, assigned_by, sub_company
  } = req.body;

  const sql = `
    UPDATE transaction_task 
    SET title = ?, description = ?, is_internal = ?, work_type_id = ?, 
        client_name = ?, client_details = ?, assigned_to = ?, start_date = ?, deadline = ?, 
        status = ?, assigned_by = ?, sub_company = ?
    WHERE task_id = ? AND is_deleted = FALSE
  `;

  const values = [
    title, description, is_internal, work_type_id, client_name,
    client_details, JSON.stringify(assigned_to),
    start_date, deadline, status, assigned_by,
    is_internal ? sub_company : null,
    taskId
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("❌ Error updating task:", err);
      return res.status(500).json({ error: "Task update failed" });
    }

    db.query("DELETE FROM task_assignees WHERE task_id = ?", [taskId], (err) => {
      if (err) {
        console.error("❌ Error clearing old assignees:", err);
        return res.status(500).json({ error: "Task updated, but failed to clear assignees" });
      }

      if (!assigned_to.length) {
        return res.json({ message: "✅ Task updated with no assignees" });
      }

      const insertSql = `INSERT INTO task_assignees (task_id, user_id) VALUES ?`;
      const insertValues = assigned_to.map(userId => [taskId, userId]);

      db.query(insertSql, [insertValues], (err) => {
        if (err) {
          console.error("❌ Error inserting assignees:", err);
          return res.status(500).json({ error: "Task updated, but failed to assign users" });
        }

        res.json({ message: "✅ Task updated with assignees" });
      });
    });
  });
};

// Update only task status
const updateTaskStatus = (req, res) => {
  const taskId = req.params.id;
  const { status, description } = req.body;

  const sql = "UPDATE transaction_task SET status = ?, description = ? WHERE task_id = ? AND is_deleted = FALSE";

  db.query(sql, [status, description, taskId], (err, result) => {
    if (err) {
      console.error("❌ Error updating task status:", err);
      return res.status(500).json({ error: "Server error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Task not found or already deleted" });
    }

    res.json({ message: "✅ Task status updated" });
  });
};

// Soft delete a task
const deleteTask = (req, res) => {
  const taskId = req.params.id;

  const sql = "UPDATE transaction_task SET is_deleted = TRUE WHERE task_id = ?";

  db.query(sql, [taskId], (err, result) => {
    if (err) {
      console.error("❌ Error deleting task:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "✅ Task deleted" });
  });
};

module.exports = {
  getAllTasks,
  getUserTasks,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask
};
