require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Users = require('../models/Users');
const bcrypt = require('bcryptjs');
const serverless = require('serverless-http');

const app = express();
app.use(express.json());

// MongoDB connection (cached)
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  isConnected = true;
}

// GET route for browser test
app.get('/', (req, res) => {
  res.json({ message: 'Signup endpoint is alive 🚀' });
});

// POST route for signup
app.post('/', async (req, res) => {
  try {
    await connectDB();
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new Users({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = serverless(app);
