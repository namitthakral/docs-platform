"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { getRoute } from "@/config/routes"
import { RegisterFormProps } from "./register-form.props"
import { registerFormStyles } from "./register-form.styles"

export default function RegisterForm({ 
  onSuccess,
  className = ""
}: RegisterFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        return
      }

      setMessage("Check your email for a confirmation link!")
      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`${registerFormStyles.container} ${className}`}>
      <div className={registerFormStyles.header}>
        <h2 className={registerFormStyles.title}>
          Create your account
        </h2>
        <p className={registerFormStyles.subtitle}>
          Or{" "}
          <Link
            href={getRoute.auth.login()}
            className={registerFormStyles.link}
          >
            sign in to existing account
          </Link>
        </p>
      </div>
      <form className={registerFormStyles.form} onSubmit={handleRegister}>
        <div className={registerFormStyles.inputGroup}>
          <div className={registerFormStyles.inputWrapper}>
            <label htmlFor="email" className={registerFormStyles.label}>
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={registerFormStyles.emailInput}
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={registerFormStyles.inputWrapper}>
            <label htmlFor="password" className={registerFormStyles.label}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className={registerFormStyles.passwordInput}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className={registerFormStyles.inputWrapper}>
            <label htmlFor="confirm-password" className={registerFormStyles.label}>
              Confirm Password
            </label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              className={registerFormStyles.confirmPasswordInput}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className={registerFormStyles.errorMessage}>{error}</div>
        )}

        {message && (
          <div className={registerFormStyles.successMessage}>{message}</div>
        )}

        <div className={registerFormStyles.buttonWrapper}>
          <button
            type="submit"
            disabled={loading}
            className={registerFormStyles.submitButton}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </div>
      </form>
    </div>
  )
}