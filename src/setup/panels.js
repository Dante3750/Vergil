'use strict';

const { buildRolePanel, buildIntroPanel } = require('../interactions/components');

async function postPanels(guild) {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const panels = [
    { channelName: '🎭-get-roles', panel: buildRolePanel() },
    { channelName: '👋-introductions', panel: buildIntroPanel() },
  ];

  for (const { channelName, panel } of panels) {
    const channel = guild.channels.cache.find((item) => item.name === channelName);
    if (!channel) continue;

    const recent = await channel.messages.fetch({ limit: 10 }).catch(() => null);
    const alreadyPosted = recent?.some((message) => message.author.id === guild.client.user.id && message.embeds.some((embed) => embed.footer?.text?.includes(panel.marker)));
    if (alreadyPosted) continue;

    await channel.send(panel.payload);
    await sleep(400);
  }
}

module.exports = { postPanels };