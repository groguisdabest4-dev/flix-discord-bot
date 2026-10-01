const fs = require('fs');
const path = require('path');
const config = require('./config');

function loadCommands() {
  const commandsDir = path.join(__dirname, 'commands');
  const commandMap = new Map();

  if (!fs.existsSync(commandsDir)) {
    return commandMap;
  }

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

module.exports = { loadCommands };
