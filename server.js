const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const { OpenAI } = require('openai');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/recommend', async (req, res) => {
  const { name, occupation, interests, milestone, relationship, country, gender, age } = req.body;

  try {
    const prompt = `Suggest three birthday gifts for a person named ${name}.
They are a ${age}-year-old ${gender} ${occupation}, and their interests include ${interests}.
They recently ${milestone || 'experienced a meaningful life event'}.
Their relationship to the user is: ${relationship}.
Gifts should fall into the following categories:
1. Under $25
2. Under $50
3. Feeling generous (up to $500)

For each gift, include a thoughtful reason why it's a good fit, considering their age, gender, and relationship.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
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

app.listen(port, () => {
  console.log(`Gift recommendation API running at http://localhost:${port}`);
});
