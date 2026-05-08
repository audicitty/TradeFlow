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
