const {Sequelize} = require('sequelize');

require('dotenv').config();

const { DATABASE_URL } = process.env;
module.exports = new Sequelize(DATABASE_URL);