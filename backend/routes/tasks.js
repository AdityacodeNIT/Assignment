const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');

// @route POST /api/tasks
// @desc Create a new task
router.post('/', protect, async (req, res) => {
  try {
    const task = await Task.create({
      user: req.user.id,
      title: req.body.title,
      dueDate: req.body.dueDate
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create task' });
  }
});

// @route PUT /api/tasks/:id
// @desc Update task (toggle complete, rename)
router.put('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Ensure user owns task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    if (req.body.title) task.title = req.body.title;
    if (req.body.dueDate) task.dueDate = req.body.dueDate;
    if (req.body.completed !== undefined) task.completed = req.body.completed;
    
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update task' });
  }
});

// @route DELETE /api/tasks/:id
// @desc Delete task
router.delete('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Ensure user owns task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await task.deleteOne();
    res.json({ id: req.params.id, message: 'Task removed' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete task' });
  }
});

module.exports = router;
