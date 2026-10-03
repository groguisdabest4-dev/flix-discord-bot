const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Get a link to invite people to the server'),
  async execute(interaction) {
    const invite = await interaction.channel.createInvite({ maxAge: 0 });

    const embed = {
      title: '📨 Server Invite',
      description: `[Join ${interaction.guild.name}](${invite.url})`,
      url: invite.url,
      fields: [
        { name: 'Server', value: interaction.guild.name },
        { name: 'Members', value: interaction.guild.memberCount.toString() }
      ],
      color: 0x6d82ff,
      footer: { text: 'Flix Community Bot' }
    };

    await interaction.reply({ embeds: [embed] });
  }
};
