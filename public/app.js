async function fetchStatus() {
  const response = await fetch('/api/status');
  const data = await response.json();

  document.getElementById('statusText').textContent = data.maintenanceMode ? 'Maintenance mode' : 'Live';
  document.getElementById('serverId').textContent = data.serverId || 'Not configured';
  document.getElementById('welcomeChannel').textContent = data.welcomeChannelId || 'Not configured';
  document.getElementById('maintenanceMessage').textContent = data.maintenanceMessage || 'No maintenance message set.';
}

const button = document.getElementById('toggleMaintenance');
button.addEventListener('click', async () => {
  const status = await fetch('/api/status');
  const current = await status.json();

  const nextValue = !current.maintenanceMode;

  await fetch('/api/maintenance', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ enabled: nextValue })
  });

  fetchStatus();
});

fetchStatus();
