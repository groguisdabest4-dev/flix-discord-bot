require('dotenv').config();
const express = require('express');
const path = require('path');
const config = require('./config');
const { getGlobalState, getGuildConfig, createOrUpdateGuildConfig, getAllGuilds, getGuildStats } = require('./db');

const app = express();
const port = config.DASHBOARD_PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Get current guild or global status
app.get('/api/status', (req, res) => {
  const guildId = req.query.guildId;
  const globalState = getGlobalState();

  if (guildId) {
    // Guild-specific status
    const guildConfig = getGuildConfig(guildId) || {};
    res.json({
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
      updatedAt: guildConfig.updatedAt
    });
  } else {
    // Global status
    res.json({
      type: 'global',
      appName: config.APP_NAME,
      maintenanceMode: Boolean(globalState.maintenanceMode),
      maintenanceMessage: globalState.maintenanceMessage,
      lastUpdatedAt: globalState.lastUpdatedAt
    });
  }
});

// Get all guilds
app.get('/api/guilds', (req, res) => {
  const stats = getGuildStats();
  res.json(stats);
});

// Get specific guild config
app.get('/api/guilds/:guildId', (req, res) => {
  const guildConfig = getGuildConfig(req.params.guildId);
  if (!guildConfig) {
    return res.status(404).json({ error: 'Guild not found' });
  }
  res.json(guildConfig);
});

// Update guild config
app.post('/api/guilds/:guildId', (req, res) => {
  const { guildId } = req.params;
  const updates = req.body;
  
  try {
    const updated = createOrUpdateGuildConfig(guildId, updates);
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Toggle maintenance for a specific guild
app.post('/api/guilds/:guildId/maintenance', (req, res) => {
  const { guildId } = req.params;
  const { enabled, message } = req.body;

  try {
    const updated = createOrUpdateGuildConfig(guildId, {
      maintenanceEnabled: Boolean(enabled),
      maintenanceMessage: message || 'This server is under maintenance.'
    });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Global maintenance
app.post('/api/maintenance', (req, res) => {
  const { enabled } = req.body;
  const { setGlobalMaintenance } = require('./db');
  
  try {
    const state = setGlobalMaintenance(Boolean(enabled));
    res.json({
      success: true,
      maintenanceMode: Boolean(state.maintenanceMode),
      maintenanceMessage: state.maintenanceMessage,
      lastUpdatedAt: state.lastUpdatedAt
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Website config
app.post('/api/guilds/:guildId/website', (req, res) => {
  const { guildId } = req.params;
  const { websiteUrl, websiteStatus, websiteDescription } = req.body;
  
  try {
    const updated = createOrUpdateGuildConfig(guildId, {
      websiteUrl,
      websiteStatus,
      websiteDescription
    });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Test website connection
app.post('/api/website/test', (req, res) => {
  const { websiteUrl } = req.body;
  
  if (!websiteUrl) {
    return res.status(400).json({ success: false, error: 'Website URL is required' });
  }

  fetch(websiteUrl, { method: 'HEAD', timeout: 5000 })
    .then(() => {
      res.json({ success: true, message: 'Website is reachable' });
    })
    .catch(error => {
      res.json({ success: false, error: error.message });
    });
});

// Settings (legacy)
app.get('/api/settings', (req, res) => {
  res.json({
    appName: config.APP_NAME
  });
});

app.post('/api/settings', (req, res) => {
  const settings = req.body;
  res.json({ success: true, message: 'Settings updated', settings });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`🌐 ${config.APP_NAME} dashboard is live at http://localhost:${port}`);
});
