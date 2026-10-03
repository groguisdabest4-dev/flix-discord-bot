const fs = require('fs');
const path = require('path');

function loadCommands() {
  const commandsDir = path.join(__dirname, '.');
  const commandMap = new Map();

  const files = fs.readdirSync(commandsDir)
    .filter(file => file.endsWith('.js') && file !== 'register.js' && file !== 'index.js');

  for (const file of files) {
    const filePath = path.join(commandsDir, file);
    const command = require(filePath);
    if (command && command.data && command.execute) {
      commandMap.set(command.data.name, command);
    }
  }

  return commandMap;
}

// Command metadata
const AVAILABLE_COMMANDS = {
  ping: { name: 'ping', category: 'utility', description: 'Returns bot latency' },
  help: { name: 'help', category: 'utility', description: 'Show all available commands' },
  info: { name: 'info', category: 'utility', description: 'Show server information' },
  stats: { name: 'stats', category: 'utility', description: 'Show member statistics' },
  website: { name: 'website', category: 'utility', description: 'Show server website' },
  invite: { name: 'invite', category: 'utility', description: 'Get server invite link' },
  maintenance: { name: 'maintenance', category: 'admin', description: 'Toggle maintenance mode' },
  kick: { name: 'kick', category: 'moderation', description: 'Kick a member' },
  ban: { name: 'ban', category: 'moderation', description: 'Ban a member' },
  mute: { name: 'mute', category: 'moderation', description: 'Mute a member' },
  warn: { name: 'warn', category: 'moderation', description: 'Warn a member' }
};

module.exports = { loadCommands, AVAILABLE_COMMANDS };
