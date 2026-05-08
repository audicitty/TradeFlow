import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const tableChecks = await Promise.all([
      prisma.user.count(),
      prisma.portfolio.count(),
      prisma.holding.count(),
      prisma.order.count(),
      prisma.journalEntry.count(),
      prisma.watchlistItem.count(),
      prisma.streak.count(),
      prisma.userBadge.count(),
    ])

    return NextResponse.json({
      connected: true,
      tables: {
        users: tableChecks[0],
        portfolios: tableChecks[1],
        holdings: tableChecks[2],
        orders: tableChecks[3],
        journalEntries: tableChecks[4],
        watchlistItems: tableChecks[5],
        streaks: tableChecks[6],
        userBadges: tableChecks[7],
      },
      message: 'Database connection successful. All tables accessible.',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Database connection failed.',
      },
      { status: 500 }
    )
  }
}
