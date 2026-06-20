'use strict';

const { EmbedBuilder } = require('discord.js');

function card(title, description, color, fields = [], footer) {
  const embed = new EmbedBuilder().setTitle(title).setDescription(description).setColor(color);
  for (const field of fields) embed.addFields(field);
  if (footer) embed.setFooter({ text: footer });
  return { embeds: [embed] };
}

function infoCard(title, description, maybeColorOrFields = [], maybeFields, maybeFooter) {
  if (typeof maybeColorOrFields === 'number') {
    return card(title, description, maybeColorOrFields, Array.isArray(maybeFields) ? maybeFields : [], typeof maybeFooter === 'string' ? maybeFooter : undefined);
  }

  return card(title, description, 0x5865F2, Array.isArray(maybeColorOrFields) ? maybeColorOrFields : [], typeof maybeFields === 'string' ? maybeFields : undefined);
}

function successCard(title, description, fields = [], footer) {
  return card(title, description, 0x2ECC71, fields, footer);
}

function warningCard(title, description, fields = [], footer) {
  return card(title, description, 0xF1C40F, fields, footer);
}

function errorCard(title, description, fields = [], footer) {
  return card(title, description, 0xE74C3C, fields, footer);
}

module.exports = { card, infoCard, successCard, warningCard, errorCard };