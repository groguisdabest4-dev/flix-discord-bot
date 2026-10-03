const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a member')
    .addUserOption(option =>
      option.setName('user').setDescription('User to warn').setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason').setDescription('Reason for warning').setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction, client, { getGuildConfig, createOrUpdateGuildConfig }) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    const guildConfig = getGuildConfig(interaction.guildId) || {};
    const warnings = guildConfig.warnings || {};
    const userWarnings = warnings[user.id] || [];

    userWarnings.push({
      reason,
      warnedBy: interaction.user.id,
      timestamp: new Date().toISOString()
    });

    createOrUpdateGuildConfig(interaction.guildId, {
      warnings: { ...warnings, [user.id]: userWarnings }
    });

    const embed = {
      title: '⚠️ Member Warned',
      fields: [
        { name: 'User', value: `${user.username}#${user.discriminator}`, inline: true },
        { name: 'Warned By', value: interaction.user.username, inline: true },
        { name: 'Reason', value: reason },
        { name: 'Total Warnings', value: userWarnings.length.toString(), inline: true }
      ],
      color: 0xf59e0b,
      footer: { text: 'Flix Moderation' }
    };

    await interaction.reply({ embeds: [embed] });
  }
};
