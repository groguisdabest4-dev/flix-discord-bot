const express = require('express');
const path = require('path');
const config = require('../src/config');
const { getGlobalState, getGuildConfig, createOrUpdateGuildConfig, getGuildStats, setGlobalMaintenance } = require('../src/db');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/status', (req, res) => {
  const guildId = req.query.guildId;
  const globalState = getGlobalState();

  if (guildId) {
    const guildConfig = getGuildConfig(guildId) || {};
    return res.json({
      type: 'guild',
      appName: config.APP_NAME,
      guildId,
      guildName: guildConfig.guildName || 'Unknown',
      maintenanceMode: Boolean(guildConfig.maintenanceEnabled),
      maintenanceMessage: guildConfig.maintenanceMessage || 'This server is under maintenance.',
      welcomeChannelId: guildConfig.welcomeChannelId,
      maintenanceChannelId: guildConfig.maintenanceChannelId,
      websiteUrl: guildConfig.websiteUrl || '',
      websiteStatus: guildConfig.websiteStatus || 'online',
      websiteDescription: guildConfig.websiteDescription || '',
      updatedAt: guildConfig.updatedAt,
      publicUrl: config.PUBLIC_URL || 'http://localhost:3000'
    });
  }

  return res.json({
    type: 'global',
    appName: config.APP_NAME,
    maintenanceMode: Boolean(globalState.maintenanceMode),
    maintenanceMessage: globalState.maintenanceMessage,
    lastUpdatedAt: globalState.lastUpdatedAt,
    publicUrl: config.PUBLIC_URL || 'http://localhost:3000'
  });
});

app.get('/api/guilds', (req, res) => {
  return res.json(getGuildStats());
});

app.get('/api/guilds/:guildId', (req, res) => {
  const guildConfig = getGuildConfig(req.params.guildId);
  if (!guildConfig) {
    return res.status(404).json({ error: 'Guild not found' });
  }
  return res.json(guildConfig);
});

app.post('/api/guilds/:guildId', (req, res) => {
  const { guildId } = req.params;
  try {
    const updated = createOrUpdateGuildConfig(guildId, req.body);
    return res.json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/maintenance', (req, res) => {
  const { enabled, message } = req.body || {};
  try {
    const state = setGlobalMaintenance(Boolean(enabled));
    if (message) {
      const nextState = { ...state, maintenanceMessage: message };
      return res.json({
        success: true,
        maintenanceMode: Boolean(nextState.maintenanceMode),
        maintenanceMessage: nextState.maintenanceMessage,
        lastUpdatedAt: nextState.lastUpdatedAt
      });
    }
    return res.json({
      success: true,
      maintenanceMode: Boolean(state.maintenanceMode),
      maintenanceMessage: state.maintenanceMessage,
      lastUpdatedAt: state.lastUpdatedAt
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/welcome', (req, res) => {
  const { guildId, channelId, message } = req.body || {};
  try {
    const updated = createOrUpdateGuildConfig(guildId, {
      welcomeChannelId: channelId,
      welcomeMessage: message || 'Welcome to our community!'
    });
    return res.json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/terms.html', (req, res) => {
  return res.sendFile(path.join(__dirname, '..', 'public', 'terms.html'));
});

app.get('/privacy.html', (req, res) => {
  return res.sendFile(path.join(__dirname, '..', 'public', 'privacy.html'));
});

app.get('/', (req, res) => {
  return res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.get(/^(?!\/api).+/, (req, res) => {
  const resolvedPath = path.join(__dirname, '..', 'public', req.path.replace(/^\//, ''));
  return res.sendFile(resolvedPath);
});

module.exports = app;
