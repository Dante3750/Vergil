# 🐉 Vergil (Dante CoC Bot)

Vergil is a comprehensive, modular Discord bot designed for the **Dante CoC** community. It provides full-scale server management, automated setup, and community engagement features.

## 🚀 Features

- **Automated Server Setup**: Fully scriptable server reconstruction including categories, channels, and roles.
- **Role Management**: Complex role hierarchy and permission systems tailored for Clash of Clans communities.
- **Engagement Systems**: 
    - **XP System**: Track member activity and level up with file-based persistence.
    - **Keepalive**: Multi-process monitoring to ensure 24/7 uptime.
- **Staff Utilities**: Advanced tools for moderation, including server "nuke" and rebuild capabilities.
- **Modular Architecture**: Easy to extend with new commands, events, and systems.

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.x or higher)
- A Discord Bot Token (via [Discord Developer Portal](https://discord.com/developers/applications))

### Installation
1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Set up your environment:
   - Copy `.env.example` to `.env`.
   - Fill in your `BOT_TOKEN`, `GUILD_ID`, and other settings.

### Running the Bot
- **Standard Start**: `npm start`
- **Keepalive Mode**: `npm run live` (auto-restarts on crash)

## ⚡ Administrative Scripts

Vergil uses powerful scripts for server maintenance:

| Command | Description |
|---------|-------------|
| `npm run setup` | Full server reconstruction (Roles + Channels + Messages) |
| `npm run live` | Start with keepalive enabled (Recommended for 24/7) |
| `npm run nuke` | **WARNING**: Wipes all channels/roles before a fresh setup |
| `npm run roles` | Rebuilds and syncs server roles from config |
| `npm run channels` | Rebuilds and syncs channel structure |
| `npm run messages` | Posts standard messages to designated channels |
| `npm run guides` | Posts bot setup guides to staff channels |

## 📂 Project Structure

- `src/commands/`: Command handlers (General, Staff, Giveaway, Nuke).
- `src/events/`: Discord event listeners (Join/Leave).
- `src/systems/`: Core logic like XP and Keepalive.
- `src/setup/`: Logic for server reconstruction, wiping, and initialization.
- `config.js`: Central configuration for roles and permissions.

---
*Created for the Dante CoC Community.*