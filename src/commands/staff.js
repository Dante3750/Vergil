'use strict';

const { successCard, warningCard, errorCard } = require('../utils/card');

function createStaffCommands() {
  return {
    '!promote': async (ctx) => {
      if (!ctx.isStaff(ctx.msg.member)) {
        await ctx.reply({ embeds: [errorCard('❌ Staff only', 'You do not have permission to use this command.')] });
        return;
      }

      await moveRole(ctx, 1);
    },
    '!demote': async (ctx) => {
      if (!ctx.isStaff(ctx.msg.member)) {
        await ctx.reply({ embeds: [errorCard('❌ Staff only', 'You do not have permission to use this command.')] });
        return;
      }

      await moveRole(ctx, -1);
    },
    '!setrole': async (ctx) => {
      if (!ctx.isStaff(ctx.msg.member)) {
        await ctx.reply({ embeds: [errorCard('❌ Staff only', 'You do not have permission to use this command.')] });
        return;
      }

      const target = ctx.msg.mentions.members?.first();
      const roleName = ctx.args.slice(2).join(' ');
      if (!target || !roleName) {
        await ctx.reply({ embeds: [warningCard('❌ Set Role Usage', 'Use `!setrole @user RoleName`.')] });
        return;
      }

      const role = ctx.guild.roles.cache.find((item) => item.name.toLowerCase().includes(roleName.toLowerCase()));
      if (!role) {
        await ctx.reply({ embeds: [warningCard('❌ Role Not Found', `No role matching "${roleName}" was found.`)] });
        return;
      }

      await target.roles.add(role);
      await ctx.reply({ embeds: [successCard('✅ Role Assigned', `Gave **${target.displayName}** the ${role} role.`)] });
    },
    '!warn': async (ctx) => {
      if (!ctx.isStaff(ctx.msg.member)) {
        await ctx.reply({ embeds: [errorCard('❌ Staff only', 'You do not have permission to use this command.')] });
        return;
      }

      const target = ctx.msg.mentions.members?.first();
      const reason = ctx.args.slice(2).join(' ') || 'No reason given';
      if (!target) {
        await ctx.reply({ embeds: [warningCard('❌ Warn Usage', 'Use `!warn @user reason`.')] });
        return;
      }

      const logChannel = ctx.guild.channels.cache.find((channel) => channel.name === '📋-ban-log');
      if (logChannel) await logChannel.send(`⚠️ **WARNING** | ${target} warned by ${ctx.msg.member} | ${reason} | ${new Date().toUTCString()}`);
      await target.send(`⚠️ Warning in **${ctx.guild.name}**: ${reason}`).catch(() => {});
      await ctx.reply({
        embeds: [warningCard('⚠️ Warning Logged', `**${target.displayName}** was warned and the action was logged.`, [{ name: 'Reason', value: reason, inline: false }])],
      });
    },
    '!kick': async (ctx) => {
      if (!ctx.isStaff(ctx.msg.member)) {
        await ctx.reply({ embeds: [errorCard('❌ Staff only', 'You do not have permission to use this command.')] });
        return;
      }

      const target = ctx.msg.mentions.members?.first();
      const reason = ctx.args.slice(2).join(' ') || 'No reason given';
      if (!target) {
        await ctx.reply({ embeds: [warningCard('❌ Kick Usage', 'Use `!kick @user reason`.')] });
        return;
      }

      await target.kick(reason);
      const logChannel = ctx.guild.channels.cache.find((channel) => channel.name === '📋-ban-log');
      if (logChannel) await logChannel.send(`👢 **KICK** | ${target.user.tag} kicked by ${ctx.msg.member} | ${reason} | ${new Date().toUTCString()}`);
      await ctx.reply({
        embeds: [errorCard('👢 Member Kicked', `**${target.displayName}** was kicked from the server.`, [{ name: 'Reason', value: reason, inline: false }])],
      });
    },
  };
}

async function moveRole(ctx, direction) {
  const target = ctx.msg.mentions.members?.first();
  if (!target) {
    await ctx.reply({ embeds: [warningCard('❌ Promotion Usage', `Use \`${direction > 0 ? '!promote' : '!demote'} @user\`.`)] });
    return;
  }

  const ladder = ctx.config.ROLE_LADDER;
  const currentIndex = ladder.findIndex((roleName) => target.roles.cache.some((role) => role.name === roleName));
  const nextIndex = direction > 0 ? currentIndex + 1 : currentIndex - 1;

  if (nextIndex < 0) {
    await ctx.reply({ embeds: [warningCard('❌ Lowest Role', 'That member is already at the lowest role in the ladder.')] });
    return;
  }

  if (nextIndex >= ladder.length) {
    await ctx.reply({ embeds: [warningCard('❌ Highest Role', 'That member is already at the highest role in the ladder.')] });
    return;
  }

  const newRoleName = ladder[nextIndex];
  const newRole = ctx.guild.roles.cache.find((role) => role.name === newRoleName);
  if (!newRole) {
    await ctx.reply({ embeds: [errorCard('❌ Role Not Found', 'The next ladder role could not be found in this server.')] });
    return;
  }

  for (const roleName of ladder) {
    const role = ctx.guild.roles.cache.find((item) => item.name === roleName);
    if (role && target.roles.cache.has(role.id)) {
      await target.roles.remove(role).catch(() => {});
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }

  await target.roles.add(newRole);
  await ctx.reply({
    embeds: [successCard(direction > 0 ? '⬆️ Member Promoted' : '⬇️ Member Demoted', `**${target.displayName}** is now ${newRoleName}.`)],
  });
}

module.exports = createStaffCommands;