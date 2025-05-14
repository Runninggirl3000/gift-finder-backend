const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
require('dotenv').config();

const sequelize = require('./sequelize');
const LovedOne = require('./models/LovedOne');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// ✅ Sync the LovedOne table
sequelize.sync({ alter: true })
  .then(() => console.log('✅ Database synced'))
  .catch(err => console.error('❌ Sync error:', err));

// ✅ Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 🎁 Gift Recommendation Endpoint
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

// 👀 View all loved ones
app.get('/loved-ones', async (req, res) => {
  try {
    const lovedOnes = await LovedOne.findAll();
    res.json({ success: true, data: lovedOnes });
  } catch (err) {
    console.error('Error fetching loved ones:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch loved ones' });
  }
});

// 🔌 Start server
app.listen(port, () => {
  console.log(`Gift recommendation API running at http://localhost:${port}`);
});
