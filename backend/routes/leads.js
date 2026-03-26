const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const { protect } = require('../middleware/auth');

// Create Lead
router.post('/', protect, async (req, res) => {
  try {
    const lead = await Lead.create({
      user: req.user.id,
      name: req.body.name,
      company: req.body.company,
      status: req.body.status || 'New'
    });
    res.status(201).json(lead);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create lead' });
  }
});

// Update Lead
router.put('/:id', protect, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead || lead.user.toString() !== req.user.id) return res.status(404).json({ message: 'Lead not found or unauthorized' });
    
    if (req.body.name) lead.name = req.body.name;
    if (req.body.company) lead.company = req.body.company;
    if (req.body.status) lead.status = req.body.status;
    
    const updatedLead = await lead.save();
    res.json(updatedLead);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update lead' });
  }
});

// Delete Lead
router.delete('/:id', protect, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead || lead.user.toString() !== req.user.id) return res.status(404).json({ message: 'Lead not found or unauthorized' });
    
    await lead.deleteOne();
    res.json({ id: req.params.id, message: 'Lead removed' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete lead' });
  }
});

module.exports = router;
