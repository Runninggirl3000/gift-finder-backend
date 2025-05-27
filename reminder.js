require('dotenv').config();
const axios = require('axios');
const sequelize = require('./sequelize');
const LovedOne = require('./models/LovedOne');

const API_URL = 'https://gift-finder-api.onrender.com/recommend';
const DASHBOARD_URL = 'https://gift-finder-beta.onrender.com/prefilled-data.html?id=';

async function sendTelegramMessage(text) {
  const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
  await axios.post(url, {
    chat_id: process.env.TELEGRAM_CHAT_ID,
    text,
    parse_mode: 'Markdown'
  });
}

function isTwoWeeksAway(dateStr) {
  const today = new Date();
  const birthday = new Date(dateStr);
  birthday.setFullYear(today.getFullYear()); // ensure it's this year's birthday

  const diff = Math.ceil((birthday - today) / (1000 * 60 * 60 * 24));
  return diff === 0;
}

async function runReminders() {
  await sequelize.sync();

  const all = await LovedOne.findAll();
  for (const person of all) {
    if (!person.birthday || !isTwoWeeksAway(person.birthday)) continue;

    const recPromptData = {
      name: person.name,
      occupation: person.occupation || '',
      interests: person.interests || '',
      milestone: person.milestone || '',
      relationship: person.relationship || '',
      country: person.country || '',
      gender: person.gender || '',
      age: person.age || ''
    };

    try {
      const recRes = await axios.post(API_URL, recPromptData);
      const ideas = recRes.data.suggestions;

      const message = `🎂 *Reminder:* ${person.name}'s birthday is in 2 weeks! (${new Date(person.birthday).toLocaleDateString()})

🎁 *Gift Ideas:*
${ideas}

🔗 [View & Edit](${DASHBOARD_URL}${person.id})`;

      await sendTelegramMessage(message);
    } catch (err) {
      console.error(`❌ Error processing ${person.name}:`, err.message);
    }
  }

  console.log('✅ Birthday reminders checked.');
}

runReminders();
