'use strict';

const { Client, GatewayIntentBits, ChannelType, Events } = require('discord.js');
const config = require('../config');
const { createXpSystem } = require('./systems/xp');
const { createCommandRouter } = require('./commands');
const { wipeServer } = require('./setup/wipe');
const { rebuildRoles } = require('./setup/roles');
const { rebuildChannels } = require('./setup/channels');
const { repostMessages } = require('./setup/messages');
const { postPanels } = require('./setup/panels');
const { repostGuides } = require('./setup/guides');
const { handleJoin } = require('./events/onJoin');
const { handleLeave } = require('./events/onLeave');
const { handleComponentInteraction } = require('./interactions/components');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function start() {
  if (!config.BOT_TOKEN || !config.GUILD_ID) {
    console.error('Missing BOT_TOKEN or GUILD_ID. Create a .env file from .env.example before starting the bot.');
    process.exit(1);
  }

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMessageReactions,
    ],
  });

  const state = {
    activeGiveaways: new Map(),
    activeRaffles: new Map(),
    xp: createXpSystem(),
  };

  const isStaff = (member) => member.roles.cache.some((role) => config.STAFF_ROLES.includes(role.name));
  const commandRouter = createCommandRouter();
  const keepRoleNames = config.ROLE_DEFINITIONS.map((role) => role.name).concat(['@everyone']);

  async function runFullSetup(guild) {
    await wipeServer(guild);
    const roles = await rebuildRoles(guild, config);
    const channels = await rebuildChannels(guild, config, roles);
    await repostMessages(guild, config, channels);
    await postPanels(guild);
    await repostGuides(guild, config, channels);
    console.log('\n' + '═'.repeat(60));
    console.log('✅  FULL SETUP COMPLETE! Bot is live.');
    console.log('═'.repeat(60));
    console.log(`
📋 DO THIS NOW:
  1. Give yourself 🐉 King role in Discord
  2. Assign bot roles to each bot user
  3. Drag role order (see #🛠️-bot-setup for guide)
  4. Set up carl-bot, ClashKing, ClashPerk (guides in #🛠️-bot-setup)

🟢 Bot is already live — no restart needed!
    `);
  }

  client.on(Events.MessageCreate, async (msg) => {
    if (msg.author.bot || !msg.guild) return;

    state.xp.award(msg.author.id, 5);

    const args = msg.content.trim().split(/\s+/);
    const cmd = args[0].toLowerCase();
    const guild = msg.guild;
    const channelIds = Object.fromEntries([...guild.channels.cache].map(([, channel]) => [channel.name, channel.id]));
    const reply = (content) => msg.reply({ content, allowedMentions: { repliedUser: false } });

    await commandRouter.handleMessage({
      msg,
      args,
      cmd,
      guild,
      reply,
      config,
      state,
      isStaff,
      channelIds,
      ChannelType,
      helpers: { runFullSetup },
    });
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.inGuild()) return;
    await handleComponentInteraction(interaction, config).catch((error) => {
      console.error('Interaction error:', error.message);
      if (!interaction.replied && !interaction.deferred) {
        interaction.reply({ content: '⚠️ That control failed to update. Try again.', ephemeral: true }).catch(() => {});
      }
    });
  });

  client.on(Events.GuildMemberAdd, async (member) => {
    const channelIds = Object.fromEntries([...member.guild.channels.cache].map(([, channel]) => [channel.name, channel.id]));
    await handleJoin(member, config, channelIds);
  });

  client.on(Events.GuildMemberRemove, async (member) => {
    await handleLeave(member);
  });

  client.once(Events.ClientReady, async () => {
    console.log('\n🐉 Dante CoC Bot connected as ' + client.user.tag);
    const guild = await client.guilds.fetch(config.GUILD_ID);

    const doSetup = process.argv.includes('--setup');
    const doNuke = process.argv.includes('--nuke');
    const doRoles = process.argv.includes('--roles');
    const doChannels = process.argv.includes('--channels');
    const doMessages = process.argv.includes('--messages');
    const doGuides = process.argv.includes('--guides');

    if (doNuke) {
      console.log('\n💣 NUKE MODE — waiting for !nuke confirm in #💣-nuke-confirm (King role only)...');
      console.log('   Bot is live and listening. Type !nuke confirm to proceed.\n');
      return;
    }

    if (doRoles) {
      await rebuildRoles(guild, config);
      console.log('\n✅ Roles rebuilt. Bot now live.');
      return;
    }

    if (doChannels) {
      await rebuildChannels(guild, config);
      console.log('\n✅ Channels rebuilt. Bot now live.');
      return;
    }

    if (doMessages) {
      await repostMessages(guild, config);
      await postPanels(guild);
      console.log('\n✅ Messages reposted. Bot now live.');
      return;
    }

    if (doGuides) {
      await repostGuides(guild, config);
      console.log('\n✅ Guides reposted. Bot now live.');
      return;
    }

    if (doSetup) {
      console.log('\n🚀 --setup detected. Running full rebuild...\n');
      await runFullSetup(guild);
      return;
    }

    console.log('🚀 Running startup checks...\n');
    try {
      await guild.members.fetch();
      let stripped = 0;
      let deleted = 0;
      let given = 0;

      for (const [, member] of guild.members.cache) {
        if (member.user.bot) continue;
        for (const [, role] of member.roles.cache) {
          if (role.name === '@everyone' || keepRoleNames.includes(role.name)) continue;
          try {
            await member.roles.remove(role);
            stripped += 1;
            await sleep(300);
          } catch {}
        }
      }
      if (stripped) console.log(`✅ Stripped ${stripped} old roles.`);

      const allRoles = await guild.roles.fetch();
      for (const [, role] of allRoles) {
        if (role.managed || role.name === '@everyone' || keepRoleNames.includes(role.name)) continue;
        try {
          await role.delete();
          deleted += 1;
          await sleep(400);
        } catch {}
      }
      if (deleted) console.log(`✅ Deleted ${deleted} old role definitions.`);

      const recruitRole = guild.roles.cache.find((role) => role.name === '🛡️ Recruit');
      if (recruitRole) {
        for (const [, member] of guild.members.cache) {
          if (member.user.bot) continue;
          if (!member.roles.cache.some((role) => keepRoleNames.includes(role.name) && role.name !== '@everyone')) {
            await member.roles.add(recruitRole);
            given += 1;
            await sleep(300);
          }
        }
      }
      if (given) console.log(`✅ Gave Recruit to ${given} members.`);

      for (const name of ['💬-general-chat', '😂-memes', '📸-media', '👋-introductions']) {
        const channel = guild.channels.cache.find((item) => item.name === name);
        if (channel) {
          await channel.setRateLimitPerUser(5).catch(() => {});
          await sleep(300);
        }
      }

      await repostMessages(guild, config);
      await postPanels(guild);

      for (const channelName of ['📋-rules', '👋-welcome']) {
        const channel = guild.channels.cache.find((item) => item.name === channelName);
        if (channel) {
          const messages = await channel.messages.fetch({ limit: 5 });
          const first = messages.last();
          if (first && !first.pinned) await first.pin().catch(() => {});
          await sleep(400);
        }
      }

      console.log('\n' + '═'.repeat(50));
      console.log('🐉 DANTE COC BOT IS LIVE!');
      console.log('═'.repeat(50));
      console.log('\n✅ Cleanup done | ✅ Guides checked | ✅ Commands ready | 🟢 Running\n');
    } catch (error) {
      console.error('\n❌ Startup error:', error.message, error);
    }
  });

  client.login(config.BOT_TOKEN);
}

module.exports = start;