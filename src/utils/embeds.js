const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

function createFlixEmbed(options = {}) {
  const {
    title = '',
    description = '',
    color = '#6d82ff',
    fields = [],
    footer = true,
    thumbnail = null,
    image = null
  } = options;

  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description);

  if (fields.length > 0) {
    embed.addFields(fields);
  }

  if (footer) {
    embed.setFooter({
      text: 'Flix Community Bot',
      iconURL: 'https://i.imgur.com/flixicon.png'
    });
  }

  if (thumbnail) {
    embed.setThumbnail(thumbnail);
  }

  if (image) {
    embed.setImage(image);
  }

  embed.setTimestamp();
  return embed;
}

function createButtonRow(buttons = []) {
  const row = new ActionRowBuilder();

  buttons.forEach(btn => {
    const button = new ButtonBuilder()
      .setCustomId(btn.customId)
      .setLabel(btn.label)
      .setStyle(btn.style || ButtonStyle.Primary);

    if (btn.emoji) button.setEmoji(btn.emoji);
    if (btn.url) button.setURL(btn.url);
    if (btn.disabled) button.setDisabled(true);

    row.addComponents(button);
  });

  return row;
}

function successEmbed(title, description) {
  return createFlixEmbed({ title: `✅ ${title}`, description, color: '#22c55e' });
}

function errorEmbed(title, description) {
  return createFlixEmbed({ title: `❌ ${title}`, description, color: '#ef4444' });
}

function warningEmbed(title, description) {
  return createFlixEmbed({ title: `⚠️ ${title}`, description, color: '#f59e0b' });
}

function infoEmbed(title, description) {
  return createFlixEmbed({ title: `ℹ️ ${title}`, description, color: '#3b82f6' });
}

module.exports = {
  createFlixEmbed,
  createButtonRow,
  successEmbed,
  errorEmbed,
  warningEmbed,
  infoEmbed
};
