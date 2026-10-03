const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket-remove')
    .setDescription('Remove a member from a ticket channel.')
    .addUserOption(option => option.setName('user').setDescription('User to remove').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction) {
    const user = interaction.options.getUser('user');

    await interaction.channel.permissionOverwrites.edit(user.id, {
      ViewChannel: false,
      SendMessages: false,
      ReadMessageHistory: false
    });

    await interaction.reply({ content: `✅ Removed ${user.tag} from this ticket.`, ephemeral: true });
  }
};
