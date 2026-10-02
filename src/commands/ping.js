const { SlashCommandBuilder, ContainerBuilder, SectionBuilder, TextDisplayBuilder, ThumbnailBuilder, SeparatorBuilder, MessageFlags } = require('discord.js');

function buildPingContainer(interaction, ping) {
  return new ContainerBuilder()
    .setAccentColor(0x6d82ff)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent('## 🏓 Flix latency report')
    )
    .addSeparatorComponents(
      new SeparatorBuilder().setDivider(true).setSpacing(1)
    )
    .addSectionComponents(
      new SectionBuilder()
        .setAccessory(
          new ThumbnailBuilder().setURL(interaction.client.user.displayAvatarURL())
        )
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(`**Latency:** ${ping}ms\n**Status:** Online and ready\n**Bot:** ${interaction.client.user.tag}`)
        )
    )
    .addSeparatorComponents(
      new SeparatorBuilder().setDivider(true).setSpacing(1)
    )
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent('Flix is live and responding normally.')
    );
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Returns the current bot latency.'),
  async execute(interaction) {
    const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
    const ping = sent.createdTimestamp - interaction.createdTimestamp;

    const container = buildPingContainer(interaction, ping);

    await interaction.editReply({
      content: '',
      components: [container],
      flags: MessageFlags.IsComponentsV2
    });
  }
};
