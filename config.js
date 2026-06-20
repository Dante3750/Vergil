const fs = require('fs');
const path = require('path');
const { PermissionFlagsBits } = require('discord.js');

function loadEnvFile(envPath) {
  if (!fs.existsSync(envPath)) return;

  const contents = fs.readFileSync(envPath, 'utf8');
  for (const line of contents.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

function numberFromEnv(name, fallback) {
  const parsed = Number(process.env[name]);
  return Number.isFinite(parsed) ? parsed : fallback;
}

loadEnvFile(path.join(__dirname, '.env'));

module.exports = {
  BOT_TOKEN: process.env.BOT_TOKEN || '',
  GUILD_ID: process.env.GUILD_ID || '',
  YOUTUBE_URL: process.env.YOUTUBE_URL || 'https://www.youtube.com/@DanteClashofClans',
  CLAN_TAG: process.env.CLAN_TAG || '#QPGV90UQ',
  SERVER_NAME: process.env.SERVER_NAME || 'Game of Thrones',
  MIN_TH: numberFromEnv('MIN_TH', 16),
  ROLE_DEFINITIONS: [
    { key: 'king',        name: '🐉 King',            color: 0xFFD700, hoist: true, perms: [PermissionFlagsBits.Administrator] },
    { key: 'hand',        name: '🦁 Hand of the King', color: 0xE67E22, hoist: true, perms: [PermissionFlagsBits.ManageChannels, PermissionFlagsBits.KickMembers, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.MuteMembers, PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
    { key: 'maester',     name: '📜 Maester',          color: 0x3498DB, hoist: true, perms: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.MuteMembers, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ViewChannel] },
    { key: 'knight',      name: '⚔️ Knight',           color: 0x2ECC71, hoist: true, perms: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AddReactions] },
    { key: 'ytfan',       name: '🎬 YouTube Fan',      color: 0xE74C3C, hoist: true, perms: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.EmbedLinks] },
    { key: 'laloon',      name: '🎈 LaLoon Fan',       color: 0x9B59B6, hoist: true, perms: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel] },
    { key: 'recruit',     name: '🛡️ Recruit',          color: 0x95A5A6, hoist: true, perms: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory] },
    { key: 'th18',        name: '🏆 TH18',             color: 0xFF4500, hoist: false, perms: [] },
    { key: 'th17',        name: '🔥 TH17',             color: 0xFF8C00, hoist: false, perms: [] },
    { key: 'th16',        name: '⭐ TH16',             color: 0xFFC300, hoist: false, perms: [] },
    { key: 'botDante',    name: '🤖 Dante Bot',        color: 0x5865F2, hoist: false, perms: [PermissionFlagsBits.ManageRoles, PermissionFlagsBits.ManageChannels, PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ViewChannel, PermissionFlagsBits.AddReactions, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.MentionEveryone, PermissionFlagsBits.KickMembers] },
    { key: 'botCarl',     name: '🤖 carl-bot',         color: 0xFF7324, hoist: false, perms: [PermissionFlagsBits.ManageRoles, PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AddReactions, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ViewChannel] },
    { key: 'botMee6',     name: '🤖 MEE6',             color: 0x00B0F4, hoist: false, perms: [PermissionFlagsBits.ManageRoles, PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.MentionEveryone, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ViewChannel] },
    { key: 'botClashKing',name: '🤖 ClashKing',        color: 0xFFD700, hoist: false, perms: [PermissionFlagsBits.ManageRoles, PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.MentionEveryone, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ManageMessages] },
    { key: 'botClashPerk',name: '🤖 ClashPerk',        color: 0x57F287, hoist: false, perms: [PermissionFlagsBits.ManageRoles, PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.MentionEveryone, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ManageMessages] },
  ],
  CHANNEL_LAYOUT: [
    { category: '📢 INFO', channels: [
      { key: 'welcome', name: '👋-welcome', topic: 'Welcome to Dante CoC!', canSend: ['king','hand','maester'], readOnly: ['knight','ytfan','laloon','recruit'] },
      { key: 'rules', name: '📋-rules', topic: 'Server rules — read before chatting', canSend: ['king','hand','maester'], readOnly: ['knight','ytfan','laloon','recruit'] },
      { key: 'announcements', name: '📣-announcements', topic: 'Server & CoC news', canSend: ['king','hand','maester'], readOnly: ['knight','ytfan','laloon','recruit'] },
      { key: 'newvideos', name: '🎬-new-videos', topic: 'New YouTube video alerts', canSend: ['king','hand','maester'], readOnly: ['knight','ytfan','laloon','recruit'] },
      { key: 'getRoles', name: '🎭-get-roles', topic: 'Pick your badges here', canSend: ['king','hand','maester','knight','ytfan','laloon','recruit'] },
    ]},
    { category: '💬 GENERAL', channels: [
      { key: 'general', name: '💬-general-chat', topic: 'Main community chat', canSend: ['king','hand','maester','knight','ytfan','laloon','recruit'] },
      { key: 'intros', name: '👋-introductions', topic: 'Introduce yourself + TH level', canSend: ['king','hand','maester','knight','ytfan','laloon','recruit'] },
      { key: 'memes', name: '😂-memes', topic: 'Memes and banter', canSend: ['king','hand','maester','knight','ytfan','laloon','recruit'] },
      { key: 'media', name: '📸-media', topic: 'Screenshots and clips', canSend: ['king','hand','maester','knight','ytfan','laloon','recruit'] },
      { key: 'polls', name: '📊-polls', topic: 'Polls', canSend: ['king','hand','maester','knight'], readOnly: ['ytfan','laloon','recruit'] },
      { key: 'giveaways', name: '🎁-giveaways', topic: 'Giveaways and lucky draws', canSend: ['king','hand','maester'], readOnly: ['knight','ytfan','laloon','recruit'] },
      { key: 'hindi', name: '🌍-hindi-chat', topic: 'Hindi chat | हिंदी', canSend: ['king','hand','maester','knight','ytfan','laloon','recruit'] },
    ]},
    { category: '🎬 YOUTUBE — DANTE COC', channels: [
      { key: 'videoalerts', name: '🔔-video-alerts', topic: 'New video notifications', canSend: ['king','hand','maester'], readOnly: ['knight','ytfan','laloon','recruit'] },
      { key: 'videochat', name: '💬-video-chat', topic: 'Discuss Dante\'s videos', canSend: ['king','hand','maester','knight','ytfan','laloon','recruit'] },
      { key: 'ideas', name: '💡-video-ideas', topic: 'Suggest video ideas', canSend: ['king','hand','maester','knight','ytfan','laloon','recruit'] },
      { key: 'hindiyt', name: '🌍-hindi-videos', topic: 'Hindi content | हिंदी', canSend: ['king','hand','maester','knight','ytfan','laloon','recruit'] },
    ]},
    { category: '⚔️ CLASH OF CLANS', channels: [
      { key: 'strategy', name: '🗡️-strategy', topic: 'Attack strategies and tips', canSend: ['king','hand','maester','knight'] },
      { key: 'recruitment', name: '🤝-recruitment', topic: 'Find a clan or player', canSend: ['king','hand','maester','knight'] },
      { key: 'bestclips', name: '🎬-best-clips', topic: 'Best attack replays', canSend: ['king','hand','maester','knight'] },
      { key: 'tournaments', name: '🏆-tournaments', topic: 'Tournament announcements', canSend: ['king','hand','maester','knight'] },
      { key: 'cocupdates', name: '📰-coc-updates', topic: 'CoC patch notes and balance', canSend: ['king','hand','maester'], readOnly: ['knight','ytfan','laloon','recruit'] },
    ]},
    { category: '🏴 WAR ROOM', channels: [
      { key: 'warchat', name: '⚔️-war-chat', topic: 'War planning and calling', canSend: ['king','hand','maester','knight'] },
      { key: 'warsignups', name: '📣-war-signups', topic: 'Opt in and out of war', canSend: ['king','hand','maester','knight'] },
      { key: 'warorders', name: '🗺️-war-orders', topic: 'Staff war orders', canSend: ['king','hand','maester'], readOnly: ['knight'] },
      { key: 'warresults', name: '🏅-war-results', topic: 'Final war results', canSend: ['king','hand','maester','knight'] },
      { key: 'cwl', name: '🏆-cwl', topic: 'Clan War League discussion', canSend: ['king','hand','maester','knight'] },
      { key: 'legend', name: '👑-legend-hits', topic: 'Legend League daily attacks', canSend: ['king','hand','maester','knight'] },
    ]},
    { category: '🏰 BASE LIBRARY', channels: [
      { key: 'warbases', name: '⚔️-war-bases', topic: 'War base links', canSend: ['king','hand','maester'], readOnly: ['knight'] },
      { key: 'cwlbases', name: '🛡️-cwl-bases', topic: 'CWL base links', canSend: ['king','hand','maester'], readOnly: ['knight'] },
      { key: 'legendbases', name: '👑-legend-bases', topic: 'Legend League base links', canSend: ['king','hand','maester','knight'] },
      { key: 'generalbases', name: '🔗-general-bases', topic: 'General base sharing', canSend: ['king','hand','maester','knight'] },
    ]},
    { category: '🎫 SUPPORT', channels: [
      { key: 'howtojoin', name: '📘-how-to-join', topic: 'How to join Dante CoC clan', canSend: ['king','hand','maester'], readOnly: ['knight','ytfan','laloon','recruit'] },
      { key: 'tickets', name: '🎫-tickets', topic: 'Open a support ticket', canSend: ['king','hand','maester','knight','ytfan','laloon','recruit'] },
      { key: 'botcmds', name: '🤖-bot-commands', topic: 'All bot commands listed here', canSend: ['king','hand','maester','knight','ytfan','laloon','recruit'] },
    ]},
    { category: '🔒 STAFF ONLY', channels: [
      { key: 'staffchat', name: '⚙️-staff-chat', topic: 'Staff-only discussion', canSend: ['king','hand','maester'] },
      { key: 'banlog', name: '📋-ban-log', topic: 'Kicks, bans and warnings', canSend: ['king','hand','maester'] },
      { key: 'botlogs', name: '🤖-bot-logs', topic: 'Bot event logs', canSend: ['king','hand','maester'] },
      { key: 'botsetup', name: '🛠️-bot-setup', topic: 'Complete bot setup guides', canSend: ['king','hand','maester'] },
      { key: 'nukeconfirm', name: '💣-nuke-confirm', topic: 'Type !nuke confirm to wipe server', canSend: ['king'] },
    ]},
    { category: '🔊 VOICE CHANNELS', channels: [
      { key: 'vc1', name: '💬 General Voice', type: 'voice', canSend: ['king','hand','maester','knight','ytfan','laloon','recruit'] },
      { key: 'vc2', name: '⚔️ War Council', type: 'voice', canSend: ['king','hand','maester','knight'] },
      { key: 'vc3', name: '🎮 Gaming', type: 'voice', canSend: ['king','hand','maester','knight','ytfan','laloon','recruit'] },
      { key: 'vc4', name: '🎙️ Chill Zone', type: 'voice', canSend: ['king','hand','maester','knight','ytfan','laloon','recruit'] },
      { key: 'vc5', name: '💤 AFK', type: 'voice', canSend: ['king','hand','maester','knight','ytfan','laloon','recruit'] },
    ]},
  ],
  ROLE_LADDER: ['🛡️ Recruit','⚔️ Knight','🎬 YouTube Fan','📜 Maester','🦁 Hand of the King','🐉 King'],
  STAFF_ROLES: ['🐉 King','🦁 Hand of the King','📜 Maester'],
  G_EMOJI: '🎉',
};