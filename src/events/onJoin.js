'use strict';

async function handleJoin(member, config, channelIds) {
  try {
    const guild = member.guild;
    const recruit = guild.roles.cache.find((role) => role.name === '🛡️ Recruit');
    if (recruit) await member.roles.add(recruit);

    const welcomeChannel = guild.channels.cache.find((channel) => channel.name === '👋-welcome');
    if (!welcomeChannel) return;

    await welcomeChannel.send([
      `## 👋 Welcome to **${config.SERVER_NAME}**, ${member}!`,
      `You've been auto-assigned 🛡️ **Recruit**.`,
      '',
      `1️⃣ Rules → ${channelIds['📋-rules'] ? `<#${channelIds['📋-rules']}>` : '#rules'}`,
      `2️⃣ Pick badges → ${channelIds['🎭-get-roles'] ? `<#${channelIds['🎭-get-roles']}>` : '#get-roles'}`,
      `3️⃣ Introduce yourself → ${channelIds['👋-introductions'] ? `<#${channelIds['👋-introductions']}>` : '#introductions'}`,
      `4️⃣ Subscribe → ${config.YOUTUBE_URL}`,
      '',
      `Type \`!help\` to see all bot commands!`,
    ].join('\n'));
  } catch (error) {
    console.error('Join error:', error.message);
  }
}

module.exports = { handleJoin };