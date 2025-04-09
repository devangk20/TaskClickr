const db = require("../config/db");

exports.getCombinedTaskSummary = async (req, res) => {
  try {
    const adminId = req.params.adminId;
    if (!adminId) {
      return res.status(400).json({ error: "Invalid Admin ID" });
    }

    const adminQuery = `
      SELECT
        IFNULL(SUM(CASE WHEN DATE(t.start_date) = CURDATE() THEN 1 ELSE 0 END), 0) AS todays_tasks,
        IFNULL(SUM(CASE WHEN t.status NOT IN ('Completed') THEN 1 ELSE 0 END), 0) AS pending_tasks,
        IFNULL(SUM(CASE WHEN t.status = 'Completed' THEN 1 ELSE 0 END), 0) AS completed_tasks
      FROM transaction_task t
      JOIN task_assignees ta ON t.task_id = ta.task_id
      WHERE ta.user_id = ? AND t.is_deleted = 0;
    `;

    const companyQuery = `
      SELECT
        IFNULL(SUM(CASE WHEN DATE(start_date) = CURDATE() THEN 1 ELSE 0 END), 0) AS todays_tasks,
        IFNULL(SUM(CASE WHEN status NOT IN ('Completed') THEN 1 ELSE 0 END), 0) AS pending_tasks,
        IFNULL(SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END), 0) AS completed_tasks,
        COUNT(*) AS total_tasks
      FROM transaction_task
      WHERE is_deleted = 0;
    `;

    const [adminResults] = await db.execute(adminQuery, [adminId]);
    const [companyResults] = await db.execute(companyQuery);

    const response = {
      adminTasks: adminResults[0] || {
        todays_tasks: 0,
        pending_tasks: 0,
        completed_tasks: 0
      },
      companyTasks: companyResults[0] || {
        todays_tasks: 0,
        pending_tasks: 0,
        completed_tasks: 0,
        total_tasks: 0
      }
    };

    console.log("Sending response:", JSON.stringify(response, null, 2));
    res.json(response);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};