/* global React, SymDot, ChangeChip, Sparkline, I */
const { useState: uS4, useMemo: uM4 } = React;

// =================== JOURNAL ===================
function Journal() {
  const [selected, setSelected] = uS4(window.JOURNAL[0].id);
  const [filter, setFilter] = uS4("ALL");
  const [editingNote, setEditingNote] = uS4(null);
  const [noteText, setNoteText] = uS4("");
  const [showDebrief, setShowDebrief] = uS4({});
  const [generating, setGenerating] = uS4(false);
  const [thesisResult, setThesisResult] = uS4({});

  const entries = window.JOURNAL.filter(j => {
    if (filter === "ALL") return true;
    if (filter === "OPEN") return j.status === "OPEN";
    if (filter === "CLOSED") return j.status === "CLOSED";
    if (filter === "PROFIT") return j.status === "CLOSED" && j.pnl > 0;
    if (filter === "LOSS") return j.status === "CLOSED" && j.pnl < 0;
    return true;
  });
  const entry = window.JOURNAL.find(j => j.id === selected) || window.JOURNAL[0];

  const generateDebrief = () => {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setShowDebrief(s => ({ ...s, [entry.id]: true })); }, 1600);
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Trade journal</h1>
          <div className="page-sub">{window.JOURNAL.length} entries · {window.JOURNAL.filter(j => j.aiDebrief).length} AI debriefs generated</div>
        </div>
        <button className="btn">+ New entry</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 16, height: "calc(100vh - 220px)" }}>
        {/* List */}
        <div className="card" style={{ padding: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: 12, borderBottom: "1px solid var(--border)", display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["ALL", "OPEN", "CLOSED", "PROFIT", "LOSS"].map(f => (
              <button key={f} className={"chip " + (filter === f ? (f === "PROFIT" ? "up" : f === "LOSS" ? "down" : "") : "")}
                onClick={() => setFilter(f)} style={{ cursor: "pointer", padding: "4px 10px" }}>
                {f}
              </button>
            ))}
          </div>
          <div style={{ overflowY: "auto", flex: 1 }}>
            {entries.map(j => (
              <div key={j.id} onClick={() => setSelected(j.id)} style={{
                padding: "14px 16px",
                cursor: "pointer",
                borderBottom: "1px solid var(--border)",
                background: selected === j.id ? "var(--bg-elevated)" : "transparent",
                borderLeft: selected === j.id ? "2px solid var(--accent)" : "2px solid transparent",
                transition: "background 0.12s"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <SymDot sym={j.sym}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13.5 }}>{j.sym}</div>
                    <div className="dim mono" style={{ fontSize: 10.5 }}>{j.id} · {j.openedAt}</div>
                  </div>
                  <span className={"chip " + (j.status === "OPEN" ? "amber" : j.pnl >= 0 ? "up" : "down")} style={{ fontSize: 9.5 }}>
                    {j.status === "OPEN" ? "OPEN" : j.pnl >= 0 ? "WIN" : "LOSS"}
                  </span>
                </div>
                <div className="muted" style={{ fontSize: 12, lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                  {j.thesis}
                </div>
                {j.status === "CLOSED" && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                    <span className="dim" style={{ fontSize: 11 }}>{j.days}d held</span>
                    <span className={"mono " + (j.pnl >= 0 ? "up" : "down")} style={{ fontSize: 12, fontWeight: 600 }}>
                      {j.pnl >= 0 ? "+" : "−"}{window.fmtINR(Math.abs(j.pnl))} ({j.pnlPct >= 0 ? "+" : ""}{j.pnlPct.toFixed(2)}%)
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Detail */}
        <div style={{ overflowY: "auto", paddingRight: 4 }}>
          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ transform: "scale(1.4)", transformOrigin: "left center" }}><SymDot sym={entry.sym}/></div>
                <div style={{ marginLeft: 12 }}>
                  <div className="sora" style={{ fontSize: 18, fontWeight: 600 }}>{entry.name}</div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 4 }}>
                    <span className="chip mono">{entry.sym}</span>
                    <span className={"chip " + (entry.side === "BUY" ? "up" : "down")}>{entry.side}</span>
                    <span className={"chip " + (entry.status === "OPEN" ? "amber" : "")}>{entry.status}</span>
                    <span className="dim" style={{ fontSize: 11 }}>{entry.id}</span>
                  </div>
                </div>
              </div>
              {entry.status === "CLOSED" && (
                <div style={{ textAlign: "right" }}>
                  <div className="card-sub" style={{ marginBottom: 4 }}>Realized P&L</div>
                  <div className={"mono " + (entry.pnl >= 0 ? "up" : "down")} style={{ fontSize: 22, fontWeight: 600 }}>
                    {entry.pnl >= 0 ? "+" : "−"}{window.fmtINR(Math.abs(entry.pnl))}
                  </div>
                  <div className={"mono " + (entry.pnl >= 0 ? "up" : "down")} style={{ fontSize: 12 }}>
                    {entry.pnlPct >= 0 ? "+" : ""}{entry.pnlPct.toFixed(2)}% · {entry.days} days
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 18, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
              <Mini2 label="Quantity" v={`${entry.qty} sh`}/>
              <Mini2 label="Avg buy" v={window.fmtINR(entry.avg)}/>
              <Mini2 label={entry.exit ? "Exit price" : "Current"} v={entry.exit ? window.fmtINR(entry.exit) : window.fmtINR(window.STOCKS.find(s => s.sym === entry.sym)?.price || entry.avg)}/>
              <Mini2 label="Opened" v={entry.openedAt}/>
            </div>
          </div>

          {/* Notes */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <NoteCard
              title="Entry note"
              sub="Why did you enter?"
              value={entry.entryNote}
              editable={entry.status === "OPEN"}
              isEditing={editingNote === "entry"}
              onEdit={() => { setEditingNote("entry"); setNoteText(entry.entryNote); }}
              onSave={() => setEditingNote(null)}
              text={noteText} setText={setNoteText}
            />
            <NoteCard
              title="Thesis"
              sub="What did you predict?"
              value={entry.thesis}
              editable={entry.status === "OPEN"}
              isEditing={editingNote === "thesis"}
              onEdit={() => { setEditingNote("thesis"); setNoteText(entry.thesis); }}
              onSave={() => setEditingNote(null)}
              text={noteText} setText={setNoteText}
            />
          </div>

          {entry.status === "CLOSED" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <NoteCard title="Exit note" sub="How did it play out?" value={entry.exitNote}/>
              <div className="card">
                <div className="card-sub" style={{ marginBottom: 8 }}>Thesis result</div>
                <div className="segment" style={{ width: "100%" }}>
                  {["PLAYED_OUT", "PARTIALLY", "WRONG", "PENDING"].map(r => {
                    const v = thesisResult[entry.id] ?? entry.thesisResult;
                    return (
                      <button key={r} className={v === r ? "active" : ""}
                        onClick={() => setThesisResult({ ...thesisResult, [entry.id]: r })}
                        style={{ flex: 1, fontSize: 11 }}>
                        {r === "PLAYED_OUT" ? "✓ Played out" : r === "PARTIALLY" ? "~ Partial" : r === "WRONG" ? "✗ Wrong" : "Pending"}
                      </button>
                    );
                  })}
                </div>
                <div className="dim" style={{ fontSize: 11.5, marginTop: 10 }}>
                  Mark whether your prediction came true. Used to train your future debriefs.
                </div>
              </div>
            </div>
          )}

          {/* AI Debrief */}
          <div className="ai-card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div>
                <div className="ai-label">✦ AI Trade Debrief · Claude</div>
                <div className="dim" style={{ fontSize: 11.5, marginTop: 2 }}>
                  {entry.status === "OPEN" ? "Close the position to unlock debrief" :
                   entry.aiDebrief || showDebrief[entry.id] ? "Generated · cached" :
                   "Get a personalised review of this trade"}
                </div>
              </div>
              {entry.status === "CLOSED" && !entry.aiDebrief && !showDebrief[entry.id] && (
                <button className="btn primary sm" onClick={generateDebrief} disabled={generating}>
                  {generating ? "Analysing trade…" : "Generate debrief"}
                </button>
              )}
            </div>

            {entry.status === "OPEN" && (
              <div style={{ padding: "30px 0", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
                🔒 The AI debrief activates after you sell.
              </div>
            )}

            {generating && (
              <div style={{ padding: "20px 0" }}>
                {["Reading entry note + thesis…", "Cross-checking against price action…", "Computing thesis validity…", "Drafting recommendations…"].map((t, i) => (
                  <div key={i} className="dim mono" style={{ fontSize: 12, marginBottom: 6, opacity: 0.4 + (i * 0.15) }}>{i < 3 ? "✓" : "…"} {t}</div>
                ))}
              </div>
            )}

            {!generating && entry.status === "CLOSED" && (entry.aiDebrief || showDebrief[entry.id]) && entry.aiDebrief && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 4 }}>
                <DebriefRow icon="✓" cls="up" label="What you did right" text={entry.aiDebrief.right}/>
                <DebriefRow icon="✗" cls="down" label="What went wrong" text={entry.aiDebrief.wrong}/>
                <DebriefRow icon="📊" cls="" label="Was the thesis valid" text={entry.aiDebrief.thesis}/>
                <DebriefRow icon="🎯" cls="" label="Better entry/exit" text={entry.aiDebrief.better}/>
                <DebriefRow icon="💡" cls="amber" label="Key lesson" text={entry.aiDebrief.lesson}/>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const Mini2 = ({ label, v }) => (
  <div>
    <div className="card-sub" style={{ marginBottom: 3 }}>{label}</div>
    <div className="mono" style={{ fontSize: 14, fontWeight: 600 }}>{v}</div>
  </div>
);

function NoteCard({ title, sub, value, editable, isEditing, onEdit, onSave, text, setText }) {
  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <div className="card-title">{title}</div>
          <div className="dim" style={{ fontSize: 11, marginTop: 2 }}>{sub}</div>
        </div>
        {editable && !isEditing && (
          <button className="btn sm ghost" onClick={onEdit} style={{ padding: "4px 8px" }}>{I.edit}</button>
        )}
        {isEditing && (
          <button className="btn sm primary" onClick={onSave} style={{ padding: "4px 10px" }}>Save</button>
        )}
      </div>
      {!isEditing && (
        <div style={{ fontSize: 13.5, lineHeight: 1.6, color: value ? "var(--text-primary)" : "var(--text-muted)" }}>
          {value || "Empty — click edit to add."}
        </div>
      )}
      {isEditing && (
        <textarea className="textarea" value={text} onChange={e => setText(e.target.value)} autoFocus rows={4}/>
      )}
    </div>
  );
}

const DebriefRow = ({ icon, label, text, cls }) => (
  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
    <div style={{
      minWidth: 28, height: 28, borderRadius: 7, display: "grid", placeItems: "center",
      fontSize: 13,
      background: cls === "up" ? "var(--accent-soft)" : cls === "down" ? "var(--danger-soft)" : cls === "amber" ? "var(--amber-soft)" : "var(--bg-elevated)",
      color: cls === "up" ? "var(--accent)" : cls === "down" ? "var(--danger)" : cls === "amber" ? "var(--amber)" : "var(--text-secondary)",
      border: "1px solid " + (cls === "up" ? "var(--accent-line)" : cls === "down" ? "rgba(255,77,79,0.32)" : cls === "amber" ? "rgba(245,166,35,0.32)" : "var(--border)")
    }}>{icon}</div>
    <div style={{ flex: 1, paddingTop: 3 }}>
      <div className="card-sub" style={{ marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 13.5, lineHeight: 1.55 }}>{text}</div>
    </div>
  </div>
);

window.Journal = Journal;
