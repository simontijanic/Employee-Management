const router = require("express").Router();
const {
  validateToken,
  validateAdmin,
} = require("../middleware/authenticationMiddleware");
const { login } = require("../controllers/loginController");
const { dashboard, getUserProfile, getSchedule, postSchedule } = require("../controllers/userController");
const { editEmployee, createUser, getApplications, getCreateEmployee } = require("../controllers/adminController");

router.get("/", validateToken, dashboard); 
router.get("/login", (req, res) => {
  res.render("login", { path: "login" });
});
router.get("/schedule", validateToken, getSchedule);

router.get("/edit-user/:id",validateToken, validateAdmin, editEmployee);
router.get("/user-profile/:id", validateToken, getUserProfile);
router.get("/create-user", validateToken, validateAdmin, getCreateEmployee);
router.post("/create-user", validateToken, validateAdmin, createUser);

router.post("/create-user-post", validateToken, validateAdmin, createUser);

router.get("/applications", validateToken, validateAdmin, getApplications);

router.post("/login-submit", login);
router.post("/schedule-submit", validateToken, postSchedule);

const Schedule = require("../models/scheduleModel");
router.get("/api/schedules", async (req ,res)=> {
  try {
    // Fetch all schedules from the database
    const schedules = await Schedule.find()

    // Format the events for FullCalendar
    const events = schedules.map((schedule) => ({
      title: schedule.task,
      start: schedule.shiftStartTime.toISOString(),
      end: schedule.shiftEndTime.toISOString(),
      description: schedule.task,
      status: schedule.status,
    }));

    console.log(events);  // Add this to check the format of the response

    res.json(events);  // Send as JSON response
  } catch (error) {
    console.error("Error fetching schedules:", error);
    res.status(500).json({ message: "Server error", error });
  }

}); // This will call the getSchedules function



module.exports = router;
