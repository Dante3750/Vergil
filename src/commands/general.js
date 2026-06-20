'use strict';

function createGeneralCommands() {
  return {
    '!help': async (ctx) => {
      await ctx.reply([
        `## 🤖 Dante CoC Bot Commands`,
        '',
        `**📊 General**`,
        `\`!rank [@user]\` — Role + XP level`,
        `\`!top\` — Top 10 most active members`,
        `\`!stats\` — Server stats`,
        `\`!youtube\` — YouTube channel link`,
        `\`!th\` — How to get TH badge roles`,
        `\`!schedule\` — War schedule`,
        `\`!cocnews\` — Latest CoC news links`,
        '',
        `**🎉 Giveaways (Staff only)**`,
        `\`!giveaway [mins] [prize]\` — Timed giveaway`,
        `\`!passgiveaway [mins]\` — Gold Pass giveaway`,
        `\`!endgiveaway [msgID]\` — End giveaway early`,
        `\`!reroll [msgID]\` — Pick new winner`,
        `\`!raffle [prize]\` — Open lucky draw (type !enter)`,
        `\`!draw\` — Pick raffle winner`,
        '',
        `**🎟️ Members**`,
        `\`!enter\` — Enter active lucky draw`,
        `\`!entries\` — See current entry count`,
        '',
        `**🔒 Staff only**`,
        `\`!promote @user\` — Move up one role`,
        `\`!demote @user\` — Move down one role`,
        `\`!setrole @user RoleName\` — Set exact role`,
        `\`!warn @user reason\` — Warn + log`,
        `\`!kick @user reason\` — Kick + log`,
        '',
        `**💣 King only**`,
        `\`!nuke confirm\` — Wipe + rebuild server (in #💣-nuke-confirm)`,
      ].join('\n'));
    },
    '!rank': async (ctx) => {
      const target = ctx.msg.mentions.members?.first() || ctx.msg.member;
      const xp = ctx.state.xp.get(target.id);
      const topRole = target.roles.cache.filter((role) => role.name !== '@everyone').sort((a, b) => b.position - a.position).first();
      await ctx.reply([
        `**${target.displayName}**`,
        `🏅 Role: ${topRole || 'None'}`,
        `⭐ XP: **${xp}** | Level: **${Math.floor(xp / 100)}**`,
      ].join('\n'));
    },
    '!top': async (ctx) => {
      const sorted = ctx.state.xp.top(10);
      if (!sorted.length) {
        await ctx.reply('📊 No activity yet!');
        return;
      }

      const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
      await ctx.reply(`## 🏆 Top 10 Most Active\n\n${sorted.map(([id, xp], index) => `${medals[index]} <@${id}> — **${xp} XP** (Lvl ${Math.floor(xp / 100)})`).join('\n')}`);
    },
    '!stats': async (ctx) => {
      await ctx.guild.members.fetch();
      const bots = ctx.guild.members.cache.filter((member) => member.user.bot).size;
      await ctx.reply([
        `## 📊 ${ctx.guild.name}`,
        `👥 Members: **${ctx.guild.memberCount - bots}** | 🤖 Bots: **${bots}**`,
        `🎬 ${ctx.config.YOUTUBE_URL}`,
      ].join('\n'));
    },
    '!youtube': async (ctx) => {
      await ctx.reply(`🎬 Subscribe → ${ctx.config.YOUTUBE_URL}`);
    },
    '!th': async (ctx) => {
      const channelId = ctx.channelIds['🎭-get-roles'];
      await ctx.reply([
        `## 🏰 TH Badge Roles`,
        `Go to ${channelId ? `<#${channelId}>` : '#get-roles'} and react:`,
        `🏆 → TH18 | 🔥 → TH17 | ⭐ → TH16`,
      ].join('\n'));
    },
    '!schedule': async (ctx) => {
      await ctx.reply([
        `## ⚔️ War Schedule`,
        `**Regular War:** Every 2 days`,
        `**CWL:** First week of every month`,
        `**Friendly War:** Weekends`,
        `Opt in/out → 📣-war-signups`,
      ].join('\n'));
    },
    '!cocnews': async (ctx) => {
      await ctx.reply([
        `## 📰 CoC News`,
        `🔗 https://www.clashofclans.com/news`,
        `🔗 https://clashofclans.fandom.com/wiki/Update_History`,
        `🔗 https://www.reddit.com/r/ClashOfClans/`,
      ].join('\n'));
    },
  };
}

module.exports = createGeneralCommands;