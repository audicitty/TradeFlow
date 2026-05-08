/* global React, SymDot, ChangeChip, Sparkline, Icon, I */
const { useState: uS1, useMemo: uM1, useEffect: uE1, useRef: uR1 } = React;

// =================== DASHBOARD ===================
function Dashboard({ openOrder, openAlert, setActive }) {
  const m = window.portfolioMetrics();
  const top = window.STOCKS.slice(0, 30).sort((a, b) => b.chgPct - a.chgPct);
  const movers = top.slice(0, 5);
  const losers = [...top].reverse().slice(0, 3);

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Good afternoon, Aarav.</h1>
          <div className="page-sub">Tuesday, May 6 · Markets close in 58 minutes</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn" onClick={() => setActive("markets")}>{I.search} Find a stock</button>
          <button className="btn primary" onClick={() => openOrder({ sym: "RELIANCE", side: "BUY" })}>{I.plus} Quick trade</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Hero portfolio card */}
        <div className="card grid-bg" style={{ padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
            <div>
              <div className="card-sub">Portfolio Value</div>
              <div className="mono" style={{ fontSize: 36, fontWeight: 600, letterSpacing: "-0.02em", marginTop: 4 }}>
                {window.fmtINR(m.total)}
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 8 }}>
                <ChangeChip pct={m.returnPct} abs={m.total - 10000} mono />
                <span className="muted" style={{ fontSize: 12 }}>all time</span>
                <span className="dim" style={{ fontSize: 12 }}>·</span>
                <span className={"mono " + (m.todayChg >= 0 ? "up" : "down")} style={{ fontSize: 12 }}>
                  {m.todayChg >= 0 ? "▲" : "▼"} {window.fmtINR(Math.abs(m.todayChg))} ({m.todayChgPct.toFixed(2)}%) today
                </span>
              </div>
            </div>
            <Sparkline data={[100,99,101,103,102,104,107,106,108,107,110,111,113,112,114,115,117,116,118]} w={180} h={56} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 18, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
            <div>
              <div className="card-sub" style={{ marginBottom: 4 }}>Invested</div>
              <div className="mono" style={{ fontSize: 17, fontWeight: 600 }}>{window.fmtINR(m.invested)}</div>
            </div>
            <div>
              <div className="card-sub" style={{ marginBottom: 4 }}>Holdings Value</div>
              <div className="mono" style={{ fontSize: 17, fontWeight: 600 }}>{window.fmtINR(m.value)}</div>
            </div>
            <div>
              <div className="card-sub" style={{ marginBottom: 4 }}>Unrealized P&L</div>
              <div className={"mono " + (m.unrealized >= 0 ? "up" : "down")} style={{ fontSize: 17, fontWeight: 600 }}>
                {m.unrealized >= 0 ? "+" : "−"}{window.fmtINR(Math.abs(m.unrealized))}
              </div>
            </div>
            <div>
              <div className="card-sub" style={{ marginBottom: 4 }}>Realized P&L</div>
              <div className={"mono " + (m.realized >= 0 ? "up" : "down")} style={{ fontSize: 17, fontWeight: 600 }}>
                {m.realized >= 0 ? "+" : "−"}{window.fmtINR(Math.abs(m.realized))}
              </div>
            </div>
          </div>
        </div>

        {/* AI Daily Insight */}
        <div className="ai-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <div className="ai-label">✦ Daily Insight · Claude</div>
            <span className="dim" style={{ fontSize: 11 }}>generated 09:15 IST</span>
          </div>
          <div style={{ fontSize: 13.5, lineHeight: 1.6, marginTop: 6 }}>{window.DAILY_INSIGHT}</div>
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <button className="btn sm" onClick={() => setActive("portfolio")}>Review IT exposure</button>
            <button className="btn sm ghost">Dismiss</button>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Holdings preview */}
        <div className="card">
          <div className="card-head">
            <div className="card-title">Open positions</div>
            <button className="btn sm ghost" onClick={() => setActive("portfolio")}>View all {I.arrowRight}</button>
          </div>
          <table className="table">
            <thead><tr><th>Stock</th><th className="right">Qty</th><th className="right">Avg</th><th className="right">LTP</th><th className="right">P&L</th><th className="right">Day</th></tr></thead>
            <tbody>
              {window.HOLDINGS.map(h => {
                const s = window.STOCKS.find(x => x.sym === h.sym);
                const value = h.qty * s.price;
                const cost = h.qty * h.avg;
                const pnl = value - cost;
                const pnlPct = (pnl / cost) * 100;
                return (
                  <tr key={h.sym} className="clickable" onClick={() => openOrder({ sym: h.sym, side: "SELL" })}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <SymDot sym={h.sym}/>
                        <div>
                          <div style={{ fontWeight: 500 }}>{h.sym}</div>
                          <div className="dim" style={{ fontSize: 11 }}>{s.sector}</div>
                        </div>
                      </div>
                    </td>
                    <td className="right mono">{h.qty}</td>
                    <td className="right mono muted">{window.fmt(h.avg)}</td>
                    <td className="right mono">{window.fmt(s.price)}</td>
                    <td className={"right mono " + (pnl >= 0 ? "up" : "down")}>
                      {pnl >= 0 ? "+" : "−"}{window.fmt(Math.abs(pnl))}
                      <div style={{ fontSize: 11, opacity: 0.85 }}>{pnl >= 0 ? "▲" : "▼"} {Math.abs(pnlPct).toFixed(2)}%</div>
                    </td>
                    <td className={"right mono " + (s.chgPct >= 0 ? "up" : "down")}>{s.chgPct >= 0 ? "+" : ""}{s.chgPct.toFixed(2)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Streak + challenges */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card" style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, display: "grid", placeItems: "center", background: "var(--amber-soft)", border: "1px solid rgba(245,166,35,0.3)" }}>
              <div style={{ color: "var(--amber)", fontSize: 24 }}>{I.flame}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div className="card-sub">Daily streak</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span className="mono" style={{ fontSize: 28, fontWeight: 600 }}>{window.USER.streak}</span>
                <span className="muted" style={{ fontSize: 12 }}>days</span>
              </div>
              <div className="dim" style={{ fontSize: 11 }}>Best: {window.USER.bestStreak} days</div>
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <div className="card-title">Active challenges</div>
              <span className="chip mono">{window.CHALLENGES.filter(c => c.completed).length}/{window.CHALLENGES.length}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {window.CHALLENGES.slice(0, 3).map(c => {
                const pct = Math.min(100, (c.current / c.target) * 100);
                return (
                  <div key={c.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 12.5, fontWeight: 500 }}>{c.name}</span>
                      <span className="mono dim" style={{ fontSize: 11.5 }}>
                        {c.completed ? <span className="up">✓ done</span> : `${c.current}/${c.target} ${c.unit}`}
                      </span>
                    </div>
                    <div className={"progress" + (c.completed ? "" : pct < 50 ? " warn" : "")}><div style={{ width: pct + "%" }}/></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        {/* Top movers */}
        <div className="card">
          <div className="card-head">
            <div className="card-title">Top movers · NIFTY 50</div>
            <span className="chip up mono">▲ NIFTY 23,842</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {movers.map(s => (
              <div key={s.sym} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0" }}>
                <SymDot sym={s.sym}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: 13 }}>{s.sym}</div>
                  <div className="dim" style={{ fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</div>
                </div>
                <Sparkline data={window.spark(symHue(s.sym), 16)} w={50} h={20}/>
                <div style={{ textAlign: "right", minWidth: 70 }}>
                  <div className="mono" style={{ fontSize: 12.5, fontWeight: 500 }}>{window.fmt(s.price)}</div>
                  <div className={"mono " + (s.chgPct >= 0 ? "up" : "down")} style={{ fontSize: 11 }}>
                    {s.chgPct >= 0 ? "+" : ""}{s.chgPct.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent orders */}
        <div className="card">
          <div className="card-head">
            <div className="card-title">Recent orders</div>
            <button className="btn sm ghost" onClick={() => setActive("portfolio")}>History {I.arrowRight}</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {window.ORDERS.slice(0, 5).map(o => (
              <div key={o.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0" }}>
                <div style={{ width: 32, height: 32, borderRadius: 7, display: "grid", placeItems: "center",
                  background: o.side === "BUY" ? "var(--accent-soft)" : "var(--danger-soft)",
                  color: o.side === "BUY" ? "var(--accent)" : "var(--danger)",
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.05em"
                }}>{o.side}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: 13 }}>{o.sym}</div>
                  <div className="dim mono" style={{ fontSize: 10.5 }}>{o.date.split(" ")[1]} · {o.type}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="mono" style={{ fontSize: 12.5 }}>{o.qty} × {window.fmt(o.price)}</div>
                  <span className={"chip " + (o.status === "EXECUTED" ? "up" : o.status === "PENDING" ? "amber" : "down")} style={{ fontSize: 9.5, padding: "1px 5px" }}>
                    {o.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Earnings calendar */}
        <div className="card">
          <div className="card-head">
            <div className="card-title">Earnings this week</div>
            <span className="chip amber">📅 3 events</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { sym: "RELIANCE", date: "May 8", est: 25.40, day: "Thu", you: true },
              { sym: "BHARTIARTL", date: "May 9", est: 8.92, day: "Fri", you: false },
              { sym: "TATAMOTORS", date: "May 10", est: 14.20, day: "Sat", you: true },
            ].map(e => (
              <div key={e.sym} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0" }}>
                <div style={{ width: 38, textAlign: "center", padding: "4px 0", borderRadius: 6, background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
                  <div className="dim" style={{ fontSize: 9, letterSpacing: "0.1em" }}>{e.day.toUpperCase()}</div>
                  <div className="mono" style={{ fontSize: 13, fontWeight: 600 }}>{e.date.split(" ")[1]}</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: 13 }}>{e.sym} {e.you && <span className="chip up" style={{ fontSize: 9, marginLeft: 4 }}>HELD</span>}</div>
                  <div className="dim" style={{ fontSize: 11 }}>Est. EPS ₹{e.est}</div>
                </div>
                <span className="chip mono">Q4 FY26</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

window.Dashboard = Dashboard;
