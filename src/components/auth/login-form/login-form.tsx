"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { getRoute } from "@/config/routes"
import { LoginFormProps } from "./login-form.props"
import { loginFormStyles } from "./login-form.styles"

export default function LoginForm({
  redirectTo = getRoute.dashboard.home(),
  onSuccess,
  className = "",
}: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        return
      }

      if (onSuccess) {
        onSuccess()
      } else {
        router.push(redirectTo)
        router.refresh()
      }
    } catch {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`${loginFormStyles.container} ${className}`}>
      <div className={loginFormStyles.header}>
        <h2 className={loginFormStyles.title}>Sign in to your account</h2>
        <p className={loginFormStyles.subtitle}>
          Or{" "}
          <Link
            href={getRoute.auth.register()}
            className={loginFormStyles.link}
          >
            create a new account
          </Link>
        </p>
      </div>
      <form className={loginFormStyles.form} onSubmit={handleLogin}>
        <div className={loginFormStyles.inputGroup}>
          <div className={loginFormStyles.inputWrapper}>
            <label htmlFor="email" className={loginFormStyles.label}>
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={loginFormStyles.emailInput}
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={loginFormStyles.inputWrapper}>
            <label htmlFor="password" className={loginFormStyles.label}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className={loginFormStyles.passwordInput}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {error && <div className={loginFormStyles.errorMessage}>{error}</div>}

        <div className={loginFormStyles.buttonWrapper}>
          <button
            type="submit"
            disabled={loading}
            className={loginFormStyles.submitButton}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </form>
    </div>
  )
}
