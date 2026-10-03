const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mute a member in the server')
    .addUserOption(option =>
      option.setName('user').setDescription('User to mute').setRequired(true)
    )
    .addStringOption(option =>
      option.setName('duration').setDescription('Duration (e.g., 1h, 30m, 1d)').setRequired(false)
    )
    .addStringOption(option =>
      option.setName('reason').setDescription('Reason for mute').setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const durationStr = interaction.options.getString('duration') || '1h';
    const reason = interaction.options.getString('reason') || 'No reason provided';

    const durationMs = parseDuration(durationStr);
    if (!durationMs) {
      return interaction.reply({ content: 'Invalid duration format. Use: 1h, 30m, 1d, etc.', ephemeral: true });
    }

    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) {
      return interaction.reply({ content: 'Member not found.', ephemeral: true });
    }

    await member.timeout(durationMs, reason);

    const embed = {
      title: '🔇 Member Muted',
      fields: [
        { name: 'User', value: `${user.username}#${user.discriminator}`, inline: true },
        { name: 'Duration', value: durationStr, inline: true },
        { name: 'Reason', value: reason }
      ],
      color: 0xf59e0b,
      footer: { text: 'Flix Moderation' }
    };

    await interaction.reply({ embeds: [embed] });
  }
};

function parseDuration(str) {
  const match = str.match(/(\d+)([smhd])/);
  if (!match) return null;

  const [, amount, unit] = match;
  const ms = {
    's': 1000,
    'm': 60000,
    'h': 3600000,
    'd': 86400000
  };

  return parseInt(amount) * (ms[unit] || 0);
}
