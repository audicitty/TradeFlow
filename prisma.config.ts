import path from 'node:path'
import { readFileSync } from 'node:fs'
import { defineConfig } from 'prisma/config'

// Prisma CLI doesn't load .env.local — parse it manually
try {
  const envLocal = readFileSync(
    path.join(process.cwd(), '.env.local'),
    'utf8'
  )
  for (const line of envLocal.split('\n')) {
    const m = line.match(/^([^#\s][^=]*)=(.*)$/)
    if (m) {
      const key = m[1].trim()
      const val = m[2].trim().replace(/^["']|["']$/g, '')
      if (!process.env[key]) process.env[key] = val
    }
  }
} catch {}

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  datasource: {
    url: process.env.DIRECT_URL ?? '',
  },
})
