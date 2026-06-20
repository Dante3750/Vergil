'use strict';

const { EmbedBuilder } = require('discord.js');

function makeCard({ title, description, color, fields = [], footer }) {
  const embed = new EmbedBuilder().setTitle(title).setDescription(description).setColor(color);
  for (const field of fields) {
    embed.addFields(field);
  }
  if (footer) {
    embed.setFooter({ text: footer });
  }
  return { embeds: [embed] };
}

function buildMessages(ch, cfg) {
  return [
    {
      channelKey: 'welcome',
      payload: makeCard({
        title: `👋 Welcome to ${cfg.SERVER_NAME}`,
        description: `CoC clan + YouTube community built for clean onboarding, clear roles, and easy war flow.`,
        color: 0x5865F2,
        fields: [
          { name: '1. Read first', value: `<#${ch.rules}>`, inline: true },
          { name: '2. Pick badges', value: `<#${ch.getRoles}>`, inline: true },
          { name: '3. Introduce yourself', value: `<#${ch.intros}>`, inline: true },
          { name: '4. Subscribe', value: cfg.YOUTUBE_URL, inline: false },
        ],
        footer: 'Auto-role: Recruit | Staff verify promotions to Knight',
      }),
    },
    {
      channelKey: 'rules',
      payload: makeCard({
        title: '📋 Server Rules',
        description: 'Short version: keep it respectful, relevant, and war-ready.',
        color: 0xE67E22,
        fields: [
          { name: 'Respect', value: 'Respect everyone or risk a ban.', inline: true },
          { name: 'Spam', value: 'No spam or excessive pinging.', inline: true },
          { name: 'Content', value: 'No NSFW, cheating, or account sharing.', inline: true },
          { name: 'Language', value: 'English or Hindi only.', inline: true },
          { name: 'War', value: 'Use both attacks and follow staff orders.', inline: true },
          { name: 'Posting', value: 'Use the right channel for the right topic.', inline: true },
        ],
        footer: 'By staying here you agree to all server rules.',
      }),
    },
    {
      channelKey: 'getRoles',
      payload: makeCard({
        title: '🎭 Pick Your Badges',
        description: 'These are cosmetic roles only. They make the server easier to read and keep reactions simple.',
        color: 0x9B59B6,
        fields: [
          { name: 'Member badges', value: '⚔️ Knight\n🎬 YouTube Fan\n🎈 LaLoon Fan', inline: true },
          { name: 'TH badges', value: '🏆 TH18\n🔥 TH17\n⭐ TH16', inline: true },
          { name: 'Bot note', value: `Carl-bot handles the reaction menu in <#${ch.botsetup}>.`, inline: false },
        ],
        footer: 'Use only what you want to show in chat and member list.',
      }),
    },
    {
      channelKey: 'howtojoin',
      payload: makeCard({
        title: '📘 How to Join Dante CoC Clan',
        description: 'Fast application path for new players. Keep the process short and clear.',
        color: 0x2ECC71,
        fields: [
          { name: 'Minimum TH', value: `TH${cfg.MIN_TH}`, inline: true },
          { name: 'Clan tag', value: cfg.CLAN_TAG, inline: true },
          { name: 'Apply in', value: `<#${ch.tickets}>`, inline: true },
          { name: 'Tell us', value: 'TH level • war stars • favourite strategy', inline: false },
          { name: 'Requirements', value: 'TH16/17/18, active in wars, and rule-compliant.', inline: false },
        ],
        footer: `Subscribe to ${cfg.YOUTUBE_URL}`,
      }),
    },
    {
      channelKey: 'warchat',
      payload: makeCard({
        title: '⚔️ War Room Rules',
        description: 'Use this channel for live war planning only. Keep calls clean and staff-visible.',
        color: 0xC0392B,
        fields: [
          { name: 'Before war', value: `Opt in/out in <#${ch.warsignups}>.`, inline: true },
          { name: 'During war', value: 'Call your base before you hit.', inline: true },
          { name: 'Staff check', value: `Read <#${ch.warorders}> first.`, inline: true },
          { name: 'Missed attacks', value: '1st = warning | 2nd = demotion | 3rd = removed from war.', inline: false },
          { name: 'Call format', value: '`Taking base #[number] with [strategy]`', inline: false },
        ],
        footer: 'War discipline keeps the clan clean and efficient.',
      }),
    },
    {
      channelKey: 'legend',
      payload: makeCard({
        title: '👑 Legend League — Daily Hits',
        description: 'Drop your daily attack recap here. Keep it short so the channel stays readable.',
        color: 0xF1C40F,
        fields: [
          { name: 'Format', value: 'Day • Attacks • Stars gained • Trophies • Strategy', inline: false },
          { name: 'Tracking', value: 'ClashKing handles season recap and summary posts.', inline: false },
          { name: 'Quick command', value: '`/legend stats` for your season summary.', inline: false },
        ],
        footer: 'Daily recap posts automatically at season reset.',
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
        description: 'One channel for all reward drops and raffle entries.',
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
  ];
}

module.exports = { buildMessages };