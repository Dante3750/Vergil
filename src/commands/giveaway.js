'use strict';

const { infoCard, successCard, warningCard, errorCard } = require('../utils/card');

function createGiveawayCommands() {
  return {
    '!giveaway': async (ctx) => {
      if (!ctx.isStaff(ctx.msg.member)) {
        await ctx.reply({ embeds: [errorCard('❌ Staff only', 'You do not have permission to use this command.')] });
        return;
      }

      const mins = Number.parseInt(ctx.args[1], 10);
      const prize = ctx.args.slice(2).join(' ');
      if (!mins || !prize) {
        await ctx.reply({ embeds: [warningCard('❌ Giveaway Usage', 'Use `!giveaway [minutes] [prize]`.')] });
        return;
      }

      await startGiveaway(ctx, mins, prize, '🎁 GIVEAWAY');
    },
    '!passgiveaway': async (ctx) => {
      if (!ctx.isStaff(ctx.msg.member)) {
        await ctx.reply({ embeds: [errorCard('❌ Staff only', 'You do not have permission to use this command.')] });
        return;
      }

      await startGiveaway(ctx, Number.parseInt(ctx.args[1], 10) || 1440, '🏰 Clash of Clans Gold Pass', '🏰 GOLD PASS GIVEAWAY');
    },
    '!endgiveaway': async (ctx) => {
      if (!ctx.isStaff(ctx.msg.member)) {
        await ctx.reply({ embeds: [errorCard('❌ Staff only', 'You do not have permission to use this command.')] });
        return;
      }

      if (!ctx.args[1]) {
        await ctx.reply({ embeds: [warningCard('❌ End Giveaway Usage', 'Use `!endgiveaway [message ID]`.')] });
        return;
      }

      await endGiveaway(ctx, ctx.args[1]);
      await ctx.msg.delete().catch(() => {});
    },
    '!reroll': async (ctx) => {
      if (!ctx.isStaff(ctx.msg.member)) {
        await ctx.reply({ embeds: [errorCard('❌ Staff only', 'You do not have permission to use this command.')] });
        return;
      }

      if (!ctx.args[1]) {
        await ctx.reply({ embeds: [warningCard('❌ Reroll Usage', 'Use `!reroll [message ID]`.')] });
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
        await ctx.reply({ embeds: [warningCard('❌ Message Not Found', 'I could not find that giveaway message in this server.')] });
        return;
      }

      const users = await giveawayMessage.reactions.cache.get(ctx.config.G_EMOJI)?.users.fetch();
      const eligible = users?.filter((user) => !user.bot);
      if (!eligible?.size) {
        await ctx.reply({ embeds: [warningCard('❌ No Eligible Entries', 'Nobody has reacted on that giveaway yet.')] });
        return;
      }

      await ctx.msg.channel.send({ embeds: [successCard('🎉 Reroll Winner', `New winner: <@${eligible.random().id}> 🎊`)] });
      await ctx.msg.delete().catch(() => {});
    },
    '!raffle': async (ctx) => {
      if (!ctx.isStaff(ctx.msg.member)) {
        await ctx.reply({ embeds: [errorCard('❌ Staff only', 'You do not have permission to use this command.')] });
        return;
      }

      const prize = ctx.args.slice(1).join(' ');
      if (!prize) {
        await ctx.reply({ embeds: [warningCard('❌ Raffle Usage', 'Use `!raffle [prize]`.')] });
        return;
      }

      ctx.state.activeRaffles.set(ctx.msg.channel.id, { prize, entries: new Set(), hostId: ctx.msg.author.id });
      await ctx.msg.channel.send({
        embeds: [infoCard(
          '🎟️ Lucky Draw Open',
          'Use `!enter` to join. Staff can type `!draw` when entry time is done.',
          [
            { name: 'Prize', value: prize, inline: false },
            { name: 'Hosted by', value: `${ctx.msg.member}`, inline: false },
          ],
          'Open raffle active in this channel.'
        )],
      });
      await ctx.msg.delete().catch(() => {});
    },
    '!enter': async (ctx) => {
      const raffle = ctx.state.activeRaffles.get(ctx.msg.channel.id);
      if (!raffle) {
        await ctx.reply({ embeds: [warningCard('❌ No Active Lucky Draw', 'There is no raffle running in this channel.')] });
        return;
      }

      if (raffle.entries.has(ctx.msg.author.id)) {
        await ctx.reply({ embeds: [successCard('🎟️ Already Entered', `You are already in. **${raffle.entries.size}** entries total.`)] });
      } else {
        raffle.entries.add(ctx.msg.author.id);
        await ctx.reply({ embeds: [successCard('🎟️ Entry Confirmed', `You are in! **${raffle.entries.size}** entries total. Good luck!`)] });
      }
    },
    '!entries': async (ctx) => {
      const raffle = ctx.state.activeRaffles.get(ctx.msg.channel.id);
      if (!raffle) {
        await ctx.reply({ embeds: [warningCard('❌ No Active Lucky Draw', 'There is no raffle running in this channel.')] });
        return;
      }

      await ctx.reply({ embeds: [infoCard('🎟️ Current Entries', `**${raffle.entries.size}** ticket(s) for **${raffle.prize}**.`)] });
    },
    '!draw': async (ctx) => {
      if (!ctx.isStaff(ctx.msg.member)) {
        await ctx.reply({ embeds: [errorCard('❌ Staff only', 'You do not have permission to use this command.')] });
        return;
      }

      const raffle = ctx.state.activeRaffles.get(ctx.msg.channel.id);
      if (!raffle || !raffle.entries.size) {
        await ctx.reply({ embeds: [warningCard('❌ No Active Draw', 'There is no raffle running here or no one entered.')] });
        return;
      }

      const entries = [...raffle.entries];
      const winner = entries[Math.floor(Math.random() * entries.length)];
      ctx.state.activeRaffles.delete(ctx.msg.channel.id);

      await ctx.msg.channel.send({
        embeds: [successCard(
          '🎊 We Have a Winner',
          `🏆 <@${winner}> wins **${raffle.prize}**!`,
          [
            { name: 'Entries', value: `${entries.length}`, inline: true },
            { name: 'Next step', value: 'Contact a staff member to claim.', inline: true },
          ],
        )],
      });
      await ctx.msg.delete().catch(() => {});
    },
  };
}

async function startGiveaway(ctx, mins, prize, title) {
  const endsAt = new Date(Date.now() + mins * 60 * 1000);
  const timestamp = Math.floor(endsAt.getTime() / 1000);
  const giveawayMessage = await ctx.msg.channel.send([
    { embeds: [infoCard(title, 'React with 🎉 to enter before the timer ends.', [
      { name: 'Prize', value: prize, inline: false },
      { name: 'Ends', value: `<t:${timestamp}:R>`, inline: true },
      { name: 'Hosted by', value: `${ctx.msg.member}`, inline: true },
    ])] },
  ]);

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
    await giveawayMessage.channel.send({ embeds: [warningCard('😢 Giveaway Ended', `No entries were collected for **${data?.prize}**.`)] });
    ctx.state.activeGiveaways.delete(messageId);
    return;
  }

  const winner = eligible.random();
  await giveawayMessage.edit({ embeds: [successCard('🎉 Giveaway Ended', `🏆 <@${winner.id}> wins **${data?.prize}**!`, [
    { name: 'Prize', value: data?.prize || 'Unknown', inline: false },
  ])] });
  await giveawayMessage.channel.send({ embeds: [successCard('🎊 Winner Announced', `Contact staff to claim the prize: **${data?.prize}**.`)] });
  ctx.state.activeGiveaways.delete(messageId);
}

module.exports = createGiveawayCommands;