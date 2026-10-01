const { REST, Routes } = require('discord.js');
const config = require('../config');

async function registerSlashCommands(client, commands) {
  if (!config.DISCORD_CLIENT_ID || !config.DISCORD_TOKEN) {
    console.warn('Skipping command registration because DISCORD_CLIENT_ID or DISCORD_TOKEN is missing.');
    return;
  }

  const commandsPayload = Array.from(commands.values()).map(command => command.data.toJSON());

  const rest = new REST({ version: '10' }).setToken(config.DISCORD_TOKEN);

  if (config.SERVER_ID) {
    await rest.put(
      Routes.applicationGuildCommands(config.DISCORD_CLIENT_ID, config.SERVER_ID),
      { body: commandsPayload }
    );
  } else {
    await rest.put(Routes.applicationCommands(config.DISCORD_CLIENT_ID), { body: commandsPayload });
  }
}

module.exports = { registerSlashCommands };
