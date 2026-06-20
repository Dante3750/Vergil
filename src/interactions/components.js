'use strict';

const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ComponentType,
} = require('discord.js');
const { infoCard, successCard, warningCard, errorCard } = require('../utils/card');

const MEMBER_BADGES = [
  { key: 'knight', label: 'Knight', emoji: '⚔️', description: 'Active CoC player' },
  { key: 'ytfan', label: 'YouTube Fan', emoji: '🎬', description: 'Dante subscriber' },
  { key: 'laloon', label: 'LaLoon Fan', emoji: '🎈', description: 'Likes LaLoon content' },
];

const TH_BADGES = [
  { key: 'th18', label: 'TH18', emoji: '🏆', description: 'Town Hall 18' },
  { key: 'th17', label: 'TH17', emoji: '🔥', description: 'Town Hall 17' },
  { key: 'th16', label: 'TH16', emoji: '⭐', description: 'Town Hall 16' },
];

const INTRO_TEMPLATES = [
  {
    id: 'starter',
    label: 'Starter Intro',
    emoji: '👋',
    title: '👋 Starter Intro',
    description: 'A simple intro for new members.',
    fields: [
      { name: 'Copy', value: 'Name:\nTH:\nLocation / timezone:\nFavorite attack:\nWar status:\nGoal in clan:', inline: false },
    ],
  },
  {
    id: 'war',
    label: 'War Intro',
    emoji: '⚔️',
    title: '⚔️ War Intro',
    description: 'Best for active war players.',
    fields: [
      { name: 'Copy', value: 'Name:\nTH:\nWar stars:\nFavorite attack:\nClan goal:\nOnline times:', inline: false },
    ],
  },
  {
    id: 'bio',
    label: 'Profile Bio',
    emoji: '🪪',
    title: '🪪 Profile Bio',
    description: 'A clean Discord about-me style bio.',
    fields: [
      { name: 'Copy', value: 'TH17 | War attacker | Friendly challenger | Active evenings', inline: false },
      { name: 'Status idea', value: 'Grinding wars | Coaching new players | Subscribe for CoC content', inline: false },
    ],
  },
];

function buildRolePanel() {
  const memberMenu = new StringSelectMenuBuilder()
    .setCustomId('roles:member')
    .setPlaceholder('Pick your member badges')
    .setMinValues(0)
    .setMaxValues(3)
    .addOptions(MEMBER_BADGES.map((badge) => new StringSelectMenuOptionBuilder()
      .setLabel(badge.label)
      .setValue(badge.key)
      .setDescription(badge.description)
      .setEmoji(badge.emoji)));

  const thMenu = new StringSelectMenuBuilder()
    .setCustomId('roles:th')
    .setPlaceholder('Pick your TH badge')
    .setMinValues(0)
    .setMaxValues(1)
    .addOptions(TH_BADGES.map((badge) => new StringSelectMenuOptionBuilder()
      .setLabel(badge.label)
      .setValue(badge.key)
      .setDescription(badge.description)
      .setEmoji(badge.emoji)));

  return {
    marker: 'vergil-role-panel-v1',
    payload: {
      embeds: [
        infoCard(
          '🎭 Interactive Badge Picker',
          'Use the menus below instead of searching for reactions. Badge roles stay free, fast, and easy to change.',
          [
            { name: 'Member badges', value: '⚔️ Knight\n🎬 YouTube Fan\n🎈 LaLoon Fan', inline: true },
            { name: 'TH badges', value: '🏆 TH18\n🔥 TH17\n⭐ TH16', inline: true },
          ],
          'Powered by Discord select menus | Reactions still work as backup | vergil-role-panel-v1'
        ),
      ],
      components: [new ActionRowBuilder().addComponents(memberMenu), new ActionRowBuilder().addComponents(thMenu)],
    },
  };
}

function buildIntroPanel() {
  const buttons = INTRO_TEMPLATES.map((template) => new ButtonBuilder()
    .setCustomId(`intro:${template.id}`)
    .setLabel(template.label)
    .setEmoji(template.emoji)
    .setStyle(template.id === 'bio' ? ButtonStyle.Secondary : ButtonStyle.Primary));

  return {
    marker: 'vergil-intro-panel-v1',
    payload: {
      embeds: [
        infoCard(
          '🎙️ Intro Templates',
          'Pick a template and the bot will send it privately so you can paste it into #👋-introductions.',
          [
            { name: 'Starter', value: 'Short and simple for new members.', inline: true },
            { name: 'War', value: 'Focused on war habits and activity.', inline: true },
            { name: 'Bio', value: 'Good for profile about-me or status.', inline: true },
          ],
          'Use the template that matches how you want to present yourself. | vergil-intro-panel-v1'
        ),
      ],
      components: [new ActionRowBuilder().addComponents(buttons)],
    },
  };
}

function findRole(config, key) {
  return config.ROLE_DEFINITIONS.find((definition) => definition.key === key);
}

async function handleComponentInteraction(interaction, config) {
  if (interaction.isStringSelectMenu()) {
    if (interaction.customId === 'roles:member') {
      const member = interaction.member;
      const selectedKeys = interaction.values;
      const selectedNames = selectedKeys
        .map((key) => findRole(config, key))
        .filter(Boolean)
        .map((definition) => definition.name);

      const managedKeys = MEMBER_BADGES.map((badge) => badge.key);
      const currentRoles = member.roles.cache.filter((role) => managedKeys.some((key) => findRole(config, key)?.name === role.name));
      for (const role of currentRoles.values()) {
        await member.roles.remove(role).catch(() => {});
      }

      for (const key of selectedKeys) {
        const definition = findRole(config, key);
        const role = definition && interaction.guild.roles.cache.find((item) => item.name === definition.name);
        if (role) await member.roles.add(role).catch(() => {});
      }

      await interaction.reply({
        ephemeral: true,
        embeds: [successCard(
          '✅ Badge Roles Updated',
          'Your member badges were saved successfully.',
          [
            { name: 'Selected', value: selectedNames.length ? selectedNames.join('\n') : 'No member badges selected', inline: false },
          ],
          'You can open the menu again any time to change these.'
        )],
      });
      return true;
    }

    if (interaction.customId === 'roles:th') {
      const selectedKey = interaction.values[0] || null;
      const member = interaction.member;
      const currentRoles = TH_BADGES
        .map((badge) => findRole(config, badge.key))
        .filter(Boolean)
        .map((definition) => interaction.guild.roles.cache.find((item) => item.name === definition.name))
        .filter(Boolean);

      for (const role of currentRoles) {
        await member.roles.remove(role).catch(() => {});
      }

      const definition = selectedKey ? findRole(config, selectedKey) : null;
      const role = definition && interaction.guild.roles.cache.find((item) => item.name === definition.name);
      if (role) await member.roles.add(role).catch(() => {});

      await interaction.reply({
        ephemeral: true,
        embeds: [successCard(
          '✅ TH Badge Updated',
          'Your Town Hall badge is now set.',
          [
            { name: 'Selected', value: definition ? definition.name : 'No TH badge selected', inline: false },
          ],
          'This keeps the server cleaner than reaction spam.'
        )],
      });
      return true;
    }
  }

  if (interaction.isButton() && interaction.customId.startsWith('intro:')) {
    const template = INTRO_TEMPLATES.find((item) => `intro:${item.id}` === interaction.customId);
    if (!template) return false;

    await interaction.reply({
      ephemeral: true,
      embeds: [infoCard(
        template.title,
        template.description,
        template.fields,
        'Copy the text and post it in #👋-introductions.'
      )],
    });
    return true;
  }

  return false;
}

module.exports = { buildRolePanel, buildIntroPanel, handleComponentInteraction };