"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Step 1: Create account
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to create account")
        return
      }

      // Step 2: Auto sign in
      const signInResult = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      })

      if (signInResult?.error) {
        setError("Account created but sign in failed. Please go to login.")
        return
      }

      toast.success("Account created! Let's set up your profile.")
      router.push("/onboarding")
      router.refresh()

    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-base p-4">
      <div className="w-full max-w-md space-y-8">

        {/* Logo */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl
                          bg-accent/10 border border-accent/20 mb-4">
            <span className="font-display font-bold text-accent text-xl">T</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            Start trading risk-free
          </h1>
          <p className="text-text-secondary mt-2 text-sm">
            Get ₹10,000 virtual cash to trade real NSE/BSE stocks
          </p>
        </div>

        {/* Form */}
        <div className="bg-bg-surface border border-border-custom rounded-xl p-6 space-y-5">

          {error && (
            <div className="bg-danger/10 border border-danger/20 rounded-lg px-4 py-3">
              <p className="text-danger text-sm">{error}</p>
            </div>
          )}

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={async () => {
              setIsLoading(true)
              await signIn("google", { callbackUrl: "/onboarding", redirect: true })
            }}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3
                       bg-bg-elevated hover:bg-bg-elevated/80
                       border border-border-custom rounded-lg h-11
                       text-text-primary text-sm font-medium
                       transition-all duration-200 disabled:opacity-50"
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
              <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.04a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
              <path fill="#FBBC05" d="M4.5 10.48A4.8 4.8 0 0 1 4.5 7.5V5.43H1.83a8 8 0 0 0 0 7.12z"/>
              <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.43L4.5 7.5a4.8 4.8 0 0 1 4.48-3.32z"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-custom" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-bg-surface px-2 text-text-muted">or</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-text-secondary text-sm">
                Full name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Arjun Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
                minLength={2}
                className="bg-bg-elevated border-border-custom text-text-primary
                           placeholder:text-text-muted focus:border-accent"
              />
            </div>

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
                className="bg-bg-elevated border-border-custom text-text-primary
                           placeholder:text-text-muted focus:border-accent"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-text-secondary text-sm">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="bg-bg-elevated border-border-custom text-text-primary
                           placeholder:text-text-muted focus:border-accent"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || !name || !email || !password}
              className="w-full bg-accent hover:bg-accent/90 text-bg-base
                         font-semibold h-11 transition-all duration-200"
            >
              {isLoading ? "Creating account..." : "Create Free Account"}
            </Button>
          </form>

          <p className="text-center text-text-muted text-xs pt-2">
            By signing up you agree to trade with virtual money only.
            No real funds are involved.
          </p>
        </div>

        <p className="text-center text-text-secondary text-sm">
          Already have an account?{" "}
          <Link href="/login"
            className="text-accent hover:text-accent/80 font-medium transition-colors">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  )
}
