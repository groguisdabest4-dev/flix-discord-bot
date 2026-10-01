require('dotenv').config();
const config = require('./config');
const { createBot } = require('./bot');

async function start() {
  const client = await createBot();
  client.login(config.DISCORD_TOKEN);
}

start().catch(error => {
  console.error('Failed to start Flix:', error);
  process.exit(1);
});
