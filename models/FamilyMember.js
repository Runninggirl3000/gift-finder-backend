const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const FamilyMember = sequelize.define('FamilyMember', {
  name: DataTypes.STRING,
  birthday: DataTypes.DATEONLY,
  age: DataTypes.INTEGER,
  gender: DataTypes.STRING,
  relationship: DataTypes.STRING,
  occupation: DataTypes.STRING,
  interests: DataTypes.TEXT,
  milestone: DataTypes.TEXT,
  country: DataTypes.STRING
});

module.exports = FamilyMember;
