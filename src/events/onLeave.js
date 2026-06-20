'use strict';

async function handleLeave(member) {
  try {
    const logChannel = member.guild.channels.cache.find((channel) => channel.name === '📋-ban-log');
    if (!logChannel) return;

    const roles = member.roles.cache.filter((role) => role.name !== '@everyone').map((role) => role.name).join(', ') || 'None';
    await logChannel.send(`🚪 **LEFT** | ${member.user.tag} | Roles: ${roles} | ${new Date().toUTCString()}`);
  } catch {}
}

module.exports = { handleLeave };