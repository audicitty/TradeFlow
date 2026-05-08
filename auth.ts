import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { authConfig } from "./auth.config"

const credentialsSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account }) {
      // Explicitly allow all OAuth sign-ins; credentials are handled by authorize()
      if (account?.provider === "google") {
        return !!user.id
      }
      return true
    },
    async jwt({ token, user, account }) {
      // Runs on initial sign-in (credentials or Google)
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id as string },
          include: { portfolio: true },
        })
        return {
          ...token,
          id: user.id as string,
          avatar: dbUser?.avatar ?? "avatar_1",
          onboardingComplete: !!dbUser?.portfolio,
        }
      }

      // Runs on subsequent Google re-authentication to refresh onboarding status
      if (account?.provider === "google") {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
          include: { portfolio: true },
        })
        if (dbUser) {
          return {
            ...token,
            avatar: dbUser.avatar ?? token.avatar ?? "avatar_1",
            onboardingComplete: !!dbUser.portfolio,
          }
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.avatar = token.avatar as string
        session.user.onboardingComplete = token.onboardingComplete as boolean
      }
      return session
    },
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { email, password } = credentialsSchema.parse(credentials)

          const user = await prisma.user.findUnique({
            where: { email },
            include: { portfolio: true },
          })

          if (!user) return null
          if (!user.password) return null

          const passwordMatch = await bcrypt.compare(password, user.password)
          if (!passwordMatch) return null

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            avatar: user.avatar,
            onboardingComplete: !!user.portfolio,
          }
        } catch {
          return null
        }
      },
    }),
  ],
  events: {
    async signIn({ user, account, isNewUser }) {
      // Ensure new Google users get a default avatar (PrismaAdapter sets DB default,
      // but this guarantees the field is explicitly written)
      if (account?.provider === "google" && isNewUser) {
        await prisma.user.update({
          where: { id: user.id as string },
          data: { avatar: "avatar_1" },
        })
      }
    },
  },
  trustHost: true,
})
