const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'User' 
  },
  name: { 
    type: String, 
    required: true 
  },
  company: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    required: true,
    enum: ['New', 'Contacted', 'Qualified'],
    default: 'New'
  }
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
