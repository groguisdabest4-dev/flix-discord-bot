const { REST, Routes } = require('discord.js');
const config = require('../config');
const { getGuildConfig } = require('../db');
const { AVAILABLE_COMMANDS } = require('./index');

async function registerSlashCommands(client, commands) {
  if (!config.DISCORD_CLIENT_ID || !config.DISCORD_TOKEN) {
    console.warn('Skipping command registration because DISCORD_CLIENT_ID or DISCORD_TOKEN is missing.');
    return;
  }

  const rest = new REST({ version: '10' }).setToken(config.DISCORD_TOKEN);

  // Register commands for each guild
  for (const guild of client.guilds.cache.values()) {
    try {
      const guildConfig = getGuildConfig(guild.id) || {};
      const enabledPlugins = guildConfig.enabledPlugins || {};

      // Filter commands based on enabled plugins
      const enabledCommands = Array.from(commands.values())
        .filter(cmd => {
          const commandName = cmd.data.name;
          // Always enable admin commands
          if (AVAILABLE_COMMANDS[commandName]?.category === 'admin') {
            return true;
          }
          // Check if plugin is enabled
          return enabledPlugins[commandName] || false;
        })
        .map(cmd => cmd.data.toJSON());

      await rest.put(
        Routes.applicationGuildCommands(config.DISCORD_CLIENT_ID, guild.id),
        { body: enabledCommands }
      );

      console.log(`✅ Registered ${enabledCommands.length} commands for guild ${guild.name}`);
    } catch (error) {
      console.error(`Failed to register commands for guild:`, error);
    }
  }
}

module.exports = { registerSlashCommands };
