/* global React */
const { useState, useMemo, useEffect, useRef } = React;

// =================== ICONS ===================
const Icon = ({ d, size = 16, stroke = 1.6 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    {d}
  </svg>
);
const I = {
  dash: <Icon d={<><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></>}/>,
  market: <Icon d={<><path d="M3 3v18h18"/><path d="M7 14l4-4 4 4 5-6"/></>}/>,
  pf: <Icon d={<><path d="M20 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></>}/>,
  star: <Icon d={<polygon points="12 2 15 9 22 9.3 17 14 18.5 21 12 17.3 5.5 21 7 14 2 9.3 9 9 12 2"/>}/>,
  book: <Icon d={<><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>}/>,
  trophy: <Icon d={<><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0V4z"/><path d="M5 4h2v3a3 3 0 0 1-3-3h1z"/><path d="M19 4h-2v3a3 3 0 0 0 3-3h-1z"/></>}/>,
  rank: <Icon d={<><path d="M6 9H4.5A2.5 2.5 0 0 1 2 6.5V5h4"/><path d="M18 9h1.5A2.5 2.5 0 0 0 22 6.5V5h-4"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></>}/>,
  cog: <Icon d={<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>}/>,
  search: <Icon d={<><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></>}/>,
  bell: <Icon d={<><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></>}/>,
  flame: <Icon d={<path d="M8.5 14.5A2.5 2.5 0 0 0 11 17a7 7 0 0 0 7-7c0-1.74-.5-3.34-1.36-4.7C16 7.5 14 9 12 9c-1 0-2-1.16-2-2.5C10 4.5 9 3 7.5 2 6 5 4 7 4 11a7 7 0 0 0 4.5 6.5z"/>}/>,
  plus: <Icon d={<><path d="M12 5v14"/><path d="M5 12h14"/></>}/>,
  x: <Icon d={<><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>}/>,
  arrowRight: <Icon d={<><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></>}/>,
  edit: <Icon d={<><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></>}/>,
  check: <Icon d={<path d="M20 6 9 17l-5-5"/>}/>,
  cash: <Icon d={<><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></>}/>,
  filter: <Icon d={<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>}/>,
  sparkle: <Icon d={<><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/></>}/>,
};

// =================== HELPERS ===================
const symHue = (s) => { let h = 0; for (let i=0;i<s.length;i++) h = (h*31 + s.charCodeAt(i)) % 360; return h; };
const SymDot = ({ sym }) => (
  <div className="sym-dot" style={{
    background: `linear-gradient(135deg, oklch(0.34 0.10 ${symHue(sym)}), oklch(0.22 0.08 ${symHue(sym)}))`,
    border: `1px solid oklch(0.42 0.10 ${symHue(sym)} / 0.6)`,
  }}>{sym.slice(0, 2)}</div>
);

const ChangeChip = ({ pct, abs, mono }) => {
  const up = pct >= 0;
  return (
    <span className={"chip " + (up ? "up" : "down") + (mono ? " mono" : "")}>
      {up ? "▲" : "▼"} {abs !== undefined ? `${window.fmtINR(Math.abs(abs))} ` : ""}{Math.abs(pct).toFixed(2)}%
    </span>
  );
};

const Sparkline = ({ data, w = 80, h = 24, color }) => {
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
  const isUp = data[data.length - 1] >= data[0];
  const c = color || (isUp ? "var(--accent)" : "var(--danger)");
  return (
    <svg className="spark" width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts} fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// =================== SIDEBAR ===================
function Sidebar({ active, setActive }) {
  const items = [
    { id: "dashboard", label: "Dashboard", icon: I.dash },
    { id: "markets", label: "Markets", icon: I.market },
    { id: "portfolio", label: "Portfolio", icon: I.pf },
    { id: "watchlist", label: "Watchlist", icon: I.star, badge: window.WATCHLIST.length },
    { id: "journal", label: "Journal", icon: I.book, badge: window.JOURNAL.filter(j => j.status === "OPEN").length },
  ];
  const items2 = [
    { id: "challenges", label: "Challenges", icon: I.trophy, badge: window.CHALLENGES.filter(c => c.completed).length },
    { id: "leaderboard", label: "Leaderboard", icon: I.rank },
    { id: "settings", label: "Settings", icon: I.cog },
  ];
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">T</div>
        <div>
          <div className="brand-name">TradeFlow</div>
          <div className="brand-sub">India · Paper</div>
        </div>
      </div>
      <div className="nav-section">Trading</div>
      {items.map(it => (
        <div key={it.id} className={"nav-item" + (active === it.id ? " active" : "")} onClick={() => setActive(it.id)}>
          <div className="nav-icon">{it.icon}</div>
          <span>{it.label}</span>
          {it.badge ? <span className="nav-badge">{it.badge}</span> : null}
        </div>
      ))}
      <div className="nav-section">Progress</div>
      {items2.map(it => (
        <div key={it.id} className={"nav-item" + (active === it.id ? " active" : "")} onClick={() => setActive(it.id)}>
          <div className="nav-icon">{it.icon}</div>
          <span>{it.label}</span>
          {it.badge ? <span className="nav-badge">{it.badge}</span> : null}
        </div>
      ))}
      <div className="sidebar-footer">
        <div className="avatar">{window.USER.avatar}</div>
        <div style={{ minWidth: 0 }}>
          <div className="user-name">{window.USER.name}</div>
          <div className="user-email" style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{window.USER.email}</div>
        </div>
      </div>
    </aside>
  );
}

// =================== TOPBAR ===================
function Topbar({ marketOpen, cash, onSearch, onAlert }) {
  return (
    <div className="topbar">
      <div className="topbar-search">
        <span>{I.search}</span>
        <input placeholder="Search stocks, journal, orders…" onFocus={onSearch} readOnly />
        <kbd>⌘K</kbd>
      </div>
      <div style={{ flex: 1 }}/>
      <div className="market-pill">
        <span className={"dot " + (marketOpen ? "open" : "closed")}/>
        <span className="muted">NSE</span>
        <span style={{ fontWeight: 600 }}>{marketOpen ? "OPEN" : "CLOSED"}</span>
        <span className="dim mono" style={{ fontSize: 11 }}>· 14:32 IST</span>
      </div>
      <div className="cash-chip">
        <span style={{ color: "var(--text-muted)" }}>{I.cash}</span>
        <span className="label">CASH</span>
        <span className="val">{window.fmtINR(cash, 2)}</span>
      </div>
      <button className="icon-btn" onClick={onAlert} title="Alerts">{I.bell}</button>
    </div>
  );
}

// =================== EXPORTS ===================
Object.assign(window, { Icon, I, SymDot, ChangeChip, Sparkline, Sidebar, Topbar, symHue });
