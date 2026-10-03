let currentData = {};

// Initialize dashboard
window.addEventListener('DOMContentLoaded', () => {
  setupTabNavigation();
  fetchStatus();
  setInterval(fetchStatus, 5000);
});

// Tab Navigation
function setupTabNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tabName = link.getAttribute('data-tab');
      switchTab(tabName);
    });
  });
}

function switchTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });

  // Remove active from nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });

  // Show selected tab
  const selectedTab = document.getElementById(tabName);
  if (selectedTab) {
    selectedTab.classList.add('active');
  }

  // Mark nav link as active
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
}

// Fetch and display status
async function fetchStatus() {
  try {
    const response = await fetch('/api/status');
    const data = await response.json();
    currentData = data;

    // Update overview tab
    const statusText = data.maintenanceMode ? 'Maintenance Mode' : 'Live';
    document.getElementById('statusText').textContent = statusText;
    document.getElementById('serverId').textContent = data.serverId || 'Not configured';
    document.getElementById('welcomeChannel').textContent = data.welcomeChannelId || 'Not configured';
    document.getElementById('maintenanceChannel').textContent = data.maintenanceChannelId || 'Not configured';
    document.getElementById('maintenanceMessage').textContent = data.maintenanceMessage || 'No maintenance message set.';
    document.getElementById('lastUpdated').textContent = data.lastUpdatedAt ? `Last updated: ${new Date(data.lastUpdatedAt).toLocaleString()}` : '';

    // Update badge
    const badge = document.getElementById('statusBadge');
    badge.textContent = statusText;
    badge.className = `status-badge ${data.maintenanceMode ? 'maintenance' : 'live'}`;

    // Update maintenance mode UI
    const enableBtn = document.getElementById('enableMaintenanceBtn');
    const disableBtn = document.getElementById('disableMaintenanceBtn');
    const statusDiv = document.getElementById('maintenanceStatus');

    if (data.maintenanceMode) {
      enableBtn.style.display = 'none';
      disableBtn.style.display = 'block';
      statusDiv.innerHTML = '<span style="color: #f59e0b; font-weight: 600;">🚧 Maintenance mode is ACTIVE</span>';
    } else {
      enableBtn.style.display = 'block';
      disableBtn.style.display = 'none';
      statusDiv.innerHTML = '<span style="color: #22c55e; font-weight: 600;">✅ Bot is LIVE</span>';
    }
  } catch (error) {
    console.error('Failed to fetch status:', error);
  }
}

// Maintenance controls
async function toggleMaintenance() {
  const status = await fetch('/api/status');
  const current = await status.json();
  const nextValue = !current.maintenanceMode;

  await fetch('/api/maintenance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ enabled: nextValue })
  });

  fetchStatus();
}

async function enableMaintenance() {
  await toggleMaintenance();
}

async function disableMaintenance() {
  await toggleMaintenance();
}

// Guild settings
function saveGuildSettings() {
  alert('Guild settings save feature coming soon!');
}

function resetGuildSettings() {
  fetchStatus();
}

// Welcome message
function saveWelcomeMessage() {
  const message = document.getElementById('welcomeMessageContent').value;
  alert('Welcome message saved! (Feature in development)');
}

// Embed builder
function previewEmbed() {
  const title = document.getElementById('embedTitle').value;
  const description = document.getElementById('embedDescription').value;
  const color = document.getElementById('embedColor').value;
  const fieldsText = document.getElementById('embedFields').value;

  let fields = [];
  try {
    if (fieldsText) {
      fields = JSON.parse(fieldsText);
    }
  } catch (e) {
    alert('Invalid JSON in fields');
    return;
  }

  const embedCode = {
    title,
    description,
    color,
    fields,
    timestamp: new Date().toISOString(),
    footer: {
      text: 'Flix Community Bot'
    }
  };

  const previewDiv = document.getElementById('embedPreview');
  const codeDiv = document.getElementById('embedPreviewCode');
  codeDiv.textContent = JSON.stringify(embedCode, null, 2);
  previewDiv.style.display = 'block';
}

function copyEmbedCode() {
  const code = document.getElementById('embedPreviewCode').textContent;
  navigator.clipboard.writeText(code).then(() => {
    alert('Embed code copied to clipboard!');
  }).catch(() => {
    alert('Failed to copy to clipboard');
  });
}

// Log functionality
function loadLogs() {
  const logsList = document.getElementById('logsList');
  const logs = [
    { time: new Date(), action: 'Bot started', status: 'success' },
    { time: new Date(Date.now() - 5000), action: 'Dashboard loaded', status: 'success' },
    { time: new Date(Date.now() - 10000), action: 'Checking guild configuration', status: 'info' }
  ];

  logsList.innerHTML = logs.map(log => `
    <div style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-size: 0.9rem;">
      <span style="color: #9ca3af;">${log.time.toLocaleTimeString()}</span>
      <span style="margin-left: 12px; color: #1f2937;">${log.action}</span>
      <span style="margin-left: 12px; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: 600;" 
            style="background: ${log.status === 'success' ? '#dcfce7' : '#dbeafe'}; color: ${log.status === 'success' ? '#166534' : '#1e40af'};">
        ${log.status.toUpperCase()}
      </span>
    </div>
  `).join('');
}

// Load logs when logs tab is opened
document.addEventListener('click', (e) => {
  if (e.target?.getAttribute('data-tab') === 'logs') {
    loadLogs();
  }
});

// Event listeners
document.getElementById('toggleMaintenance').addEventListener('click', toggleMaintenance);
