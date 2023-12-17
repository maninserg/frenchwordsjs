const { DataTypes } = require('sequelize');
const db = require('../db.js');
const Example = require('./examples');

const Translate = db.define(
  'translate',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    translate: {
      type: DataTypes.STRING(25),
      allowNull: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

Translate.hasMany(Example);
Example.belongsTo(Translate);

module.exports = Translate;
