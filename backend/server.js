require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

const app = express();

const User = require('./models/User');
const Record = require('./models/Record');

mongoose.connect(
  process.env.MONGO_URI
)
.then(() => {
  console.log('MongoDB Connected');
})
.catch((error) => {
  console.log(error);
});

app.use(cors());
app.use(express.json());

async function seedData() {

  const existingUsers = await User.find();

  if (existingUsers.length === 0) {

    await User.create([
      {
        username: 'alice.johnson',
        password: 'admin123',
        role: 'Admin',
        name: 'Alice Johnson',
        department: 'IT Administration',
        employeeId: 'EMP1001',
        email: 'alice.johnson@company.com'
      },
      {
        username: 'bob.smith',
        password: 'user123',
        role: 'General User',
        name: 'Bob Smith',
        department: 'Finance',
        employeeId: 'EMP1024',
        email: 'bob.smith@company.com'
      },
      {
        username: 'carol.white',
        password: 'user123',
        role: 'General User',
        name: 'Carol White',
        department: 'Human Resources',
        employeeId: 'EMP1056',
        email: 'carol.white@company.com'
      }
    ]);

    await Record.create([
      {
        username: 'bob.smith',
        resource: 'HR Portal',
        accessLevel: 'Read Only',
        status: 'Active'
      },
      {
        username: 'bob.smith',
        resource: 'Inventory System',
        accessLevel: 'Restricted',
        status: 'Pending'
      },
      {
        username: 'carol.white',
        resource: 'Finance Dashboard',
        accessLevel: 'Read Only',
        status: 'Pending'
      },
      {
        username: 'alice.johnson',
        resource: 'Admin Console',
        accessLevel: 'Full Access',
        status: 'Active'
      }
    ]);

    console.log('Initial Data Seeded');
  }
}
seedData();

// CHECK USERNAME
app.get('/api/users/check/:username', async (req, res) => {

  const user = await User.findOne({
    username: req.params.username
  });

  res.json(user);
});

// LOGIN
app.post('/api/login', async (req, res) => {

  const { username, password, role } = req.body;

  await new Promise(resolve => setTimeout(resolve, 1000));

  const user = await User.findOne({
    username,
    password,
    role
  });

  if (user) {

    res.json({
      success: true,
      token: 'dummy-jwt-token',
      user
    });

  } else {

    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});


// GET USERS
app.get('/api/users', async (req, res) => {

  await new Promise(resolve => setTimeout(resolve, 700));

  const users = await User.find();

  res.json(users);
});


// ADD USER
app.post('/api/users', async (req, res) => {

  const newUser = await User.create(req.body);

  res.json({
    success: true,
    user: newUser
  });
});


// DELETE USER
app.delete('/api/users/:id', async (req, res) => {

  await User.findByIdAndDelete(req.params.id);

  res.json({
    success: true
  });
});


// GET USER RECORDS
app.get('/api/records/:username', async (req, res) => {

  await new Promise(resolve => setTimeout(resolve, 700));

  const records = await Record.find({
    username: req.params.username
  });

  res.json(records);
});


// GET ALL RECORDS
app.get('/api/records', async (req, res) => {

  await new Promise(resolve => setTimeout(resolve, 700));

  const records = await Record.find();

  res.json(records);
});


// CREATE RECORD
app.post('/api/records', async (req, res) => {

  const newRecord = await Record.create(req.body);

  res.json({
    success: true,
    record: newRecord
  });
});

// UPDATE RECORD STATUS
app.put('/api/records/:id', async (req, res) => {

  const updatedRecord = await Record.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updatedRecord);
});


const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});