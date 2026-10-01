const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', '..', 'data');
const settingsFile = path.join(dataDir, 'settings.json');

function ensureStore() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(settingsFile)) {
    fs.writeFileSync(settingsFile, JSON.stringify({
      maintenanceMode: false,
      maintenanceMessage: 'Flix is currently under major updates. We will let you know when the bot is back online.',
      lastUpdatedAt: null
    }, null, 2));
  }
}

function readState() {
  ensureStore();
  const raw = fs.readFileSync(settingsFile, 'utf8');
  return JSON.parse(raw);
}

function getState() {
  return readState();
}

function writeState(value) {
  ensureStore();
  fs.writeFileSync(settingsFile, JSON.stringify(value, null, 2));
  return value;
}

function setMaintenance(enabled) {
  const state = readState();
  const updated = {
    ...state,
    maintenanceMode: Boolean(enabled),
    maintenanceMessage: enabled
      ? 'Flix is currently under major updates. We will let you know when the bot is back online.'
      : 'Flix is back online and ready to go.',
    lastUpdatedAt: new Date().toISOString()
  };

  return writeState(updated);
}

function createOrUpdateSetting(settings = {}) {
  const state = readState();
  const updated = { ...state, ...settings, lastUpdatedAt: new Date().toISOString() };
  return writeState(updated);
}

module.exports = {
  getState,
  setMaintenance,
  createOrUpdateSetting,
  writeState
};
