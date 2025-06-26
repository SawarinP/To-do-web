const express = require('express');
const router = express.Router();
const Task = require('../models/Task');


// 🔹 GET: All Tasks
router.get('/getAll', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});


// 🔹 GET: Summary of Status
router.get('/stats', async (req, res) => {
    try {
      const total = await Task.countDocuments();
      const completed = await Task.countDocuments({ status: 'Completed' });
      const inProgress = await Task.countDocuments({ status: 'In Progress' });
      const notStarted = await Task.countDocuments({ status: 'Not Started' });
  
      const stats = {
        completed: total ? Math.round((completed / total) * 100) : 0,
        inProgress: total ? Math.round((inProgress / total) * 100) : 0,
        notStarted: total ? Math.round((notStarted / total) * 100) : 0,
      };
  
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
});


// 🔹 GET: Completed Tasks
router.get('/completed', async (req, res) => {
  try {
    const tasks = await Task.find({ status: 'Completed' }).sort({ updatedAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to get completed tasks" });
  }
});


// 🔹 POST: Create Task
router.post('/add', async (req, res) => {
  try {
    const { title, description, priority, status, createdAt, dueDate } = req.body;

    // ตรวจสอบ fields ที่ขาด
    const missingFields = [];
    if (!title) missingFields.push('title');
    if (!description) missingFields.push('description');
    if (!priority) missingFields.push('priority');
    if (!status) missingFields.push('status');
    if (!createdAt) missingFields.push('createdAt');
    if (!dueDate) missingFields.push('dueDate');

    if (missingFields.length > 0) {
      return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
    }

    const newTask = new Task({
      title,
      description,
      priority,
      status,
      dueDate: new Date(dueDate),
      createdAt: new Date(createdAt),
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    console.error('[ERROR] Failed to create task:', err);
    res.status(400).json({ error: "Failed to create task" });
  }
});




// 🔹 PATCH: Update Task
router.patch('/update/:id', async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Task not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to update task" });
  }
});


// 🔹 DELETE: Delete Task
router.delete('/delete/:id', async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete task" });
  }
});

module.exports = router;
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    console.error('Failed to fetch task:', err);
    res.status(500).json({ error: 'Server error' });
  }
});