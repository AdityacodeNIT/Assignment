const express = require('express');
const router = express.Router();
const TeamMember = require('../models/TeamMember');
const { protect } = require('../middleware/auth');

// Create Team Member
router.post('/', protect, async (req, res) => {
  try {
    const member = await TeamMember.create({
      user: req.user.id,
      name: req.body.name,
      role: req.body.role
    });
    res.status(201).json(member);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create team member' });
  }
});

// Delete Team Member
router.delete('/:id', protect, async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member || member.user.toString() !== req.user.id) return res.status(404).json({ message: 'Member not found or unauthorized' });
    
    await member.deleteOne();
    res.json({ id: req.params.id, message: 'Member removed' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete team member' });
  }
});

module.exports = router;
