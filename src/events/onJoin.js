'use strict';

const { infoCard } = require('../utils/card');

function mentionChannel(channelId, fallback) {
  return channelId ? `<#${channelId}>` : fallback;
}

async function handleJoin(member, config, channelIds) {
  try {
    const guild = member.guild;
    const recruit = guild.roles.cache.find((role) => role.name === '🛡️ Recruit');
    if (recruit) await member.roles.add(recruit);

    const welcomeChannel = guild.channels.cache.find((channel) => channel.name === '👋-welcome');
    if (!welcomeChannel) return;

    await welcomeChannel.send({
      embeds: [infoCard(
        `👋 Welcome to ${config.SERVER_NAME}`,
        `You are in, ${member}. You have been auto-assigned 🛡️ Recruit and can use the checklist below to get set up fast.`,
        0x5865F2,
        [
          { name: 'Get started', value: [
            `1. Read the rules: ${mentionChannel(channelIds['📋-rules'], '#rules')}`,
            `2. Pick badges: ${mentionChannel(channelIds['🎭-get-roles'], '#get-roles')}`,
            `3. Introduce yourself: ${mentionChannel(channelIds['👋-introductions'], '#introductions')}`,
            `4. Apply or ask for help: ${mentionChannel(channelIds['📘-how-to-join'], '#how-to-join')}`,
          ].join('\n'), inline: false },
          { name: 'Bot help', value: 'Use `!help` for the command list, `!free` for the free-first stack, and `!intro` / `!bio` for profile templates.', inline: false },
          { name: 'Stay connected', value: config.YOUTUBE_URL, inline: false },
        ],
        'Reply in introductions when you are ready to say hello.'
      )],
    });
  } catch (error) {
    console.error('Join error:', error.message);
  }
}

module.exports = { handleJoin };