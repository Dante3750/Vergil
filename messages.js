'use strict';

const { EmbedBuilder } = require('discord.js');

function makeCard({ title, description, color, fields = [], footer }) {
  const embed = new EmbedBuilder().setTitle(title).setColor(color);
  if (typeof description === 'string' && description.trim()) {
    embed.setDescription(description);
  }
  for (const field of fields) {
    embed.addFields(field);
  }
  if (footer) {
    embed.setFooter({ text: footer });
  }
  return { embeds: [embed] };
}

function buildWelcomeCard(ch, cfg) {
  return makeCard({
    title: `👋 Start Here at ${cfg.SERVER_NAME}`,
    description: 'Welcome to the Dante CoC community. This hub keeps onboarding, roles, war flow, and video updates in one place.',
    color: 0x5865F2,
    fields: [
      { name: '1. Read the rules', value: `<#${ch.rules}>`, inline: true },
      { name: '2. Pick badges', value: `<#${ch.getRoles}>`, inline: true },
      { name: '3. Say hello', value: `<#${ch.intros}>`, inline: true },
      { name: '4. Join the clan flow', value: `<#${ch.howtojoin}>`, inline: true },
      { name: '5. Stay updated', value: cfg.YOUTUBE_URL, inline: false },
    ],
    footer: 'Auto-role: Recruit | Staff review promotions and war access',
  });
}

function buildMessages(ch, cfg) {
  return [
    {
      channelKey: 'welcome',
      payload: buildWelcomeCard(ch, cfg),
    },
    {
      channelKey: 'rules',
      payload: makeCard({
        title: '📋 Server Rules & Expectations',
        description: 'Keep the server respectful, useful, and easy to read. If anything is unclear, ask staff before posting.',
        color: 0xE67E22,
        fields: [
          { name: 'Respect', value: 'Be civil. Harassment, slurs, and drama are not tolerated.', inline: true },
          { name: 'Spam', value: 'No spam, mass mentions, or repeated pings.', inline: true },
          { name: 'Content', value: 'No NSFW, cheating, scams, or account sharing.', inline: true },
          { name: 'Language', value: 'Keep it readable. English or Hindi only.', inline: true },
          { name: 'War', value: 'Use both attacks and follow staff war calls.', inline: true },
          { name: 'Posting', value: 'Put each topic in the correct channel.', inline: true },
        ],
        footer: 'By staying here you agree to the server rules and staff decisions.',
      }),
    },
    {
      channelKey: 'getRoles',
      payload: makeCard({
        title: '🎭 Pick Your Badges',
        description: 'These are cosmetic roles that make the server easier to read and help staff sort your interests fast.',
        color: 0x9B59B6,
        fields: [
          { name: 'Member badges', value: '⚔️ Knight\n🎬 YouTube Fan\n🎈 LaLoon Fan', inline: true },
          { name: 'TH badges', value: '🏆 TH18\n🔥 TH17\n⭐ TH16', inline: true },
          { name: 'Bot note', value: `Carl-bot handles the reaction menu in <#${ch.botsetup}>.`, inline: false },
        ],
        footer: 'Use only the badges you actually want to show.',
      }),
    },
    {
      channelKey: 'howtojoin',
      payload: makeCard({
        title: '📘 How to Join Dante CoC Clan',
        description: 'Fast application path for new players. Keep the process short so staff can review it quickly.',
        color: 0x2ECC71,
        fields: [
          { name: 'Minimum TH', value: `TH${cfg.MIN_TH}`, inline: true },
          { name: 'Clan tag', value: cfg.CLAN_TAG, inline: true },
          { name: 'Apply in', value: `<#${ch.tickets}>`, inline: true },
          { name: 'Tell us', value: 'TH level • war stars • favourite strategy • activity level', inline: false },
          { name: 'Requirements', value: 'TH16/17/18, active in wars, and rule-compliant.', inline: false },
        ],
        footer: `Need a quick answer? Open a ticket in <#${ch.tickets}>.`,
      }),
    },
    {
      channelKey: 'tickets',
      payload: makeCard({
        title: '🎫 Support Desk',
        description: 'Use this channel when you need a fast staff reply or a private issue handled cleanly.',
        color: 0x3498DB,
        fields: [
          { name: 'Best for', value: 'Joining help, role issues, war questions, Discord problems, and appeals.', inline: false },
          { name: 'Include', value: 'Your Discord tag • what you need • screenshots if relevant', inline: false },
          { name: 'Response flow', value: 'Staff will reply here or move the case into a private ticket if needed.', inline: false },
        ],
        footer: 'Keep support requests short, clear, and easy to review.',
      }),
    },
    {
      channelKey: 'warchat',
      payload: makeCard({
        title: '⚔️ War Room Rules',
        description: 'Use this channel for live war planning only. Keep calls clean, direct, and staff-visible.',
        color: 0xC0392B,
        fields: [
          { name: 'Before war', value: `Opt in/out in <#${ch.warsignups}>.`, inline: true },
          { name: 'During war', value: 'Call your base before you hit.', inline: true },
          { name: 'Staff check', value: `Read <#${ch.warorders}> first.`, inline: true },
          { name: 'Missed attacks', value: '1st = warning | 2nd = demotion | 3rd = removed from war.', inline: false },
          { name: 'Call format', value: 'Taking base #[number] with [strategy]', inline: false },
        ],
        footer: 'War discipline keeps the clan efficient and easy to manage.',
      }),
    },
    {
      channelKey: 'legend',
      payload: makeCard({
        title: '👑 Legend League — Daily Hits',
        description: 'Drop your daily attack recap here. Keep it short so the channel stays readable and searchable.',
        color: 0xF1C40F,
        fields: [
          { name: 'Format', value: 'Day • Attacks • Stars gained • Trophies • Strategy', inline: false },
          { name: 'Tracking', value: 'ClashKing handles season recap and summary posts.', inline: false },
          { name: 'Best practice', value: 'Add one short note about what worked so others can learn from it.', inline: false },
        ],
        footer: 'Post daily so the channel stays useful all season.',
      }),
    },
    {
      channelKey: 'generalbases',
      payload: makeCard({
        title: '🏰 Base Sharing',
        description: 'Use a standard format so members can scan base type and link fast.',
        color: 0x95A5A6,
        fields: [
          { name: 'Required format', value: 'TH level • Type • Link • Notes', inline: false },
          { name: 'Channel map', value: `War → <#${ch.warbases}>\nCWL → <#${ch.cwlbases}>\nLegend → <#${ch.legendbases}>`, inline: false },
        ],
        footer: 'Clean formatting makes base feedback much faster.',
      }),
    },
    {
      channelKey: 'giveaways',
      payload: makeCard({
        title: '🎁 Giveaways & Lucky Draws',
        description: 'One channel for all reward drops, raffles, and community entry posts.',
        color: 0xE74C3C,
        fields: [
          { name: 'Timed giveaways', value: 'React with 🎉 to enter.', inline: true },
          { name: 'Lucky draws', value: '`!enter` to join, `!draw` for staff.', inline: true },
          { name: 'Gold passes', value: 'Run regularly. Keep notifications on.', inline: false },
        ],
        footer: 'Entries are handled automatically by the bot.',
      }),
    },
    {
      channelKey: 'announcements',
      payload: makeCard({
        title: '📣 Announcements',
        description: 'Use this channel for official server news, update drops, and major clan notices.',
        color: 0x3498DB,
        fields: [
          { name: 'Official news', value: 'https://www.clashofclans.com/news', inline: false },
          { name: 'Patch notes', value: 'https://clashofclans.fandom.com/wiki/Update_History', inline: false },
        ],
        footer: 'Type !cocnews anywhere for quick links.',
      }),
    },
    {
      channelKey: 'newvideos',
      payload: makeCard({
        title: '🎬 New Dante CoC Videos',
        description: `New uploads post here automatically.\n\nSubscribe: ${cfg.YOUTUBE_URL}`,
        color: 0xFF0000,
        footer: 'Keep notifications on for first-view timing.',
      }),
    },
    {
      channelKey: 'botcmds',
      payload: makeCard({
        title: '🤖 Bot Command Hub',
        description: 'Use this as the quick reference for the most useful commands in the server.',
        color: 0x5865F2,
        fields: [
          { name: 'Core commands', value: '`!help` `!rank` `!top` `!stats` `!youtube` `!th` `!schedule` `!cocnews`', inline: false },
          { name: 'Member tools', value: '`!enter` `!entries` `!intro` `!bio` `!free`', inline: false },
          { name: 'Staff tools', value: '`!giveaway` `!passgiveaway` `!endgiveaway` `!reroll` `!raffle` `!draw` `!promote` `!demote` `!setrole` `!warn` `!kick`', inline: false },
        ],
        footer: 'Use !help first if you are not sure what to type.',
      }),
    },
  ];
}

module.exports = { buildMessages, buildWelcomeCard };