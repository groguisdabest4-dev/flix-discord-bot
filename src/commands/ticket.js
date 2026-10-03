const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Open a support ticket.'),
  async execute(interaction, client, { getGuildConfig }) {
    const guildConfig = getGuildConfig(interaction.guildId) || {};
    const panels = guildConfig.ticketPanels || {};

    if (!Object.keys(panels).length) {
      return interaction.reply({ content: 'No ticket panels are configured for this server yet.', ephemeral: true });
    }

    const panelOptions = Object.values(panels)
      .map(panel => `**${panel.id}** — ${panel.title}`)
      .join('\n');

    return interaction.reply({
      content: `Choose a ticket panel:\n${panelOptions}\n\nUse the panel button created by admins to open a ticket.`,
      ephemeral: true
    });
  }
};
