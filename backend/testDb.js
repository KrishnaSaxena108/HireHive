require('dotenv').config();
const db = require('./models');

async function testConnection() {
  try {
    await db.sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // optionally create a sample user if no users exist
    const { User } = db;
    const count = await User.count();
    console.log(`User table has ${count} record(s).`);

    if (count === 0) {
      const newUser = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123' // while bcrypt might be applied via hook in model
      });
      console.log('Created sample user:', newUser.toJSON());
    }

    process.exit(0);
  } catch (err) {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  }
}

testConnection();
