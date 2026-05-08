import type { Metadata } from "next"
import "./globals.css"
import { SessionProvider } from "@/components/layout/SessionProvider"
import { Toaster } from "sonner"

export const metadata: Metadata = {
  title: "TradeFlow India — Paper Trading Platform",
  description: "Trade real NSE/BSE stocks with virtual ₹10,000. Zero risk, real market prices.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <SessionProvider>
          {children}
          <Toaster
            position="bottom-right"
            theme="dark"
            toastOptions={{
              style: {
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  )
}
