const db = require("../config/db");

// Get all tasks with assigned users
const getAllTasks = async (req, res) => {
  try {
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
    const [results] = await db.query(sql);
    res.json(results);
  } catch (err) {
    console.error("❌ Error fetching tasks:", err);
    res.status(500).json({ error: "Database error" });
  }
};

// Get tasks assigned to a specific user
const getUserTasks = async (req, res) => {
  const userId = req.user.userId;
  try {
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
    const [results] = await db.query(sql, [userId]);
    res.json(results);
  } catch (err) {
    console.error("❌ Error fetching user tasks:", err);
    res.status(500).json({ error: "Database error" });
  }
};

// Create a task
const createTask = async (req, res) => {
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

  try {
    const [result] = await db.query(taskSql, taskValues);
    const taskId = result.insertId;

    if (!assigned_to.length) {
      return res.status(201).json({ message: "✅ Task created", taskId });
    }

    const assigneeSql = `INSERT INTO task_assignees (task_id, user_id) VALUES ?`;
    const assigneeValues = assigned_to.map(userId => [taskId, userId]);

    await db.query(assigneeSql, [assigneeValues]);

    res.status(201).json({ message: "✅ Task created with assignees", taskId });
  } catch (err) {
    console.error("❌ Error creating task:", err);
    res.status(500).json({ error: "Task creation failed" });
  }
};

// Update task
const updateTask = async (req, res) => {
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

  try {
    await db.query(sql, values);
    await db.query("DELETE FROM task_assignees WHERE task_id = ?", [taskId]);

    if (!assigned_to.length) {
      return res.json({ message: "✅ Task updated with no assignees" });
    }

    const insertSql = `INSERT INTO task_assignees (task_id, user_id) VALUES ?`;
    const insertValues = assigned_to.map(userId => [taskId, userId]);

    await db.query(insertSql, [insertValues]);
    res.json({ message: "✅ Task updated with assignees" });
  } catch (err) {
    console.error("❌ Error updating task:", err);
    res.status(500).json({ error: "Task update failed" });
  }
};

// Update only task status
const updateTaskStatus = async (req, res) => {
  const taskId = req.params.id;
  const { status, description } = req.body;

  try {
    const [result] = await db.query(
      "UPDATE transaction_task SET status = ?, description = ? WHERE task_id = ? AND is_deleted = FALSE",
      [status, description, taskId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Task not found or already deleted" });
    }

    res.json({ message: "✅ Task status updated" });
  } catch (err) {
    console.error("❌ Error updating task status:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Soft delete a task
const deleteTask = async (req, res) => {
  const taskId = req.params.id;

  try {
    const [result] = await db.query(
      "UPDATE transaction_task SET is_deleted = TRUE WHERE task_id = ?",
      [taskId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "✅ Task deleted" });
  } catch (err) {
    console.error("❌ Error deleting task:", err);
    res.status(500).json({ error: "Database error" });
  }
};

module.exports = {
  getAllTasks,
  getUserTasks,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask
};
