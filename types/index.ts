export interface StockQuote {
  symbol: string
  exchange: string
  companyName: string
  price: number
  change: number
  changePercent: number
  dayHigh: number
  dayLow: number
  volume: number
  marketCap: number
  peRatio: number | null
  fiftyTwoWeekHigh: number
  fiftyTwoWeekLow: number
}

export interface Holding {
  id: string
  symbol: string
  exchange: string
  companyName: string
  quantity: number
  avgBuyPrice: number
  sector: string
  marketCap: string
}

export interface Order {
  id: string
  symbol: string
  exchange: string
  companyName: string
  orderType: 'MARKET' | 'LIMIT'
  side: 'BUY' | 'SELL'
  quantity: number
  limitPrice?: number
  executedPrice?: number
  status: 'PENDING' | 'EXECUTED' | 'REJECTED'
  totalCharges: number
  realizedPnl?: number
  createdAt: string
  executedAt?: string
}

export interface PortfolioSummary {
  cashBalance: number
  totalInvested: number
  holdingsValue: number
  totalValue: number
  unrealizedPnl: number
  realizedPnl: number
  returnPercent: number
  todayChange: number
  todayChangePercent: number
}
