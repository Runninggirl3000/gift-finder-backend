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
  return diff >= 13 && diff <= 14;
}

async function runReminders() {
  await sequelize.sync();
  const all = await LovedOne.findAll();

  console.log("📋 Checking birthday formats:");
  for (const person of all) {
    console.log(`${person.name}: ${person.birthday}`);

    if (!person.birthday || isNaN(new Date(person.birthday))) {
      console.warn(`⚠️ Skipping ${person.name}: invalid or missing birthday.`);
      continue;
    }

    const birthdayThisYear = new Date(person.birthday);
    birthdayThisYear.setFullYear(new Date().getFullYear());

    const diff = Math.ceil((birthdayThisYear - new Date()) / (1000 * 60 * 60 * 24));
    console.log(`→ ${person.name}'s birthday is in ${diff} day(s)`);

    if (!isTwoWeeksAway(person.birthday)) continue;

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

      const message = `🎂 *Reminder:* ${person.name}'s birthday is in 2 weeks! (${birthdayThisYear.toLocaleDateString()})

🎁 *Gift Ideas:*
${ideas}

🔗 [View & Edit](${DASHBOARD_URL}${person.id})`;

      await sendTelegramMessage(message);
      console.log(`✅ Sent reminder for ${person.name}`);
    } catch (err) {
      console.error(`❌ Error processing ${person.name}:`, err.response?.data || err.message);
    }
  }

  console.log('✅ Birthday reminders checked.');
}

runReminders();
