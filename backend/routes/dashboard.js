const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Task = require('../models/Task');

// @route GET /api/dashboard/data
// @desc Get dummy dashboard data mixed with real tasks 
// @access Private
router.get('/data', protect, async (req, res) => {
  try {
    const userTasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });

    const responseData = {
      user: req.user,
      leads: [
        { id: 1, name: 'Aarav Sharma', company: 'TechNova Solutions', status: 'New' },
        { id: 2, name: 'Priya Patel', company: 'Global Logistics Inc', status: 'Contacted' },
        { id: 3, name: 'David Miller', company: 'Nexus Enterprises', status: 'Qualified' },
      ],
      tasks: userTasks,
      users: [
        { id: 201, name: 'Arjun Desai', role: 'Administrator' },
        { id: 202, name: 'Neha Gupta', role: 'Sales Lead' },
        { id: 203, name: 'Samantha Lee', role: 'Support Agent' },
      ]
    };

    res.json(responseData);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching dashboard data' });
  }
});

module.exports = router;
