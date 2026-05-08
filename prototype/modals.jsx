/* global React, SymDot, ChangeChip, I */
const { useState: uS6, useMemo: uM6 } = React;

// =================== ORDER MODAL ===================
function OrderModal({ ctx, onClose, onPlace }) {
  const stock = window.STOCKS.find(s => s.sym === ctx.sym);
  const holding = window.HOLDINGS.find(h => h.sym === ctx.sym);
  const [side, setSide] = uS6(ctx.side || "BUY");
  const [type, setType] = uS6("MARKET");
  const [qty, setQty] = uS6(side === "BUY" ? 5 : (holding ? Math.min(2, holding.qty) : 1));
  const [limitPrice, setLimitPrice] = uS6(stock.price);
  const [step, setStep] = uS6(1);
  const [showJournal, setShowJournal] = uS6(false);
  const [entryNote, setEntryNote] = uS6("");
  const [thesis, setThesis] = uS6("");

  const price = type === "LIMIT" ? Number(limitPrice) || stock.price : stock.price;
  const gross = qty * price;
  const brokerage = 20;
  const stt = gross * 0.001;
  const exch = gross * 0.0000335;
  const sebi = gross * (10 / 1e7);
  const gst = (brokerage + exch) * 0.18;
  const stamp = side === "BUY" ? gross * 0.00015 : 0;
  const totalCharges = brokerage + stt + exch + sebi + gst + stamp;
  const net = side === "BUY" ? gross + totalCharges : gross - totalCharges;
  const insufficient = side === "BUY" && net > window.USER.cash;
  const overSell = side === "SELL" && holding && qty > holding.qty;
  const noHolding = side === "SELL" && !holding;
  const qtyInvalid = !Number.isInteger(qty) || qty <= 0;

  const estPnl = side === "SELL" && holding ? (price - holding.avg) * qty - totalCharges : 0;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ width: 520 }}>
        <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <SymDot sym={stock.sym}/>
            <div>
              <div className="sora" style={{ fontWeight: 600, fontSize: 15 }}>{stock.sym}</div>
              <div className="dim" style={{ fontSize: 11 }}>{stock.name}</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ textAlign: "right" }}>
              <div className="mono" style={{ fontSize: 16, fontWeight: 600 }}>{window.fmtINR(stock.price)}</div>
              <div className={"mono " + (stock.chgPct >= 0 ? "up" : "down")} style={{ fontSize: 11 }}>
                {stock.chgPct >= 0 ? "▲" : "▼"} {Math.abs(stock.chgPct).toFixed(2)}%
              </div>
            </div>
            <button className="icon-btn" onClick={onClose}>{I.x}</button>
          </div>
        </div>

        {step === 1 && (
          <div style={{ padding: 22 }}>
            {/* Side */}
            <div className="segment" style={{ width: "100%", padding: 4 }}>
              <button onClick={() => setSide("BUY")} style={{ flex: 1, fontSize: 13, padding: "8px 0",
                background: side === "BUY" ? "var(--accent)" : "transparent",
                color: side === "BUY" ? "#021810" : "var(--text-secondary)",
                fontWeight: 600
              }}>BUY</button>
              <button onClick={() => setSide("SELL")} style={{ flex: 1, fontSize: 13, padding: "8px 0",
                background: side === "SELL" ? "var(--danger)" : "transparent",
                color: side === "SELL" ? "#1a0606" : "var(--text-secondary)",
                fontWeight: 600
              }}>SELL</button>
            </div>

            {/* Type */}
            <div style={{ marginTop: 16 }}>
              <div className="field-label">Order type</div>
              <div className="segment">
                <button className={type === "MARKET" ? "active" : ""} onClick={() => setType("MARKET")}>Market</button>
                <button className={type === "LIMIT" ? "active" : ""} onClick={() => setType("LIMIT")}>Limit</button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: type === "LIMIT" ? "1fr 1fr" : "1fr", gap: 12, marginTop: 14 }}>
              <div>
                <div className="field-label">Quantity (shares)</div>
                <input className="input mono" type="number" value={qty} onChange={e => setQty(parseInt(e.target.value) || 0)} min="1" step="1"/>
                {side === "BUY" && <div className="dim" style={{ fontSize: 11, marginTop: 6 }}>Available cash · {window.fmtINR(window.USER.cash)}</div>}
                {side === "SELL" && holding && <div className="dim" style={{ fontSize: 11, marginTop: 6 }}>You hold · <span className="mono">{holding.qty}</span> shares @ avg ₹{window.fmt(holding.avg)}</div>}
                {side === "SELL" && noHolding && <div className="down" style={{ fontSize: 11, marginTop: 6 }}>You don't hold this stock</div>}
                {overSell && <div className="down" style={{ fontSize: 11, marginTop: 4 }}>You only hold {holding.qty} shares</div>}
              </div>
              {type === "LIMIT" && (
                <div>
                  <div className="field-label">Limit price (₹)</div>
                  <input className="input mono" type="number" step="0.05" value={limitPrice} onChange={e => setLimitPrice(e.target.value)}/>
                  <div className="dim" style={{ fontSize: 11, marginTop: 6 }}>LTP · ₹{window.fmt(stock.price)}</div>
                </div>
              )}
            </div>

            {/* Summary */}
            <div style={{ marginTop: 18, padding: 14, background: "var(--bg-base)", borderRadius: 8, border: "1px solid var(--border)" }}>
              <div className="card-sub" style={{ marginBottom: 10 }}>Order summary</div>
              <Row label="Estimated price" v={window.fmtINR(price)}/>
              <Row label={`Gross ${side === "BUY" ? "cost" : "proceeds"}`} v={window.fmtINR(gross)} bold/>
              <details style={{ marginTop: 10, paddingTop: 10, borderTop: "1px dashed var(--border)" }}>
                <summary style={{ cursor: "pointer", fontSize: 11.5, color: "var(--text-muted)", listStyle: "none", display: "flex", justifyContent: "space-between" }}>
                  <span>Charges breakdown</span>
                  <span className="mono">{window.fmtINR(totalCharges)}</span>
                </summary>
                <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4, fontSize: 11 }}>
                  <Row sm label="Brokerage" v={`₹${brokerage.toFixed(2)}`}/>
                  <Row sm label="STT (0.1%)" v={`₹${stt.toFixed(2)}`}/>
                  <Row sm label="Exchange (0.00335%)" v={`₹${exch.toFixed(4)}`}/>
                  <Row sm label="SEBI" v={`₹${sebi.toFixed(4)}`}/>
                  <Row sm label="GST (18%)" v={`₹${gst.toFixed(2)}`}/>
                  {side === "BUY" && <Row sm label="Stamp duty (0.015%)" v={`₹${stamp.toFixed(2)}`}/>}
                </div>
              </details>
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--border)" }}>
                <Row label={side === "BUY" ? "Net to debit" : "Net to credit"} v={window.fmtINR(net)} accent/>
                {side === "SELL" && holding && (
                  <Row label="Estimated P&L" v={(estPnl >= 0 ? "+" : "−") + window.fmtINR(Math.abs(estPnl))} cls={estPnl >= 0 ? "up" : "down"}/>
                )}
              </div>
            </div>

            {insufficient && (
              <div style={{ marginTop: 12, padding: 10, background: "var(--danger-soft)", border: "1px solid rgba(255,77,79,0.3)", borderRadius: 7, fontSize: 12, color: "var(--danger)" }}>
                Insufficient balance. You need {window.fmtINR(net - window.USER.cash)} more.
              </div>
            )}

            {/* Journal toggle */}
            <div style={{ marginTop: 14, padding: 12, background: "var(--bg-base)", borderRadius: 7, border: "1px solid var(--border)" }}>
              <div onClick={() => setShowJournal(!showJournal)} style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 500 }}>📓 Add trade note (optional)</div>
                  <div className="dim" style={{ fontSize: 11, marginTop: 2 }}>Record your reasoning for the AI debrief later</div>
                </div>
                <span className="dim mono" style={{ fontSize: 14 }}>{showJournal ? "−" : "+"}</span>
              </div>
              {showJournal && (
                <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
                  <textarea className="textarea" placeholder="Why are you placing this trade?" maxLength="500" value={entryNote} onChange={e => setEntryNote(e.target.value)} rows={2}/>
                  <textarea className="textarea" placeholder="What's your prediction? (e.g. expecting +8% in 4 weeks)" maxLength="300" value={thesis} onChange={e => setThesis(e.target.value)} rows={2}/>
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
              <button className="btn" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
              <button
                className={"btn " + (side === "BUY" ? "primary" : "danger")}
                disabled={qtyInvalid || insufficient || overSell || noHolding}
                onClick={() => setStep(2)}
                style={{ flex: 2 }}
              >Review {side} order</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ padding: 22 }}>
            <div className="card-sub" style={{ marginBottom: 12 }}>Confirm your order</div>
            <div style={{ padding: 16, background: "var(--bg-base)", borderRadius: 8, border: "1px solid var(--border)", marginBottom: 14 }}>
              <Row label="Action" v={<span className={"chip " + (side === "BUY" ? "up" : "down")}>{side} · {type}</span>}/>
              <Row label="Stock" v={`${stock.sym} · ${stock.ex}`}/>
              <Row label="Quantity" v={`${qty} shares`}/>
              <Row label="Price" v={window.fmtINR(price)}/>
              <Row label="Charges" v={window.fmtINR(totalCharges)}/>
              <div style={{ paddingTop: 8, marginTop: 8, borderTop: "1px solid var(--border)" }}>
                <Row label={side === "BUY" ? "Net debit" : "Net credit"} v={window.fmtINR(net)} accent bold/>
              </div>
            </div>
            <div className="dim" style={{ fontSize: 11.5, lineHeight: 1.5, marginBottom: 14 }}>
              Paper trade · No real money involved. Order will execute at next market tick if MARKET, or when limit is reached if LIMIT.
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn" onClick={() => setStep(1)} style={{ flex: 1 }}>Back</button>
              <button className={"btn " + (side === "BUY" ? "primary" : "danger")} style={{ flex: 2 }}
                onClick={() => onPlace({ sym: stock.sym, side, type, qty, price, net, totalCharges, journal: showJournal ? { entryNote, thesis } : null })}>
                Confirm {side}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const Row = ({ label, v, bold, cls, accent, sm }) => (
  <div style={{ display: "flex", justifyContent: "space-between", padding: sm ? "1px 0" : "4px 0", fontSize: sm ? 11 : 13 }}>
    <span className={sm ? "dim" : "muted"}>{label}</span>
    <span className={"mono " + (cls || "") + (accent ? " " : "")} style={{
      fontWeight: bold ? 600 : 500,
      fontSize: bold ? 14 : (sm ? 11 : 13),
      color: accent ? "var(--text-primary)" : undefined
    }}>{v}</span>
  </div>
);

// =================== ALERT MODAL ===================
function AlertModal({ sym, onClose, onSet }) {
  const stock = window.STOCKS.find(s => s.sym === sym);
  const [direction, setDirection] = uS6("ABOVE");
  const [target, setTarget] = uS6((stock.price * 1.05).toFixed(2));
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ width: 440 }}>
        <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="sora" style={{ fontWeight: 600, fontSize: 15 }}>Set price alert</div>
            <div className="dim" style={{ fontSize: 11 }}>{stock.sym} · current ₹{window.fmt(stock.price)}</div>
          </div>
          <button className="icon-btn" onClick={onClose}>{I.x}</button>
        </div>
        <div style={{ padding: 22 }}>
          <div className="field-label">Trigger when price goes</div>
          <div className="segment" style={{ width: "100%", marginBottom: 14 }}>
            <button className={direction === "ABOVE" ? "active" : ""} onClick={() => setDirection("ABOVE")} style={{ flex: 1 }}>▲ Above</button>
            <button className={direction === "BELOW" ? "active" : ""} onClick={() => setDirection("BELOW")} style={{ flex: 1 }}>▼ Below</button>
          </div>
          <div className="field-label">Target price (₹)</div>
          <input className="input mono" value={target} onChange={e => setTarget(e.target.value)}/>
          <div className="dim" style={{ fontSize: 11, marginTop: 6 }}>
            {direction === "ABOVE"
              ? `+${(((target - stock.price) / stock.price) * 100).toFixed(2)}% from current`
              : `${(((target - stock.price) / stock.price) * 100).toFixed(2)}% from current`}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <button className="btn" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
            <button className="btn primary" style={{ flex: 2 }} onClick={() => onSet({ sym, direction, target })}>Set alert</button>
          </div>
        </div>
      </div>
    </div>
  );
}

window.OrderModal = OrderModal;
window.AlertModal = AlertModal;
