require('dotenv').config();
const express = require('express');
const path = require('path');
const config = require('./config');
const { getState, setMaintenance } = require('./db');

const app = express();
const port = config.DASHBOARD_PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/status', (req, res) => {
  const state = getState();
  res.json({
    appName: config.APP_NAME,
    maintenanceMode: Boolean(state.maintenanceMode),
    maintenanceMessage: state.maintenanceMessage,
    lastUpdatedAt: state.lastUpdatedAt,
    serverId: config.SERVER_ID,
    welcomeChannelId: config.WELCOME_CHANNEL_ID,
    maintenanceChannelId: config.MAINTENANCE_CHANNEL_ID,
    publicUrl: config.PUBLIC_URL
  });
});

app.post('/api/maintenance', (req, res) => {
  const enabled = req.body?.enabled;
  const state = setMaintenance(Boolean(enabled));
  res.json({
    success: true,
    maintenanceMode: Boolean(state.maintenanceMode),
    maintenanceMessage: state.maintenanceMessage,
    lastUpdatedAt: state.lastUpdatedAt
  });
});

app.get('/api/settings', (req, res) => {
  res.json({
    guildId: config.SERVER_ID,
    welcomeChannelId: config.WELCOME_CHANNEL_ID,
    maintenanceChannelId: config.MAINTENANCE_CHANNEL_ID,
    appName: config.APP_NAME
  });
});

app.post('/api/settings', (req, res) => {
  const { welcomeChannelId, maintenanceChannelId } = req.body;
  // In a real app, you'd persist these changes
  res.json({
    success: true,
    message: 'Settings updated',
    welcomeChannelId,
    maintenanceChannelId
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`🌐 ${config.APP_NAME} dashboard is live at http://localhost:${port}`);
});
