const express = require("express");
const Task = require("../models/Task");
const router = express.Router();

// Get all tasks
router.get("/", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// Add a new task
router.post("/", async (req, res) => {
  const newTask = new Task({ text: req.body.text });
  await newTask.save();
  res.json(newTask);
});

// Delete a task
router.delete("/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
});

// Update a task
router.put("/:id", async (req, res) => {
  const { text, completed } = req.body; // Destructure 'completed' from req.body
  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    { text, completed }, // Update both 'text' and 'completed'
    { new: true }
  );
  res.json(updatedTask);
});




module.exports = router;
