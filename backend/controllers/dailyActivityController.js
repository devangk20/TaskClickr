const dailyActivityService = require("../services/dailyActivityService");

const addDailyActivity = async (req, res) => {
  try {
    const newActivity = await dailyActivityService.createActivity(req.body);
    res.status(201).json(newActivity);
  } catch (error) {
    res.status(500).json({ message: "Error adding activity", error });
  }
};

const getAllDailyActivities = async (req, res) => {
  try {
    const activities = await dailyActivityService.getAllActivities();
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: "Error fetching activities", error });
  }
};

// ✅ Make sure to export the functions properly
module.exports = {
  addDailyActivity,
  getAllDailyActivities,
};
