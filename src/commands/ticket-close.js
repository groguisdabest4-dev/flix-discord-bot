const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket-close')
    .setDescription('Close the current ticket.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction, client, { getGuildConfig }) {
    const guildConfig = getGuildConfig(interaction.guildId) || {};
    const ticketData = guildConfig.ticketData || {};
    const ticketId = interaction.channel.name;

    if (!ticketData[ticketId]) {
      return interaction.reply({ content: 'This channel is not a ticket channel.', ephemeral: true });
    }

    ticketData[ticketId].status = 'closed';
    ticketData[ticketId].closedAt = new Date().toISOString();

    await interaction.reply({ content: `✅ Ticket **${ticketId}** has been closed.`, ephemeral: false });
  }
};
