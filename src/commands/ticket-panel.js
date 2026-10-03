const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket-panel')
    .setDescription('Manage ticket panels for your server.')
    .addSubcommand(sub =>
      sub.setName('create')
        .setDescription('Create a new support ticket panel')
        .addStringOption(option => option.setName('title').setDescription('Panel title').setRequired(true))
        .addStringOption(option => option.setName('description').setDescription('Panel description').setRequired(true))
        .addStringOption(option => option.setName('button-text').setDescription('Button label').setRequired(true))
        .addStringOption(option => option.setName('emoji').setDescription('Button emoji').setRequired(false))
        .addChannelOption(option => option.setName('category').setDescription('Ticket category channel').setRequired(true))
        .addRoleOption(option => option.setName('support-role').setDescription('Support role').setRequired(false))
    )
    .addSubcommand(sub =>
      sub.setName('list')
        .setDescription('List all ticket panels')
    )
    .addSubcommand(sub =>
      sub.setName('delete')
        .setDescription('Delete a ticket panel')
        .addStringOption(option => option.setName('panel-id').setDescription('Panel ID').setRequired(true))
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction, client, { getGuildConfig, createOrUpdateGuildConfig }) {
    const guildConfig = getGuildConfig(interaction.guildId) || {};
    const panels = guildConfig.ticketPanels || {};

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'create') {
      const title = interaction.options.getString('title');
      const description = interaction.options.getString('description');
      const buttonText = interaction.options.getString('button-text');
      const emoji = interaction.options.getString('emoji') || '🎫';
      const category = interaction.options.getChannel('category');
      const supportRole = interaction.options.getRole('support-role');

      const panelId = `panel-${Date.now()}`;
      panels[panelId] = {
        id: panelId,
        title,
        description,
        buttonText,
        emoji,
        categoryId: category.id,
        supportRoleId: supportRole?.id || null,
        createdAt: new Date().toISOString(),
        enabled: true,
        ticketNameFormat: 'ticket-{number}'
      };

      createOrUpdateGuildConfig(interaction.guildId, { ticketPanels: panels });

      return interaction.reply({
        content: `✅ Ticket panel created with ID: **${panelId}**`,
        ephemeral: true
      });
    }

    if (subcommand === 'list') {
      if (!Object.keys(panels).length) {
        return interaction.reply({ content: 'No ticket panels configured yet.', ephemeral: true });
      }

      const panelList = Object.values(panels)
        .map(panel => `**${panel.id}** — ${panel.title} (${panel.buttonText})`)
        .join('\n');

      return interaction.reply({ content: panelList, ephemeral: true });
    }

    if (subcommand === 'delete') {
      const panelId = interaction.options.getString('panel-id');
      if (!panels[panelId]) {
        return interaction.reply({ content: 'That panel does not exist.', ephemeral: true });
      }

      delete panels[panelId];
      createOrUpdateGuildConfig(interaction.guildId, { ticketPanels: panels });

      return interaction.reply({ content: `✅ Deleted ticket panel **${panelId}**`, ephemeral: true });
    }
  }
};
