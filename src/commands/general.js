'use strict';

const { infoCard, successCard, warningCard } = require('../utils/card');

function createGeneralCommands() {
  return {
    '!help': async (ctx) => {
      await ctx.reply({
        embeds: [infoCard(
          '🤖 Dante CoC Bot Commands',
          'A quick reference for common commands. Keep this channel pinned or use it as a shortcut card.',
          0x5865F2,
          [
            { name: 'General', value: '`!rank` `!top` `!stats` `!youtube` `!th` `!schedule` `!cocnews`', inline: false },
            { name: 'Members', value: '`!enter` `!entries`', inline: true },
            { name: 'Staff', value: '`!giveaway` `!passgiveaway` `!endgiveaway` `!reroll` `!raffle` `!draw` `!promote` `!demote` `!setrole` `!warn` `!kick`', inline: false },
            { name: 'King only', value: '`!nuke confirm`', inline: true },
          ],
          'Use !free to see the free-first bot stack we recommend.'
        )],
      });
    },
    '!rank': async (ctx) => {
      const target = ctx.msg.mentions.members?.first() || ctx.msg.member;
      const xp = ctx.state.xp.get(target.id);
      const topRole = target.roles.cache.filter((role) => role.name !== '@everyone').sort((a, b) => b.position - a.position).first();
      await ctx.reply({
        embeds: [infoCard(
          `🏅 ${target.displayName}`,
          'Quick rank snapshot for the selected member.',
          [
            { name: 'Role', value: `${topRole || 'None'}`, inline: true },
            { name: 'XP', value: `${xp}`, inline: true },
            { name: 'Level', value: `${Math.floor(xp / 100)}`, inline: true },
          ],
          'Level is based on XP divided by 100.'
        )],
      });
    },
    '!top': async (ctx) => {
      const sorted = ctx.state.xp.top(10);
      if (!sorted.length) {
        await ctx.reply({ embeds: [warningCard('📊 Top Activity', 'No activity yet!', [], 'Start chatting to build XP.')] });
        return;
      }

      const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
      await ctx.reply({
        embeds: [infoCard(
          '🏆 Top 10 Most Active',
          sorted.map(([id, xp], index) => `${medals[index]} <@${id}> — **${xp} XP** (Lvl ${Math.floor(xp / 100)})`).join('\n'),
          [],
          'XP leaderboard refreshes in real time while the bot is running.'
        )],
      });
    },
    '!stats': async (ctx) => {
      await ctx.guild.members.fetch();
      const bots = ctx.guild.members.cache.filter((member) => member.user.bot).size;
      await ctx.reply({
        embeds: [infoCard(
          `📊 ${ctx.guild.name}`,
          'Current server status snapshot.',
          [
            { name: 'Members', value: `${ctx.guild.memberCount - bots}`, inline: true },
            { name: 'Bots', value: `${bots}`, inline: true },
            { name: 'YouTube', value: ctx.config.YOUTUBE_URL, inline: false },
          ],
        )],
      });
    },
    '!youtube': async (ctx) => {
      await ctx.reply({ embeds: [successCard('🎬 YouTube Channel', 'Subscribe here for new videos and alerts.', [{ name: 'Link', value: ctx.config.YOUTUBE_URL, inline: false }])] });
    },
    '!th': async (ctx) => {
      const channelId = ctx.channelIds['🎭-get-roles'];
      await ctx.reply({
        embeds: [infoCard(
          '🏰 TH Badge Roles',
          'Use the badge picker to set your Town Hall role.',
          [
            { name: 'Channel', value: channelId ? `<#${channelId}>` : '#get-roles', inline: true },
            { name: 'Badges', value: '🏆 TH18\n🔥 TH17\n⭐ TH16', inline: true },
          ],
        )],
      });
    },
    '!schedule': async (ctx) => {
      await ctx.reply({
        embeds: [infoCard(
          '⚔️ War Schedule',
          'The current clan rhythm and where to opt in.',
          [
            { name: 'Regular war', value: 'Every 2 days', inline: true },
            { name: 'CWL', value: 'First week of every month', inline: true },
            { name: 'Friendly war', value: 'Weekends', inline: true },
            { name: 'Opt in/out', value: '<#war-signups>', inline: false },
          ],
          'Adjust the schedule card if the clan cadence changes.'
        )],
      });
    },
    '!cocnews': async (ctx) => {
      await ctx.reply({
        embeds: [infoCard(
          '📰 CoC News',
          'Quick links for updates and patch notes.',
          [
            { name: 'Official', value: 'https://www.clashofclans.com/news', inline: false },
            { name: 'Patch notes', value: 'https://clashofclans.fandom.com/wiki/Update_History', inline: false },
            { name: 'Community', value: 'https://www.reddit.com/r/ClashOfClans/', inline: false },
          ],
        )],
      });
    },
    '!intro': async (ctx) => {
      await ctx.reply({
        embeds: [infoCard(
          '🎙️ Intro Template',
          'Drop this in #👋-introductions so new members know what kind of player you are.',
          0x5865F2,
          [
            { name: 'Copy format', value: 'Name:\nTH:\nLocation / timezone:\nFavorite attack:\nWar status:\nGoal in clan:', inline: false },
          ],
          'Keep it short, readable, and easy to reply to.'
        )],
      });
    },
    '!bio': async (ctx) => {
      await ctx.reply({
        embeds: [successCard(
          '🪪 Profile / Bio Template',
          'A clean Discord bio helps members remember what you do without clutter.',
          [
            { name: 'About me', value: 'TH17 | War attacker | Friendly challenger | Active evenings', inline: false },
            { name: 'Custom status idea', value: 'Grinding wars | Coaching new players | Subscribe for CoC content', inline: false },
          ],
          'Use Discord custom profiles and status for free before paying for cosmetics.'
        )],
      });
    },
    '!free': async (ctx) => {
      await ctx.reply({
        embeds: [warningCard(
          '🆓 Free Stack We Should Prefer',
          'These are the best no-cost features and bots to lean on before paying for anything.',
          [
            { name: 'Discord built-ins', value: 'Community onboarding, role-exclusive channels, polls, text and voice channels, screen share, profiles.', inline: false },
            { name: 'Carl-bot', value: 'Reaction roles, greetings, logging, automod, custom commands, suggestions, notifications.', inline: false },
            { name: 'YAGPDB', value: 'Open-source, self-hostable, reaction roles, automod, modlogs, feeds, custom commands.', inline: false },
            { name: 'Best use', value: 'Start with free tools. Add paid bots only when a hard limit blocks you.', inline: false },
          ],
          'Start free, then only add paid bots if you hit a hard limit.'
        )],
      });
    },
  };
}

module.exports = createGeneralCommands;