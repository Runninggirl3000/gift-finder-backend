const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const sequelize = require('./sequelize');
const LovedOne = require('./models/LovedOne');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// 🎉 Test route
app.get('/', (req, res) => {
  res.send('Gift Finder API is running');
});

// ✅ Get all loved ones
app.get('/loved-ones', async (req, res) => {
  try {
    const all = await LovedOne.findAll();
    res.json({ success: true, data: all });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to get loved ones' });
  }
});

// ✅ Get a single loved one by ID
app.get('/loved-ones/:id', async (req, res) => {
  try {
    const lovedOne = await LovedOne.findByPk(req.params.id);
    if (!lovedOne) {
      return res.status(404).json({ success: false, message: 'Loved one not found' });
    }
    res.json({ success: true, data: lovedOne });
  } catch (error) {
    console.error('Error fetching by ID:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// ✅ Add new loved one
app.post('/loved-ones/add', async (req, res) => {
  try {
    const newLovedOne = await LovedOne.create(req.body);
    res.status(201).json({ success: true, data: newLovedOne });
  } catch (err) {
    console.error('Error creating:', err);
    res.status(400).json({ success: false, message: 'Error creating loved one' });
  }
});

// ✅ Update loved one by ID
app.put('/loved-ones/:id', async (req, res) => {
  try {
    const lovedOne = await LovedOne.findByPk(req.params.id);
    if (!lovedOne) {
      return res.status(404).json({ success: false, message: 'Loved one not found' });
    }
    await lovedOne.update(req.body);
    res.json({ success: true, data: lovedOne });
  } catch (error) {
    console.error('Error updating:', error);
    res.status(400).json({ success: false, message: 'Failed to update loved one' });
  }
});

// 🔁 Sync and listen
sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
