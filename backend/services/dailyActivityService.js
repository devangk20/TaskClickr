const db = require("../config/db");

const addDailyActivity = async (task_id, report_date, activities, actual_work, payment_status, assigned_team) => {
  await db.query(
    "INSERT INTO transaction_daily_activity (task_id, report_date, activities, actual_work, payment_status, assigned_team) VALUES (?, ?, ?, ?, ?, ?)",
    [task_id, report_date, activities, actual_work, payment_status, assigned_team]
  );
  return { message: "Activity logged successfully" };
};

const getUserActivities = async (userId) => {
  const [activities] = await db.query(
    "SELECT * FROM transaction_daily_activity WHERE task_id IN (SELECT task_id FROM transaction_task WHERE assigned_to = ?)",
    [userId]
  );
  return activities;
};

module.exports = { addDailyActivity, getUserActivities };
