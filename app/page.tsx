import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatINR, formatPercent } from '@/lib/utils'

export default function Home() {
  return (
    <main className="min-h-screen bg-bg-base p-8">
      <div className="max-w-2xl mx-auto space-y-6">

        <div>
          <h1 className="font-display text-3xl font-bold text-text-primary">
            TradeFlow India
          </h1>
          <p className="text-text-secondary mt-2">
            Setup verification — Step 1 complete
          </p>
        </div>

        <Card className="bg-bg-surface border-border-custom">
          <CardHeader>
            <CardTitle className="font-display text-text-primary">
              Design System Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Button className="bg-accent text-bg-base hover:bg-accent/90">
                BUY
              </Button>
              <Button variant="destructive">
                SELL
              </Button>
              <Button variant="outline" className="border-border-custom text-text-secondary">
                Outline
              </Button>
            </div>
            <div className="flex gap-2">
              <Badge className="bg-accent/10 text-accent">▲ +2.34%</Badge>
              <Badge className="bg-danger/10 text-danger">▼ -1.12%</Badge>
              <Badge className="bg-amber/10 text-amber">PENDING</Badge>
            </div>
            <div className="font-mono text-text-primary text-xl">
              {formatINR(10000)}
            </div>
            <div className="font-mono text-accent">
              {formatPercent(12.45)}
            </div>
            <div className="font-mono text-danger">
              {formatPercent(-3.21)}
            </div>
          </CardContent>
        </Card>

        <p className="text-text-muted text-sm font-mono">
          ✓ Next.js 14 · TypeScript · Tailwind · shadcn/ui · Design System
        </p>
      </div>
    </main>
  )
}
