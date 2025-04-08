const db = require("../config/db");

// Get combined task summary for an Admin and Company
exports.getCombinedTaskSummary = async (req, res) => {
  try {
    const adminId = req.params.adminId;
    if (!adminId) {
      return res.status(400).json({ error: "Invalid Admin ID" });
    }

    console.log("Fetching task summary for Admin ID:", adminId);

    // Queries
    const adminQuery = `
      SELECT
        IFNULL(SUM(CASE WHEN DATE(start_date) = CURDATE() THEN 1 ELSE 0 END), 0) AS todays_tasks,
        IFNULL(SUM(CASE WHEN status NOT IN ('Completed') THEN 1 ELSE 0 END), 0) AS pending_tasks,
        IFNULL(SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END), 0) AS completed_tasks
      FROM transaction_task
      WHERE assigned_to = ? AND is_deleted = 0;
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

    // Execute queries
    const [adminResults] = await db.promise().execute(adminQuery, [adminId]);
    const [companyResults] = await db.promise().execute(companyQuery);

    // Format results
    const result = {
      adminTasks: adminResults[0] || { todays_tasks: 0, pending_tasks: 0, completed_tasks: 0 },
      companyTasks: companyResults[0] || { todays_tasks: 0, pending_tasks: 0, completed_tasks: 0, total_tasks: 0 }
    };

    console.log("API Response:", JSON.stringify(result, null, 2));
    res.json(result);
  } catch (error) {
    console.error("Error in getCombinedTaskSummary:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
