# TradeFlow India — Build Guide
## Brick by Brick Development Reference

> **How to use this file:** Follow each step in order. Do not move to the next step until the current one is fully working and tested. Each step has a clear goal, exact instructions, and a checklist to verify completion.

---

## PROJECT OVERVIEW

**What we're building:** A paper trading platform for the Indian stock market (NSE/BSE). Users get ₹10,000 virtual cash to trade real stocks with real-time prices — zero real money involved.

**Tech Stack:**
- Frontend: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- Backend: Next.js API Routes (serverless)
- Database: Neon PostgreSQL + Prisma ORM
- Auth: NextAuth.js v5 (email/password + Google OAuth)
- Market Data: yahoo-finance2 (npm package, free, no API key)
- AI: OpenRouter API (free models — Gemini 2.0 Flash)
- Charts: Recharts + Lightweight Charts (TradingView)
- State: Zustand
- Animations: Framer Motion
- Toasts: Sonner
- Hosting: Vercel

**Environment Variables needed (collect these before starting):**
```
DATABASE_URL              → from neon.tech
DIRECT_URL                → from neon.tech
NEXTAUTH_SECRET           → generate with: openssl rand -base64 32
NEXTAUTH_URL              → http://localhost:3000 (dev) / your vercel URL (prod)
GOOGLE_CLIENT_ID          → from Google Cloud Console
GOOGLE_CLIENT_SECRET      → from Google Cloud Console
OPENROUTER_API_KEY        → from openrouter.ai (free)
CRON_SECRET               → any random string
```

---

## DESIGN SYSTEM (Apply from Step 6 onwards)

```css
--bg-base: #0A0B0E;
--bg-surface: #111318;
--bg-elevated: #1A1D26;
--border: #222530;
--accent-primary: #00D09C;
--accent-danger: #FF4D4F;
--accent-amber: #F5A623;
--accent-blue: #3B82F6;
--text-primary: #F0F2F5;
--text-secondary: #8B8FA8;
--text-muted: #4A4E6B;
```

**Fonts:**
- Numbers/Prices: `JetBrains Mono`
- UI Labels/Body: `DM Sans`
- Headers: `Sora`

**Rules:**
- Dark mode only — always
- Profit values: `--accent-primary` with `▲` prefix
- Loss values: `--accent-danger` with `▼` prefix
- All monetary values: `Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })`
- All dates: IST timezone using `date-fns-tz` with `Asia/Kolkata`

---

---

# PHASE 1 — FOUNDATION

---

## STEP 1 — Project Setup + All Dependencies

**Goal:** A working Next.js 14 project with all packages installed, TypeScript configured, Tailwind working, and a basic homepage that renders without errors.

### Instructions

**1.1 — Create the project**
```bash
npx create-next-app@14 tradeflow --typescript --tailwind --app --no-src-dir --import-alias "@/*"
cd tradeflow
```

**1.2 — Install all dependencies at once**
```bash
npm install @prisma/client prisma @auth/prisma-adapter next-auth@beta
npm install yahoo-finance2
npm install zustand
npm install recharts
npm install lightweight-charts
npm install framer-motion
npm install sonner
npm install date-fns date-fns-tz
npm install zod
npm install @hookform/resolvers react-hook-form
npm install lucide-react
npm install class-variance-authority clsx tailwind-merge
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-tabs @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-avatar @radix-ui/react-progress @radix-ui/react-tooltip @radix-ui/react-switch
```

**1.3 — Install shadcn/ui**
```bash
npx shadcn-ui@latest init
```
When prompted:
- Style: Default
- Base color: Slate
- CSS variables: Yes

Then add components:
```bash
npx shadcn-ui@latest add button input label card badge tabs table dialog select textarea progress avatar separator tooltip switch
```

**1.4 — Create folder structure**
```
tradeflow/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── markets/
│   │   ├── portfolio/
│   │   ├── journal/
│   │   ├── watchlist/
│   │   ├── challenges/
│   │   ├── leaderboard/
│   │   └── settings/
│   ├── api/
│   │   ├── auth/
│   │   ├── market/
│   │   ├── orders/
│   │   ├── portfolio/
│   │   ├── watchlist/
│   │   ├── alerts/
│   │   ├── ai/
│   │   └── cron/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/          (shadcn components)
│   ├── layout/      (sidebar, topbar, shell)
│   ├── trading/     (order modal, stock card)
│   ├── portfolio/   (holdings table, P&L cards)
│   ├── charts/      (all chart components)
│   ├── journal/     (journal entry, list)
│   ├── gamification/ (badges, challenges, streak)
│   └── ai/          (insight card, debrief card)
├── lib/
│   ├── prisma.ts
│   ├── yahoo-finance.ts
│   ├── openrouter.ts
│   ├── charges.ts
│   ├── market-hours.ts
│   ├── badges.ts
│   └── utils.ts
├── hooks/
│   ├── usePortfolio.ts
│   ├── useStockPrice.ts
│   ├── useMarketStatus.ts
│   ├── useWatchlist.ts
│   └── useOrders.ts
├── store/
│   ├── portfolioStore.ts
│   ├── marketStore.ts
│   └── orderStore.ts
├── types/
│   └── index.ts
└── prisma/
    └── schema.prisma
```

Create all these folders manually or ask the AI to scaffold them.

**1.5 — Create `.env.local` file**
```env
DATABASE_URL="postgresql://placeholder"
DIRECT_URL="postgresql://placeholder"
NEXTAUTH_SECRET="placeholder"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="placeholder"
GOOGLE_CLIENT_SECRET="placeholder"
OPENROUTER_API_KEY="placeholder"
CRON_SECRET="placeholder"
```

**1.6 — Update `globals.css`**
Add the CSS variables from the Design System section above to `:root`. Also import Google Fonts: JetBrains Mono, DM Sans, Sora.

**1.7 — Update `tailwind.config.ts`**
Map Tailwind colors to CSS variables so you can use `bg-base`, `text-primary`, etc. in classNames.

**1.8 — Create `lib/utils.ts`**
```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(num: number, decimals = 2): string {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}
```

### ✅ Step 1 Completion Checklist
- [ ] `npm run dev` starts without errors
- [ ] `http://localhost:3000` renders the default page
- [ ] No TypeScript errors in terminal
- [ ] `globals.css` has all CSS variables
- [ ] All folders created
- [ ] shadcn Button component renders correctly on homepage as a test

---

## STEP 2 — Neon Database + Prisma Schema

**Goal:** Database is created on Neon, Prisma schema is defined, first migration runs successfully, and you can query the DB from your app.

### Instructions

**2.1 — Create Neon database**
1. Go to neon.tech → Sign up free
2. Create new project → name it `tradeflow`
3. Select region: `AWS ap-south-1` (Mumbai — closest to India)
4. Copy the connection strings:
   - `DATABASE_URL` → use the **pooled** connection string
   - `DIRECT_URL` → use the **direct** connection string
5. Update `.env.local` with real values

**2.2 — Initialize Prisma**
```bash
npx prisma init
```

**2.3 — Replace `prisma/schema.prisma` with the full schema**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model User {
  id             String          @id @default(cuid())
  email          String          @unique
  name           String
  avatar         String          @default("avatar_1")
  password       String?
  emailVerified  DateTime?
  createdAt      DateTime        @default(now())
  accounts       Account[]
  sessions       Session[]
  portfolio      Portfolio?
  orders         Order[]
  watchlistItems WatchlistItem[]
  priceAlerts    PriceAlert[]
  journalEntries JournalEntry[]
  badges         UserBadge[]
  streak         Streak?
  dailyInsights  DailyInsight[]
  aiCallCount    AICallCount?
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  @@unique([identifier, token])
}

model Portfolio {
  id              String    @id @default(cuid())
  userId          String    @unique
  cashBalance     Decimal   @default(10000) @db.Decimal(12, 2)
  startingBalance Decimal   @default(10000) @db.Decimal(12, 2)
  createdAt       DateTime  @default(now())
  resetCount      Int       @default(0)
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  holdings        Holding[]
}

model Holding {
  id          String    @id @default(cuid())
  portfolioId String
  symbol      String
  exchange    String
  companyName String
  quantity    Int
  avgBuyPrice Decimal   @db.Decimal(12, 2)
  sector      String
  marketCap   String
  portfolio   Portfolio @relation(fields: [portfolioId], references: [id], onDelete: Cascade)
  @@unique([portfolioId, symbol, exchange])
}

model Order {
  id              String        @id @default(cuid())
  userId          String
  symbol          String
  exchange        String
  companyName     String
  orderType       String
  side            String
  quantity        Int
  limitPrice      Decimal?      @db.Decimal(12, 2)
  executedPrice   Decimal?      @db.Decimal(12, 2)
  status          String        @default("PENDING")
  brokerage       Decimal       @default(0) @db.Decimal(10, 2)
  stt             Decimal       @default(0) @db.Decimal(10, 2)
  exchangeCharges Decimal       @default(0) @db.Decimal(10, 4)
  sebiCharges     Decimal       @default(0) @db.Decimal(10, 4)
  gst             Decimal       @default(0) @db.Decimal(10, 2)
  stampDuty       Decimal       @default(0) @db.Decimal(10, 2)
  totalCharges    Decimal       @default(0) @db.Decimal(10, 2)
  realizedPnl     Decimal?      @db.Decimal(12, 2)
  journalEntryId  String?       @unique
  createdAt       DateTime      @default(now())
  executedAt      DateTime?
  user            User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  journalEntry    JournalEntry? @relation(fields: [journalEntryId], references: [id])
}

model JournalEntry {
  id           String    @id @default(cuid())
  userId       String
  symbol       String
  companyName  String
  entryNote    String?
  exitNote     String?
  thesis       String?
  thesisResult String?
  aiDebrief    String?
  createdAt    DateTime  @default(now())
  closedAt     DateTime?
  order        Order?
  user         User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model WatchlistItem {
  id          String   @id @default(cuid())
  userId      String
  symbol      String
  exchange    String
  companyName String
  addedAt     DateTime @default(now())
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([userId, symbol, exchange])
}

model PriceAlert {
  id          String   @id @default(cuid())
  userId      String
  symbol      String
  exchange    String
  companyName String
  targetPrice Decimal  @db.Decimal(12, 2)
  direction   String
  triggered   Boolean  @default(false)
  createdAt   DateTime @default(now())
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Streak {
  id             String    @id @default(cuid())
  userId         String    @unique
  currentStreak  Int       @default(0)
  longestStreak  Int       @default(0)
  lastActiveDate DateTime?
  user           User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model UserBadge {
  id       String   @id @default(cuid())
  userId   String
  badgeId  String
  earnedAt DateTime @default(now())
  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([userId, badgeId])
}

model DailyInsight {
  id            String   @id @default(cuid())
  userId        String
  insight       String
  generatedDate String
  createdAt     DateTime @default(now())
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([userId, generatedDate])
}

model AICallCount {
  id        String   @id @default(cuid())
  userId    String   @unique
  count     Int      @default(0)
  resetDate String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model EarningsEvent {
  id          String   @id @default(cuid())
  symbol      String
  exchange    String
  companyName String
  reportDate  DateTime
  @@unique([symbol, exchange, reportDate])
}

model PortfolioSnapshot {
  id             String   @id @default(cuid())
  userId         String
  portfolioValue Decimal  @db.Decimal(12, 2)
  cashBalance    Decimal  @db.Decimal(12, 2)
  snapshotDate   String
  createdAt      DateTime @default(now())
  @@unique([userId, snapshotDate])
}
```

**2.4 — Create `lib/prisma.ts` (singleton client)**
```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

**2.5 — Run migration**
```bash
npx prisma migrate dev --name init
```

**2.6 — Verify in Neon dashboard**
Go to neon.tech → your project → Tables. You should see all tables created.

**2.7 — Test the connection**
Create a temporary API route `app/api/test/route.ts`:
```typescript
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const userCount = await prisma.user.count()
  return NextResponse.json({ connected: true, userCount })
}
```
Hit `http://localhost:3000/api/test` — should return `{ connected: true, userCount: 0 }`.

Delete this test route after verifying.

### ✅ Step 2 Completion Checklist
- [ ] Neon project created, Mumbai region
- [ ] `.env.local` has real `DATABASE_URL` and `DIRECT_URL`
- [ ] `npx prisma migrate dev --name init` runs with zero errors
- [ ] All 16 tables visible in Neon dashboard
- [ ] Test API route returns `{ connected: true, userCount: 0 }`
- [ ] `lib/prisma.ts` singleton created

---

## STEP 3 — NextAuth Email/Password Authentication

**Goal:** Users can sign up with email + password, log in, log out. Sessions work. Protected routes redirect to login.

### Instructions

**3.1 — Install bcrypt for password hashing**
```bash
npm install bcryptjs
npm install --save-dev @types/bcryptjs
```

**3.2 — Create `auth.ts` in project root**
```typescript
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    newUser: "/onboarding",
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = z.object({
          email: z.string().email(),
          password: z.string().min(6),
        }).safeParse(credentials)

        if (!parsed.success) return null

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email }
        })

        if (!user || !user.password) return null

        const passwordMatch = await bcrypt.compare(parsed.data.password, user.password)
        if (!passwordMatch) return null

        return user
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    async session({ session, token }) {
      if (token) session.user.id = token.id as string
      return session
    }
  }
})
```

**3.3 — Create `app/api/auth/[...nextauth]/route.ts`**
```typescript
import { handlers } from "@/auth"
export const { GET, POST } = handlers
```

**3.4 — Create signup API route `app/api/auth/signup/route.ts`**
```typescript
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { z } from "zod"

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password, name } = signupSchema.parse(body)

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name }
    })

    return NextResponse.json({ success: true, userId: user.id })
  } catch (error) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 })
  }
}
```

**3.5 — Create Login page `app/(auth)/login/page.tsx`**
Full login form with:
- Email + password inputs
- "Sign In" button → calls `signIn("credentials", { email, password, redirectTo: "/dashboard" })`
- Error message display
- Link to `/signup`
- Apply design system colors

**3.6 — Create Signup page `app/(auth)/signup/page.tsx`**
Full signup form with:
- Name + email + password inputs
- "Create Account" button → POST to `/api/auth/signup` → then `signIn("credentials", ...)`
- Link to `/login`

**3.7 — Create `middleware.ts` in project root**
```typescript
import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAuthPage = req.nextUrl.pathname.startsWith('/login') ||
                     req.nextUrl.pathname.startsWith('/signup')
  const isOnboarding = req.nextUrl.pathname === '/onboarding'

  if (!isLoggedIn && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

**3.8 — Add SessionProvider to `app/layout.tsx`**
Wrap children with NextAuth's SessionProvider.

### ✅ Step 3 Completion Checklist
- [ ] `/signup` page renders, form works, user created in DB
- [ ] `/login` page renders, correct credentials log user in
- [ ] Wrong password shows error message
- [ ] After login, user lands on `/dashboard` (even if it's just a blank page)
- [ ] Going to `/dashboard` without login redirects to `/login`
- [ ] Going to `/login` while logged in redirects to `/dashboard`
- [ ] User record visible in Neon `User` table after signup

---

## STEP 4 — Google OAuth

**Goal:** "Sign in with Google" button works on login and signup pages.

### Instructions

**4.1 — Create Google OAuth credentials**
1. Go to console.cloud.google.com
2. Create new project → name it `tradeflow`
3. APIs & Services → OAuth consent screen → External → fill app name
4. APIs & Services → Credentials → Create OAuth Client ID
5. Application type: Web application
6. Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
7. Copy Client ID and Client Secret to `.env.local`

**4.2 — Add Google provider to `auth.ts`**
```typescript
import Google from "next-auth/providers/google"

// Add inside providers array:
Google({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
})
```

**4.3 — Add Google button to login and signup pages**
```typescript
import { signIn } from "@/auth"

// Button onClick:
await signIn("google", { redirectTo: "/dashboard" })
```

Style: white button, Google logo (use lucide or SVG), "Continue with Google" text.

**4.4 — Handle new Google users**
In the NextAuth callbacks, check if user has a portfolio. If not, redirect to `/onboarding` instead of `/dashboard`:
```typescript
async session({ session, token }) {
  if (token) {
    session.user.id = token.id as string
    // Check if onboarding is complete
    const portfolio = await prisma.portfolio.findUnique({
      where: { userId: token.id as string }
    })
    session.user.onboardingComplete = !!portfolio
  }
  return session
}
```

### ✅ Step 4 Completion Checklist
- [ ] "Continue with Google" button appears on login page
- [ ] Clicking it opens Google OAuth popup/redirect
- [ ] After Google auth, user is created in DB with no password field
- [ ] Account record created in `Account` table
- [ ] Redirects to `/dashboard` (or `/onboarding` if new user)

---

## STEP 5 — Onboarding Screen

**Goal:** New users (both email and Google) land on `/onboarding`, set their display name, pick an avatar, and their Portfolio + Streak + AICallCount records are created in the DB.

### Instructions

**5.1 — Create onboarding page `app/onboarding/page.tsx`**

UI Elements:
- Heading: "Welcome to TradeFlow India"
- Subtext: "You start with ₹10,000 virtual cash. Trade real NSE/BSE stocks, risk-free."
- Name input (pre-filled if from Google)
- Avatar picker: 6 avatar options (use colored initials or simple illustrated SVGs — label them `avatar_1` through `avatar_6`)
- "Start Trading →" button

**5.2 — Create onboarding API route `app/api/onboarding/route.ts`**
```typescript
// POST /api/onboarding
// Body: { name: string, avatar: string }
// Creates: Portfolio, Streak, AICallCount records
// Updates: User.name and User.avatar

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { name, avatar } = await req.json()
  const userId = session.user.id

  // Use Prisma transaction
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { name, avatar }
    }),
    prisma.portfolio.create({
      data: { userId, cashBalance: 10000, startingBalance: 10000 }
    }),
    prisma.streak.create({
      data: { userId }
    }),
    prisma.aICallCount.create({
      data: {
        userId,
        count: 0,
        resetDate: new Date().toISOString().split('T')[0]
      }
    }),
  ])

  return NextResponse.json({ success: true })
}
```

**5.3 — Redirect logic**
After successful onboarding API call → redirect to `/dashboard`.

**5.4 — Protect onboarding**
In middleware: if user is logged in AND has a portfolio AND tries to visit `/onboarding` → redirect to `/dashboard`.

### ✅ Step 5 Completion Checklist
- [ ] New user after signup lands on `/onboarding`
- [ ] Can type their name and select an avatar
- [ ] Clicking "Start Trading" calls the API
- [ ] `Portfolio` record created with `cashBalance = 10000`
- [ ] `Streak` record created for user
- [ ] `AICallCount` record created for user
- [ ] User redirected to `/dashboard`
- [ ] Visiting `/onboarding` again after completion redirects to `/dashboard`

---

---

# PHASE 2 — CORE TRADING

---

## STEP 6 — App Shell (Sidebar + Topbar + Layout)

**Goal:** The main app layout is in place — sidebar navigation, topbar with cash display and market status, and a content area. All navigation links work (even if pages are empty placeholders).

### Instructions

**6.1 — Create `components/layout/Sidebar.tsx`**

Desktop sidebar specs:
- Width: 220px expanded, 64px collapsed (toggle button)
- Background: `--bg-surface`
- Border right: `--border`
- Logo: "T" mark + "TradeFlow" text + "India · Paper" subtext
- Nav sections: "Trading" and "Progress"
- Nav items with icons (use lucide-react):
  - Trading: Dashboard, Markets, Portfolio, Watchlist, Journal
  - Progress: Challenges, Leaderboard, Settings
- Active item: `--accent-primary` left border + slightly lighter background
- User info at bottom: avatar, name, email

**6.2 — Create `components/layout/Topbar.tsx`**

Topbar specs:
- Height: 56px
- Background: `--bg-surface`
- Border bottom: `--border`
- Left: Search bar (decorative for now, will wire up later) with ⌘K hint
- Center: Market status pill — green pulsing dot + "NSE OPEN" or grey + "NSE CLOSED" based on IST time
- Right: Cash chip (shows available cash from portfolio), Bell icon

**6.3 — Create `lib/market-hours.ts`**
```typescript
export function getMarketStatus() {
  const now = new Date()
  const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
  const day = ist.getDay()
  const hours = ist.getHours()
  const minutes = ist.getMinutes()
  const timeInMinutes = hours * 60 + minutes
  const isWeekday = day >= 1 && day <= 5
  const isOpen = isWeekday && timeInMinutes >= 555 && timeInMinutes < 930 // 9:15 to 15:30
  return {
    isOpen,
    currentIST: ist,
    nextEvent: isOpen ? 'Closes at 15:30 IST' : 'Opens at 09:15 IST'
  }
}
```

**6.4 — Create `app/(dashboard)/layout.tsx`**
```typescript
// Wraps all dashboard pages with Sidebar + Topbar
// Main content area scrolls independently
// Sidebar fixed on desktop, hidden on mobile (bottom tab bar instead)
```

**6.5 — Create placeholder pages**
Each of these should just render `<h1>Page Name</h1>` for now:
- `app/(dashboard)/dashboard/page.tsx`
- `app/(dashboard)/markets/page.tsx`
- `app/(dashboard)/portfolio/page.tsx`
- `app/(dashboard)/journal/page.tsx`
- `app/(dashboard)/watchlist/page.tsx`
- `app/(dashboard)/challenges/page.tsx`
- `app/(dashboard)/leaderboard/page.tsx`
- `app/(dashboard)/settings/page.tsx`

**6.6 — Mobile bottom tab bar**
Create `components/layout/MobileTabBar.tsx` — shown only below `768px`:
- 5 tabs: Dashboard, Markets, Portfolio, Journal, More
- Fixed at bottom, same background as sidebar

### ✅ Step 6 Completion Checklist
- [ ] Sidebar renders on desktop with all nav items
- [ ] Clicking each nav item navigates to the correct route
- [ ] Active nav item is visually highlighted
- [ ] Topbar shows market status (OPEN/CLOSED) based on real IST time
- [ ] Mobile bottom tab bar shows on small screens
- [ ] Layout has no horizontal scroll on desktop
- [ ] No console errors

---

## STEP 7 — Dashboard with Real Portfolio Data

**Goal:** Dashboard shows real data from the DB — portfolio value, cash balance, P&L. All numbers come from the database, not mock data.

### Instructions

**7.1 — Create portfolio data API `app/api/portfolio/summary/route.ts`**
```typescript
// GET - returns portfolio summary for authenticated user
// Response:
{
  cashBalance: number,
  holdings: Holding[],  // from DB
  totalInvested: number,  // sum of qty * avgBuyPrice
  portfolioValue: number, // cashBalance (no live prices yet — add in Step 9)
  unrealizedPnl: number,
  realizedPnl: number,   // sum of all Order.realizedPnl
  returnPercent: number
}
```

**7.2 — Create Zustand portfolio store `store/portfolioStore.ts`**
```typescript
import { create } from 'zustand'

interface PortfolioStore {
  cashBalance: number
  holdings: any[]
  totalValue: number
  unrealizedPnl: number
  realizedPnl: number
  returnPercent: number
  isLoading: boolean
  refresh: () => Promise<void>
}

export const usePortfolioStore = create<PortfolioStore>((set) => ({
  cashBalance: 0,
  holdings: [],
  totalValue: 0,
  unrealizedPnl: 0,
  realizedPnl: 0,
  returnPercent: 0,
  isLoading: true,
  refresh: async () => {
    const res = await fetch('/api/portfolio/summary')
    const data = await res.json()
    set({ ...data, isLoading: false })
  }
}))
```

**7.3 — Build Dashboard page `app/(dashboard)/dashboard/page.tsx`**

Components to render (with real data, live prices come in Step 9):

**Portfolio Summary Card (top, full width):**
- Total portfolio value (large, JetBrains Mono, 36px)
- All-time P&L: absolute ₹ + percentage
- Sub-metrics row: Invested | Holdings Value | Unrealized P&L | Realized P&L
- Sparkline placeholder (static for now)

**Cash Balance visible in topbar chip** — pulls from portfolioStore.

**Recent Orders strip** — fetches last 5 orders from `/api/orders?limit=5`

**Streak card** — shows currentStreak from DB (just the number, no animation yet)

**Active Challenges strip** — hardcode challenge names, show 0 progress for now (wire up in Step 28+)

**Earnings this week widget** — hardcode 3 example events for now (wire up in Step 9)

**7.4 — Auto-refresh portfolio data**
On dashboard mount: call `portfolioStore.refresh()`. Set up a 30s interval to re-fetch.

### ✅ Step 7 Completion Checklist
- [ ] Dashboard loads without errors
- [ ] Portfolio value shows `₹10,000.00` for a new user (from DB)
- [ ] Cash balance in topbar matches DB value
- [ ] Realized P&L shows ₹0.00 for new user
- [ ] Recent orders section shows "No orders yet" empty state
- [ ] Streak shows 0 for new user
- [ ] No hardcoded mock numbers anywhere on the page

---

## STEP 8 — Markets Page + Stock Search

**Goal:** Users can search for any NSE stock, see a list of results with live prices fetched from Yahoo Finance.

### Instructions

**8.1 — Create `lib/yahoo-finance.ts`**
```typescript
import yahooFinance from 'yahoo-finance2'

export function getYahooSymbol(symbol: string, exchange: string): string {
  return exchange === 'NSE' ? `${symbol}.NS` : `${symbol}.BO`
}

export async function getQuote(symbol: string, exchange: string) {
  const yahooSymbol = getYahooSymbol(symbol, exchange)
  const quote = await yahooFinance.quote(yahooSymbol)
  return {
    symbol,
    exchange,
    price: quote.regularMarketPrice ?? 0,
    change: quote.regularMarketChange ?? 0,
    changePercent: quote.regularMarketChangePercent ?? 0,
    dayHigh: quote.regularMarketDayHigh ?? 0,
    dayLow: quote.regularMarketDayLow ?? 0,
    volume: quote.regularMarketVolume ?? 0,
    marketCap: quote.marketCap ?? 0,
    peRatio: quote.trailingPE ?? null,
    fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh ?? 0,
    fiftyTwoWeekLow: quote.fiftyTwoWeekLow ?? 0,
  }
}

export async function searchStocks(query: string) {
  const results = await yahooFinance.search(query)
  return results.quotes
    .filter((q: any) => q.exchange === 'NSI' || q.exchange === 'BSE' || q.quoteType === 'EQUITY')
    .slice(0, 10)
    .map((q: any) => ({
      symbol: q.symbol?.replace('.NS', '').replace('.BO', ''),
      exchange: q.exchange === 'BSE' ? 'BSE' : 'NSE',
      companyName: q.shortname ?? q.longname ?? q.symbol,
    }))
}
```

**8.2 — Create market API routes**

`app/api/market/search/route.ts`:
```typescript
// GET /api/market/search?q=reliance
// Returns array of { symbol, exchange, companyName }
```

`app/api/market/quote/route.ts`:
```typescript
// GET /api/market/quote?symbol=RELIANCE&exchange=NSE
// Returns full quote object
```

`app/api/market/status/route.ts`:
```typescript
// GET /api/market/status
// Returns { isOpen: boolean, currentIST: string, nextEvent: string }
```

**8.3 — Build Markets page `app/(dashboard)/markets/page.tsx`**

Components:
- Full-width search bar (autofocus on desktop)
- NSE / BSE toggle pill (default NSE)
- `Trending stocks` section: hardcode 12 popular NSE symbols (RELIANCE, TCS, HDFCBANK, INFY, ICICIBANK, BHARTIARTL, SBIN, LT, WIPRO, ZOMATO, TATAMOTORS, ADANIENT) — fetch their live prices on page load
- Search results list: show when user types 2+ characters
- Each stock row: symbol chip, company name, current price, day change %, color-coded ▲▼

**8.4 — Create `useStockPrice` hook `hooks/useStockPrice.ts`**
```typescript
// Uses SWR to fetch /api/market/quote?symbol=X&exchange=Y
// refreshInterval: market open = 5000ms, market closed = 60000ms
```

**8.5 — Debounce search input**
Use 300ms debounce on the search input before hitting the API. Show loading spinner while fetching.

### ✅ Step 8 Completion Checklist
- [ ] Markets page loads with 12 trending stocks and their live prices
- [ ] Prices show in JetBrains Mono with ▲▼ color coding
- [ ] Search for "Reliance" returns relevant results
- [ ] Search for "TCS" returns results
- [ ] NSE/BSE toggle works
- [ ] Clicking a search result (or trending stock) navigates to that stock's page (even if placeholder)
- [ ] No errors when market is closed (returns last known price)

---

## STEP 9 — Stock Detail Page + Live Price Chart

**Goal:** Each stock has a dedicated page showing live price, metadata, 52-week range, candlestick chart, and Buy/Sell buttons.

### Instructions

**9.1 — Create history API `app/api/market/history/route.ts`**
```typescript
// GET /api/market/history?symbol=RELIANCE&exchange=NSE&range=1M
// Maps range to date:
// 1D = today, interval=5m
// 1W = 7 days ago, interval=1d
// 1M = 30 days ago, interval=1d
// 3M = 90 days ago, interval=1d
// 1Y = 365 days ago, interval=1d
```

**9.2 — Create stock detail page `app/(dashboard)/markets/[exchange]/[symbol]/page.tsx`**

This is a server component that fetches initial data, with client components for live price and chart.

**Price Header (client component, auto-refreshes 5s):**
- Company name (Sora, bold, large)
- Symbol + Exchange badge
- Current price: JetBrains Mono, 32px
- Change ▲/▼ absolute + percentage, color coded

**52-Week Range Bar:**
- Horizontal bar: left = 52W low, right = 52W high
- Marker positioned proportionally showing current price
- Show exact values below: "52W Low: ₹X" and "52W High: ₹Y"

**Stock Metadata Grid (2×3):**
- Market Cap | P/E Ratio | Day High | Day Low | Volume | Sector

**TradingView Lightweight Chart (dynamic import, ssr: false):**
```typescript
// Install: already in package.json from Step 1
// Range tabs: 1D | 1W | 1M | 3M | 1Y
// On tab change: fetch from /api/market/history
// Candlestick chart with dark theme matching design system
// Background: --bg-surface, text: --text-secondary, grid: --border
```

**Action Bar (sticky bottom mobile, inline desktop):**
- BUY button (green) → opens Order Modal with side=BUY pre-filled
- SELL button (red) → opens Order Modal with side=SELL pre-filled
- Watchlist star toggle → POST/DELETE /api/watchlist
- Set Alert button → opens Alert Modal

**9.3 — Update Dashboard** to use real live prices for holdings
Now that `getQuote` works, update the portfolio summary API to fetch current prices for each holding and compute real unrealized P&L.

### ✅ Step 9 Completion Checklist
- [ ] Navigating to `/markets/NSE/RELIANCE` loads the page
- [ ] Live price updates every 5 seconds during market hours
- [ ] 52-week range bar renders with current price marker in correct position
- [ ] Candlestick chart loads with 1M data by default
- [ ] Switching chart range tabs fetches new data and re-renders chart
- [ ] BUY/SELL buttons are visible (modal doesn't need to work yet)
- [ ] Metadata grid shows all 6 fields
- [ ] Dashboard portfolio value now reflects real current prices

---

## STEP 10 — Order Modal UI + Charge Calculator

**Goal:** The Order Modal renders correctly with all fields, and the charge calculator updates live as the user types quantity.

### Instructions

**10.1 — Create `lib/charges.ts`**
```typescript
export function calculateCharges(side: 'BUY' | 'SELL', quantity: number, price: number) {
  const grossTotal = quantity * price
  const brokerage = 20
  const stt = grossTotal * 0.001
  const exchangeCharges = grossTotal * 0.0000335
  const sebiCharges = grossTotal * (10 / 10_000_000)
  const gst = (brokerage + exchangeCharges) * 0.18
  const stampDuty = side === 'BUY' ? grossTotal * 0.00015 : 0
  const totalCharges = brokerage + stt + exchangeCharges + sebiCharges + gst + stampDuty
  return { brokerage, stt, exchangeCharges, sebiCharges, gst, stampDuty, totalCharges, grossTotal }
}
```

**10.2 — Create Order Modal `components/trading/OrderModal.tsx`**

This is a global modal managed by Zustand `orderStore`:

```typescript
// store/orderStore.ts
interface OrderStore {
  isOpen: boolean
  symbol: string | null
  exchange: string | null
  companyName: string | null
  side: 'BUY' | 'SELL'
  openModal: (symbol: string, exchange: string, companyName: string, side?: 'BUY' | 'SELL') => void
  closeModal: () => void
}
```

**Modal UI (two steps):**

**Step 1 — Order Form:**
- Header: company name + symbol chip (read-only)
- Side toggle: BUY (green) | SELL (red) — large segmented control
- Order Type: MARKET | LIMIT — segmented control
- Limit Price input: only shown when LIMIT selected
- Quantity input: integer only
  - Validate with `parseInt`, reject decimals
  - Error: "Only whole shares allowed"
  - For SELL: show "You hold X shares" below input
  - For BUY: show "Available: ₹X,XXX.XX" below input
- Live Charges Summary Card (updates on every keystroke):
  - Estimated Price
  - Gross Total
  - Charges breakdown (Brokerage, STT, Exchange, SEBI, GST, Stamp Duty)
  - Total Charges
  - **Net Total** (large, bold)
  - For SELL: show estimated P&L
  - Insufficient balance warning in red
- Journal Note accordion (collapsed by default):
  - "Why are you placing this trade?" textarea
  - "Your prediction?" input
- "Place Order" button (disabled until valid)

**Step 2 — Confirmation:**
- Read-only summary of all details
- "Confirm Order" button → will wire API in Step 11
- "Back" button → returns to Step 1

**10.3 — Wire modal open/close**
- BUY/SELL buttons on stock detail page → `orderStore.openModal()`
- Holdings table rows → `orderStore.openModal()` with side=SELL
- Global modal rendered in `app/(dashboard)/layout.tsx`

### ✅ Step 10 Completion Checklist
- [ ] Clicking BUY on stock page opens modal with BUY pre-selected
- [ ] Clicking SELL opens modal with SELL pre-selected
- [ ] Entering quantity updates all charge fields in real time
- [ ] Entering decimal quantity shows error message
- [ ] LIMIT order type shows limit price input
- [ ] MARKET order type hides limit price input
- [ ] Insufficient balance warning appears when total > cash
- [ ] Confirmation screen shows all details correctly
- [ ] Modal closes on X button or backdrop click

---

## STEP 11 — Order Execution API

**Goal:** Orders actually execute — cash is deducted, holdings are updated, order is saved to DB.

### Instructions

**11.1 — Create `app/api/orders/place/route.ts`**

Full execution logic wrapped in Prisma transaction:

```typescript
// POST /api/orders/place
// Body: { symbol, exchange, companyName, orderType, side, quantity, limitPrice?, entryNote?, thesis? }

// Validation (Zod):
const orderSchema = z.object({
  symbol: z.string().min(1),
  exchange: z.enum(['NSE', 'BSE']),
  companyName: z.string(),
  orderType: z.enum(['MARKET', 'LIMIT']),
  side: z.enum(['BUY', 'SELL']),
  quantity: z.number().int().positive(),
  limitPrice: z.number().positive().optional(),
  entryNote: z.string().max(500).optional(),
  thesis: z.string().max(300).optional(),
})
```

**MARKET BUY logic:**
1. Fetch current price from yahoo-finance2
2. Calculate charges
3. Check: `cashBalance >= grossTotal + totalCharges` → else 400 error
4. In transaction:
   - Deduct from `portfolio.cashBalance`
   - Upsert `Holding`: if exists → recalculate `avgBuyPrice = ((existingQty × existingAvg) + (newQty × newPrice)) / (existingQty + newQty)`, add quantity. If new → create.
   - Create `Order` with status=EXECUTED, all charge fields
   - If entryNote/thesis → create `JournalEntry`, link to order

**MARKET SELL logic:**
1. Fetch current price
2. Check: holding exists and `holding.quantity >= requestedQuantity` → else 400
3. Calculate charges
4. In transaction:
   - Calculate `realizedPnl = (currentPrice - holding.avgBuyPrice) × quantity - totalCharges`
   - Add `(quantity × currentPrice) - totalCharges` to `portfolio.cashBalance`
   - Reduce `holding.quantity`, delete if reaches 0
   - Create `Order` with status=EXECUTED, realizedPnl
   - If linked journal entry exists → update `exitNote`, set `closedAt`

**LIMIT order logic:**
1. Validate same as market but don't execute
2. Create `Order` with status=PENDING, limitPrice stored
3. Return success with "Order queued" message

**11.2 — Wire "Confirm Order" button in modal**
POST to `/api/orders/place` → on success: close modal, show Sonner toast, call `portfolioStore.refresh()`.

**11.3 — Create `app/api/orders/route.ts`** (order history)
```typescript
// GET /api/orders?limit=20&page=1
// Returns paginated orders for authenticated user
```

### ✅ Step 11 Completion Checklist
- [ ] Buying 1 share of a stock deducts correct amount from cash balance
- [ ] Holding appears in portfolio after buy
- [ ] Buying same stock again updates avgBuyPrice correctly
- [ ] Selling reduces holding quantity
- [ ] Selling all shares of a stock removes the holding
- [ ] Realized P&L is calculated and stored on sell
- [ ] LIMIT order created with PENDING status (not executed)
- [ ] Insufficient balance returns error, cash unchanged
- [ ] Selling more shares than held returns error
- [ ] Sonner toast appears on successful order
- [ ] Portfolio value updates after order

---

## STEP 12 — Holdings Page

**Goal:** Portfolio page shows all current holdings with live prices, P&L, and sorting.

### Instructions

**12.1 — Build Holdings tab in `app/(dashboard)/portfolio/page.tsx`**

**Summary cards row (6 cards):**
- Cash Balance
- Total Invested
- Current Holdings Value
- Unrealized P&L (color coded)
- Realized P&L (color coded)
- Total Return %

**Holdings table:**
| Stock | Exchange | Qty | Avg Buy ₹ | Current ₹ | Invested ₹ | Value ₹ | P&L ₹ | P&L % | Day Change % |

- All monetary columns: JetBrains Mono
- P&L cells: color coded green/red
- Sortable by clicking column headers (client-side)
- Clicking a row navigates to that stock's detail page
- Empty state: "No holdings yet. Start by buying your first stock." with Markets CTA button

**12.2 — Live price refresh**
Holdings table prices update every 5s during market hours using `useStockPrice` hook per row.

### ✅ Step 12 Completion Checklist
- [ ] All holdings show with correct quantities and avg buy prices
- [ ] Current prices are live and update every 5s during market hours
- [ ] P&L calculated correctly: `(currentPrice - avgBuyPrice) × quantity`
- [ ] Sorting by any column works
- [ ] Clicking a row opens that stock's page
- [ ] Empty state shows for new user with no holdings
- [ ] Summary cards show correct totals

---

---

# PHASE 3 — PORTFOLIO ANALYTICS

---

## STEP 13 — Sector & Market Cap Breakdown Charts

**Goal:** Analytics tab shows two donut charts — sector breakdown and market cap breakdown of current holdings.

### Instructions

**13.1 — Create analytics API `app/api/analytics/route.ts`**
Compute server-side from DB holdings:
```typescript
// Returns:
{
  sectorBreakdown: [{ sector: string, value: number, percentage: number }],
  marketCapBreakdown: [{ cap: 'LARGECAP' | 'MIDCAP' | 'SMALLCAP', value: number, percentage: number }],
  // ... more data added in later steps
}
```

**13.2 — Create `components/charts/SectorBreakdown.tsx`** (dynamic import, ssr: false)
- Recharts `PieChart` with `Cell` for each sector
- Custom legend with sector name + %
- Color palette: use distinct colors from design system + generated hues
- Click on a sector → highlights that sector's holdings in a table below the chart

**13.3 — Create `components/charts/MarketCapBreakdown.tsx`** (dynamic import, ssr: false)
- Donut chart: LARGECAP (blue), MIDCAP (amber), SMALLCAP (green)
- Show % and ₹ value in center on hover

**13.4 — Add Analytics tab to portfolio page**
Tab switcher: Holdings | Analytics | History

### ✅ Step 13 Completion Checklist
- [ ] Analytics tab renders without errors
- [ ] Sector donut chart shows correct proportions for your holdings
- [ ] Market cap donut chart shows LARGECAP/MIDCAP/SMALLCAP split
- [ ] Clicking a sector highlights that sector's holdings
- [ ] Empty state when no holdings: "Add holdings to see analytics"

---

## STEP 14 — Daily P&L Chart + Portfolio Snapshots

**Goal:** Area chart shows portfolio value over time. Cron job takes daily snapshots.

### Instructions

**14.1 — Create snapshot cron `app/api/cron/snapshot/route.ts`**
```typescript
// Runs daily at 15:35 IST (weekdays)
// vercel.json: { "crons": [{ "path": "/api/cron/snapshot", "schedule": "5 10 * * 1-5" }] }
// (10:05 UTC = 15:35 IST)

// For each user:
// 1. Fetch all holdings
// 2. Fetch current price for each holding
// 3. Compute total portfolio value = cashBalance + sum(qty × currentPrice)
// 4. Upsert PortfolioSnapshot with today's date (IST)

// Protect with: Authorization: Bearer ${CRON_SECRET}
```

**14.2 — Create `vercel.json`** in project root:
```json
{
  "crons": [
    { "path": "/api/cron/snapshot", "schedule": "5 10 * * 1-5" },
    { "path": "/api/cron/execute-limits", "schedule": "* * * * 1-5" },
    { "path": "/api/cron/check-alerts", "schedule": "* * * * 1-5" }
  ]
}
```

**14.3 — Add snapshots to analytics API**
Return `PortfolioSnapshot` data sorted by date for the chart.

**14.4 — Create `components/charts/DailyPnLChart.tsx`** (dynamic import, ssr: false)
- Recharts `AreaChart`
- X-axis: dates, Y-axis: portfolio value ₹
- Gradient fill: green when above ₹10,000, red when below
- Baseline reference line at ₹10,000
- Tooltip: date + portfolio value + change from start

### ✅ Step 14 Completion Checklist
- [ ] Cron route is protected (returns 401 without CRON_SECRET)
- [ ] Calling `/api/cron/snapshot` manually creates a `PortfolioSnapshot` record
- [ ] Daily P&L area chart renders (may only have 1-2 data points initially)
- [ ] Baseline at ₹10,000 is visible
- [ ] `vercel.json` created with all 3 cron schedules

---

## STEP 15 — Benchmark Comparison Chart

**Goal:** Line chart comparing user returns % vs Nifty 50 % from account creation date.

### Instructions

**15.1 — Add Nifty 50 data to analytics API**
```typescript
// Fetch ^NSEI historical data from account creation date
const niftyData = await yahooFinance.historical('^NSEI', {
  period1: user.createdAt,
  interval: '1d'
})
// Normalize to % return from first data point
```

**15.2 — Create `components/charts/BenchmarkChart.tsx`** (dynamic import, ssr: false)
- Two lines: "My Returns %" and "Nifty 50 %"
- Both start at 0% on account creation date
- Colors: `--accent-primary` (my returns) and `--accent-blue` (Nifty 50)
- Range selector: 1M | 3M | All Time
- Tooltip: date, my return %, Nifty %, outperformance delta

### ✅ Step 15 Completion Checklist
- [ ] Benchmark chart renders with two lines
- [ ] Both lines start at 0%
- [ ] Range selector changes the date range
- [ ] Tooltip shows correct values
- [ ] Chart works even if user has no trades (flat 0% line vs Nifty)

---

## STEP 16 — Drawdown Analysis + Trade Statistics

**Goal:** Drawdown chart and trade statistics grid complete the analytics tab.

### Instructions

**16.1 — Drawdown computation (server-side in analytics API)**
```typescript
// For each snapshot:
// runningPeak = max(all portfolio values up to this date)
// drawdown% = (runningPeak - currentValue) / runningPeak * 100
// Return array of { date, drawdownPercent }
// Also return: maxDrawdown (highest drawdown %), maxDrawdownDate
```

**16.2 — Create `components/charts/DrawdownChart.tsx`** (dynamic import, ssr: false)
- Recharts `LineChart`
- Y-axis inverted (0% at top, negative values below)
- Max drawdown displayed prominently above chart in red

**16.3 — Trade Statistics Grid**
Compute from orders table:
- Win Rate: `(profitable closed orders / total closed orders) × 100`
- Avg Holding Period: mean days between buy and sell per stock
- Total Trades: count of EXECUTED orders
- Best Trade: symbol + highest realizedPnl
- Worst Trade: symbol + lowest realizedPnl
- Total Charges Paid: sum of all `totalCharges`

**16.4 — Order History tab**
Paginated table (20 per page) with filters:
- Date range picker
- Symbol search
- Side filter: All | BUY | SELL
- Status filter: All | EXECUTED | PENDING | REJECTED
- "Export CSV" button (client-side, builds CSV from current data in memory)

### ✅ Step 16 Completion Checklist
- [ ] Drawdown chart renders (flat at 0% for new user)
- [ ] Max drawdown value shown above chart
- [ ] Trade statistics grid shows correct numbers
- [ ] Win rate is 0% for new user, updates after profitable trades
- [ ] Order history table is paginated
- [ ] Filters work independently and in combination
- [ ] CSV export downloads correctly

---

---

# PHASE 4 — JOURNAL

---

## STEP 17 — Journal Entry on Trade Placement

**Goal:** When a user adds a note during order placement, a JournalEntry is created and linked to the order.

### Instructions

This is already partially wired in Step 11. Verify:
- `JournalEntry` created when `entryNote` or `thesis` is provided during order placement
- `Order.journalEntryId` linked to the entry
- Journal entry has `status = OPEN` until position is closed

**17.1 — Update SELL order logic**
When a sell order executes:
1. Find the linked journal entry for the original BUY order for this symbol
2. If found → set `closedAt = now()`
3. Journal entry status becomes "closed" (inferred from `closedAt`)

### ✅ Step 17 Completion Checklist
- [ ] Placing a buy order with a note creates a JournalEntry in DB
- [ ] JournalEntry visible in Neon dashboard
- [ ] Selling the same stock updates the journal entry's `closedAt`

---

## STEP 18 — Journal Page

**Goal:** Full journal page with list view and detail view. Users can view, edit notes, and mark thesis result.

### Instructions

**18.1 — Create journal API routes**

`app/api/journal/route.ts`:
```typescript
// GET /api/journal?filter=all|open|closed&search=symbol
// Returns all journal entries for user
```

`app/api/journal/[id]/route.ts`:
```typescript
// GET - fetch single journal entry with linked order
// PATCH - update entryNote, exitNote, thesis, thesisResult
```

**18.2 — Build Journal page `app/(dashboard)/journal/page.tsx`**

**Two-panel layout (desktop):**
- Left panel (320px): scrollable list of journal entries
- Right panel: detail view of selected entry

**Single-panel layout (mobile):**
- List view by default
- Tap entry → navigates to detail

**Journal List Panel:**
Each card shows:
- Symbol chip + side badge (BUY/SELL color)
- Date of trade
- Thesis preview (first 60 chars truncated)
- Status badge: OPEN (amber) | CLOSED (grey)
- P&L for closed entries (color coded)

Filter pills: All | Open | Closed | Profitable | Loss
Search by symbol input

**Journal Entry Detail Panel:**
Sections in order:
1. Trade header: company name, symbol, exchange, side badge
2. Trade details: "Bought X shares at ₹Y on [date]"
3. Entry Note: editable textarea if position open, read-only if closed
4. Thesis: editable if open, read-only if closed
5. Exit Note: shown only after position closed
6. Thesis Result dropdown (if closed): PLAYED_OUT | PARTIALLY | WRONG | PENDING
7. Actual Outcome: realized P&L ₹ and % (color coded)
8. AI Debrief section (placeholder — wired in Step 24)

### ✅ Step 18 Completion Checklist
- [ ] Journal page shows all entries with correct filter pills
- [ ] Clicking an entry shows detail in right panel (desktop)
- [ ] Entry notes editable for open positions, read-only for closed
- [ ] Thesis result dropdown works for closed positions
- [ ] PATCH API saves changes correctly
- [ ] Empty state: "No journal entries yet. Add a note when placing your next trade."

---

---

# PHASE 5 — AI FEATURES

---

## STEP 19 — OpenRouter Integration + Rate Limiting

**Goal:** OpenRouter client set up, rate limiting enforced (10 calls/user/day).

### Instructions

**19.1 — Create `lib/openrouter.ts`**
```typescript
export async function callAI(systemPrompt: string, userContent: string): Promise<string> {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://tradeflow.in",
      "X-Title": "TradeFlow India"
    },
    body: JSON.stringify({
      model: "google/gemini-2.0-flash-exp:free",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent }
      ],
      max_tokens: 500
    })
  })

  if (!response.ok) throw new Error(`OpenRouter error: ${response.status}`)

  const data = await response.json()
  return data.choices[0]?.message?.content ?? ""
}
```

**19.2 — Create rate limit utility `lib/ai-rate-limit.ts`**
```typescript
// Check AICallCount for user
// If resetDate !== today (IST) → reset count to 0, update resetDate
// If count >= 10 → throw rate limit error
// Else → increment count
// Return: { allowed: boolean, remaining: number }
```

### ✅ Step 19 Completion Checklist
- [ ] `callAI()` function works — test with a simple prompt
- [ ] Rate limiter resets at midnight IST
- [ ] After 10 calls, returns 429 with correct message
- [ ] AICallCount table updates correctly in DB

---

## STEP 20 — Daily Insight Card

**Goal:** Dashboard shows an AI-generated daily insight based on the user's portfolio.

### Instructions

**20.1 — Create `app/api/ai/daily-insight/route.ts`**
```typescript
// 1. Check DailyInsight table for userId + today's IST date
// 2. If found → return cached insight
// 3. Check rate limit
// 4. Build context from portfolio (holdings, sector weights, top mover)
// 5. Call OpenRouter with system prompt below
// 6. Store in DailyInsight table
// 7. Return insight text

const systemPrompt = `You are a concise financial coach for Indian retail investors using a paper trading simulator. Given this portfolio snapshot, write ONE sharp, specific observation in 2-3 sentences. It could be a concentration risk warning, a sector momentum observation, a diversification tip, or a note about a specific holding's performance. Use Indian market context. Be direct. No generic advice. No greetings. No sign-off.`
```

**20.2 — Update Dashboard insight card**
- On mount: fetch from `/api/ai/daily-insight`
- Show skeleton loader while fetching
- Display cached insight with ✦ icon, amber border
- If no holdings → show "Add your first holding to get personalized insights"
- On error → show "Market insights unavailable today" (never show raw error)

### ✅ Step 20 Completion Checklist
- [ ] Insight card shows skeleton while loading
- [ ] AI generates a relevant insight based on actual portfolio
- [ ] Same insight served for rest of day (cached)
- [ ] Next day, new insight generated
- [ ] Error state shows friendly fallback message

---

## STEP 21 — Trade Debrief

**Goal:** After closing a position, user can generate an AI analysis of that trade.

### Instructions

**21.1 — Create `app/api/ai/trade-debrief/route.ts`**
```typescript
// POST { journalEntryId }
// 1. Fetch journal entry + linked order
// 2. Check entry has closedAt (position must be closed)
// 3. If aiDebrief already exists → return cached
// 4. Check rate limit
// 5. Build context (see below)
// 6. Call OpenRouter
// 7. Store in JournalEntry.aiDebrief
// 8. Return debrief text

const systemPrompt = `You are a trading coach reviewing a paper trade made by an Indian retail investor. Analyze this trade and respond in exactly this structure:
✓ What you did right: [1-2 sentences]
✗ What went wrong: [1-2 sentences]
📊 Was the thesis valid: [1 sentence]
🎯 Better entry/exit: [1-2 sentences with specific reasoning]
💡 Key lesson: [1 sentence]
Total response must be under 200 words. Be direct and specific. Use Indian market context where relevant.`
```

**21.2 — Update Journal entry detail**
- If position open: show "Close your position to unlock AI debrief" (greyed out)
- If closed + no debrief: show "Generate AI Debrief" button
- If debrief exists: show in styled card with ✦ icon, amber left border
- Loading state while generating

### ✅ Step 21 Completion Checklist
- [ ] "Generate AI Debrief" button only appears for closed positions
- [ ] Clicking generates a debrief with the correct structure
- [ ] Debrief cached — clicking "Generate" again serves cached version
- [ ] Open positions show the locked state message

---

## STEP 22 — Portfolio Health Score

**Goal:** Analytics tab has an AI portfolio health score with grade, risks, and recommendations.

### Instructions

**22.1 — Create `app/api/ai/portfolio-health/route.ts`**
```typescript
// Returns JSON:
// { score: number, grade: string, risks: string[], recommendations: string[] }
// Cached 24h per user

const systemPrompt = `You are a portfolio risk analyst reviewing an Indian retail investor's paper trading portfolio. Output ONLY valid JSON, no markdown, no explanation:
{
  "score": <integer 0-100>,
  "grade": <"A" | "B" | "C" | "D" | "F">,
  "risks": [<max 3 strings, each under 15 words>],
  "recommendations": [<max 3 strings, each under 15 words>]
}
Score: 90-100=A, 75-89=B, 60-74=C, 40-59=D, 0-39=F`

// Parse JSON safely — if parse fails: return { score: 50, grade: "C", risks: ["Unable to analyze"], recommendations: ["Add more holdings"] }
```

**22.2 — Add health score card to Analytics tab**
- "Analyse Portfolio" button
- Loading animation while generating
- RadialBar gauge (0-100) using Recharts `RadialBarChart`
- Letter grade badge (A=green, B=teal, C=amber, D=orange, F=red)
- Risk chips in red
- Recommendation chips in green

### ✅ Step 22 Completion Checklist
- [ ] Button generates health score on click
- [ ] Score displayed as a gauge (0-100)
- [ ] Grade badge shows correct color
- [ ] Up to 3 risks shown as red chips
- [ ] Up to 3 recommendations shown as green chips
- [ ] Cached for 24h — clicking again serves cached result

---

---

# PHASE 6 — WATCHLIST & ALERTS

---

## STEP 23 — Watchlist

**Goal:** Users can add/remove stocks from watchlist. Watchlist page shows live prices.

### Instructions

**23.1 — Create watchlist API routes**

`app/api/watchlist/route.ts`:
```typescript
// GET → fetch all watchlist items for user
// POST { symbol, exchange, companyName } → add to watchlist
```

`app/api/watchlist/[id]/route.ts`:
```typescript
// DELETE → remove from watchlist
```

**23.2 — Build Watchlist page `app/(dashboard)/watchlist/page.tsx`**

Grid layout (2 cols mobile, 3 tablet, 4 desktop):

Each watchlist card:
- Company name + symbol chip + exchange badge
- Live current price (auto-refreshes 5s during market hours)
- Day change ₹ and % (color-coded ▲▼)
- 52W high/low mini range bar (small version of stock detail bar)
- Remove button (×) top right
- Click card → navigate to stock detail page

"Add Stock" button (top right) → opens search modal → select → adds to watchlist.

**23.3 — Wire watchlist star on stock detail page**
Star filled = in watchlist, outlined = not. Toggle calls POST/DELETE watchlist API.

### ✅ Step 23 Completion Checklist
- [ ] Watchlist page shows all saved stocks
- [ ] Live prices update every 5s during market hours
- [ ] Adding a stock from search modal works
- [ ] Removing a stock (× button) works immediately
- [ ] Star on stock detail page reflects watchlist status
- [ ] Duplicate prevention: can't add same stock twice

---

## STEP 24 — Price Alerts

**Goal:** Users can set price alerts. Cron job checks and triggers them.

### Instructions

**24.1 — Create alerts API**

`app/api/alerts/route.ts`:
```typescript
// GET → fetch all alerts for user
// POST { symbol, exchange, companyName, targetPrice, direction: 'ABOVE'|'BELOW' } → create alert
```

**24.2 — Create alert cron `app/api/cron/check-alerts/route.ts`**
```typescript
// Runs every minute on weekdays
// 1. Fetch all PriceAlert where triggered = false
// 2. Group by symbol to minimize API calls
// 3. For each unique symbol: fetch current price
// 4. Check ABOVE alerts: if price >= targetPrice → trigger
// 5. Check BELOW alerts: if price <= targetPrice → trigger
// 6. On trigger: UPDATE triggered = true
// 7. Store notification for next page load
```

**24.3 — Alert Modal `components/trading/AlertModal.tsx`**
- Target price input
- Direction: ABOVE / BELOW (segmented control)
- "Set Alert" button
- Show existing alert for this stock if one exists

**24.4 — Show alert indicator on watchlist cards**
If an active (untriggered) alert exists for a watchlist stock → show a small chip with the target price.

**24.5 — Show triggered alerts as Sonner toasts**
On dashboard load: check for triggered-but-unnotified alerts → show toasts.

### ✅ Step 24 Completion Checklist
- [ ] Can set an alert from stock detail page
- [ ] Alert appears in watchlist card
- [ ] Cron route protected with CRON_SECRET
- [ ] Manually calling cron checks alerts correctly
- [ ] Triggered alerts marked in DB

---

---

# PHASE 7 — GAMIFICATION

---

## STEP 25 — Streak System

**Goal:** Daily login streak tracked and displayed.

### Instructions

**25.1 — Create streak update logic `lib/streak.ts`**
```typescript
export async function updateStreak(userId: string) {
  const today = getTodayIST() // YYYY-MM-DD
  const streak = await prisma.streak.findUnique({ where: { userId } })
  if (!streak) return

  const lastActive = streak.lastActiveDate?.toISOString().split('T')[0]
  if (lastActive === today) return // already counted

  const yesterday = getYesterdayIST()
  let newStreak: number

  if (lastActive === yesterday) {
    newStreak = streak.currentStreak + 1
  } else {
    newStreak = 1
  }

  await prisma.streak.update({
    where: { userId },
    data: {
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, streak.longestStreak),
      lastActiveDate: new Date()
    }
  })
}
```

**25.2 — Call `updateStreak` on dashboard page load**
Add to the dashboard data-fetching server component or a dedicated API route called on mount.

**25.3 — Add Framer Motion flame animation to streak card**
Pulsing flame icon + streak number in JetBrains Mono. Add subtle scale animation.

### ✅ Step 25 Completion Checklist
- [ ] First visit sets streak to 1
- [ ] Visiting again same day doesn't increment
- [ ] Visiting next day increments to 2
- [ ] Missing a day resets streak to 1
- [ ] Longest streak preserved even after reset
- [ ] Flame animation renders on dashboard

---

## STEP 26 — Badge System

**Goal:** Badges awarded automatically based on trading activity.

### Instructions

**26.1 — Create `lib/badges.ts`**
```typescript
// Badge definitions:
export const BADGES = {
  first_trade: { name: "First Trade", icon: "🏆", condition: "Place your first order" },
  first_profit: { name: "First Profit", icon: "💰", condition: "Close a profitable position" },
  streak_7: { name: "Week Warrior", icon: "🔥", condition: "7-day login streak" },
  streak_30: { name: "Monthly Master", icon: "🌟", condition: "30-day login streak" },
  diversified: { name: "Diversified", icon: "🌐", condition: "Hold stocks from 4+ sectors" },
  beat_nifty: { name: "Market Beater", icon: "📈", condition: "Beat Nifty 50 MTD" },
  big_winner: { name: "Big Winner", icon: "🚀", condition: "Single trade profit > ₹500" },
  comeback: { name: "Comeback Kid", icon: "🦅", condition: "Recover from 10%+ drawdown" },
  journal_master: { name: "The Analyst", icon: "📓", condition: "Journal notes on 5+ trades" },
  profitable_fortnight: { name: "Iron Hands", icon: "💎", condition: "Profitable for 14 days straight" },
}

// Award logic:
export async function checkAndAwardBadges(userId: string, trigger: 'order' | 'streak' | 'daily') {
  const earned = await prisma.userBadge.findMany({ where: { userId } })
  const earnedIds = earned.map(b => b.badgeId)
  // Check each badge condition, award if not already earned
  // Return array of newly awarded badge IDs
}
```

**26.2 — Call badge check after order execution (Step 11)**
Already integrated in Step 11. Now implement the actual logic.

**26.3 — Show badge toast notification**
When a new badge is awarded → Sonner toast with badge icon + name: "🏆 Badge Unlocked: First Trade!"

### ✅ Step 26 Completion Checklist
- [ ] Placing first order awards `first_trade` badge and shows toast
- [ ] Closing profitable trade awards `first_profit` badge
- [ ] 7-day streak awards `streak_7`
- [ ] Badges visible in DB `UserBadge` table
- [ ] Duplicate awards prevented

---

## STEP 27 — Challenges Page

**Goal:** Challenges page shows active monthly challenges with real progress.

### Instructions

**27.1 — Create challenges API `app/api/challenges/route.ts`**
Compute progress server-side for each challenge:

```typescript
const challenges = [
  {
    id: 'beat_nifty',
    name: 'Beat Nifty 50',
    description: 'Your MTD return must exceed Nifty 50 MTD return',
    // Compare PortfolioSnapshot MTD vs ^NSEI MTD
  },
  {
    id: 'profitable_fortnight',
    name: 'Profitable Fortnight',
    description: 'Keep portfolio above ₹10,000 for 14 consecutive days',
    // Check last 14 PortfolioSnapshots
  },
  {
    id: 'diversified',
    name: 'Diversified Portfolio',
    description: 'Hold stocks from 4+ different sectors simultaneously',
    // Count distinct sectors in Holdings
  },
  {
    id: 'trade_explorer',
    name: 'Trade Explorer',
    description: 'Place 10+ trades this calendar month',
    // Count EXECUTED orders this month
  },
  {
    id: 'journal_master',
    name: 'Journal Master',
    description: 'Add journal notes to 5+ trades this month',
    // Count orders with linked JournalEntry this month
  },
]
```

**27.2 — Build Challenges page `app/(dashboard)/challenges/page.tsx`**

Two sections:

**Active Challenges:**
Each challenge card:
- Name + description
- Progress bar (value / target × 100%)
- Current / target with unit
- "Days remaining in month" counter
- COMPLETED badge if done (green border)

**Badge Collection Grid:**
- All 10 badges displayed in a grid
- Earned: full color, shimmer animation on hover, "Earned [date]" label
- Locked: greyscale, blur effect, lock icon, condition shown on hover

### ✅ Step 27 Completion Checklist
- [ ] All 5 challenges show with real computed progress
- [ ] Progress bars reflect actual data
- [ ] "Trade Explorer" increments as you place trades
- [ ] Badge grid shows earned vs locked state correctly
- [ ] "Days remaining" counts down correctly

---

## STEP 28 — Leaderboard

**Goal:** Leaderboard shows all users ranked by % return. Current user always visible.

### Instructions

**28.1 — Create leaderboard API `app/api/leaderboard/route.ts`**
```typescript
// For each user:
// 1. Fetch portfolio
// 2. Fetch holdings with current prices (from last snapshot to avoid live calls for all users)
// 3. Compute total value = cashBalance + holdings value
// 4. Return % return = (total - 10000) / 10000 * 100
// Sort by % return descending
// Return top 50 + current user's position
```

**28.2 — Build Leaderboard page `app/(dashboard)/leaderboard/page.tsx`**

Table columns: Rank | Avatar | Display Name | % Return | Portfolio Value ₹ | Trades Placed

Styling:
- Rank 1: gold left border (#FFD700)
- Rank 2: silver left border (#C0C0C0)
- Rank 3: bronze left border (#CD7F32)
- Current user's row: blue left border, always visible at bottom if outside top 50

Refresh every 5 minutes (SWR with 300s revalidation).

Footer note: "Rankings based on % returns from ₹10,000 starting balance."

### ✅ Step 28 Completion Checklist
- [ ] Leaderboard shows all registered users
- [ ] Sorted by % return correctly
- [ ] Top 3 have gold/silver/bronze borders
- [ ] Current user's row highlighted in blue
- [ ] Data refreshes every 5 minutes

---

---

# PHASE 8 — POLISH

---

## STEP 29 — Settings Page

**Goal:** Users can edit profile, reset portfolio, manage notifications.

### Instructions

**29.1 — Build Settings page `app/(dashboard)/settings/page.tsx`**

**Profile Section:**
- Avatar (80px) + picker modal (6 presets)
- Name: inline edit (pencil icon → input → save on blur/Enter)
- Email: read-only
- Member since date
- Stats summary: Total Trades | Win Rate | Best Trade | Total Realized P&L | Portfolio Resets

**Portfolio Reset:**
- Current balance card
- "Reset Portfolio" button → confirmation modal
- Modal requires typing "RESET" to enable confirm button
- On confirm: DELETE Holdings, reset cashBalance to 10000, increment resetCount, DELETE PortfolioSnapshots, KEEP badges and streak

**Account:**
- Sign Out button
- Delete Account button (requires typing email to confirm)

**29.2 — Create settings API `app/api/settings/route.ts`**
```typescript
// PATCH → update name, avatar
// POST /api/settings/reset-portfolio → reset logic
// DELETE /api/settings/account → delete user + cascade
```

### ✅ Step 29 Completion Checklist
- [ ] Name editable inline, saves to DB
- [ ] Avatar picker works, selection saves
- [ ] Portfolio reset works: balance back to ₹10,000, holdings gone
- [ ] Badges and streak preserved after reset
- [ ] Sign out works
- [ ] Account deletion removes all user data

---

## STEP 30 — Limit Order Execution Cron

**Goal:** Pending limit orders execute automatically when price is hit.

### Instructions

**30.1 — Create `app/api/cron/execute-limits/route.ts`**
```typescript
// Runs every minute on weekdays
// 1. Fetch all Orders where status = PENDING
// 2. Group by symbol to minimize API calls
// 3. For each symbol: fetch current price
// 4. BUY LIMIT: if currentPrice <= limitPrice → execute
// 5. SELL LIMIT: if currentPrice >= limitPrice → execute
// 6. Execution logic same as MARKET order (Step 11)
// 7. If cash insufficient at execution time → REJECTED
// 8. Show Sonner toast on next page load for executed limits
```

### ✅ Step 30 Completion Checklist
- [ ] Place a LIMIT BUY order below current price → stays PENDING
- [ ] Manually trigger cron → order stays PENDING (price not hit)
- [ ] Place LIMIT BUY at current price → cron executes it
- [ ] Cash deducted correctly after limit execution
- [ ] REJECTED status set when insufficient cash

---

## STEP 31 — Loading Skeletons + Error Boundaries

**Goal:** Every async component has a proper loading skeleton. Every page has an error boundary.

### Instructions

**31.1 — Create skeleton components**
```typescript
// components/ui/Skeleton.tsx — animated pulse blocks
// Use for: portfolio cards, holdings table, charts, watchlist cards, leaderboard
```

**31.2 — Add `loading.tsx` to every route**
Next.js App Router automatically shows `loading.tsx` during server component loading.

**31.3 — Add `error.tsx` to every route**
```typescript
'use client'
export default function Error({ error, reset }) {
  return (
    <div className="error-card">
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

**31.4 — Empty states**
Every list/table needs an empty state with:
- Relevant icon
- Helpful message
- CTA button where applicable

### ✅ Step 31 Completion Checklist
- [ ] Dashboard shows skeleton cards while loading
- [ ] Charts show skeleton while data fetches
- [ ] Holdings table shows skeleton rows
- [ ] Navigating to any page never shows a blank white flash
- [ ] Error state renders with "Try again" button
- [ ] All empty states are implemented

---

## STEP 32 — Mobile Responsive Polish

**Goal:** Every page works correctly on 375px mobile screens.

### Instructions

**32.1 — Audit every page on mobile**
Use browser DevTools to simulate iPhone SE (375px width).

**Check each page:**
- Dashboard: cards stack vertically, sparklines don't overflow
- Markets: search bar full width, stock rows readable
- Stock detail: price header readable, chart full width, action bar sticky at bottom
- Order modal: full-screen on mobile, all fields accessible
- Portfolio: summary cards wrap to 2 columns, table scrollable horizontally
- Analytics: charts full width, tabs scroll horizontally
- Journal: single panel with back navigation
- Watchlist: 2-column grid
- Challenges: full width cards
- Leaderboard: table scrollable

**32.2 — Sticky first column on tables**
All data tables: first column (Stock name) sticky when scrolling horizontally.

**32.3 — Bottom tab bar**
Ensure MobileTabBar is visible on all dashboard pages and has correct active states.

### ✅ Step 32 Completion Checklist
- [ ] All pages usable on 375px without horizontal overflow
- [ ] Order modal is full-screen on mobile
- [ ] Data tables scroll horizontally with sticky first column
- [ ] Bottom tab bar visible and functional on all dashboard pages
- [ ] Text is readable (min 13px) on all mobile views

---

## STEP 33 — Vercel Deployment

**Goal:** App deployed and running on Vercel with all environment variables set.

### Instructions

**33.1 — Prepare for production**
- Remove all `console.log` statements
- Ensure no TypeScript errors: `npx tsc --noEmit`
- Run ESLint: `npm run lint`
- Test build locally: `npm run build`

**33.2 — Deploy to Vercel**
```bash
npm install -g vercel
vercel login
vercel --prod
```

Or connect GitHub repo to Vercel dashboard.

**33.3 — Set environment variables in Vercel**
In Vercel dashboard → Settings → Environment Variables, add all variables from `.env.local`.

Update:
- `NEXTAUTH_URL` → your Vercel deployment URL
- Add Vercel URL to Google OAuth authorized redirect URIs

**33.4 — Verify Vercel Cron**
Vercel dashboard → Your project → Functions → Cron Jobs. Should show 3 cron jobs from `vercel.json`.

**33.5 — Test production**
- Sign up with a new account
- Buy a stock
- Check DB on Neon dashboard
- Verify cron jobs are scheduled

### ✅ Step 33 Completion Checklist
- [ ] `npm run build` succeeds with zero errors
- [ ] App deployed to Vercel URL
- [ ] All env variables set in Vercel dashboard
- [ ] Google OAuth works in production (redirect URI updated)
- [ ] Neon DB accessible from Vercel (check connection pooling)
- [ ] All 3 cron jobs visible in Vercel dashboard
- [ ] Can sign up, buy a stock, and see it in portfolio on production

---

---

# APPENDIX

---

## Common Issues & Fixes

**Prisma connection error in production:**
Make sure `DATABASE_URL` uses the **pooled** connection and `DIRECT_URL` uses the **direct** connection from Neon. Never use the direct URL for `DATABASE_URL` in production.

**Yahoo Finance rate limits:**
Yahoo Finance has undocumented rate limits. If you get errors, add a 100ms delay between batch requests. Don't fetch more than 20 symbols simultaneously.

**NextAuth session type errors:**
Extend the session type in `types/next-auth.d.ts`:
```typescript
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      image?: string
      onboardingComplete?: boolean
    }
  }
}
```

**Chart hydration errors:**
All chart components MUST use `dynamic(() => import(...), { ssr: false })`. Never import Recharts or Lightweight Charts directly in server components.

**IST timezone:**
Always use `date-fns-tz` for IST conversions. Never use `new Date()` directly for business logic — it uses server timezone which may not be IST.

---

## Charges Formula Reference

```typescript
const grossTotal = quantity * price
const brokerage = 20                          // ₹20 flat per order
const stt = grossTotal * 0.001                // 0.1% of gross
const exchangeCharges = grossTotal * 0.0000335 // 0.00335%
const sebiCharges = grossTotal * (10 / 10_000_000)
const gst = (brokerage + exchangeCharges) * 0.18  // 18% on brokerage + exchange
const stampDuty = side === 'BUY' ? grossTotal * 0.00015 : 0  // 0.015% on BUY only
const totalCharges = brokerage + stt + exchangeCharges + sebiCharges + gst + stampDuty
```

---

## OpenRouter Models Reference

| Model ID | Speed | Quality | Use For |
|----------|-------|---------|---------|
| `google/gemini-2.0-flash-exp:free` | Fast | High | Daily insight, health score |
| `meta-llama/llama-3.3-70b-instruct:free` | Medium | High | Trade debrief |
| `mistralai/mistral-7b-instruct:free` | Fast | Medium | Fallback |

---

## Key File Locations Quick Reference

```
lib/prisma.ts          → DB client singleton
lib/yahoo-finance.ts   → Market data wrapper
lib/openrouter.ts      → AI calls wrapper
lib/charges.ts         → Order charges calculation
lib/market-hours.ts    → IST market open/close logic
lib/badges.ts          → Badge award logic
lib/streak.ts          → Streak update logic
store/portfolioStore.ts → Zustand portfolio state
store/marketStore.ts    → Zustand live prices state
store/orderStore.ts     → Zustand order modal state
middleware.ts           → Auth route protection
auth.ts                 → NextAuth configuration
vercel.json             → Cron job schedule
```

---

*Last updated: May 2026 | TradeFlow India Build Guide v1.0*
