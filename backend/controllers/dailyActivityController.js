const pool = require('../config/db');

// POST: Log a daily activity
const createDailyActivity = async (req, res) => {
  console.log('⏳ [createDailyActivity] Request received:', req.body);
  const conn = await pool.getConnection();
  console.log('🔗 Database connection acquired');
  
  try {
    const { isExistingTask, task_id, adhoc_task_data, report_date, activities, 
            actual_work, payment_status, assigned_team, user_id, 
            payment_amount, payment_date, remarks, status } = req.body;

    console.log('🔄 Starting transaction');
    await conn.beginTransaction();

    let taskId = task_id;
    let adhocTaskId = null;

    if (!isExistingTask && adhoc_task_data) {
      console.log('➕ Creating new adhoc task with data:', adhoc_task_data);
      const [result] = await conn.query(
        `INSERT INTO transaction_task 
         (title, description, is_internal, sub_company, client_name, client_details, work_type_id, assigned_to, start_date, deadline, status, assigned_by, adhoc_flag)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        [
          adhoc_task_data.title,
          adhoc_task_data.description,
          adhoc_task_data.is_internal,
          adhoc_task_data.sub_company,
          adhoc_task_data.client_name,
          adhoc_task_data.client_details,
          adhoc_task_data.work_type_id,
          JSON.stringify([user_id]),
          report_date,
          report_date,
          status || 'Pending',
          user_id
        ]
      );
      adhocTaskId = result.insertId;
      taskId = 999;
      console.log(`✅ Adhoc task created with ID: ${adhocTaskId}`);
    }

    console.log('📝 Inserting daily activity record');
    await conn.query(
      `INSERT INTO daily_activity
      (task_id, report_date, activities, actual_work, payment_status, assigned_team, adhoc_task_id, user_id, payment_amount, payment_date, remarks, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        taskId,
        report_date,
        activities,
        actual_work,
        payment_status || 'Not Paid',
        assigned_team,
        adhocTaskId,
        user_id,
        payment_amount,
        payment_date,
        remarks,
        status || 'Pending'
      ]
    );

    await conn.commit();
    console.log('💾 Transaction committed successfully');
    return res.status(201).json({ message: 'Activity logged successfully.' });
  } catch (error) {
    await conn.rollback();
    console.error('❌ Transaction rolled back due to error:', error);
    return res.status(500).json({ message: 'Failed to log activity', error: error.message });
  } finally {
    conn.release();
    console.log('🔓 Database connection released');
  }
};

// GET: Tasks assigned to a specific user
const fetchUserTasks = async (req, res) => {
  console.log('⏳ [fetchUserTasks] Request received for user:', req.params.userId || req.user?.userId);
  const conn = await pool.getConnection();
  console.log('🔗 Database connection acquired');

  try {
    const userId = req.user?.userId || req.params.userId;
    if (!userId) {
      console.warn('⚠️ No user ID provided');
      return res.status(400).json({ error: "User ID is required" });
    }

    console.log(`🔍 Fetching tasks for user ID: ${userId}`);
    const sql = `
      SELECT 
        t.*, 
        GROUP_CONCAT(DISTINCT CONCAT(u.first_name, ' ', u.last_name) SEPARATOR ', ') AS assigned_to_names,
        GROUP_CONCAT(DISTINCT u.user_id) AS assigned_user_ids,
        CONCAT(assigner.first_name, ' ', assigner.last_name) AS assigned_by_name
      FROM transaction_task t
      LEFT JOIN task_assignees ta ON t.task_id = ta.task_id
      LEFT JOIN master_user u ON ta.user_id = u.user_id
      LEFT JOIN master_user assigner ON t.assigned_by = assigner.user_id
      WHERE (ta.user_id = ? OR t.assigned_by = ?) AND t.is_deleted = FALSE
      GROUP BY t.task_id;
    `;
    
    const [results] = await conn.query(sql, [userId, userId]);
    console.log(`📊 Found ${results.length} tasks for user ${userId}`);
    
    if (!results.length) {
      console.log('ℹ️ No tasks found for user');
      return res.status(404).json({ message: "No tasks found for this user" });
    }
    
    return res.json(results);
  } catch (err) {
    console.error("❌ Error fetching user tasks:", err);
    return res.status(500).json({ error: "Database error", details: err.message });
  } finally {
    conn.release();
    console.log('🔓 Database connection released');
  }
};

// GET: All daily activities (admin/reporting)
const fetchAllDailyActivities = async (req, res) => {
  console.log('⏳ [fetchAllDailyActivities] Request received');
  const conn = await pool.getConnection();
  console.log('🔗 Database connection acquired');

  try {
    console.log('🔍 Fetching all daily activities');
    const [activities] = await conn.query(
      `SELECT da.*, 
       CONCAT(u.first_name, ' ', u.last_name) AS user_name
       FROM daily_activity da
       JOIN master_user u ON da.user_id = u.user_id
       WHERE da.is_deleted = 0 
       ORDER BY da.report_date DESC`
    );
    
    console.log(`📊 Found ${activities.length} activities`);
    
    if (!activities.length) {
      console.log('ℹ️ No activities found');
      return res.status(404).json({ message: "No activities found" });
    }
    
    return res.json(activities);
  } catch (error) {
    console.error('❌ Error fetching daily activities:', error);
    return res.status(500).json({ 
      message: 'Failed to fetch activities',
      error: error.message 
    });
  } finally {
    conn.release();
    console.log('🔓 Database connection released');
  }
};

// POST: Create Adhoc Task separately (optional)
const createAdhocTask = async (req, res) => {
  console.log('⏳ [createAdhocTask] Request received:', req.body);
  const conn = await pool.getConnection();
  console.log('🔗 Database connection acquired');

  try {
    const {
      title,
      description,
      is_internal,
      sub_company,
      client_name,
      client_details,
      work_type_id,
      user_id,
      status
    } = req.body;

    console.log('➕ Creating new adhoc task');
    const [result] = await conn.query(
      `INSERT INTO transaction_task 
        (title, description, is_internal, sub_company, client_name, client_details, work_type_id, assigned_to, start_date, deadline, status, assigned_by, adhoc_flag)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, ?, 1)`,
      [
        title,
        description,
        is_internal,
        sub_company,
        client_name,
        client_details,
        work_type_id,
        JSON.stringify([user_id]),
        status || 'Pending',
        user_id
      ]
    );

    console.log(`✅ Adhoc task created with ID: ${result.insertId}`);
    return res.status(201).json({ 
      message: "Adhoc task created", 
      taskId: result.insertId 
    });
  } catch (error) {
    console.error("❌ Error creating adhoc task:", error);
    return res.status(500).json({ 
      message: "Failed to create adhoc task", 
      error: error.message 
    });
  } finally {
    conn.release();
    console.log('🔓 Database connection released');
  }
};

module.exports = {
  createDailyActivity,
  fetchUserTasks,
  fetchAllDailyActivities,
  createAdhocTask
};