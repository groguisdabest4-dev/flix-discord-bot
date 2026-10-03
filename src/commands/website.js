const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('website')
    .setDescription('Shows the server website link'),
  async execute(interaction, client, { getGuildConfig }) {
    const guildConfig = getGuildConfig(interaction.guildId);
    const websiteUrl = guildConfig?.websiteUrl;

    if (!websiteUrl) {
      return interaction.reply({
        content: 'No website has been configured for this server. Ask a server admin to set it up on the dashboard.',
        ephemeral: true
      });
    }

    const embed = {
      title: '🌐 Server Website',
      description: `[Visit Website](${websiteUrl})`,
      url: websiteUrl,
      fields: [
        { name: 'Status', value: guildConfig.websiteStatus || 'online' },
        { name: 'Description', value: guildConfig.websiteDescription || 'No description available' }
      ],
      color: 0x6d82ff,
      footer: { text: 'Flix Community Bot' }
    };

    await interaction.reply({ embeds: [embed] });
  }
};
