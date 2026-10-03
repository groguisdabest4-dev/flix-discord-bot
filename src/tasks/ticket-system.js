const { Events, Client, Collection, PermissionsBitField } = require('discord.js');
const config = require('./config');
const { getGuildConfig, createOrUpdateGuildConfig } = require('./db');

async function setupTicketSystem(client) {
  client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;
    if (!interaction.customId.startsWith('ticket-create-')) return;

    const guildConfig = getGuildConfig(interaction.guildId) || {};
    const panels = guildConfig.ticketPanels || {};
    const panelId = interaction.customId.replace('ticket-create-', '');
    const panel = panels[panelId];

    if (!panel) return;

    const ticketName = `${panel.ticketNameFormat || 'ticket-{number}'}`.replace('{number}', Date.now().toString().slice(-5));
    const category = interaction.guild.channels.cache.get(panel.categoryId);
    if (!category) return interaction.reply({ content: 'The category for this ticket panel is invalid.', ephemeral: true });

    const ticketChannel = await interaction.guild.channels.create({
      name: ticketName,
      type: 0,
      parent: category.id,
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel]
        },
        {
          id: interaction.user.id,
          allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory]
        }
      ]
    });

    const ticketData = guildConfig.ticketData || {};
    ticketData[ticketChannel.name] = {
      status: 'open',
      userId: interaction.user.id,
      panelId,
      openedAt: new Date().toISOString(),
      supportRoleId: panel.supportRoleId || null
    };

    createOrUpdateGuildConfig(interaction.guildId, { ticketData });

    if (panel.supportRoleId) {
      const role = interaction.guild.roles.cache.get(panel.supportRoleId);
      if (role) {
        await ticketChannel.permissionOverwrites.edit(role.id, {
          ViewChannel: true,
          SendMessages: true,
          ReadMessageHistory: true
        });
      }
    }

    await ticketChannel.send({
      content: `Hello <@${interaction.user.id}>! Your ticket has been created. Support will reply soon.\n\n**Panel:** ${panel.title}\n**Description:** ${panel.description}`
    });

    await interaction.reply({ content: `✅ Your ticket has been created: <#${ticketChannel.id}>`, ephemeral: true });
  });
}

module.exports = { setupTicketSystem };
