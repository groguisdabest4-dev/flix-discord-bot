const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Shows server information'),
  async execute(interaction, client, { getGuildConfig }) {
    const guild = interaction.guild;
    const guildConfig = getGuildConfig(guild.id) || {};

    const embed = {
      title: `📊 ${guild.name}`,
      thumbnail: { url: guild.iconURL() },
      fields: [
        { name: 'Server ID', value: guild.id, inline: true },
        { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
        { name: 'Members', value: guild.memberCount.toString(), inline: true },
        { name: 'Created', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true },
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
