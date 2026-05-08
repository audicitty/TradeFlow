"use client"

import { Suspense, useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password. Please try again.")
        return
      }

      toast.success("Welcome back!")
      router.push(callbackUrl)
      router.refresh()

    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-bg-surface border border-border-custom rounded-xl p-6 space-y-5">
      {error && (
        <div className="bg-danger/10 border border-danger/20 rounded-lg px-4 py-3">
          <p className="text-danger text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-text-secondary text-sm">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
            className="bg-bg-elevated border-border-custom text-text-primary
                       placeholder:text-text-muted focus:border-accent focus:ring-accent/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-text-secondary text-sm">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-bg-elevated border-border-custom text-text-primary
                       placeholder:text-text-muted focus:border-accent focus:ring-accent/20"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading || !email || !password}
          className="w-full bg-accent hover:bg-accent/90 text-bg-base
                     font-semibold h-11 transition-all duration-200"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-base p-4">
      <div className="w-full max-w-md space-y-8">

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 mb-4">
            <span className="font-display font-bold text-accent text-xl">T</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            Welcome back
          </h1>
          <p className="text-text-secondary mt-2 text-sm">
            Sign in to your TradeFlow account
          </p>
        </div>

        <Suspense fallback={
          <div className="bg-bg-surface border border-border-custom rounded-xl p-6 h-48 animate-pulse" />
        }>
          <LoginForm />
        </Suspense>

        <p className="text-center text-text-secondary text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup"
            className="text-accent hover:text-accent/80 font-medium transition-colors">
            Create one free
          </Link>
        </p>

      </div>
    </div>
  )
}
