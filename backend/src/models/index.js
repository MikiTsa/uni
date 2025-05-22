// src/models/index.js
require('dotenv').config();
const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect:  'postgres',
  protocol: 'postgres',
  logging:  false,
});

const models = {};

// 1) Dynamically load each model file
fs.readdirSync(__dirname)
  .filter(file => file.endsWith('.js') && file !== 'index.js')
  .forEach(file => {
    const defineModel = require(path.join(__dirname, file));
    const model = defineModel(sequelize);
    models[model.name] = model;
  });

// 2) Attach them to sequelize.models so associations can see each other
Object.keys(models).forEach(name => {
  sequelize.models[name] = models[name];
});

// 3) Run all `associate` methods
Object.values(models)
  .filter(m => typeof m.associate === 'function')
  .forEach(m => m.associate(sequelize.models));

module.exports = { sequelize, ...sequelize.models };