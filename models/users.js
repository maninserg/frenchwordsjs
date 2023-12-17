const { DataTypes } = require('sequelize');
const db = require('../db.js');
const Part = require('./parts.js');
const Translate = require('./translates.js');
const Example = require('./examples');
const Word = require('./words.js');

const User = db.define(
  'user',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(25),
      allowNull: true,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    firstname: {
      type: DataTypes.STRING(25),
    },
  },
  {
    timestamps: true,
  }
);

User.hasMany(Word);
Word.belongsTo(User);

User.hasMany(Translate);
Translate.belongsTo(User);

User.hasMany(Part);
Part.belongsTo(User);

User.hasMany(Example);
Example.belongsTo(User);

module.exports = User;
