# Vergil

Vergil is a modular Discord bot for the Dante CoC server.

## Setup

1. Copy `.env.example` to `.env` and fill in your token and server ID.
2. Run `npm install`.
3. Start with `npm start` or `node index.js`.

## Structure

- `.env` holds local secrets.
- `config.js` loads environment values plus the shared role and channel layout.
- `messages.js` and `guides.js` hold post content.
- `src/commands/` contains grouped command handlers.
- `src/setup/` contains server rebuild helpers.
- `src/events/` contains join and leave handlers.
- `src/systems/` contains shared runtime systems like keepalive and XP.

## Notes

- `dante-bot.js` is kept as a compatibility wrapper.
- `index.js` is the main entry point.