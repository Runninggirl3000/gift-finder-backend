require('dotenv').config();
const sequelize = require('./sequelize');
const LovedOne = require('./models/LovedOne');

const seedData = [
  {
    name: "Kyle",
    birthday: "1983-11-23",
    gender: "Male",
    age: 41,
    relationship: "Husband",
    occupation: "Scientist",
    interests: "Triathlon, building atomic clocks, hopes to qualify for Kona Ironman",
    milestone: "Going to Hokkaido with the family for Half Ironman World Championship",
    country: "Singapore"
  },
  {
    name: "Malcolm",
    birthday: "2010-05-11",
    gender: "Male",
    age: 15,
    relationship: "Son",
    occupation: "Student",
    interests: "Anime, Cross Country, Kendrick Lamar, karaoke, running (already has a Garmin watch)",
    milestone: "Watching his first Lady Gaga Concert",
    country: "Singapore"
  },
  {
    name: "Russell",
    birthday: "2014-12-24",
    gender: "Male",
    age: 11,
    relationship: "Son",
    occupation: "Student",
    interests: "Minecraft, Anime, Mathematics, Science, Scootering",
    milestone: "Started studying for PSLE",
    country: "Singapore"
  },
  {
    name: "Ashley",
    birthday: "1983-03-23",
    gender: "Female",
    age: 42,
    relationship: "Sister",
    occupation: "Art Teacher",
    interests: "Art, rugby, cooking healthy meals for her family",
    milestone: "Turned 40 years old this year",
    country: "Singapore"
  },
  {
    name: "Jasmin",
    birthday: "1960-07-07",
    gender: "Female",
    age: 64,
    relationship: "Mother",
    occupation: "Janitor",
    interests: "Painting, karaoke, yoga, travelling",
    milestone: "Retiring this year",
    country: "Singapore"
  }
];

(async () => {
  try {
    await sequelize.sync({ alter: true }); // safe structure sync
    await LovedOne.bulkCreate(seedData);
    console.log('🎉 Loved ones seeded successfully!');
  } catch (err) {
    console.error('❌ Error seeding data:', err);
  } finally {
    await sequelize.close();
  }
})();
