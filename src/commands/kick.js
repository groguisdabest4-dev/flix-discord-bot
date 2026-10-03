const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a member from the server')
    .addUserOption(option =>
      option.setName('user').setDescription('User to kick').setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason').setDescription('Reason for kick').setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.KickMembers)) {
      return interaction.reply({ content: 'I do not have permission to kick members.', ephemeral: true });
    }

    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) {
      return interaction.reply({ content: 'Member not found.', ephemeral: true });
    }

    await member.kick(reason);

    const embed = {
      title: '👢 Member Kicked',
      fields: [
        { name: 'User', value: `${user.username}#${user.discriminator}`, inline: true },
        { name: 'Kicked By', value: interaction.user.username, inline: true },
        { name: 'Reason', value: reason }
      ],
      color: 0xef4444,
      footer: { text: 'Flix Moderation' }
    };

    await interaction.reply({ embeds: [embed] });
  }
};
