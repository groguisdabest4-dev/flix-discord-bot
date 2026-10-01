# Flix

A public Discord bot brand styled as a realistic community platform, complete with a minimal web dashboard, a welcome flow for one specific server, and a maintenance mode that puts the bot into downtime protection while broadcasting a message to your community.

## Features

- Branded as Flix
- Discord bot built with discord.js v14
- Web dashboard served with Express
- Server-specific welcome system for one guild only
- `/maintenance` command for administrators
- Global maintenance mode that blocks other commands while the bot is offline for updates
- Public-friendly architecture ready to extend

## Project structure

- `src/index.js` – starts the Discord bot and dashboard
- `src/bot.js` – bot logic, commands, and events
- `src/dashboard.js` – lightweight Express dashboard
- `src/db.js` – persistent local app storage
- `src/config.js` – environment-driven config
- `src/events/` – welcome and readiness handlers
- `src/commands/` – slash commands
- `public/` – HTML/CSS dashboard assets

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in the values.

3. Start the app:
   ```bash
   npm start
   ```

4. Open the dashboard locally at:
   ```text
   http://localhost:3000
   ```

## Environment variables

```env
DISCORD_TOKEN=your_discord_bot_token
DISCORD_CLIENT_ID=your_application_client_id
OWNER_ID=your_discord_user_id
SERVER_ID=your_target_server_id
WELCOME_CHANNEL_ID=channel_id_for_welcome_messages
MAINTENANCE_CHANNEL_ID=channel_id_for_maintenance_broadcasts
DASHBOARD_PORT=3000
PUBLIC_URL=http://localhost:3000
APP_NAME=Flix
MAINTENANCE_MESSAGE=Flix is currently under major updates. We will let you know when the bot is back online.
```

## Slash commands

The bot includes:

- `/ping`
- `/maintenance enabled:true|false`

## Notes

- The welcome system is intentionally locked to the configured `SERVER_ID`.
- The maintenance mode is global for the bot runtime.
- All other bot commands are blocked while maintenance mode is active.

## License

MIT
