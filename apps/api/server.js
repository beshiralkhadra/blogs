require('dotenv').config();
const { createApp, sequelize } = require('./app');
const port = process.env.PORT || 4433;
const app = createApp();

app.listen(port, async () => {
  try {
    console.log(`app listening on http://localhost:${port}`);
    await sequelize.sync().then(() => {
      console.log('Database connected successfully');
    });
  } catch (error) {
    console.error(error);
  }
});
