const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Returns the current bot latency.'),
  async execute(interaction) {
    const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
    const ping = sent.createdTimestamp - interaction.createdTimestamp;

    const embed = {
      title: '🏓 Pong!',
      description: `Bot latency: **${ping}ms**`,
      color: 0x6d82ff,
      footer: { text: 'Flix Bot' },
      timestamp: new Date().toISOString()
    };

    await interaction.editReply({ content: '', embeds: [embed] });
  }
};
