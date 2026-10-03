const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Shows all available commands in this server'),
  async execute(interaction, client, { getGuildConfig }) {
    const guildConfig = getGuildConfig(interaction.guildId) || {};
    const enabledPlugins = guildConfig.enabledPlugins || {};

    const enabledCommands = Object.keys(enabledPlugins)
      .filter(cmd => enabledPlugins[cmd])
      .map(cmd => `**/${cmd}**`)
      .join(', ') || 'No commands enabled';

    const embed = {
      title: '📚 Flix Commands',
      description: `**Enabled commands in this server:**\n${enabledCommands}`,
      color: 0x6d82ff,
      fields: [
        {
          name: 'Learn More',
          value: 'Visit the server dashboard to enable/disable commands and customize settings.'
        }
      ],
      footer: { text: 'Flix Community Bot' },
      timestamp: new Date().toISOString()
    };

    await interaction.reply({ embeds: [embed] });
  }
};
