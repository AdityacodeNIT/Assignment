const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Task = require('../models/Task');
const Lead = require('../models/Lead');
const TeamMember = require('../models/TeamMember');

// @route GET /api/dashboard/data
// @desc Get dashboard data combining static and user-created dynamic objects
// @access Private
router.get('/data', protect, async (req, res) => {
  try {
    const userTasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    const userLeads = await Lead.find({ user: req.user.id }).sort({ createdAt: -1 });
    const userTeams = await TeamMember.find({ user: req.user.id }).sort({ createdAt: -1 });

    const responseData = {
      user: req.user,
      leads: [
        ...userLeads,
        { id: 1, name: 'Aarav Sharma', company: 'TechNova Solutions', status: 'New' },
        { id: 2, name: 'Priya Patel', company: 'Global Logistics Inc', status: 'Contacted' },
        { id: 3, name: 'David Miller', company: 'Nexus Enterprises', status: 'Qualified' },
      ],
      tasks: [
        ...userTasks,
        { id: 101, title: 'Call Aarav Sharma regarding new proposal', dueDate: '2026-03-27', completed: false },
        { id: 102, title: 'Send contract draft to Priya Patel', dueDate: '2026-03-28', completed: false },
        { id: 103, title: 'Follow up with David Miller', dueDate: '2026-03-26', completed: true },
      ],
      users: [
        ...userTeams,
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
