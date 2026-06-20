'use strict';

async function wipeServer(guild) {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  console.log('🗑️  Wiping channels...');
  const channels = await guild.channels.fetch();
  for (const [, channel] of channels) {
    try { await channel.delete(); await sleep(300); } catch {}
  }

  console.log('🗑️  Wiping roles...');
  const roles = await guild.roles.fetch();
  for (const [, role] of roles) {
    if (role.name !== '@everyone' && !role.managed) {
      try { await role.delete(); await sleep(300); } catch {}
    }
  }

  console.log('✅  Server wiped.\n');
}

module.exports = { wipeServer };