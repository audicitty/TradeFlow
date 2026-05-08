import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      image?: string | null
      avatar: string
      onboardingComplete: boolean
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    avatar: string
    onboardingComplete?: boolean
  }
}

// JWT lives in @auth/core/jwt — augmenting the source module
declare module "@auth/core/jwt" {
  interface JWT {
    id: string
    avatar: string
    onboardingComplete: boolean
  }
}
