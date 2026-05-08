/* global React, SymDot, ChangeChip, Sparkline, I */
const { useState: uS5 } = React;

// =================== CHALLENGES ===================
function Challenges() {
  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Challenges & badges</h1>
          <div className="page-sub">Earn badges by completing monthly challenges · Resets 1st of each month</div>
        </div>
        <div className="chip mono">May 2026 · 25d left</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
        {window.CHALLENGES.map(c => {
          const pct = Math.min(100, (c.current / c.target) * 100);
          return (
            <div key={c.id} className="card" style={{
              borderColor: c.completed ? "var(--accent-line)" : "var(--border)",
              background: c.completed ? "linear-gradient(135deg, rgba(0,208,156,0.04), transparent 70%)" : "var(--bg-surface)"
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div className="card-title">{c.name}</div>
                {c.completed && <span className="chip up">✓ Completed</span>}
              </div>
              <div className="muted" style={{ fontSize: 12.5, lineHeight: 1.5, marginBottom: 14, minHeight: 38 }}>{c.desc}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                <span className="mono" style={{ fontSize: 22, fontWeight: 600 }}>{c.current}<span className="dim" style={{ fontSize: 13 }}>/{c.target}</span></span>
                <span className="muted mono" style={{ fontSize: 11 }}>{c.unit}</span>
              </div>
              <div className={"progress" + (c.completed ? "" : pct < 40 ? " warn" : "")}><div style={{ width: pct + "%" }}/></div>
              <div className="dim" style={{ fontSize: 11, marginTop: 8 }}>{c.daysLeft} days remaining this month</div>
            </div>
          );
        })}
      </div>

      <div className="card-head" style={{ marginBottom: 14 }}>
        <div>
          <div className="card-title">Badge collection</div>
          <div className="dim" style={{ fontSize: 11.5, marginTop: 2 }}>{window.BADGES.filter(b => b.earned).length} of {window.BADGES.length} earned</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14 }}>
        {window.BADGES.map(b => (
          <div key={b.id} className="card" style={{
            textAlign: "center", padding: 18,
            opacity: b.earned ? 1 : 0.45,
            filter: b.earned ? "none" : "saturate(0.3)",
            position: "relative"
          }}>
            <div style={{
              fontSize: 38, marginBottom: 10,
              filter: b.earned ? "drop-shadow(0 0 12px rgba(0,208,156,0.3))" : "grayscale(1)"
            }}>{b.icon}</div>
            <div className="sora" style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 4 }}>{b.name}</div>
            <div className="dim" style={{ fontSize: 11, lineHeight: 1.4, minHeight: 32 }}>{b.desc}</div>
            {b.earned ? (
              <div className="mono up" style={{ fontSize: 10.5, marginTop: 8 }}>✓ {b.date}</div>
            ) : (
              <div className="dim mono" style={{ fontSize: 10.5, marginTop: 8 }}>🔒 Locked</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// =================== WATCHLIST ===================
function Watchlist({ watchlist, toggleWatch, openOrder, openAlert, openDetail }) {
  const items = watchlist.map(sym => window.STOCKS.find(s => s.sym === sym)).filter(Boolean);
  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Watchlist</h1>
          <div className="page-sub">{items.length} stocks tracked · Live prices update every 5s</div>
        </div>
        <button className="btn primary">{I.plus} Add stock</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        {items.map(s => {
          const rangePos = ((s.price - s.w52l) / (s.w52h - s.w52l)) * 100;
          return (
            <div key={s.sym} className="card" style={{ padding: 16, position: "relative" }}>
              <button onClick={() => toggleWatch(s.sym)} style={{
                position: "absolute", top: 10, right: 10,
                background: "transparent", border: "none", color: "var(--text-muted)",
                cursor: "pointer", padding: 4
              }} title="Remove">{I.x}</button>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, cursor: "pointer" }} onClick={() => openDetail(s.sym)}>
                <SymDot sym={s.sym}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13.5 }}>{s.sym}</div>
                  <div className="dim" style={{ fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</div>
                </div>
              </div>
              <div className="mono" style={{ fontSize: 22, fontWeight: 600 }}>{window.fmtINR(s.price)}</div>
              <ChangeChip pct={s.chgPct} abs={s.chg} mono/>

              <div style={{ marginTop: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginBottom: 3 }}>
                  <span className="dim">{window.fmt(s.w52l)}</span>
                  <span className="dim">52W</span>
                  <span className="dim">{window.fmt(s.w52h)}</span>
                </div>
                <div className="range-bar">
                  <div className="range-fill" style={{ left: 0, right: 0 }}/>
                  <div className="range-marker" style={{ left: rangePos + "%" }}/>
                </div>
              </div>

              <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
                <button className="btn sm primary" style={{ flex: 1 }} onClick={() => openOrder({ sym: s.sym, side: "BUY" })}>Buy</button>
                <button className="btn sm" onClick={() => openAlert(s.sym)}>{I.bell}</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =================== LEADERBOARD ===================
const LB_USERS = [
  { rank: 1, name: "Priya Iyer", avatar: "PI", ret: 24.82, val: 12482, trades: 38 },
  { rank: 2, name: "Karthik Reddy", avatar: "KR", ret: 19.40, val: 11940, trades: 27 },
  { rank: 3, name: "Nisha Bhattacharya", avatar: "NB", ret: 15.67, val: 11567, trades: 22 },
  { rank: 4, name: "Arjun Sharma", avatar: "AS", ret: 13.21, val: 11321, trades: 31 },
  { rank: 5, name: "Meera Pillai", avatar: "MP", ret: 11.84, val: 11184, trades: 19 },
  { rank: 6, name: "Rohan Kapoor", avatar: "RK", ret: 10.92, val: 11092, trades: 24 },
  { rank: 7, name: "Aarav Mehta", avatar: "AM", ret: 8.92, val: 10892, trades: 12, you: true },
  { rank: 8, name: "Divya Nair", avatar: "DN", ret: 7.45, val: 10745, trades: 28 },
  { rank: 9, name: "Vikram Joshi", avatar: "VJ", ret: 6.30, val: 10630, trades: 15 },
  { rank: 10, name: "Sanjay Gupta", avatar: "SG", ret: 5.18, val: 10518, trades: 9 },
];

function Leaderboard() {
  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Leaderboard</h1>
          <div className="page-sub">Top traders by % return from ₹10,000 starting balance · Resets monthly</div>
        </div>
        <div className="chip mono">May 2026</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 18 }}>
        {LB_USERS.slice(0, 3).map((u, i) => {
          const colors = ["#FFD700", "#C0C0C0", "#CD7F32"];
          return (
            <div key={u.rank} className="card" style={{
              padding: 18, borderColor: colors[i] + "55",
              background: `linear-gradient(135deg, ${colors[i]}10, transparent 70%)`,
              position: "relative", overflow: "hidden"
            }}>
              <div style={{ position: "absolute", top: -10, right: -10, fontSize: 80, opacity: 0.08 }}>
                {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div className="avatar" style={{
                  width: 44, height: 44, fontSize: 14,
                  background: `linear-gradient(135deg, ${colors[i]}, ${colors[i]}66)`,
                  color: "#0a0b0e"
                }}>{u.avatar}</div>
                <div>
                  <div className="dim" style={{ fontSize: 10, letterSpacing: "0.1em" }}>RANK #{u.rank}</div>
                  <div className="sora" style={{ fontSize: 15, fontWeight: 600 }}>{u.name}</div>
                </div>
              </div>
              <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span className="mono up" style={{ fontSize: 24, fontWeight: 600 }}>+{u.ret.toFixed(2)}%</span>
                <span className="mono dim" style={{ fontSize: 12 }}>{window.fmtINR(u.val, 0)}</span>
              </div>
              <div className="dim" style={{ fontSize: 11, marginTop: 4 }}>{u.trades} trades placed</div>
            </div>
          );
        })}
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="table">
          <thead><tr><th>Rank</th><th>Trader</th><th className="right">Return %</th><th className="right">Portfolio</th><th className="right">Trades</th><th className="right">Trend</th></tr></thead>
          <tbody>
            {LB_USERS.map((u, i) => (
              <tr key={u.rank} className={"glow-row " + (i < 3 ? ["gold","silver","bronze"][i] : u.you ? "you" : "")}>
                <td className="mono" style={{ fontSize: 13, fontWeight: 600, paddingLeft: 18 }}>#{u.rank}</td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div className="avatar" style={{ width: 28, height: 28, fontSize: 11, background: u.you ? "linear-gradient(135deg, var(--blue), #1d4ed8)" : `linear-gradient(135deg, oklch(0.42 0.10 ${(u.rank * 47) % 360}), oklch(0.28 0.08 ${(u.rank * 47) % 360}))` }}>{u.avatar}</div>
                    <div>
                      <div style={{ fontWeight: 500 }}>{u.name} {u.you && <span className="chip blue" style={{ marginLeft: 6, fontSize: 9 }}>YOU</span>}</div>
                    </div>
                  </div>
                </td>
                <td className={"right mono " + (u.ret >= 0 ? "up" : "down")} style={{ fontSize: 13, fontWeight: 600 }}>
                  {u.ret >= 0 ? "+" : ""}{u.ret.toFixed(2)}%
                </td>
                <td className="right mono">{window.fmtINR(u.val, 0)}</td>
                <td className="right mono muted">{u.trades}</td>
                <td className="right">
                  <Sparkline data={window.spark(u.rank * 7, 12)} w={60} h={20}/>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// =================== SETTINGS ===================
function Settings({ openReset }) {
  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Settings</h1>
          <div className="page-sub">Profile, portfolio, and account preferences</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="card">
          <div className="card-title" style={{ marginBottom: 16 }}>Profile</div>
          <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 18 }}>
            <div className="avatar" style={{ width: 72, height: 72, fontSize: 22, borderRadius: 14 }}>{window.USER.avatar}</div>
            <div>
              <button className="btn sm">Change avatar</button>
              <div className="dim" style={{ fontSize: 11, marginTop: 6 }}>Choose from 6 preset illustrations</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Field label="Display name" value={window.USER.name}/>
            <Field label="Email" value={window.USER.email} readOnly/>
            <Field label="Member since" value={window.USER.joined} readOnly/>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
            <Mini3 label="Total trades" v="12"/>
            <Mini3 label="Win rate" v="71%"/>
            <Mini3 label="Best trade" v="+₹624" cls="up"/>
          </div>
        </div>

        <div className="card">
          <div className="card-title" style={{ marginBottom: 16 }}>Portfolio</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <Mini3 label="Cash" v={window.fmtINR(window.USER.cash)}/>
            <Mini3 label="Starting balance" v={window.fmtINR(window.USER.starting)}/>
            <Mini3 label="Return since start" v="+8.92%" cls="up"/>
            <Mini3 label="Resets" v={window.USER.resets}/>
          </div>
          <div style={{ padding: 14, background: "var(--bg-base)", border: "1px solid rgba(255,77,79,0.18)", borderRadius: 8 }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: "var(--danger)", marginBottom: 4 }}>Reset portfolio</div>
            <div className="dim" style={{ fontSize: 12, lineHeight: 1.5, marginBottom: 12 }}>
              Resets cash to ₹10,000 and clears all holdings, orders, and journal entries. Badges and streaks are preserved. Cannot be undone.
            </div>
            <button className="btn danger sm" onClick={openReset}>Reset portfolio</button>
          </div>
        </div>

        <div className="card">
          <div className="card-title" style={{ marginBottom: 14 }}>Notifications</div>
          <Toggle label="Price alert browser notifications" sub="Get notified when stocks hit your target price" on={true}/>
          <Toggle label="Earnings reminders" sub="3-day notice for held stocks reporting results" on={true}/>
          <Toggle label="Daily insight digest" sub="AI-generated portfolio observation at market open" on={false}/>
        </div>

        <div className="card">
          <div className="card-title" style={{ marginBottom: 14 }}>Account</div>
          <button className="btn" style={{ width: "100%", marginBottom: 8, justifyContent: "flex-start" }}>Sign out</button>
          <button className="btn" style={{ width: "100%", marginBottom: 8, justifyContent: "flex-start", color: "var(--danger)", borderColor: "rgba(255,77,79,0.3)" }}>Delete account</button>
        </div>
      </div>
    </div>
  );
}

const Field = ({ label, value, readOnly }) => (
  <div>
    <div className="field-label">{label}</div>
    <div style={{ display: "flex", gap: 8 }}>
      <input className="input" defaultValue={value} disabled={readOnly}/>
      {!readOnly && <button className="btn sm">{I.edit}</button>}
    </div>
  </div>
);

const Mini3 = ({ label, v, cls }) => (
  <div style={{ padding: 10, background: "var(--bg-base)", borderRadius: 7, border: "1px solid var(--border)" }}>
    <div className="card-sub" style={{ marginBottom: 3, fontSize: 10 }}>{label}</div>
    <div className={"mono " + (cls || "")} style={{ fontSize: 14, fontWeight: 600 }}>{v}</div>
  </div>
);

function Toggle({ label, sub, on: initial }) {
  const [on, setOn] = uS5(initial);
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{label}</div>
        <div className="dim" style={{ fontSize: 11.5, marginTop: 2 }}>{sub}</div>
      </div>
      <div onClick={() => setOn(!on)} style={{
        width: 36, height: 20, borderRadius: 999,
        background: on ? "var(--accent)" : "var(--bg-elevated)",
        border: "1px solid " + (on ? "var(--accent)" : "var(--border)"),
        position: "relative", cursor: "pointer", transition: "background 0.16s"
      }}>
        <div style={{
          position: "absolute", top: 1, left: on ? 17 : 1,
          width: 16, height: 16, borderRadius: "50%",
          background: on ? "#021810" : "var(--text-secondary)",
          transition: "left 0.16s"
        }}/>
      </div>
    </div>
  );
}

window.Challenges = Challenges;
window.Watchlist = Watchlist;
window.Leaderboard = Leaderboard;
window.Settings = Settings;
