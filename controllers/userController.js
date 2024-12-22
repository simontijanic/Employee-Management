const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Schedule = require("../models/scheduleModel");
const Application = require("../models/applicationModel");

exports.dashboard = async (req, res) => {
  try {
    const users = await User.find();
    res.render("dashboard", {
      employees: users || [],
      path: "dashboard",
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Server Error");
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id; 
    const loggedInUserId = req.user.userId;

    const employee = await User.findById(userId);

    if (!employee) {
      return res.status(404).send("User not found");
    }

    const isCurrentUser = userId === loggedInUserId; 

    res.render("user-profile", {
      employee,
      isCurrentUser,
      path: "user-profile",
    });

  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Server Error");
  }
};

exports.getSchedule = async (req, res) => {
  try {
    const schedules = await Schedule.find();
    const employees = await User.find();

    const Events = schedules.map(schedule => ({
      title: schedule.task,
      start: schedule.shiftStartTime,
      end: schedule.shiftEndTime,
      description: schedule.task, // Optional: add additional info if needed
      status: schedule.status
    }));

    
    res.render("schedule", {
      path: "schedule",
      employees,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

exports.postSchedule = async (req, res) => {
  try {
    const { date, shiftStartTime, shiftEndTime, task, status } =
      req.body;

    const startDate = new Date(date);
    const startTime = shiftStartTime.split(":");
    startDate.setHours(startTime[0], startTime[1]);

    const employee = req.user.userId;

    const endDate = new Date(date);
    const endTime = shiftEndTime.split(":");
    endDate.setHours(endTime[0], endTime[1]);

    // Create a new schedule document
    const newSchedule = new Schedule({
      employee,
      date,
      shiftStartTime: startDate,
      shiftEndTime: endDate,
      task,
      status,
    });

    await newSchedule.save();

    res
      .status(201)
      .json({
        message: "Schedule created successfully!",
        schedule: newSchedule,
      });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while creating the schedule." });
  }
};
