// index.js at project root
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const { sequelize } = require('./src/models');

const app = express();
app.use(express.json());


app.use(session({
    secret: 'temporary-insecure-dev-secret', 
    resave: false,
    saveUninitialized: false, 
    cookie: { 
        secure: process.env.NODE_ENV === 'production', 
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 
    }
}));



// sanity check
app.get('/', (req, res) => res.send('✅ API is up'));

// mount your routers
app.use('/api/program', require('./src/routes/programs'));
app.use('/api',          require('./src/routes/years'));
app.use('/api/subjects',          require('./src/routes/subjects'));
app.use('/api/files',          require('./src/routes/files'));
app.use('/api/users',    require('./src/routes/users'));


// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

const port = process.env.PORT || 3000;
sequelize.authenticate()
  .then(() => app.listen(port, () => console.log(`Server running at http://localhost:${port}`)))
  .catch(err => console.error('DB connection failed:', err));