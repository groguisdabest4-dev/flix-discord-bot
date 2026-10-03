const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', '..', 'data');
const pluginFile = path.join(dataDir, 'plugins.json');

function ensurePluginStore() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(pluginFile)) {
    fs.writeFileSync(pluginFile, JSON.stringify({
      tickets: { enabled: true },
      moderation: { enabled: true },
      utility: { enabled: true },
      admin: { enabled: true }
    }, null, 2));
  }
}

function getPluginConfig() {
  ensurePluginStore();
  return JSON.parse(fs.readFileSync(pluginFile, 'utf8'));
}

function updatePluginConfig(key, enabled) {
  const cfg = getPluginConfig();
  cfg[key] = { enabled };
  fs.writeFileSync(pluginFile, JSON.stringify(cfg, null, 2));
  return cfg;
}

module.exports = { getPluginConfig, updatePluginConfig };
