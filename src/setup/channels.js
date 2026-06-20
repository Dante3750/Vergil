'use strict';

const { ChannelType, PermissionFlagsBits } = require('discord.js');

async function rebuildChannels(guild, config, roles) {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  if (!roles) {
    roles = {};
    for (const definition of config.ROLE_DEFINITIONS) {
      const role = guild.roles.cache.find((item) => item.name === definition.name);
      if (role) roles[definition.key] = role;
    }
  }

  console.log('\n📁 Building channels...');
  const channelMap = {};

  for (const section of config.CHANNEL_LAYOUT) {
    const category = guild.channels.cache.find((channel) => channel.name === section.category && channel.type === ChannelType.GuildCategory)
      || await guild.channels.create({ name: section.category, type: ChannelType.GuildCategory });
    await sleep(300);

    for (const channel of section.channels) {
      const type = channel.type === 'voice' ? ChannelType.GuildVoice : ChannelType.GuildText;
      const permissionOverwrites = [{ id: guild.roles.everyone, deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect] }];

      for (const key of (channel.canSend || [])) {
        if (!roles[key]) continue;
        if (type === ChannelType.GuildVoice) {
          permissionOverwrites.push({ id: roles[key], allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect, PermissionFlagsBits.Speak] });
        } else {
          permissionOverwrites.push({ id: roles[key], allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] });
        }
      }

      for (const key of (channel.readOnly || [])) {
        if (!roles[key] || (channel.canSend || []).includes(key)) continue;
        permissionOverwrites.push({ id: roles[key], allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory], deny: [PermissionFlagsBits.SendMessages] });
      }

      const existing = guild.channels.cache.find((item) => item.name === channel.name);
      if (existing) {
        channelMap[channel.key] = existing;
        console.log(`  ↩️  #${channel.name}`);
      } else {
        const created = await guild.channels.create({ name: channel.name, type, parent: category, topic: channel.topic || '', permissionOverwrites });
        channelMap[channel.key] = created;
        console.log(`  ✅ #${channel.name}`);
      }

      await sleep(400);
    }
  }

  return channelMap;
}

module.exports = { rebuildChannels };