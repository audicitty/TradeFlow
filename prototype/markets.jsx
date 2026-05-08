/* global React, SymDot, ChangeChip, Sparkline, I */
const { useState: uS2, useMemo: uM2 } = React;

// =================== MARKETS ===================
function Markets({ openOrder, openDetail }) {
  const [exchange, setExchange] = uS2("NSE");
  const [query, setQuery] = uS2("");
  const filtered = window.STOCKS.filter(s =>
    !query || s.sym.toLowerCase().includes(query.toLowerCase()) || s.name.toLowerCase().includes(query.toLowerCase())
  );
  const trending = window.STOCKS.slice(0, 12);
  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Markets</h1>
          <div className="page-sub">Discover NSE/BSE-listed stocks · Live prices update every 5s</div>
        </div>
        <div className="segment">
          <button className={exchange === "NSE" ? "active" : ""} onClick={() => setExchange("NSE")}>NSE</button>
          <button className={exchange === "BSE" ? "active" : ""} onClick={() => setExchange("BSE")}>BSE</button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16, padding: 14 }}>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>{I.search}</span>
          <input className="input" style={{ paddingLeft: 36 }} placeholder="Search by symbol or company name…" value={query} onChange={e => setQuery(e.target.value)} autoFocus/>
        </div>
      </div>

      {!query && (
        <div style={{ marginBottom: 16 }}>
          <div className="card-sub" style={{ marginBottom: 10 }}>Trending today</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {trending.map(s => (
              <div key={s.sym} className="card" style={{ padding: 14, cursor: "pointer" }} onClick={() => openDetail(s.sym)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <SymDot sym={s.sym}/>
                  <span className={"chip mono " + (s.chgPct >= 0 ? "up" : "down")} style={{ fontSize: 10.5 }}>
                    {s.chgPct >= 0 ? "▲" : "▼"} {Math.abs(s.chgPct).toFixed(2)}%
                  </span>
                </div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{s.sym}</div>
                <div className="dim" style={{ fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</div>
                <div className="mono" style={{ fontSize: 17, fontWeight: 600, marginTop: 8 }}>{window.fmtINR(s.price)}</div>
                <Sparkline data={window.spark(window.symHue(s.sym), 16)} w={140} h={28}/>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="card-head" style={{ padding: 14, marginBottom: 0, borderBottom: "1px solid var(--border)" }}>
          <div className="card-title">{query ? `${filtered.length} results` : "All stocks"} · {exchange}</div>
          <span className="dim" style={{ fontSize: 11 }}>Click a row for details</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="table">
            <thead><tr>
              <th>Stock</th><th>Sector</th><th className="right">Price</th><th className="right">Day</th>
              <th className="right">Day H/L</th><th className="right">Volume</th><th className="right">Mkt Cap</th><th className="right">P/E</th><th></th>
            </tr></thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.sym} className="clickable" onClick={() => openDetail(s.sym)}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <SymDot sym={s.sym}/>
                      <div>
                        <div style={{ fontWeight: 500 }}>{s.sym} <span className="chip" style={{ fontSize: 9, padding: "1px 5px", marginLeft: 4 }}>{s.ex}</span></div>
                        <div className="dim" style={{ fontSize: 11 }}>{s.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="muted">{s.sector}</td>
                  <td className="right mono">{window.fmt(s.price)}</td>
                  <td className={"right mono " + (s.chgPct >= 0 ? "up" : "down")}>
                    {s.chgPct >= 0 ? "+" : ""}{s.chgPct.toFixed(2)}%
                    <div style={{ fontSize: 10.5, opacity: 0.85 }}>{s.chg >= 0 ? "+" : ""}{window.fmt(s.chg)}</div>
                  </td>
                  <td className="right mono dim" style={{ fontSize: 11.5 }}>{window.fmt(s.dh)} / {window.fmt(s.dl)}</td>
                  <td className="right mono muted">{s.vol}</td>
                  <td className="right mono muted">{s.mcap}</td>
                  <td className="right mono muted">{s.pe.toFixed(1)}</td>
                  <td className="right">
                    <button className="btn sm primary" onClick={(e) => { e.stopPropagation(); openOrder({ sym: s.sym, side: "BUY" }); }}>Trade</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// =================== STOCK DETAIL ===================
function StockDetail({ sym, onBack, openOrder, openAlert, watchlist, toggleWatch }) {
  const s = window.STOCKS.find(x => x.sym === sym);
  const [range, setRange] = uS2("1M");
  const inWatch = watchlist.includes(sym);
  const holding = window.HOLDINGS.find(h => h.sym === sym);
  const rangePos = ((s.price - s.w52l) / (s.w52h - s.w52l)) * 100;

  // Generate candle data
  const candles = uM2(() => {
    const len = range === "1D" ? 78 : range === "1W" ? 35 : range === "1M" ? 22 : range === "3M" ? 60 : 250;
    const seed = window.symHue(sym);
    let v = s.price * 0.92;
    return Array.from({ length: len }).map((_, i) => {
      const drift = (Math.sin(i * 0.4 + seed) + Math.cos(i * 0.21 + seed * 0.7)) * (s.price * 0.012);
      v += drift + (Math.random() - 0.5) * s.price * 0.008;
      const o = v;
      const c = v + (Math.random() - 0.45) * s.price * 0.012;
      const h = Math.max(o, c) + Math.random() * s.price * 0.006;
      const l = Math.min(o, c) - Math.random() * s.price * 0.006;
      v = c;
      return { o, h, l, c };
    });
  }, [sym, range]);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <button className="btn sm" onClick={onBack}>← Markets</button>
        <span className="dim" style={{ fontSize: 12 }}>/ {s.sector} / {s.sym}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16, marginBottom: 16 }}>
        <div className="card">
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ transform: "scale(1.6)", transformOrigin: "left center" }}><SymDot sym={s.sym}/></div>
              <div style={{ marginLeft: 14 }}>
                <div className="sora" style={{ fontSize: 20, fontWeight: 600 }}>{s.name}</div>
                <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 4 }}>
                  <span className="chip mono">{s.sym}</span>
                  <span className="chip">{s.ex}</span>
                  <span className="chip">{s.sector}</span>
                </div>
              </div>
            </div>
            <button className="icon-btn" onClick={() => toggleWatch(sym)} style={{ color: inWatch ? "var(--amber)" : "var(--text-secondary)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={inWatch ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6">
                <polygon points="12 2 15 9 22 9.3 17 14 18.5 21 12 17.3 5.5 21 7 14 2 9.3 9 9 12 2"/>
              </svg>
            </button>
          </div>

          <div style={{ marginTop: 18, display: "flex", alignItems: "baseline", gap: 14 }}>
            <span className="mono" style={{ fontSize: 36, fontWeight: 600, letterSpacing: "-0.02em" }}>{window.fmtINR(s.price)}</span>
            <ChangeChip pct={s.chgPct} abs={s.chg} mono/>
            <span className="dim mono" style={{ fontSize: 12 }}>· last 14:32 IST</span>
          </div>

          <div style={{ marginTop: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
              <span className="dim">52W LOW · {window.fmtINR(s.w52l)}</span>
              <span className="dim">52W HIGH · {window.fmtINR(s.w52h)}</span>
            </div>
            <div className="range-bar">
              <div className="range-fill" style={{ left: 0, right: 0 }}/>
              <div className="range-marker" style={{ left: rangePos + "%" }}/>
            </div>
            <div style={{ textAlign: "center", fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
              <span className="mono" style={{ color: "var(--text-primary)" }}>{rangePos.toFixed(0)}%</span> of 52W range
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 22, marginBottom: 10 }}>
            <div className="card-title">Price chart</div>
            <div className="segment">
              {["1D", "1W", "1M", "3M", "1Y"].map(r => (
                <button key={r} className={range === r ? "active" : ""} onClick={() => setRange(r)}>{r}</button>
              ))}
            </div>
          </div>

          <Candlestick candles={candles} h={260}/>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="card">
            <div className="card-sub" style={{ marginBottom: 10 }}>Trade</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
              <button className="btn primary" onClick={() => openOrder({ sym, side: "BUY" })}>BUY</button>
              <button className="btn danger" onClick={() => openOrder({ sym, side: "SELL" })}>SELL</button>
            </div>
            <button className="btn" style={{ width: "100%" }} onClick={() => openAlert(sym)}>{I.bell} Set price alert</button>
            {holding && (
              <div style={{ marginTop: 14, padding: 12, borderRadius: 8, background: "var(--bg-base)", border: "1px solid var(--border)" }}>
                <div className="card-sub" style={{ marginBottom: 6 }}>Your position</div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span className="muted" style={{ fontSize: 12 }}>Quantity</span>
                  <span className="mono">{holding.qty} shares</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span className="muted" style={{ fontSize: 12 }}>Avg buy</span>
                  <span className="mono">{window.fmtINR(holding.avg)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span className="muted" style={{ fontSize: 12 }}>Unrealized P&L</span>
                  <span className={"mono " + ((s.price - holding.avg) >= 0 ? "up" : "down")}>
                    {(s.price - holding.avg) >= 0 ? "+" : "−"}{window.fmtINR(Math.abs((s.price - holding.avg) * holding.qty))}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <div className="card-sub" style={{ marginBottom: 12 }}>Key statistics</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Stat label="Day High" v={window.fmtINR(s.dh)}/>
              <Stat label="Day Low" v={window.fmtINR(s.dl)}/>
              <Stat label="Volume" v={s.vol}/>
              <Stat label="Market Cap" v={s.mcap}/>
              <Stat label="P/E Ratio" v={s.pe.toFixed(1)}/>
              <Stat label="Cap" v={s.cap}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Stat = ({ label, v }) => (
  <div>
    <div className="card-sub" style={{ marginBottom: 3 }}>{label}</div>
    <div className="mono" style={{ fontSize: 14, fontWeight: 600 }}>{v}</div>
  </div>
);

// Candlestick chart
function Candlestick({ candles, h = 260 }) {
  const w = 720;
  const padL = 50, padR = 14, padT = 10, padB = 24;
  const allLows = candles.map(c => c.l), allHighs = candles.map(c => c.h);
  const min = Math.min(...allLows), max = Math.max(...allHighs);
  const range = max - min;
  const cw = (w - padL - padR) / candles.length;
  const bw = Math.max(2, cw * 0.6);
  const y = (v) => padT + (1 - (v - min) / range) * (h - padT - padB);
  const ticks = 5;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} style={{ display: "block" }}>
      {Array.from({ length: ticks }).map((_, i) => {
        const v = min + (range * i) / (ticks - 1);
        const yy = y(v);
        return (
          <g key={i}>
            <line x1={padL} y1={yy} x2={w - padR} y2={yy} stroke="var(--border)" strokeDasharray="2 4"/>
            <text x={padL - 6} y={yy + 3} fill="var(--text-muted)" fontSize="10" textAnchor="end" fontFamily="JetBrains Mono">{v.toFixed(0)}</text>
          </g>
        );
      })}
      {candles.map((c, i) => {
        const x = padL + i * cw + cw / 2;
        const up = c.c >= c.o;
        const color = up ? "var(--accent)" : "var(--danger)";
        const yo = y(c.o), yc = y(c.c);
        return (
          <g key={i}>
            <line x1={x} y1={y(c.h)} x2={x} y2={y(c.l)} stroke={color} strokeWidth="1"/>
            <rect x={x - bw / 2} y={Math.min(yo, yc)} width={bw} height={Math.max(1, Math.abs(yc - yo))} fill={color} fillOpacity={up ? 0.8 : 0.9}/>
          </g>
        );
      })}
    </svg>
  );
}

window.Markets = Markets;
window.StockDetail = StockDetail;
