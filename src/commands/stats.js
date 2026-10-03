const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Show server member statistics'),
  async execute(interaction) {
    const guild = interaction.guild;
    const members = await guild.members.fetch();
    
    const botsCount = members.filter(m => m.user.bot).size;
    const humansCount = members.size - botsCount;
    const onlineCount = members.filter(m => m.presence?.status !== 'offline').size;

    const embed = {
      title: `📈 ${guild.name} Statistics`,
      thumbnail: { url: guild.iconURL() },
      fields: [
        { name: 'Total Members', value: members.size.toString(), inline: true },
        { name: 'Humans', value: humansCount.toString(), inline: true },
        { name: 'Bots', value: botsCount.toString(), inline: true },
        { name: 'Online', value: onlineCount.toString(), inline: true },
        { name: 'Channels', value: guild.channels.cache.size.toString(), inline: true },
        { name: 'Roles', value: guild.roles.cache.size.toString(), inline: true }
      ],
      color: 0x6d82ff,
      footer: { text: 'Flix Community Bot' },
      timestamp: new Date().toISOString()
    };

    await interaction.reply({ embeds: [embed] });
  }
};
