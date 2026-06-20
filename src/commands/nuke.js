'use strict';

const { infoCard, successCard, warningCard, errorCard } = require('../utils/card');

function createNukeCommands() {
  return {
    '!nuke': async (ctx) => {
      if (ctx.args[1] !== 'confirm') return;

      if (!ctx.msg.member.roles.cache.some((role) => role.name === '🐉 King')) {
        await ctx.reply({ embeds: [errorCard('❌ Access Denied', 'Only 🐉 King can nuke the server.')] });
        return;
      }

      if (ctx.msg.channel.name !== '💣-nuke-confirm') {
        await ctx.reply({ embeds: [warningCard('❌ Wrong Channel', 'Run this in #💣-nuke-confirm only.')] });
        return;
      }

      await ctx.msg.channel.send({ embeds: [infoCard('💣 NUKE CONFIRMED', 'Wiping the server and rebuilding everything now.')] });
      console.log('\n💣 NUKE triggered by ' + ctx.msg.author.tag);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await ctx.helpers.runFullSetup(ctx.guild);
    },
  };
}

module.exports = createNukeCommands;