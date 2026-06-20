🐉 DANTE COC BOT v3 — FULL CONTROL EDITION
============================================

ONE FILE. TOTAL CONTROL. EVERYTHING.

═══════════════════════════════════════════════
STEP 1 — FILL IN YOUR DETAILS
═══════════════════════════════════════════════
Create a .env file in this folder by copying .env.example and filling in your values:

  BOT_TOKEN=PASTE_YOUR_BOT_TOKEN_HERE          ← your Discord bot token
  GUILD_ID=PASTE_YOUR_SERVER_ID_HERE           ← right-click server → Copy Server ID
  YOUTUBE_URL=https://...                      ← your YouTube channel
  CLAN_TAG=#YOURCLAN                           ← your CoC clan tag
  SERVER_NAME=Dante CoC                        ← your server name
  MIN_TH=16                                    ← minimum TH to join

═══════════════════════════════════════════════
STEP 2 — INSTALL (one time only)
═══════════════════════════════════════════════
Right-click this folder → Open in Terminal → type:
  npm install

═══════════════════════════════════════════════
STEP 3 — RUN
═══════════════════════════════════════════════

For a brand new / fresh server:
  node index.js --setup --keepalive

Every time after that (just start the bot):
  node index.js --keepalive

═══════════════════════════════════════════════
ALL COMMANDS
═══════════════════════════════════════════════

node index.js                       Normal start (bot only)
node index.js --keepalive          Start + auto-restart on crash
node index.js --setup              Full wipe + rebuild + bot live
node index.js --setup --keepalive  Full setup + stay alive 24/7

─── Surgical rebuild (change one thing at a time) ──────────────
node index.js --roles              Rebuild roles only (add/remove/recolor)
node index.js --channels           Rebuild channel structure only
node index.js --messages           Repost channel messages (empty channels only)
node index.js --guides             Repost bot setup guides

─── Nuclear option ─────────────────────────────────────────────
node index.js --nuke                Start bot in nuke-ready mode
                                    Then type: !nuke confirm
                                    in #💣-nuke-confirm (King role only)

─── npm shortcuts ──────────────────────────────────────────────
npm start           → normal start
npm run live        → start + keepalive
npm run setup       → full setup
npm run setup-live  → setup + keepalive (recommended for fresh deploy)
npm run nuke        → nuke mode + keepalive
npm run roles       → roles only
npm run channels    → channels only
npm run messages    → messages only
npm run guides      → guides only

═══════════════════════════════════════════════
HOW TO CUSTOMISE
═══════════════════════════════════════════════

Open dante-bot.js. There are 5 editable sections:

  SECTION 1 — YOUR SETTINGS     (token, server id, clan tag, etc.)
  SECTION 2 — ROLES             (add/remove/recolor/rename roles)
  SECTION 3 — CHANNELS          (add/remove/rename/reorder channels)
  SECTION 4 — CHANNEL MESSAGES  (what gets posted in each channel)
  SECTION 5 — BOT SETUP GUIDES  (the guides in #🛠️-bot-setup)

Everything below SECTION 5 is the bot engine — no need to touch it.

─── Adding a new role ──────────────────────────────────────────
1. Add an entry to ROLE_DEFINITIONS in SECTION 2
2. Run: node dante-bot.js --roles

─── Adding a new channel ───────────────────────────────────────
1. Add an entry to CHANNEL_LAYOUT in SECTION 3
2. Run: node dante-bot.js --channels

─── Changing a channel message ─────────────────────────────────
1. Edit the content in buildMessages() in SECTION 4
2. Manually delete the old message in Discord
3. Run: node dante-bot.js --messages

─── Nuking and starting fresh ──────────────────────────────────
1. Run: node dante-bot.js --nuke
2. In Discord, go to #💣-nuke-confirm
3. Type: !nuke confirm  (you must have 🐉 King role)
4. Bot wipes everything and rebuilds automatically

═══════════════════════════════════════════════
BOT COMMANDS (type in Discord)
═══════════════════════════════════════════════

Anyone:
  !help               List all commands
  !rank [@user]       Role + XP level
  !top                Top 10 most active members
  !stats              Server member count
  !youtube            YouTube channel link
  !th                 How to get TH badge roles
  !schedule           War schedule
  !cocnews            CoC news links
  !enter              Enter active lucky draw
  !entries            See current entry count

Staff only (King / Hand / Maester):
  !giveaway [mins] [prize]    Timed giveaway (react 🎉 to enter)
  !passgiveaway [mins]        Gold Pass giveaway
  !endgiveaway [msgID]        End giveaway early
  !reroll [msgID]             Pick new winner
  !raffle [prize]             Open lucky draw
  !draw                       Pick raffle winner
  !promote @user              Move up one role
  !demote @user               Move down one role
  !setrole @user RoleName     Set exact role
  !warn @user reason          Warn + log in #📋-ban-log
  !kick @user reason          Kick + log

King only:
  !nuke confirm       Nuclear wipe (only in #💣-nuke-confirm)

═══════════════════════════════════════════════
FILES
═══════════════════════════════════════════════
index.js        ← main entry point
dante-bot.js    ← compatibility wrapper
config.js       ← local env loader and defaults
.env            ← your local secrets and settings
package.json    ← scripts and dependencies
README.txt      ← this file

═══════════════════════════════════════════════
FOR 24/7 UPTIME (bot running when PC is off)
═══════════════════════════════════════════════
Free option:
  → https://railway.app
  → New Project → Deploy from GitHub
  → Upload dante-bot.js and package.json
  → Set start command: node dante-bot.js

Paid (more reliable):
  → Any VPS (DigitalOcean $4/mo, Vultr, etc.)
  → Upload files → run: node dante-bot.js --keepalive

═══════════════════════════════════════════════
⚠️  IMPORTANT
═══════════════════════════════════════════════
- NEVER share your Bot Token with anyone
- --setup and !nuke delete everything — only use on fresh/empty server
- Bot setup guides post automatically in #🛠️-bot-setup after setup
- See guides in #🛠️-bot-setup for ClashKing + ClashPerk full setup
