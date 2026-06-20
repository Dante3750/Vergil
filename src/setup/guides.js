'use strict';

const { buildGuides } = require('../../guides');

async function repostGuides(guild, config, channelMap) {
  let channel;
  if (channelMap) channel = channelMap.botsetup;
  else channel = guild.channels.cache.find((item) => item.name === '🛠️-bot-setup');

  if (!channel) {
    console.log('⚠️  #🛠️-bot-setup not found — skipping guides.');
    return;
  }

  console.log('\n🤖 Posting bot guides in #🛠️-bot-setup...');
  const existing = await channel.messages.fetch({ limit: 10 });
  if (existing.size > 0) {
    console.log('  ↩️  Guides already posted (delete them manually to repost)');
    return;
  }

  for (const guide of buildGuides(config)) {
    await channel.send(guide);
    await new Promise((resolve) => setTimeout(resolve, 600));
  }

  console.log('  ✅ All guides posted.');
}

module.exports = { repostGuides };