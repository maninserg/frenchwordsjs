const { DataTypes } = require('sequelize');
const db = require('../db.js');
const Translate = require('./translates.js');
const Example = require('./examples');

const Word = db.define(
  'word',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    word: {
      type: DataTypes.STRING(25),
      allowNull: true,
      unique: true,
    },
    ipa_str: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true,
    },
    forvo_link: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      unique: true,
    },
    favotire: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

Word.hasMany(Translate);
Translate.belongsTo(Word);

Word.hasMany(Example);
Example.belongsTo(Word);

module.exports = Word;
