const { SlashCommandBuilder, PermissionFlagsBits, ContainerBuilder, SectionBuilder, TextDisplayBuilder, ThumbnailBuilder, SeparatorBuilder, MessageFlags } = require('discord.js');
const config = require('../config');
const { getGuildConfig, createOrUpdateGuildConfig, getGlobalState } = require('../db');

function buildMaintenanceContainer({ enabled, client, guildId, customMessage }) {
  const title = enabled ? '## 🚧 Flix maintenance mode' : '## ✅ Flix online';
  const body = enabled
    ? `**Status:** Under major updates\n**Message:** ${customMessage || 'This server is under maintenance.'}\n**Note:** All commands are temporarily paused until the bot returns.`
    : `**Status:** Live and operational\n**Message:** Flix is back online and ready to serve the community.`;

  return new ContainerBuilder()
    .setAccentColor(enabled ? 0xf59e0b : 0x22c55e)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(title)
    )
    .addSeparatorComponents(
      new SeparatorBuilder().setDivider(true).setSpacing(1)
    )
    .addSectionComponents(
      new SectionBuilder()
        .setAccessory(
          new ThumbnailBuilder().setURL(client.user.displayAvatarURL())
        )
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(body)
        )
    )
    .addSeparatorComponents(
      new SeparatorBuilder().setDivider(true).setSpacing(1)
    )
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(enabled ? 'We will notify the server once the update is complete.' : 'All systems are live again.')
    );
}

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
    ),
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

    let container;
    let successMessage = '';

    if (mode === 'server-enable') {
      createOrUpdateGuildConfig(interaction.guildId, {
        maintenanceEnabled: true,
        maintenanceMessage: customMessage || 'This server is under maintenance.'
      });
      container = buildMaintenanceContainer({ enabled: true, client, guildId: interaction.guildId, customMessage });
      successMessage = '🚧 Server maintenance mode enabled.';
    } else if (mode === 'server-disable') {
      createOrUpdateGuildConfig(interaction.guildId, {
        maintenanceEnabled: false,
        maintenanceMessage: null
      });
      container = buildMaintenanceContainer({ enabled: false, client });
      successMessage = '✅ Server maintenance mode disabled.';
    } else if (mode === 'global-enable') {
      setGlobalMaintenance(true);
      container = buildMaintenanceContainer({ enabled: true, client, customMessage });
      successMessage = '🚧 Global maintenance mode enabled. All servers affected.';
    } else if (mode === 'global-disable') {
      setGlobalMaintenance(false);
      container = buildMaintenanceContainer({ enabled: false, client });
      successMessage = '✅ Global maintenance mode disabled. All servers back online.';
    }

    await interaction.reply({
      components: [container],
      flags: MessageFlags.IsComponentsV2,
      ephemeral: false
    });

    console.log(`[${interaction.guildId}] ${successMessage}`);
  }
};
