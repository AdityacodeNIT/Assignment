const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('./models/User');

let mongoServer;

const connectDB = async () => {
  try {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    
    await mongoose.connect(uri);
    console.log('In-Memory MongoDB connected!');
    
    // Seed test user automatically
    const userExists = await User.findOne({ email: 'test@example.com' });
    if (!userExists) {
      await User.create({
        name: 'Test Assignment',
        email: 'test@example.com',
        password: 'password123'
      });
      console.log('Test user seeded automatically.');
    }

  } catch (error) {
    console.error('Error connecting to Memory DB:', error);
  }
};

module.exports = connectDB;
