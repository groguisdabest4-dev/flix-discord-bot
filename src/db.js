const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', '..', 'data');
const guildsFile = path.join(dataDir, 'guilds.json');
const globalFile = path.join(dataDir, 'global.json');

function ensureStore() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(globalFile)) {
    fs.writeFileSync(globalFile, JSON.stringify({
      maintenanceMode: false,
      maintenanceMessage: 'Flix is currently under major updates. We will let you know when the bot is back online.',
      lastUpdatedAt: null,
      version: '1.0.0'
    }, null, 2));
  }

  if (!fs.existsSync(guildsFile)) {
    fs.writeFileSync(guildsFile, JSON.stringify({}, null, 2));
  }
}

// Global state functions
function readGlobalState() {
  ensureStore();
  const raw = fs.readFileSync(globalFile, 'utf8');
  return JSON.parse(raw);
}

function writeGlobalState(value) {
  ensureStore();
  fs.writeFileSync(globalFile, JSON.stringify(value, null, 2));
  return value;
}

function getGlobalState() {
  return readGlobalState();
}

function setGlobalMaintenance(enabled) {
  const state = readGlobalState();
  const updated = {
    ...state,
    maintenanceMode: Boolean(enabled),
    maintenanceMessage: enabled
      ? 'Flix is currently under major updates. We will let you know when the bot is back online.'
      : 'Flix is back online and ready to go.',
    lastUpdatedAt: new Date().toISOString()
  };
  return writeGlobalState(updated);
}

// Guild-specific functions
function readGuilds() {
  ensureStore();
  const raw = fs.readFileSync(guildsFile, 'utf8');
  return JSON.parse(raw);
}

function writeGuilds(value) {
  ensureStore();
  fs.writeFileSync(guildsFile, JSON.stringify(value, null, 2));
  return value;
}

function getGuildConfig(guildId) {
  const guilds = readGuilds();
  return guilds[guildId] || null;
}

function createOrUpdateGuildConfig(guildId, config) {
  const guilds = readGuilds();
  
  guilds[guildId] = {
    ...guilds[guildId],
    ...config,
    guildId,
    updatedAt: new Date().toISOString()
  };

  return writeGuilds(guilds)[guildId];
}

function getAllGuilds() {
  return readGuilds();
}

function deleteGuildConfig(guildId) {
  const guilds = readGuilds();
  delete guilds[guildId];
  return writeGuilds(guilds);
}

function getGuildWelcomeConfig(guildId) {
  const config = getGuildConfig(guildId);
  if (!config) return null;
  
  return {
    enabled: config.welcomeEnabled !== false,
    channelId: config.welcomeChannelId,
    message: config.welcomeMessage || `Welcome to our community, {user}! We're excited to have you here.`
  };
}

function getGuildMaintenanceConfig(guildId) {
  const config = getGuildConfig(guildId);
  if (!config) return null;
  
  return {
    maintenanceChannelId: config.maintenanceChannelId,
    customMessage: config.maintenanceCustomMessage || null
  };
}

function setGuildMaintenance(guildId, enabled, customMessage) {
  return createOrUpdateGuildConfig(guildId, {
    maintenanceEnabled: Boolean(enabled),
    maintenanceMessage: customMessage || 'This server is under maintenance. Please check back soon.',
    maintenanceEnabledAt: new Date().toISOString()
  });
}

function getGuildStats() {
  const guilds = readGuilds();
  return {
    totalGuilds: Object.keys(guilds).length,
    guilds: Object.values(guilds).map(g => ({
      guildId: g.guildId,
      guildName: g.guildName,
      maintenanceEnabled: g.maintenanceEnabled || false,
      createdAt: g.createdAt,
      updatedAt: g.updatedAt
    }))
  };
}

module.exports = {
  // Global
  getGlobalState,
  setGlobalMaintenance,
  writeGlobalState,
  readGlobalState,
  
  // Guild-specific
  getGuildConfig,
  createOrUpdateGuildConfig,
  getAllGuilds,
  deleteGuildConfig,
  getGuildWelcomeConfig,
  getGuildMaintenanceConfig,
  setGuildMaintenance,
  getGuildStats,
  
  // Legacy compatibility
  getState: getGlobalState,
  setMaintenance: setGlobalMaintenance,
  createOrUpdateSetting: (settings) => writeGlobalState({ ...readGlobalState(), ...settings })
};
