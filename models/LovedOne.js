const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const LovedOne = sequelize.define('LovedOne', {
  name: DataTypes.STRING,
  birthday: DataTypes.DATEONLY,
  gender: DataTypes.STRING,
  age: DataTypes.INTEGER,
  relationship: DataTypes.STRING,
  occupation: DataTypes.STRING,
  interests: DataTypes.STRING,
  milestone: DataTypes.STRING,
  country: DataTypes.STRING
});

module.exports = LovedOne;
