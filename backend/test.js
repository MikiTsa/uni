// quick‐and‐dirty test.js
const { sequelize } = require('./src/models');
sequelize
  .authenticate()
  .then(() => console.log('✅ Connected!'))
  .catch(e => console.error('❌ Connection failed:', e));