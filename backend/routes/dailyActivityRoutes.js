const express = require('express');
const router = express.Router();
const {
  createDailyActivity,
  fetchUserTasks,
  fetchAllDailyActivities,
  createAdhocTask
} = require('../controllers/dailyActivityController');

// POST: Create Adhoc task
router.post("/adhoc", createAdhocTask);

// POST: Log a new daily activity
router.post('/daily-activity', createDailyActivity);

// GET: Fetch tasks assigned to a user
router.get('/user-tasks/:userId', fetchUserTasks);

// GET: All daily activities for admin
router.get('/daily-activities', fetchAllDailyActivities);

module.exports = router;
