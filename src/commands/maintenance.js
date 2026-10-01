const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const config = require('../config');
const { setMaintenance, getState } = require('../db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('maintenance')
    .setDescription('Put the Flix bot into or out of maintenance mode.')
    .addBooleanOption(option =>
      option
        .setName('enabled')
        .setDescription('Enable or disable maintenance mode.')
        .setRequired(true)
    ),
  async execute(interaction, client) {
    if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
      await interaction.reply({
        content: 'You need administrator permissions to toggle maintenance mode.',
        ephemeral: true
      });
      return;
    }

    const enabled = interaction.options.getBoolean('enabled');
    const state = setMaintenance(enabled);

    const message = enabled
      ? `🚧 ${config.APP_NAME} is now in maintenance mode. The bot is temporarily offline while we work on major updates.`
      : `✅ ${config.APP_NAME} has returned online. All systems are back live.`;

    await interaction.reply({ content: message, ephemeral: false });

    const guild = client.guilds.cache.get(config.SERVER_ID);
    const channel = guild?.channels.cache.get(config.MAINTENANCE_CHANNEL_ID) || guild?.systemChannel;

    if (channel && channel.isTextBased()) {
      await channel.send(enabled ? config.MAINTENANCE_MESSAGE : 'Flix is back online. Thanks for your patience!');
    }

    await client.user.setActivity(enabled ? 'Flix | maintenance mode' : 'Flix | live community', { type: enabled ? 3 : 3 });

    if (!enabled) {
      console.log('Maintenance mode disabled. Bot is live again.');
    } else {
      console.log('Maintenance mode enabled. Bot is offline to end users.');
    }

    return state;
  }
};
