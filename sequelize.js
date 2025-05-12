const { Sequelize } = require('sequelize');
const { parse } = require('pg-connection-string');

const config = parse(process.env.DATABASE_URL);

const sequelize = new Sequelize(config.database, config.user, config.password, {
  host: config.host,
  port: config.port,
  dialect: 'postgres',
  logging: false,
});
