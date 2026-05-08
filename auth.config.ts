import type { NextAuthConfig } from "next-auth"

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
    newUser: "/onboarding",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as unknown as { id: string; avatar?: string; onboardingComplete?: boolean }
        return {
          ...token,
          id: u.id,
          avatar: u.avatar ?? "avatar_1",
          onboardingComplete: u.onboardingComplete ?? false,
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
  // providers added in auth.ts; none needed for edge middleware
  providers: [],
}
