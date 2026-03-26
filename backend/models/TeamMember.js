const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'User' 
  },
  name: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('TeamMember', teamMemberSchema);
