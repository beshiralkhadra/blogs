require('dotenv').config();
const { sequelize } = require('./models');
const express = require('express');
const cors = require('cors');

function createApp() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors({ origin: '*' }));

  app.get('/', (req, res) => res.send('Dat App'));

  const blogRoutes = require('./routers/routes/blogRoutes');
  const userRoutes = require('./routers/routes/userRoutes');

  app.use('/auth', userRoutes);
  app.use('/blog', blogRoutes);

  return app;
}

module.exports = { createApp, sequelize };
