const { DataTypes } = require('sequelize');
const db = require('../db.js');

const Examples = db.define(
  'example',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    example: {
      type: DataTypes.TEXT,
      allowNull: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Examples;
