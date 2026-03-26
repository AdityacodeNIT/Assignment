const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'User' 
  },
  title: { 
    type: String, 
    required: true 
  },
  dueDate: { 
    type: String, 
    required: true,
    default: () => new Date().toISOString().split('T')[0]
  },
  completed: { 
    type: Boolean, 
    default: false 
  }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
