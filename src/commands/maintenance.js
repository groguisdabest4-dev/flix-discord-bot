const { SlashCommandBuilder, PermissionFlagsBits, ContainerBuilder, SectionBuilder, TextDisplayBuilder, ThumbnailBuilder, SeparatorBuilder, MessageFlags } = require('discord.js');
const config = require('../config');
const { setMaintenance } = require('../db');

function buildMaintenanceContainer({ enabled, client }) {
  const title = enabled ? '## 🚧 Flix maintenance mode' : '## ✅ Flix online';
  const body = enabled
    ? `**Status:** Under major updates\n**Message:** ${config.MAINTENANCE_MESSAGE}\n**Note:** All commands are temporarily paused until the bot returns.`
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
    const container = buildMaintenanceContainer({ enabled, client });

    await interaction.reply({
      components: [container],
      flags: MessageFlags.IsComponentsV2,
      ephemeral: false
    });

    const guild = client.guilds.cache.get(config.SERVER_ID);
    const channel = guild?.channels.cache.get(config.MAINTENANCE_CHANNEL_ID) || guild?.systemChannel;

    if (channel && channel.isTextBased()) {
      await channel.send(enabled ? config.MAINTENANCE_MESSAGE : 'Flix is back online. Thanks for your patience!');
    }

    await client.user.setActivity(enabled ? 'Flix | maintenance mode' : 'Flix | live community', { type: 3 });

    if (!enabled) {
      console.log('Maintenance mode disabled. Bot is live again.');
    } else {
      console.log('Maintenance mode enabled. Bot is offline to end users.');
    }

    return state;
  }
};
