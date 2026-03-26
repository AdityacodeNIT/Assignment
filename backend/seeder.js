const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/assignment')
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const seedData = async () => {
  try {
    await User.deleteMany(); // Clear existing users

    const testUser = new User({
      name: 'Test Assignment',
      email: 'test@example.com',
      password: 'password123'
    });

    await testUser.save();
    console.log('Seed data imported! User: test@example.com / password123');
    process.exit();
  } catch (error) {
    console.error('Error importing seed data:', error);
    process.exit(1);
  }
};

seedData();
