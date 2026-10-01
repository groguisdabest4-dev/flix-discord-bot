const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Returns the current bot latency.'),
  async execute(interaction) {
    const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
    const ping = sent.createdTimestamp - interaction.createdTimestamp;

    const embed = new EmbedBuilder()
      .setColor('#6d82ff')
      .setTitle('🏓 Pong!')
      .setDescription(`Bot latency: **${ping}ms**`)
      .setFooter({ text: 'Flix Bot', iconURL: interaction.client.user.displayAvatarURL() })
      .setTimestamp();

    await interaction.editReply({ content: '', embeds: [embed] });
  }
};
