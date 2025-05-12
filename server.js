const sequelize = require('./sequelize');
const FamilyMember = require('./models/FamilyMember');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// ✅ Initialize OpenAI with the new client format
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 🎁 Generate gift recommendations
app.post('/recommend', async (req, res) => {
  const { name, occupation, interests, milestone, relationship, country, gender, age } = req.body;

  const prompt = `Suggest three birthday gifts for a person named ${name}.
They are a ${age}-year-old ${gender} ${occupation}, and their interests include ${interests}.
They recently ${milestone || 'experienced a meaningful life event'}.
Their relationship to the user is: ${relationship}.
Gifts should fall into the following categories:
1. Under $25
2. Under $50
3. Feeling generous (up to $500)

For each gift, include a thoughtful reason why it's a good fit, considering their age, gender, and relationship.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    });

    const aiReply = completion.choices[0].message.content;
    res.json({ success: true, suggestions: aiReply });
  } catch (error) {
    console.error('Error fetching gift recommendations:', error.message);
    res.status(500).json({ success: false, error: 'Failed to get recommendations.' });
  }
});

// 👨‍👩‍👧 Add a family member
app.post('/family/add', async (req, res) => {
  try {
    const newMember = await FamilyMember.create(req.body);
    res.json({ success: true, member: newMember });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to add member' });
  }
});

// 📋 Get all family members
app.get('/family', async (req, res) => {
  try {
    const members = await FamilyMember.findAll();
    res.json(members);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

// 🔁 Sync DB and start the server
sequelize.sync().then(() => {
  app.listen(port, () => {
