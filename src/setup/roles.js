'use strict';

async function rebuildRoles(guild, config) {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  console.log('👑 Building roles...');
  const existing = await guild.roles.fetch();
  for (const [, role] of existing) {
    if (role.managed || role.name === '@everyone') continue;
    if (!config.ROLE_DEFINITIONS.some((definition) => definition.name === role.name)) {
      try { await role.delete(); await sleep(300); } catch {}
    }
  }

  const roles = {};
  for (const definition of config.ROLE_DEFINITIONS) {
    const exists = guild.roles.cache.find((role) => role.name === definition.name);
    if (exists) {
      roles[definition.key] = exists;
      console.log(`  ↩️  ${definition.name} (already exists)`);
    } else {
      roles[definition.key] = await guild.roles.create({
        name: definition.name,
        color: definition.color,
        hoist: definition.hoist,
        mentionable: true,
        permissions: definition.perms,
      });
      console.log(`  ✅ ${definition.name} created`);
    }

    await sleep(400);
  }

  return roles;
}

module.exports = { rebuildRoles };