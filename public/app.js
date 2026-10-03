* {
  box-sizing: border-box;
}

:root {
  --bg: #f4f7fb;
  --panel: #ffffff;
  --panel-alt: #f8fafc;
  --line: #e5e7eb;
  --text: #111827;
  --muted: #6b7280;
  --primary: #5b6cff;
  --primary-strong: #3e4de6;
  --success: #16a34a;
  --warning: #f59e0b;
  --danger: #dc2626;
  --shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
  background: var(--bg);
  color: var(--text);
}

button,
input,
textarea {
  font: inherit;
}

.shell {
  min-height: 100vh;
  display: flex;
  background: var(--bg);
}

.sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid var(--line);
  padding: 32px 24px;
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 48px;
}

.brand-badge {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: linear-gradient(135deg, #6d82ff, #8b5cf6);
  display: grid;
  place-items: center;
  font-weight: 800;
  font-size: 1.4rem;
  color: white;
  box-shadow: 0 4px 12px rgba(109, 130, 255, 0.3);
}

h1, h2, h3, h4, p {
  margin: 0;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.7rem;
  color: var(--muted);
}

nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-link {
  text-decoration: none;
  color: var(--text);
  padding: 10px 12px;
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.nav-link:hover,
.nav-link.active {
  background: var(--panel-alt);
  color: var(--primary-strong);
}

.sidebar-footer {
  margin-top: auto;
  display: flex;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid var(--line);
}

.sidebar-footer a {
  text-decoration: none;
  color: var(--muted);
  font-size: 0.9rem;
}

.content {
  flex: 1;
  padding: 40px 32px;
}

.tab-content {
  display: none;
}

.tab-content.active {
  display: block;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
}

.primary-button {
  border: none;
  background: linear-gradient(135deg, var(--primary), var(--primary-strong));
  color: white;
  font-weight: 700;
  padding: 12px 18px;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: var(--shadow);
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 28px;
}

.stat-card,
.panel {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 18px;
  box-shadow: var(--shadow);
}

.stat-card {
  padding: 22px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.label {
  color: var(--muted);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.stat-card strong {
  font-size: 1.3rem;
}

.status-badge {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--warning);
  display: inline-block;
}

.status-badge.success {
  background: var(--success);
}

.status-badge.danger {
  background: var(--danger);
}

.panel {
  padding: 22px 20px;
  margin-bottom: 22px;
}

.panel-header {
  margin-bottom: 16px;
}

.form-grid {
  display: grid;
  gap: 18px;
}

label {
  display: grid;
  gap: 8px;
  color: var(--text);
  font-weight: 600;
}

input,
textarea {
  width: 100%;
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 12px 14px;
  background: #fff;
  color: var(--text);
}

textarea {
  resize: vertical;
  min-height: 100px;
}

.toggle-list {
  display: grid;
  gap: 12px;
}

.check-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
}

.log-list {
  padding-left: 18px;
  margin: 0;
  display: grid;
  gap: 10px;
  color: var(--muted);
}

.legal-page {
  max-width: 900px;
  margin: 40px auto;
  padding: 32px;
  background: white;
  border: 1px solid var(--line);
  border-radius: 20px;
  box-shadow: var(--shadow);
}

.legal-page h1 {
  margin-bottom: 24px;
}

.legal-page h2 {
  margin-top: 28px;
  margin-bottom: 12px;
}

.legal-page p,
.legal-page li {
  color: #374151;
  line-height: 1.7;
}

.legal-page ul {
  padding-left: 20px;
}

@media (max-width: 900px) {
  .shell {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: auto;
    position: static;
    border-right: none;
    border-bottom: 1px solid var(--line);
  }

  .content {
    padding: 24px 18px 40px;
  }
}
