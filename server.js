const cfg = require('./nubot/config.js')
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 9000

const app = express();
app.get('/', (req, res) => {
  const message = `Welcome to Nubot (${cfg.getEnvConfig('APP_ENV')})!`
  res.send(message);
});
app.listen(PORT, () => console.log(`Server listening at http://localhost:${PORT}`));