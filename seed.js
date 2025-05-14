const sequelize = require('./sequelize');
const LovedOne = require('./models/LovedOne'); // Make sure this matches your file name and export

const seedData = [
  {
    name: 'Kyle',
    birthday: '1983-11-23',
    gender: 'Male',
    relationship: 'Husband',
    occupation: 'Scientist',
    interests: 'Triathlon, building atomic clocks, hopes to qualify for Kona Ironman World Championship one day',
    milestone: 'Going to Hokkaido with the family for his Half Ironman World Championship',
    country: 'Singapore'
  },
  {
    name: 'Malcolm',
    birthday: '2010-05-11',
    gender: 'Male',
    relationship: 'Son',
    occupation: 'Student',
    interests: 'Anime, Cross Country, Kendrick Lamar, karaoke, running (already has a Garmin watch)',
    milestone: 'Turned 15 this year, Watching his first Lady Gaga Concert',
    country: 'Singapore'
  },
  {
    name: 'Russell',
    birthday: '2014-12-24',
    gender: 'Male',
    relationship: 'Son',
    occupation: 'Student',
    interests: 'Minecraft, Anime, Mathematics, Science, Scootering',
    milestone: 'Started studying for PSLE',
    country: 'Singapore'
  },
  {
    name: 'Ashley',
    birthday: '1983-03-23',
    gender: 'Female',
    relationship: 'Sister',
    occupation: 'Art Teacher',
    interests: 'Art, rugby, cooking healthy meals for her family',
    milestone: 'Turned 40 years old this year',
    country: 'Singapore'
  },
  {
    name: 'Jasmin',
    birthday: '1960-07-07',
    gender: 'Female',
    relationship: 'Mother',
    occupation: 'Janitor',
    interests: 'Painting, karaoke, yoga, travelling',
    milestone: 'Retiring this year',
    country: 'Singapore'
  }
];

(async () => {
  try {
    await sequelize.sync({ force: true }); // DANGER: drops & recreates tables
    await LovedOne.bulkCreate(seedData);
    console.log('✅ Database seeded with loved ones!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
})();
