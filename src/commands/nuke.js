'use strict';

function createNukeCommands() {
  return {
    '!nuke': async (ctx) => {
      if (ctx.args[1] !== 'confirm') return;

      if (!ctx.msg.member.roles.cache.some((role) => role.name === '🐉 King')) {
        await ctx.reply('❌ Only 🐉 King can nuke the server.');
        return;
      }

      if (ctx.msg.channel.name !== '💣-nuke-confirm') {
        await ctx.reply('❌ Run this in #💣-nuke-confirm only.');
        return;
      }

      await ctx.msg.channel.send('💣 **NUKE CONFIRMED — wiping server and rebuilding...**');
      console.log('\n💣 NUKE triggered by ' + ctx.msg.author.tag);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await ctx.helpers.runFullSetup(ctx.guild);
    },
  };
}

module.exports = createNukeCommands;