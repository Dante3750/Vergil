'use strict';

function createGiveawayCommands() {
  return {
    '!giveaway': async (ctx) => {
      if (!ctx.isStaff(ctx.msg.member)) {
        await ctx.reply('❌ Staff only.');
        return;
      }

      const mins = Number.parseInt(ctx.args[1], 10);
      const prize = ctx.args.slice(2).join(' ');
      if (!mins || !prize) {
        await ctx.reply('❌ Usage: `!giveaway [minutes] [prize]`');
        return;
      }

      await startGiveaway(ctx, mins, prize, '🎁 GIVEAWAY');
    },
    '!passgiveaway': async (ctx) => {
      if (!ctx.isStaff(ctx.msg.member)) {
        await ctx.reply('❌ Staff only.');
        return;
      }

      await startGiveaway(ctx, Number.parseInt(ctx.args[1], 10) || 1440, '🏰 Clash of Clans Gold Pass', '🏰 GOLD PASS GIVEAWAY');
    },
    '!endgiveaway': async (ctx) => {
      if (!ctx.isStaff(ctx.msg.member)) {
        await ctx.reply('❌ Staff only.');
        return;
      }

      if (!ctx.args[1]) {
        await ctx.reply('❌ Usage: `!endgiveaway [message ID]`');
        return;
      }

      await endGiveaway(ctx, ctx.args[1]);
      await ctx.msg.delete().catch(() => {});
    },
    '!reroll': async (ctx) => {
      if (!ctx.isStaff(ctx.msg.member)) {
        await ctx.reply('❌ Staff only.');
        return;
      }

      if (!ctx.args[1]) {
        await ctx.reply('❌ Usage: `!reroll [message ID]`');
        return;
      }

      let giveawayMessage = null;
      for (const [, channel] of ctx.guild.channels.cache) {
        if (channel.type !== ctx.ChannelType.GuildText) continue;
        try {
          giveawayMessage = await channel.messages.fetch(ctx.args[1]);
          break;
        } catch {}
      }

      if (!giveawayMessage) {
        await ctx.reply('❌ Message not found.');
        return;
      }

      const users = await giveawayMessage.reactions.cache.get(ctx.config.G_EMOJI)?.users.fetch();
      const eligible = users?.filter((user) => !user.bot);
      if (!eligible?.size) {
        await ctx.reply('❌ No eligible entries.');
        return;
      }

      await ctx.msg.channel.send(`🎉 **Reroll!** New winner: <@${eligible.random().id}> 🎊`);
      await ctx.msg.delete().catch(() => {});
    },
    '!raffle': async (ctx) => {
      if (!ctx.isStaff(ctx.msg.member)) {
        await ctx.reply('❌ Staff only.');
        return;
      }

      const prize = ctx.args.slice(1).join(' ');
      if (!prize) {
        await ctx.reply('❌ Usage: `!raffle [prize]`');
        return;
      }

      ctx.state.activeRaffles.set(ctx.msg.channel.id, { prize, entries: new Set(), hostId: ctx.msg.author.id });
      await ctx.msg.channel.send([
        `# 🎟️ LUCKY DRAW OPEN!`,
        `**Prize:** ${prize}`,
        `**Hosted by:** ${ctx.msg.member}`,
        '',
        `Type \`!enter\` to get your ticket!`,
        `Staff types \`!draw\` to pick the winner.`,
      ].join('\n'));
      await ctx.msg.delete().catch(() => {});
    },
    '!enter': async (ctx) => {
      const raffle = ctx.state.activeRaffles.get(ctx.msg.channel.id);
      if (!raffle) {
        await ctx.reply('❌ No active lucky draw here.');
        return;
      }

      if (raffle.entries.has(ctx.msg.author.id)) {
        await ctx.reply(`🎟️ Already entered! **${raffle.entries.size}** entries total.`);
      } else {
        raffle.entries.add(ctx.msg.author.id);
        await ctx.reply(`🎟️ You're in! **${raffle.entries.size}** entries total. Good luck!`);
      }
    },
    '!entries': async (ctx) => {
      const raffle = ctx.state.activeRaffles.get(ctx.msg.channel.id);
      if (!raffle) {
        await ctx.reply('❌ No active lucky draw.');
        return;
      }

      await ctx.reply(`🎟️ **${raffle.entries.size}** ticket(s) for **${raffle.prize}**.`);
    },
    '!draw': async (ctx) => {
      if (!ctx.isStaff(ctx.msg.member)) {
        await ctx.reply('❌ Staff only.');
        return;
      }

      const raffle = ctx.state.activeRaffles.get(ctx.msg.channel.id);
      if (!raffle || !raffle.entries.size) {
        await ctx.reply('❌ No active draw or no entries.');
        return;
      }

      const entries = [...raffle.entries];
      const winner = entries[Math.floor(Math.random() * entries.length)];
      ctx.state.activeRaffles.delete(ctx.msg.channel.id);

      await ctx.msg.channel.send([
        `# 🎊 WE HAVE A WINNER!`,
        `Out of **${entries.length}** entries...`,
        `🏆 <@${winner}> wins **${raffle.prize}**!`,
        `Contact a staff member to claim! 🎉`,
      ].join('\n'));
      await ctx.msg.delete().catch(() => {});
    },
  };
}

async function startGiveaway(ctx, mins, prize, title) {
  const endsAt = new Date(Date.now() + mins * 60 * 1000);
  const timestamp = Math.floor(endsAt.getTime() / 1000);
  const giveawayMessage = await ctx.msg.channel.send([
    `# ${title}`,
    `**Prize:** ${prize}`,
    `**Ends:** <t:${timestamp}:R>`,
    `**Hosted by:** ${ctx.msg.member}`,
    '',
    `React with 🎉 to enter!`,
  ].join('\n'));

  await giveawayMessage.react(ctx.config.G_EMOJI);
  ctx.state.activeGiveaways.set(giveawayMessage.id, { prize, channelId: ctx.msg.channel.id, hostId: ctx.msg.author.id, endsAt });
  await ctx.msg.delete().catch(() => {});
  setTimeout(() => endGiveaway(ctx, giveawayMessage.id), mins * 60 * 1000);
}

async function endGiveaway(ctx, messageId) {
  const data = ctx.state.activeGiveaways.get(messageId);
  let giveawayMessage = null;

  for (const [, channel] of ctx.guild.channels.cache) {
    if (channel.type !== ctx.ChannelType.GuildText) continue;
    try {
      giveawayMessage = await channel.messages.fetch(messageId);
      break;
    } catch {}
  }

  if (!giveawayMessage) return;

  const users = await giveawayMessage.reactions.cache.get(ctx.config.G_EMOJI)?.users.fetch();
  const eligible = users?.filter((user) => !user.bot);
  if (!eligible?.size) {
    await giveawayMessage.channel.send(`😢 Giveaway for **${data?.prize}** ended — no entries.`);
    ctx.state.activeGiveaways.delete(messageId);
    return;
  }

  const winner = eligible.random();
  await giveawayMessage.edit([
    `# 🎉 GIVEAWAY ENDED`,
    `**Prize:** ${data?.prize}`,
    `**Winner:** <@${winner.id}>`,
  ].join('\n'));
  await giveawayMessage.channel.send(`🎊 <@${winner.id}> wins **${data?.prize}**! Contact staff to claim. 🎉`);
  ctx.state.activeGiveaways.delete(messageId);
}

module.exports = createGiveawayCommands;