'use strict';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runStartupChecks(guild, config, helpers) {
  const { keepRoleNames, repostMessages, postPanels } = helpers;

  console.log('🚀 Running startup checks...\n');

  try {
    await guild.members.fetch();
    let stripped = 0;
    let deleted = 0;
    let given = 0;

    // 1. Strip roles that aren't in config
    for (const [, member] of guild.members.cache) {
      if (member.user.bot) continue;
      for (const [, role] of member.roles.cache) {
        if (role.name === '@everyone' || keepRoleNames.includes(role.name)) continue;
        try {
          await member.roles.remove(role);
          stripped += 1;
          await sleep(300);
        } catch (e) {}
      }
    }
    if (stripped) console.log(`✅ Stripped ${stripped} old roles.`);

    // 2. Delete role definitions not in config
    const allRoles = await guild.roles.fetch();
    for (const [, role] of allRoles) {
      if (role.managed || role.name === '@everyone' || keepRoleNames.includes(role.name)) continue;
      try {
        await role.delete();
        deleted += 1;
        await sleep(400);
      } catch (e) {}
    }
    if (deleted) console.log(`✅ Deleted ${deleted} old role definitions.`);

    // 3. Ensure everyone has the Recruit role if they have nothing else
    const recruitRole = guild.roles.cache.find((role) => role.name === '🛡️ Recruit');
    if (recruitRole) {
      for (const [, member] of guild.members.cache) {
        if (member.user.bot) continue;
        const hasManagedRole = member.roles.cache.some(
          (role) => keepRoleNames.includes(role.name) && role.name !== '@everyone'
        );
        if (!hasManagedRole) {
          try {
            await member.roles.add(recruitRole);
            given += 1;
            await sleep(300);
          } catch (e) {}
        }
      }
    }
    if (given) console.log(`✅ Gave Recruit to ${given} members.`);

    // 4. Set slowmode on key channels
    for (const name of ['💬-general-chat', '😂-memes', '📸-media', '👋-introductions']) {
      const channel = guild.channels.cache.find((item) => item.name === name);
      if (channel) {
        await channel.setRateLimitPerUser(5).catch(() => {});
        await sleep(300);
      }
    }

    // 5. Refresh messages and panels
    await repostMessages(guild, config);
    await postPanels(guild);

    // 6. Pin messages in info channels
    for (const channelName of ['📋-rules', '👋-welcome']) {
      const channel = guild.channels.cache.find((item) => item.name === channelName);
      if (channel) {
        const messages = await channel.messages.fetch({ limit: 5 });
        const first = messages.last();
        if (first && !first.pinned) {
          await first.pin().catch(() => {});
        }
        await sleep(400);
      }
    }

    console.log('\n' + '═'.repeat(50));
    console.log('🐉 DANTE COC BOT IS LIVE!');
    console.log('═'.repeat(50));
    console.log('\n✅ Cleanup done | ✅ Guides checked | ✅ Commands ready | 🟢 Running\n');
  } catch (error) {
    console.error('\n❌ Startup error:', error.message);
  }
}

module.exports = { runStartupChecks };