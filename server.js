const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/taskflow';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to Imperial Database 👑'))
  .catch(err => console.error('Database connection error:', err));

// Schema
const DataSchema = new mongoose.Schema({
  users: Array,
  projects: Array,
  tasks: Array,
}, { timestamps: true });

const AppData = mongoose.model('AppData', DataSchema);

// API Routes
app.get('/api/data', async (req, res) => {
  try {
    let data = await AppData.findOne();
    if (!data) {
      // Initialize with seed data if empty
      data = new AppData({ users: [], projects: [], tasks: [] });
      await data.save();
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/data', async (req, res) => {
  try {
    const { users, projects, tasks } = req.body;
    let data = await AppData.findOne();
    if (data) {
      data.users = users;
      data.projects = projects;
      data.tasks = tasks;
    } else {
      data = new AppData({ users, projects, tasks });
    }
    await data.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve Frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Imperial Server running on port ${PORT} 👑`);
});
