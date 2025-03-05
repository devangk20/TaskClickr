exports.getAllTasks = (req, res) => {
  const { userId, role } = req.user; // Assuming user data is extracted from JWT token or session

  let sql;
  let params = [];

  if (role === "Admin" || role === "Super Admin") {
    // Admins and Super Admins can see all tasks
    sql = `
      SELECT 
        tt.task_id, tt.title, tt.description, tt.client_name, tt.assigned_to, 
        tt.deadline, tt.status, 
        CONCAT(u1.first_name, ' ', COALESCE(u1.middle_name, ''), ' ', u1.last_name) AS assigned_to_name, 
        CONCAT(u2.first_name, ' ', COALESCE(u2.middle_name, ''), ' ', u2.last_name) AS assigned_by_name 
      FROM transaction_task tt
      LEFT JOIN master_user u1 ON tt.assigned_to = u1.user_id
      LEFT JOIN master_user u2 ON tt.assigned_by = u2.user_id;
    `;
  } else {
    // Employees can see only tasks assigned to them
    sql = `
      SELECT 
        tt.task_id, tt.title, tt.description, tt.client_name, tt.assigned_to, 
        tt.deadline, tt.status, 
        CONCAT(u1.first_name, ' ', COALESCE(u1.middle_name, ''), ' ', u1.last_name) AS assigned_to_name, 
        CONCAT(u2.first_name, ' ', COALESCE(u2.middle_name, ''), ' ', u2.last_name) AS assigned_by_name 
      FROM transaction_task tt
      LEFT JOIN master_user u1 ON tt.assigned_to = u1.user_id
      LEFT JOIN master_user u2 ON tt.assigned_by = u2.user_id
      WHERE tt.assigned_to = ?;
    `;
    params.push(userId);
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("❌ Error fetching tasks:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
};
