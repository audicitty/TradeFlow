/* global React, SymDot, ChangeChip, Sparkline, I */
const { useState: uS3, useMemo: uM3 } = React;

// =================== PORTFOLIO ===================
function Portfolio({ openOrder, openDetail }) {
  const [tab, setTab] = uS3("holdings");
  const m = window.portfolioMetrics();

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Portfolio</h1>
          <div className="page-sub">Track positions, performance, and history</div>
        </div>
        <button className="btn">Export CSV</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12, marginBottom: 18 }}>
        <Stat2 label="Total value" v={window.fmtINR(m.total)} sub={<ChangeChip pct={m.returnPct} />} />
        <Stat2 label="Invested" v={window.fmtINR(m.invested)} sub="cost basis" />
        <Stat2 label="Holdings value" v={window.fmtINR(m.value)} sub={`${window.HOLDINGS.length} positions`} />
        <Stat2 label="Unrealized P&L" v={(m.unrealized >= 0 ? "+" : "−") + window.fmtINR(Math.abs(m.unrealized))} cls={m.unrealized >= 0 ? "up" : "down"} sub="open positions" />
        <Stat2 label="Realized P&L" v={(m.realized >= 0 ? "+" : "−") + window.fmtINR(Math.abs(m.realized))} cls={m.realized >= 0 ? "up" : "down"} sub="closed positions" />
        <Stat2 label="Cash" v={window.fmtINR(m.cash)} sub={`${((m.cash / m.total) * 100).toFixed(1)}% of book`} />
      </div>

      <div className="tabs">
        {["holdings", "analytics", "history"].map(t => (
          <div key={t} className={"tab" + (tab === t ? " active" : "")} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
            {t === "holdings" && <span className="chip mono" style={{ marginLeft: 8, fontSize: 10 }}>{window.HOLDINGS.length}</span>}
            {t === "history" && <span className="chip mono" style={{ marginLeft: 8, fontSize: 10 }}>{window.ORDERS.length}</span>}
          </div>
        ))}
      </div>

      {tab === "holdings" && <Holdings openOrder={openOrder} openDetail={openDetail}/>}
      {tab === "analytics" && <Analytics/>}
      {tab === "history" && <History/>}
    </div>
  );
}

const Stat2 = ({ label, v, sub, cls }) => (
  <div className="stat">
    <div className="stat-label">{label}</div>
    <div className={"stat-value " + (cls || "")}>{v}</div>
    <div className="stat-sub">{sub}</div>
  </div>
);

function Holdings({ openOrder, openDetail }) {
  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <table className="table">
        <thead><tr>
          <th>Stock</th><th>Sector</th><th className="right">Qty</th><th className="right">Avg buy</th><th className="right">LTP</th>
          <th className="right">Invested</th><th className="right">Value</th><th className="right">P&L ₹</th><th className="right">P&L %</th><th className="right">Day</th><th></th>
        </tr></thead>
        <tbody>
          {window.HOLDINGS.map(h => {
            const s = window.STOCKS.find(x => x.sym === h.sym);
            const cost = h.qty * h.avg;
            const value = h.qty * s.price;
            const pnl = value - cost;
            const pnlPct = (pnl / cost) * 100;
            return (
              <tr key={h.sym}>
                <td onClick={() => openDetail(h.sym)} style={{ cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <SymDot sym={h.sym}/>
                    <div>
                      <div style={{ fontWeight: 500 }}>{h.sym}</div>
                      <div className="dim" style={{ fontSize: 11 }}>{s.name}</div>
                    </div>
                  </div>
                </td>
                <td className="muted">{s.sector}</td>
                <td className="right mono">{h.qty}</td>
                <td className="right mono muted">{window.fmt(h.avg)}</td>
                <td className="right mono">{window.fmt(s.price)}</td>
                <td className="right mono muted">{window.fmt(cost)}</td>
                <td className="right mono">{window.fmt(value)}</td>
                <td className={"right mono " + (pnl >= 0 ? "up" : "down")}>{pnl >= 0 ? "+" : "−"}{window.fmt(Math.abs(pnl))}</td>
                <td className={"right mono " + (pnlPct >= 0 ? "up" : "down")}>{pnlPct >= 0 ? "+" : ""}{pnlPct.toFixed(2)}%</td>
                <td className={"right mono " + (s.chgPct >= 0 ? "up" : "down")}>{s.chgPct >= 0 ? "+" : ""}{s.chgPct.toFixed(2)}%</td>
                <td className="right">
                  <button className="btn sm" onClick={() => openOrder({ sym: h.sym, side: "SELL" })}>Sell</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Analytics() {
  const [healthShown, setHealthShown] = uS3(false);
  const [healthLoading, setHealthLoading] = uS3(false);

  // Sector breakdown
  const sectors = {};
  let totalValue = 0;
  for (const h of window.HOLDINGS) {
    const s = window.STOCKS.find(x => x.sym === h.sym);
    const v = h.qty * s.price;
    sectors[s.sector] = (sectors[s.sector] || 0) + v;
    totalValue += v;
  }
  const sectorList = Object.entries(sectors).map(([n, v]) => ({ n, v, pct: (v / totalValue) * 100 })).sort((a, b) => b.v - a.v);
  const sectorColors = ["#00D09C", "#3B82F6", "#F5A623", "#A78BFA", "#FF4D4F", "#22D3EE"];

  // Equity curve mock
  const equity = [10000, 10120, 10080, 10240, 10180, 10310, 10420, 10380, 10560, 10510, 10620, 10580, 10712, 10680, 10780, 10892];

  const handleHealth = () => {
    setHealthLoading(true);
    setTimeout(() => { setHealthLoading(false); setHealthShown(true); }, 1200);
  };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Sector breakdown */}
        <div className="card">
          <div className="card-head">
            <div className="card-title">Sector allocation</div>
            <span className="dim" style={{ fontSize: 11 }}>{sectorList.length} sectors</span>
          </div>
          <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
            <Donut data={sectorList} colors={sectorColors}/>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
              {sectorList.map((s, i) => (
                <div key={s.n} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: sectorColors[i % sectorColors.length] }}/>
                  <span style={{ fontSize: 12.5, flex: 1 }}>{s.n}</span>
                  <span className="mono dim" style={{ fontSize: 11.5 }}>{window.fmt(s.v, 0)}</span>
                  <span className="mono" style={{ fontSize: 11.5, minWidth: 40, textAlign: "right", fontWeight: 600 }}>{s.pct.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Benchmark */}
        <div className="card">
          <div className="card-head">
            <div className="card-title">vs NIFTY 50</div>
            <div className="segment">
              <button className="active">1M</button><button>3M</button><button>All</button>
            </div>
          </div>
          <BenchmarkChart h={200}/>
          <div style={{ display: "flex", gap: 18, marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--border)" }}>
            <div>
              <div className="card-sub" style={{ marginBottom: 2 }}>My return</div>
              <div className="mono up" style={{ fontWeight: 600 }}>+8.92%</div>
            </div>
            <div>
              <div className="card-sub" style={{ marginBottom: 2 }}>NIFTY 50</div>
              <div className="mono up" style={{ fontWeight: 600 }}>+6.14%</div>
            </div>
            <div>
              <div className="card-sub" style={{ marginBottom: 2 }}>Outperformance</div>
              <div className="mono up" style={{ fontWeight: 600 }}>+2.78%</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Equity curve */}
        <div className="card">
          <div className="card-head">
            <div className="card-title">Daily portfolio value</div>
            <span className="dim mono" style={{ fontSize: 11 }}>baseline ₹10,000</span>
          </div>
          <EquityCurve data={equity} h={220}/>
        </div>

        {/* Trade stats */}
        <div className="card">
          <div className="card-title" style={{ marginBottom: 14 }}>Trade statistics</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Mini label="Win rate" v="71%" sub="5 of 7 closed" cls="up"/>
            <Mini label="Avg holding" v="89 days" sub="median 64 days"/>
            <Mini label="Total trades" v="12" sub="this lifetime"/>
            <Mini label="Brokerage paid" v="₹356.55" sub="all charges"/>
            <Mini label="Best trade" v="+₹624.80" sub="BHARTIARTL · 11.2%" cls="up"/>
            <Mini label="Worst trade" v="−₹384.20" sub="WIPRO · −3.5%" cls="down"/>
          </div>
        </div>
      </div>

      {/* AI Portfolio health */}
      <div className="card" style={{ background: "linear-gradient(135deg, rgba(245,166,35,0.04), transparent 60%)", borderColor: "rgba(245,166,35,0.18)" }}>
        <div className="card-head">
          <div>
            <div className="card-title">✦ Portfolio health · AI analysis</div>
            <div className="dim" style={{ fontSize: 11.5, marginTop: 2 }}>Powered by Claude · Cached 24h</div>
          </div>
          {!healthShown && <button className="btn" onClick={handleHealth} disabled={healthLoading}>{healthLoading ? "Analysing…" : "Analyse portfolio"}</button>}
          {healthShown && <span className="chip up">✓ Generated 2m ago</span>}
        </div>

        {!healthShown && !healthLoading && (
          <div style={{ padding: "32px 0", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
            Click <span className="muted">Analyse portfolio</span> to receive a risk-graded health score with personalised recommendations.
          </div>
        )}
        {healthLoading && (
          <div style={{ padding: "32px 0", textAlign: "center" }}>
            <div className="dim mono" style={{ fontSize: 12, animation: "pulse 1.4s infinite alternate" }}>analyzing 5 holdings · sector concentration · drawdown · benchmark gap…</div>
          </div>
        )}
        {healthShown && (
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr", gap: 24, alignItems: "start", paddingTop: 6 }}>
            <Gauge score={72} grade="B"/>
            <div>
              <div className="card-sub" style={{ marginBottom: 8, color: "var(--danger)" }}>⚠ Risks</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {[
                  "IT sector concentration at 18% with valuations stretched",
                  "Cash buffer at 28% — high opportunity cost in rising market",
                  "TATAMOTORS down 11.9%, average holding period 8+ months"
                ].map(r => (
                  <div key={r} className="chip down" style={{ width: "fit-content", padding: "6px 10px", fontSize: 12 }}>{r}</div>
                ))}
              </div>
            </div>
            <div>
              <div className="card-sub" style={{ marginBottom: 8, color: "var(--accent)" }}>✓ Recommendations</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {[
                  "Add Pharma or FMCG exposure to balance cyclical tilt",
                  "Trim INFY on next rally above ₹1,900 (+3.5%)",
                  "Deploy ₹2,000 cash into 1-2 mid-cap diversifiers"
                ].map(r => (
                  <div key={r} className="chip up" style={{ width: "fit-content", padding: "6px 10px", fontSize: 12 }}>{r}</div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const Mini = ({ label, v, sub, cls }) => (
  <div style={{ padding: 12, background: "var(--bg-base)", borderRadius: 8, border: "1px solid var(--border)" }}>
    <div className="card-sub" style={{ marginBottom: 4 }}>{label}</div>
    <div className={"mono " + (cls || "")} style={{ fontSize: 17, fontWeight: 600 }}>{v}</div>
    <div className="dim" style={{ fontSize: 11, marginTop: 2 }}>{sub}</div>
  </div>
);

function Donut({ data, colors }) {
  const size = 140, r = 54, cx = size/2, cy = size/2;
  let acc = 0;
  const total = data.reduce((a, d) => a + d.v, 0);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {data.map((d, i) => {
        const a0 = (acc / total) * Math.PI * 2 - Math.PI / 2;
        acc += d.v;
        const a1 = (acc / total) * Math.PI * 2 - Math.PI / 2;
        const large = (a1 - a0) > Math.PI ? 1 : 0;
        const x0 = cx + Math.cos(a0) * r, y0 = cy + Math.sin(a0) * r;
        const x1 = cx + Math.cos(a1) * r, y1 = cy + Math.sin(a1) * r;
        return <path key={d.n} d={`M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`} fill={colors[i % colors.length]} stroke="var(--bg-surface)" strokeWidth="1.5"/>;
      })}
      <circle cx={cx} cy={cy} r={32} fill="var(--bg-surface)"/>
      <text x={cx} y={cy - 2} textAnchor="middle" fill="var(--text-primary)" fontSize="14" fontWeight="600" fontFamily="JetBrains Mono">{data.length}</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="var(--text-muted)" fontSize="9" letterSpacing="0.1em">SECTORS</text>
    </svg>
  );
}

function EquityCurve({ data, h = 200 }) {
  const w = 720;
  const padL = 50, padR = 14, padT = 14, padB = 24;
  const min = Math.min(9800, ...data), max = Math.max(...data);
  const baseline = 10000;
  const x = (i) => padL + (i / (data.length - 1)) * (w - padL - padR);
  const y = (v) => padT + (1 - (v - min) / (max - min)) * (h - padT - padB);
  const area = data.map((v, i) => `${x(i)},${y(v)}`).join(" L ");
  const yBase = y(baseline);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h}>
      <defs>
        <linearGradient id="eqGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.45"/>
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
        const v = min + (max - min) * (1 - p);
        const yy = padT + p * (h - padT - padB);
        return (
          <g key={i}>
            <line x1={padL} y1={yy} x2={w - padR} y2={yy} stroke="var(--border)" strokeDasharray="2 4"/>
            <text x={padL - 6} y={yy + 3} textAnchor="end" fontSize="10" fill="var(--text-muted)" fontFamily="JetBrains Mono">{v.toFixed(0)}</text>
          </g>
        );
      })}
      <line x1={padL} y1={yBase} x2={w - padR} y2={yBase} stroke="var(--text-muted)" strokeDasharray="3 3" strokeWidth="1"/>
      <text x={w - padR - 4} y={yBase - 4} textAnchor="end" fontSize="10" fill="var(--text-muted)">baseline ₹10,000</text>
      <path d={`M ${x(0)},${h - padB} L ${area} L ${x(data.length - 1)},${h - padB} Z`} fill="url(#eqGrad)"/>
      <path d={`M ${area}`} stroke="var(--accent)" strokeWidth="2" fill="none"/>
      {data.map((v, i) => i === data.length - 1 && <circle key={i} cx={x(i)} cy={y(v)} r="3" fill="var(--accent)"/>)}
    </svg>
  );
}

function BenchmarkChart({ h = 200 }) {
  const w = 600;
  const padL = 36, padR = 14, padT = 14, padB = 22;
  const me = [0, 0.5, 0.9, 1.4, 2.1, 2.8, 3.6, 4.2, 5.1, 6.4, 7.2, 8.0, 8.92];
  const nifty = [0, 0.3, 0.6, 0.9, 1.2, 1.6, 2.4, 3.1, 3.8, 4.5, 5.2, 5.8, 6.14];
  const min = -1, max = 10;
  const x = (i) => padL + (i / (me.length - 1)) * (w - padL - padR);
  const y = (v) => padT + (1 - (v - min) / (max - min)) * (h - padT - padB);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h}>
      {[0, 2.5, 5, 7.5, 10].map(v => {
        const yy = y(v);
        return (
          <g key={v}>
            <line x1={padL} y1={yy} x2={w - padR} y2={yy} stroke="var(--border)" strokeDasharray="2 4"/>
            <text x={padL - 6} y={yy + 3} textAnchor="end" fontSize="10" fill="var(--text-muted)" fontFamily="JetBrains Mono">{v}%</text>
          </g>
        );
      })}
      <path d={`M ${nifty.map((v, i) => `${x(i)},${y(v)}`).join(" L ")}`} stroke="var(--text-muted)" strokeWidth="1.5" fill="none" strokeDasharray="4 3"/>
      <path d={`M ${me.map((v, i) => `${x(i)},${y(v)}`).join(" L ")}`} stroke="var(--accent)" strokeWidth="2.2" fill="none"/>
      <circle cx={x(me.length - 1)} cy={y(me[me.length - 1])} r="3.5" fill="var(--accent)"/>
      <text x={x(me.length - 1) - 4} y={y(me[me.length - 1]) - 8} textAnchor="end" fontSize="10" fill="var(--accent)" fontFamily="JetBrains Mono" fontWeight="600">+8.92%</text>
      <text x={x(nifty.length - 1) - 4} y={y(nifty[nifty.length - 1]) + 14} textAnchor="end" fontSize="10" fill="var(--text-muted)" fontFamily="JetBrains Mono">+6.14%</text>
    </svg>
  );
}

function Gauge({ score, grade }) {
  const r = 72, c = 2 * Math.PI * r;
  const offset = c * (1 - score / 100);
  return (
    <div className="gauge">
      <svg viewBox="0 0 168 168">
        <circle cx="84" cy="84" r={r} stroke="var(--bg-elevated)" strokeWidth="10" fill="none"/>
        <circle cx="84" cy="84" r={r} stroke="var(--accent)" strokeWidth="10" fill="none" strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"/>
      </svg>
      <div className="center" style={{ flexDirection: "column" }}>
        <div className="score">{score}</div>
        <div className="grade">Grade {grade}</div>
      </div>
    </div>
  );
}

function History() {
  const [filter, setFilter] = uS3("ALL");
  const filtered = window.ORDERS.filter(o => filter === "ALL" || o.side === filter || o.status === filter);
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center" }}>
        <span className="card-sub">Filter:</span>
        {["ALL", "BUY", "SELL", "EXECUTED", "PENDING"].map(f => (
          <button key={f} className={"chip " + (filter === f ? "up" : "")} onClick={() => setFilter(f)} style={{ cursor: "pointer", padding: "4px 10px", fontSize: 11 }}>{f}</button>
        ))}
      </div>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="table">
          <thead><tr>
            <th>ID</th><th>Date</th><th>Stock</th><th>Side</th><th>Type</th>
            <th className="right">Qty</th><th className="right">Price</th><th className="right">Charges</th>
            <th className="right">Realized P&L</th><th>Status</th>
          </tr></thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o.id}>
                <td className="mono dim" style={{ fontSize: 11.5 }}>{o.id}</td>
                <td className="mono dim" style={{ fontSize: 11.5 }}>{o.date}</td>
                <td><div style={{ display: "flex", alignItems: "center", gap: 8 }}><SymDot sym={o.sym}/>{o.sym}</div></td>
                <td><span className={"chip " + (o.side === "BUY" ? "up" : "down")}>{o.side}</span></td>
                <td className="muted" style={{ fontSize: 12 }}>{o.type}</td>
                <td className="right mono">{o.qty}</td>
                <td className="right mono">{window.fmt(o.price)}</td>
                <td className="right mono dim">{window.fmt(o.charges)}</td>
                <td className={"right mono " + (o.pnl === null ? "" : o.pnl >= 0 ? "up" : "down")}>
                  {o.pnl === null ? "—" : (o.pnl >= 0 ? "+" : "−") + window.fmt(Math.abs(o.pnl))}
                </td>
                <td>
                  <span className={"chip " + (o.status === "EXECUTED" ? "up" : o.status === "PENDING" ? "amber" : "down")}>{o.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

window.Portfolio = Portfolio;
