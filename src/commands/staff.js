'use strict';

function createStaffCommands() {
  return {
    '!promote': async (ctx) => {
      if (!ctx.isStaff(ctx.msg.member)) {
        await ctx.reply('❌ Staff only.');
        return;
      }

      await moveRole(ctx, 1);
    },
    '!demote': async (ctx) => {
      if (!ctx.isStaff(ctx.msg.member)) {
        await ctx.reply('❌ Staff only.');
        return;
      }

      await moveRole(ctx, -1);
    },
    '!setrole': async (ctx) => {
      if (!ctx.isStaff(ctx.msg.member)) {
        await ctx.reply('❌ Staff only.');
        return;
      }

      const target = ctx.msg.mentions.members?.first();
      const roleName = ctx.args.slice(2).join(' ');
      if (!target || !roleName) {
        await ctx.reply('❌ Usage: `!setrole @user RoleName`');
        return;
      }

      const role = ctx.guild.roles.cache.find((item) => item.name.toLowerCase().includes(roleName.toLowerCase()));
      if (!role) {
        await ctx.reply(`❌ No role matching "${roleName}"`);
        return;
      }

      await target.roles.add(role);
      await ctx.reply(`✅ Gave **${target.displayName}** the ${role} role.`);
    },
    '!warn': async (ctx) => {
      if (!ctx.isStaff(ctx.msg.member)) {
        await ctx.reply('❌ Staff only.');
        return;
      }

      const target = ctx.msg.mentions.members?.first();
      const reason = ctx.args.slice(2).join(' ') || 'No reason given';
      if (!target) {
        await ctx.reply('❌ Usage: `!warn @user reason`');
        return;
      }

      const logChannel = ctx.guild.channels.cache.find((channel) => channel.name === '📋-ban-log');
      if (logChannel) await logChannel.send(`⚠️ **WARNING** | ${target} warned by ${ctx.msg.member} | ${reason} | ${new Date().toUTCString()}`);
      await target.send(`⚠️ Warning in **${ctx.guild.name}**: ${reason}`).catch(() => {});
      await ctx.reply(`⚠️ **${target.displayName}** warned. Logged.`);
    },
    '!kick': async (ctx) => {
      if (!ctx.isStaff(ctx.msg.member)) {
        await ctx.reply('❌ Staff only.');
        return;
      }

      const target = ctx.msg.mentions.members?.first();
      const reason = ctx.args.slice(2).join(' ') || 'No reason given';
      if (!target) {
        await ctx.reply('❌ Usage: `!kick @user reason`');
        return;
      }

      await target.kick(reason);
      const logChannel = ctx.guild.channels.cache.find((channel) => channel.name === '📋-ban-log');
      if (logChannel) await logChannel.send(`👢 **KICK** | ${target.user.tag} kicked by ${ctx.msg.member} | ${reason} | ${new Date().toUTCString()}`);
      await ctx.reply(`👢 **${target.displayName}** kicked. Reason: ${reason}`);
    },
  };
}

async function moveRole(ctx, direction) {
  const target = ctx.msg.mentions.members?.first();
  if (!target) {
    await ctx.reply(`❌ Usage: \`${direction > 0 ? '!promote' : '!demote'} @user\``);
    return;
  }

  const currentIndex = ctx.config.ROLE_LADDER.findIndex((roleName) => target.roles.cache.some((role) => role.name === roleName));
  const nextIndex = direction > 0 ? currentIndex + 1 : currentIndex - 1;
  if (nextIndex < 0) {
    await ctx.reply('❌ Already at lowest role.');
    return;
  }
  if (nextIndex >= ctx.config.ROLE_LADDER.length) {
    await ctx.reply('❌ Already at highest role.');
    return;
  }

  const newRole = ctx.guild.roles.cache.find((role) => role.name === ctx.config.ROLE_LADDER[nextIndex]);
  if (!newRole) {
    await ctx.reply('❌ Role not found.');
    return;
  }

  for (const roleName of ctx.config.ROLE_LADDER) {
    const role = ctx.guild.roles.cache.find((item) => item.name === roleName);
    if (role && target.roles.cache.has(role.id)) {
      await target.roles.remove(role);
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }

  await target.roles.add(newRole);
  await ctx.reply(`${direction > 0 ? '⬆️' : '⬇️'} **${target.displayName}** is now ${newRole}`);
}

module.exports = createStaffCommands;