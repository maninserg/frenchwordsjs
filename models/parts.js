const { DataTypes } = require('sequelize');
const db = require('../db.js');
const Word = require('./words.js');

const Part = db.define(
  'part',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    part: {
      type: DataTypes.STRING(25),
      allowNull: true,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    favorite: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    timestamps: true,
  }
);

Part.hasMany(Word);
Word.belongsTo(Part);

module.exports = Part;
