const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./users'); // Assuming you have a User model

/**
 * @swagger
 * components:
 *  schemas:
 *    File:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *        userId:
 *          type: integer
 *        originalFilename:
 *          type: string
 *        storagePath:
 *          type: text
 *        title:
 *          type: string
 *        description:
 *          type: text
 *        status:
 *          type: string
 *        extractedData:
 *          type: text
 */
const File = sequelize.define('File', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  originalFilename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  storagePath: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'uploaded',
    validate: {
      isIn: [['uploaded', 'processing', 'processed', 'failed']],
    },
  },
  extractedData: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

module.exports = File;