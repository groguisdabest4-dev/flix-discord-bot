const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('maintenance')
    .setDescription('Put this server or the bot into maintenance mode.')
    .addStringOption(option =>
      option
        .setName('mode')
        .setDescription('Maintenance mode type')
        .setRequired(true)
        .addChoices(
          { name: 'Enable (This Server)', value: 'server-enable' },
          { name: 'Disable (This Server)', value: 'server-disable' },
          { name: 'Enable (Global)', value: 'global-enable' },
          { name: 'Disable (Global)', value: 'global-disable' }
        )
    )
    .addStringOption(option =>
      option
        .setName('message')
        .setDescription('Custom maintenance message (optional)')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction, client, { getGuildConfig, createOrUpdateGuildConfig, getGlobalState }) {
    if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
      await interaction.reply({
        content: 'You need administrator permissions to toggle maintenance mode.',
        ephemeral: true
      });
      return;
    }

    const mode = interaction.options.getString('mode');
    const customMessage = interaction.options.getString('message');
    const { setGlobalMaintenance } = require('../db');

    let successMessage = '';

    if (mode === 'server-enable') {
      createOrUpdateGuildConfig(interaction.guildId, {
        maintenanceEnabled: true,
        maintenanceMessage: customMessage || 'This server is under maintenance.'
      });
      successMessage = '🚧 Server maintenance mode enabled.';
    } else if (mode === 'server-disable') {
      createOrUpdateGuildConfig(interaction.guildId, {
        maintenanceEnabled: false,
        maintenanceMessage: null
      });
      successMessage = '✅ Server maintenance mode disabled.';
    } else if (mode === 'global-enable') {
      setGlobalMaintenance(true);
      successMessage = '🚧 Global maintenance mode enabled. All servers affected.';
    } else if (mode === 'global-disable') {
      setGlobalMaintenance(false);
      successMessage = '✅ Global maintenance mode disabled. All servers back online.';
    }

    const embed = {
      title: mode.includes('enable') ? '🚧 Maintenance Enabled' : '✅ Maintenance Disabled',
      description: successMessage,
      color: mode.includes('enable') ? 0xf59e0b : 0x22c55e,
      footer: { text: 'Flix Moderation' }
    };

    await interaction.reply({ embeds: [embed], ephemeral: false });
    console.log(`[${interaction.guildId}] ${successMessage}`);
  }
};
