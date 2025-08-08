require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Users = require('../models/Users');
const serverless = require('serverless-http');

const app = express();
app.use(express.json());

let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  isConnected = true;
}
connectDB();

app.get('/', async (req, res) => {
  const users = await Users.find();
  res.json(users);
});

app.post('/', async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = new Users({ name, email });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = app;
module.exports.handler = serverless(app);
