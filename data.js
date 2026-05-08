// Mock data for TradeFlow India prototype
window.STOCKS = [
  { sym: "RELIANCE", ex: "NSE", name: "Reliance Industries Ltd", price: 2847.50, chg: 23.40, chgPct: 0.83, dh: 2858.00, dl: 2820.10, vol: "8.2M", mcap: "19.27L Cr", pe: 28.4, sector: "Energy", cap: "LARGECAP", w52h: 3024.90, w52l: 2220.30 },
  { sym: "TCS", ex: "NSE", name: "Tata Consultancy Services", price: 4128.75, chg: -42.15, chgPct: -1.01, dh: 4180.00, dl: 4115.00, vol: "2.1M", mcap: "14.94L Cr", pe: 31.2, sector: "IT", cap: "LARGECAP", w52h: 4592.25, w52l: 3360.00 },
  { sym: "HDFCBANK", ex: "NSE", name: "HDFC Bank Ltd", price: 1687.30, chg: 12.85, chgPct: 0.77, dh: 1692.00, dl: 1672.50, vol: "12.4M", mcap: "12.85L Cr", pe: 19.8, sector: "Banking", cap: "LARGECAP", w52h: 1794.00, w52l: 1363.55 },
  { sym: "INFY", ex: "NSE", name: "Infosys Ltd", price: 1842.60, chg: 8.20, chgPct: 0.45, dh: 1851.30, dl: 1828.00, vol: "5.8M", mcap: "7.65L Cr", pe: 26.7, sector: "IT", cap: "LARGECAP", w52h: 1974.40, w52l: 1351.65 },
  { sym: "ICICIBANK", ex: "NSE", name: "ICICI Bank Ltd", price: 1234.85, chg: 18.65, chgPct: 1.53, dh: 1241.00, dl: 1216.25, vol: "9.7M", mcap: "8.69L Cr", pe: 18.4, sector: "Banking", cap: "LARGECAP", w52h: 1306.50, w52l: 970.20 },
  { sym: "BHARTIARTL", ex: "NSE", name: "Bharti Airtel Ltd", price: 1583.40, chg: 27.55, chgPct: 1.77, dh: 1590.00, dl: 1561.00, vol: "4.3M", mcap: "9.42L Cr", pe: 78.3, sector: "Telecom", cap: "LARGECAP", w52h: 1686.05, w52l: 1098.85 },
  { sym: "SBIN", ex: "NSE", name: "State Bank of India", price: 812.45, chg: -3.20, chgPct: -0.39, dh: 819.50, dl: 808.10, vol: "11.2M", mcap: "7.25L Cr", pe: 9.7, sector: "Banking", cap: "LARGECAP", w52h: 912.00, w52l: 600.70 },
  { sym: "LT", ex: "NSE", name: "Larsen & Toubro Ltd", price: 3624.10, chg: 45.80, chgPct: 1.28, dh: 3635.00, dl: 3580.50, vol: "1.4M", mcap: "4.98L Cr", pe: 36.1, sector: "Infrastructure", cap: "LARGECAP", w52h: 3919.90, w52l: 2965.30 },
  { sym: "HINDUNILVR", ex: "NSE", name: "Hindustan Unilever Ltd", price: 2456.80, chg: -18.40, chgPct: -0.74, dh: 2480.00, dl: 2451.00, vol: "1.8M", mcap: "5.77L Cr", pe: 53.2, sector: "FMCG", cap: "LARGECAP", w52h: 2768.95, w52l: 2172.05 },
  { sym: "ITC", ex: "NSE", name: "ITC Ltd", price: 478.30, chg: 4.15, chgPct: 0.88, dh: 480.00, dl: 473.20, vol: "15.6M", mcap: "5.97L Cr", pe: 28.9, sector: "FMCG", cap: "LARGECAP", w52h: 528.50, w52l: 399.30 },
  { sym: "KOTAKBANK", ex: "NSE", name: "Kotak Mahindra Bank", price: 1789.20, chg: 14.30, chgPct: 0.81, dh: 1798.00, dl: 1772.50, vol: "3.2M", mcap: "3.55L Cr", pe: 21.5, sector: "Banking", cap: "LARGECAP", w52h: 1942.00, w52l: 1543.85 },
  { sym: "AXISBANK", ex: "NSE", name: "Axis Bank Ltd", price: 1162.55, chg: 9.40, chgPct: 0.81, dh: 1168.00, dl: 1148.20, vol: "6.4M", mcap: "3.59L Cr", pe: 13.8, sector: "Banking", cap: "LARGECAP", w52h: 1339.65, w52l: 951.05 },
  { sym: "MARUTI", ex: "NSE", name: "Maruti Suzuki India", price: 11248.60, chg: 142.50, chgPct: 1.28, dh: 11280.00, dl: 11098.00, vol: "0.4M", mcap: "3.54L Cr", pe: 27.6, sector: "Auto", cap: "LARGECAP", w52h: 13680.00, w52l: 9737.65 },
  { sym: "ASIANPAINT", ex: "NSE", name: "Asian Paints Ltd", price: 2384.75, chg: -28.30, chgPct: -1.17, dh: 2418.00, dl: 2378.00, vol: "1.1M", mcap: "2.29L Cr", pe: 47.1, sector: "FMCG", cap: "LARGECAP", w52h: 3422.95, w52l: 2125.00 },
  { sym: "WIPRO", ex: "NSE", name: "Wipro Ltd", price: 542.80, chg: 6.25, chgPct: 1.16, dh: 545.00, dl: 535.10, vol: "8.9M", mcap: "2.84L Cr", pe: 24.3, sector: "IT", cap: "LARGECAP", w52h: 583.70, w52l: 376.05 },
  { sym: "HCLTECH", ex: "NSE", name: "HCL Technologies Ltd", price: 1764.30, chg: 22.40, chgPct: 1.29, dh: 1772.00, dl: 1738.50, vol: "2.3M", mcap: "4.79L Cr", pe: 28.8, sector: "IT", cap: "LARGECAP", w52h: 1881.10, w52l: 1230.40 },
  { sym: "SUNPHARMA", ex: "NSE", name: "Sun Pharmaceutical", price: 1812.40, chg: 16.80, chgPct: 0.94, dh: 1820.00, dl: 1791.00, vol: "1.9M", mcap: "4.35L Cr", pe: 41.6, sector: "Pharma", cap: "LARGECAP", w52h: 1960.35, w52l: 1242.10 },
  { sym: "TATAMOTORS", ex: "NSE", name: "Tata Motors Ltd", price: 786.55, chg: -8.90, chgPct: -1.12, dh: 802.00, dl: 783.10, vol: "14.2M", mcap: "2.89L Cr", pe: 11.4, sector: "Auto", cap: "LARGECAP", w52h: 1179.05, w52l: 696.25 },
  { sym: "TITAN", ex: "NSE", name: "Titan Company Ltd", price: 3568.20, chg: 38.45, chgPct: 1.09, dh: 3582.00, dl: 3520.00, vol: "0.9M", mcap: "3.17L Cr", pe: 88.4, sector: "Consumer", cap: "LARGECAP", w52h: 3886.95, w52l: 3055.65 },
  { sym: "BAJFINANCE", ex: "NSE", name: "Bajaj Finance Ltd", price: 6892.30, chg: 84.20, chgPct: 1.24, dh: 6912.00, dl: 6798.00, vol: "0.8M", mcap: "4.27L Cr", pe: 28.2, sector: "Finance", cap: "LARGECAP", w52h: 7830.00, w52l: 6378.10 },
  { sym: "ADANIENT", ex: "NSE", name: "Adani Enterprises Ltd", price: 2415.80, chg: -34.60, chgPct: -1.41, dh: 2462.00, dl: 2410.00, vol: "3.8M", mcap: "2.79L Cr", pe: 42.7, sector: "Conglomerate", cap: "LARGECAP", w52h: 3743.90, w52l: 2150.10 },
  { sym: "ONGC", ex: "NSE", name: "Oil & Natural Gas Corp", price: 268.40, chg: 3.85, chgPct: 1.45, dh: 270.00, dl: 264.20, vol: "18.4M", mcap: "3.38L Cr", pe: 8.2, sector: "Energy", cap: "LARGECAP", w52h: 345.00, w52l: 213.05 },
  { sym: "NTPC", ex: "NSE", name: "NTPC Ltd", price: 348.65, chg: 4.20, chgPct: 1.22, dh: 350.00, dl: 343.10, vol: "12.8M", mcap: "3.38L Cr", pe: 14.6, sector: "Energy", cap: "LARGECAP", w52h: 448.45, w52l: 304.20 },
  { sym: "POWERGRID", ex: "NSE", name: "Power Grid Corporation", price: 318.50, chg: 2.80, chgPct: 0.89, dh: 320.00, dl: 314.20, vol: "9.1M", mcap: "2.96L Cr", pe: 18.7, sector: "Energy", cap: "LARGECAP", w52h: 366.20, w52l: 268.40 },
  { sym: "ULTRACEMCO", ex: "NSE", name: "UltraTech Cement Ltd", price: 11342.50, chg: 124.80, chgPct: 1.11, dh: 11380.00, dl: 11198.00, vol: "0.3M", mcap: "3.27L Cr", pe: 48.2, sector: "Cement", cap: "LARGECAP", w52h: 12145.00, w52l: 9015.20 },
  { sym: "NESTLEIND", ex: "NSE", name: "Nestle India Ltd", price: 2284.30, chg: -12.60, chgPct: -0.55, dh: 2305.00, dl: 2278.00, vol: "0.6M", mcap: "2.20L Cr", pe: 73.8, sector: "FMCG", cap: "LARGECAP", w52h: 2778.00, w52l: 2145.10 },
  { sym: "DMART", ex: "NSE", name: "Avenue Supermarts Ltd", price: 4128.40, chg: 36.20, chgPct: 0.88, dh: 4145.00, dl: 4080.00, vol: "0.5M", mcap: "2.69L Cr", pe: 96.4, sector: "Retail", cap: "LARGECAP", w52h: 5484.85, w52l: 3536.30 },
  { sym: "ZOMATO", ex: "NSE", name: "Zomato Ltd", price: 268.45, chg: 8.30, chgPct: 3.19, dh: 271.00, dl: 258.10, vol: "42.6M", mcap: "2.36L Cr", pe: 358.2, sector: "Tech", cap: "LARGECAP", w52h: 304.50, w52l: 138.40 },
  { sym: "DIVISLAB", ex: "NSE", name: "Divi's Laboratories", price: 5482.30, chg: 64.80, chgPct: 1.20, dh: 5510.00, dl: 5410.00, vol: "0.4M", mcap: "1.45L Cr", pe: 78.4, sector: "Pharma", cap: "MIDCAP", w52h: 5950.00, w52l: 3380.20 },
  { sym: "TATASTEEL", ex: "NSE", name: "Tata Steel Ltd", price: 154.20, chg: -1.85, chgPct: -1.19, dh: 156.80, dl: 153.40, vol: "28.4M", mcap: "1.93L Cr", pe: 46.7, sector: "Metals", cap: "LARGECAP", w52h: 184.60, w52l: 122.65 },
];

// Holdings (open positions) — sized to fit ₹10,000 starting balance
window.HOLDINGS = [
  { sym: "ITC", qty: 6, avg: 460.00, buyDate: "2025-09-12", note: "Demerger unlock + steady FMCG cash machine. Defensive core." },
  { sym: "ZOMATO", qty: 8, avg: 215.30, buyDate: "2025-07-05", note: "Blinkit dark store density story; 10-min commerce moat." },
  { sym: "TATAMOTORS", qty: 2, avg: 892.50, buyDate: "2025-08-22", note: "JLR margins improving — entered too early before EV softness." },
  { sym: "ONGC", qty: 4, avg: 245.00, buyDate: "2025-11-18", note: "Crude floor at $80 + dividend yield buffer." },
  { sym: "WIPRO", qty: 1, avg: 528.40, buyDate: "2025-10-03", note: "Test position — watching turnaround signs under new CEO." },
];

// Closed/Recent orders for history
window.ORDERS = [
  { id: "ORD-2841", date: "2026-05-06 11:42", sym: "RELIANCE", side: "BUY", type: "MARKET", qty: 2, price: 2842.10, charges: 26.85, status: "EXECUTED", pnl: null },
  { id: "ORD-2840", date: "2026-05-06 10:18", sym: "TATAMOTORS", side: "SELL", type: "LIMIT", qty: 5, price: 800.00, charges: 24.40, status: "PENDING", pnl: null },
  { id: "ORD-2839", date: "2026-05-05 14:55", sym: "TCS", side: "SELL", type: "MARKET", qty: 3, price: 4170.90, charges: 36.40, status: "EXECUTED", pnl: 412.50 },
  { id: "ORD-2838", date: "2026-05-05 09:30", sym: "WIPRO", side: "SELL", type: "MARKET", qty: 20, price: 538.55, charges: 30.20, status: "EXECUTED", pnl: -384.20 },
  { id: "ORD-2837", date: "2026-05-02 12:14", sym: "ZOMATO", side: "BUY", type: "LIMIT", qty: 30, price: 245.00, charges: 27.20, status: "EXECUTED", pnl: null },
  { id: "ORD-2836", date: "2026-04-30 15:20", sym: "BHARTIARTL", side: "SELL", type: "MARKET", qty: 4, price: 1556.40, charges: 31.10, status: "EXECUTED", pnl: 624.80 },
  { id: "ORD-2835", date: "2026-04-28 10:42", sym: "ASIANPAINT", side: "SELL", type: "MARKET", qty: 6, price: 2412.30, charges: 34.50, status: "EXECUTED", pnl: -218.40 },
  { id: "ORD-2834", date: "2026-04-25 11:08", sym: "ITC", side: "BUY", type: "MARKET", qty: 25, price: 462.10, charges: 31.65, status: "EXECUTED", pnl: null },
  { id: "ORD-2833", date: "2026-04-22 13:50", sym: "ITC", side: "SELL", type: "MARKET", qty: 25, price: 471.80, charges: 31.95, status: "EXECUTED", pnl: 210.50 },
  { id: "ORD-2832", date: "2026-04-18 09:48", sym: "SBIN", side: "SELL", type: "MARKET", qty: 10, price: 826.40, charges: 30.80, status: "EXECUTED", pnl: 538.20 },
  { id: "ORD-2831", date: "2026-04-15 14:22", sym: "ADANIENT", side: "SELL", type: "MARKET", qty: 4, price: 2380.50, charges: 30.90, status: "REJECTED", pnl: null },
  { id: "ORD-2830", date: "2026-04-12 10:35", sym: "INFY", side: "BUY", type: "LIMIT", qty: 4, price: 1758.40, charges: 27.40, status: "EXECUTED", pnl: null },
];

// Watchlist
window.WATCHLIST = ["BHARTIARTL", "ICICIBANK", "MARUTI", "BAJFINANCE", "DMART", "SUNPHARMA", "TITAN", "HCLTECH"];

// Journal entries
window.JOURNAL = [
  {
    id: "J-014", sym: "TCS", name: "Tata Consultancy Services", side: "SELL", status: "CLOSED",
    openedAt: "2026-02-14", closedAt: "2026-05-05", days: 80,
    qty: 3, avg: 4032.40, exit: 4170.90, pnl: 412.50, pnlPct: 3.43,
    entryNote: "Buying ahead of Q4 results; expecting BFSI deal pipeline guidance to surprise.",
    thesis: "Q4 commentary will signal end of BFSI vertical slowdown. Target ₹4,250 in 6 weeks.",
    exitNote: "Held through results; guidance was tepid but stock held up. Took 3.4% in 11 weeks — opportunity cost vs Nifty was real.",
    thesisResult: "PARTIALLY",
    aiDebrief: {
      right: "You sized appropriately (3 shares ≈ 14% of portfolio) and stuck to your thesis through volatility — many retail traders panic-sell during result week.",
      wrong: "Holding period stretched to 80 days for a 3.4% return. Capital was tied up while Nifty IT index moved +5.2% — clear opportunity cost.",
      thesis: "Thesis was directionally correct but timing was off. BFSI commentary improved, but ahead of Q1 FY27, not Q4 FY26 as you predicted.",
      better: "Better entry would have been post-results (Apr 12) at ₹3,920 levels after the initial dip. Exit at ₹4,180 on May 5 was close to optimal — within 1% of day high.",
      lesson: "Pre-results entries on IT majors rarely deliver in 6 weeks. Wait for the dip, then size up."
    }
  },
  {
    id: "J-013", sym: "WIPRO", name: "Wipro Ltd", side: "SELL", status: "CLOSED",
    openedAt: "2026-03-10", closedAt: "2026-05-05", days: 56,
    qty: 20, avg: 557.80, exit: 538.55, pnl: -384.20, pnlPct: -3.45,
    entryNote: "Cheapest IT large-cap on EV/EBITDA. Mean reversion play.",
    thesis: "Wipro catches up to peers on margin recovery. Target ₹600 in 8 weeks.",
    exitNote: "Cut after Wipro guided down on Q1 FY27. Margin recovery story didn't materialize.",
    thesisResult: "WRONG",
    aiDebrief: {
      right: "You cut the position cleanly at -3.4% rather than averaging down — discipline that most retail investors lack on losing trades.",
      wrong: "Entry was based on relative valuation alone without checking near-term catalysts. Wipro had no margin trigger before Q1 results.",
      thesis: "Thesis was structurally flawed. Cheap on a multiple ≠ mean reversion catalyst. Wipro's been cheaper than peers for 3 years.",
      better: "Better setup: wait for an actual catalyst — a positive deal announcement or guidance upgrade. Or pair-trade WIPRO long / INFY short to isolate the spread.",
      lesson: "Valuation gaps in IT services can persist for years. Need a catalyst, not just cheapness."
    }
  },
  {
    id: "J-012", sym: "BHARTIARTL", name: "Bharti Airtel Ltd", side: "SELL", status: "CLOSED",
    openedAt: "2025-12-08", closedAt: "2026-04-30", days: 144,
    qty: 4, avg: 1400.20, exit: 1556.40, pnl: 624.80, pnlPct: 11.16,
    entryNote: "Tariff hike pass-through still playing out. ARPU expansion intact.",
    thesis: "ARPU crosses ₹230 by FY27 → 15% upside.",
    exitNote: "Took profits ahead of 5G capex update. ARPU did expand as expected — clean trade.",
    thesisResult: "PLAYED_OUT",
    aiDebrief: {
      right: "Textbook execution. Thesis was specific (ARPU > ₹230), measurable, and you sized 4 shares despite high stock price — 8% portfolio weight, sensible for a high-conviction bet.",
      wrong: "Could have trailed a stop instead of fixed exit — stock ran another 2% after you sold. Minor quibble on a +11% trade.",
      thesis: "Thesis played out almost exactly: Q3 ARPU printed ₹233 in Feb 2026. You correctly identified the delayed impact of the Jul 2024 tariff hike.",
      better: "Entry at ₹1,400 was excellent — bought during the December consolidation. Exit at ₹1,556 captured 80% of the move — leaving the last 20% is fine.",
      lesson: "Telecom plays work on multi-quarter ARPU cycles, not weeks. Patience paid 11%."
    }
  },
  {
    id: "J-011", sym: "ITC", name: "ITC Ltd", side: "BUY", status: "OPEN",
    openedAt: "2025-09-12", closedAt: null, days: null,
    qty: 6, avg: 460.00, exit: null, pnl: null, pnlPct: null,
    entryNote: "Demerger unlock + steady FMCG cash machine. Defensive core.",
    thesis: "Hotels demerger + cigarette volume growth → ₹520 in 9 months.",
    exitNote: null, thesisResult: "PENDING", aiDebrief: null
  },
  {
    id: "J-010", sym: "TATAMOTORS", name: "Tata Motors Ltd", side: "BUY", status: "OPEN",
    openedAt: "2025-08-22", closedAt: null, days: null,
    qty: 2, avg: 892.50, exit: null, pnl: null, pnlPct: null,
    entryNote: "JLR margins improving — entered too early before EV softness.",
    thesis: "EV ramp + JLR free cash flow → ₹1,100 in 12 months.",
    exitNote: null, thesisResult: "PENDING", aiDebrief: null
  },
  {
    id: "J-009", sym: "SBIN", name: "State Bank of India", side: "SELL", status: "CLOSED",
    openedAt: "2025-11-04", closedAt: "2026-04-18", days: 165,
    qty: 10, avg: 772.60, exit: 826.40, pnl: 538.20, pnlPct: 6.96,
    entryNote: "Cheapest PSU bank, ROA expanding.",
    thesis: "Re-rates to 1.5x book as credit costs normalize.",
    exitNote: "Held through Budget. Took profits at 7%.",
    thesisResult: "PLAYED_OUT", aiDebrief: null
  },
];

// Badges
window.BADGES = [
  { id: "first_trade", name: "First Trade", icon: "🏆", desc: "Place your first executed order", earned: true, date: "2025-07-05" },
  { id: "first_profit", name: "First Profit", icon: "💰", desc: "Close a position in profit", earned: true, date: "2025-08-14" },
  { id: "streak_7", name: "Week Warrior", icon: "🔥", desc: "7-day login streak", earned: true, date: "2025-09-12" },
  { id: "streak_30", name: "Monthly Master", icon: "🌟", desc: "30-day login streak", earned: true, date: "2025-12-04" },
  { id: "diversified", name: "Diversified", icon: "🌐", desc: "Hold stocks from 4+ sectors", earned: true, date: "2025-10-22" },
  { id: "beat_nifty", name: "Market Beater", icon: "📈", desc: "Beat Nifty 50 monthly return", earned: true, date: "2026-01-31" },
  { id: "profitable_fortnight", name: "Iron Hands", icon: "💎", desc: "14 days above starting balance", earned: true, date: "2025-11-28" },
  { id: "journal_master", name: "The Analyst", icon: "📓", desc: "Journal 5+ trades in a month", earned: false, date: null },
  { id: "big_winner", name: "Big Winner", icon: "🚀", desc: "Single trade P&L > ₹500", earned: true, date: "2026-04-30" },
  { id: "comeback", name: "Comeback Kid", icon: "🦅", desc: "Recover from 10% drawdown", earned: false, date: null },
];

// Active challenges
window.CHALLENGES = [
  { id: "beat_nifty", name: "Beat Nifty 50", desc: "MTD return must exceed Nifty 50 MTD", progress: 2.84, target: 1.92, unit: "%", current: 2.84, completed: true, daysLeft: 25 },
  { id: "fortnight", name: "Profitable Fortnight", desc: "Stay above ₹10,000 for 14 days", progress: 11, target: 14, unit: "days", current: 11, completed: false, daysLeft: 25 },
  { id: "diversified", name: "Diversified Portfolio", desc: "Hold stocks from 4+ sectors", progress: 5, target: 4, unit: "sectors", current: 5, completed: true, daysLeft: 25 },
  { id: "explorer", name: "Trade Explorer", desc: "Place 10+ trades this month", progress: 4, target: 10, unit: "trades", current: 4, completed: false, daysLeft: 25 },
  { id: "journal", name: "Journal Master", desc: "Add notes to 5+ trades this month", progress: 2, target: 5, unit: "notes", current: 2, completed: false, daysLeft: 25 },
];

window.USER = {
  name: "Aarav Mehta",
  email: "aarav.mehta@gmail.com",
  avatar: "AM",
  joined: "April 2025",
  cash: 2225.00,
  starting: 10000,
  streak: 11,
  bestStreak: 34,
  resets: 1,
};

// Daily AI insight (cached)
window.DAILY_INSIGHT = "Your IT exposure is 18% of holdings, but TCS and INFY both trade above their 5-year P/E averages. Consider whether your conviction matches the rich valuation, especially with INFY's narrow guidance for FY27. Banking exposure (HDFCBANK at 25%) looks healthier — earnings visibility is back.";

// Sparkline data generator
window.spark = (seed, len = 24, vol = 0.02) => {
  const out = [];
  let v = 100 + seed * 7;
  for (let i = 0; i < len; i++) {
    v += (Math.sin(i * 0.7 + seed) + (Math.random() - 0.5) * 2) * vol * 100;
    out.push(v);
  }
  return out;
};

// Compute portfolio metrics from holdings × current prices
window.portfolioMetrics = () => {
  let invested = 0, value = 0;
  for (const h of window.HOLDINGS) {
    const stock = window.STOCKS.find(s => s.sym === h.sym);
    invested += h.qty * h.avg;
    value += h.qty * stock.price;
  }
  const total = value + window.USER.cash;
  const realized = window.ORDERS.filter(o => o.pnl !== null).reduce((a, o) => a + o.pnl, 0);
  const unrealized = value - invested;
  return {
    invested, value, total, realized, unrealized,
    cash: window.USER.cash,
    returnPct: (total - 10000) / 10000 * 100,
    todayChg: 38.40, todayChgPct: 0.37,
  };
};

window.fmt = (n, dec = 2) => {
  if (n === null || n === undefined) return "—";
  return n.toLocaleString("en-IN", { minimumFractionDigits: dec, maximumFractionDigits: dec });
};
window.fmtINR = (n, dec = 2) => "₹" + window.fmt(n, dec);
