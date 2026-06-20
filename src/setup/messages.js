'use strict';

const { buildMessages } = require('../../messages');

async function repostMessages(guild, config, channelMap) {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  if (!channelMap) {
    channelMap = {};
    for (const [, channel] of guild.channels.cache) {
      for (const definition of config.CHANNEL_LAYOUT.flatMap((section) => section.channels)) {
        if (definition.name === channel.name) channelMap[definition.key] = channel;
      }
    }
  }

  const ids = {};
  for (const [key, channel] of Object.entries(channelMap)) ids[key] = channel?.id;

  console.log('\n📜 Posting channel messages...');
  for (const { channelKey, content, payload } of buildMessages(ids, config)) {
    const channel = channelMap[channelKey];
    if (!channel) continue;

    try {
      const existing = await channel.messages.fetch({ limit: 3 });
      if (existing.size === 0) {
        await channel.send(payload || content);
        console.log(`  ✅ Posted in #${channel.name}`);
      } else {
        console.log(`  ↩️  #${channel.name} already has content`);
      }
    } catch {}

    await sleep(400);
  }
}

module.exports = { repostMessages };