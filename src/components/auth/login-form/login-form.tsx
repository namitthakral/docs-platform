"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { getRoute } from "@/config/routes"
import { useLogin } from "@/hooks/use-auth-mutations"
import { LoginFormProps } from "./login-form.props"
import { loginFormStyles } from "./login-form.styles"

export default function LoginForm({
  redirectTo = getRoute.dashboard.home(),
  onSuccess,
  className = "",
}: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [urlMessage, setUrlMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const loginMutation = useLogin()

  // Handle URL parameters for confirmation messages
  useEffect(() => {
    const error = searchParams.get('error')
    const message = searchParams.get('message')
    
    if (error && message) {
      // Use the specific error message from the URL
      setUrlMessage({
        type: 'error',
        text: decodeURIComponent(message)
      })
    } else if (error === 'confirmation_failed') {
      setUrlMessage({
        type: 'error',
        text: 'Email confirmation failed. Please check your email and try again.'
      })
    } else if (error === 'confirmation_incomplete') {
      setUrlMessage({
        type: 'error',
        text: 'Email confirmation could not be completed. Please try logging in or registering again.'
      })
    } else if (error === 'confirmation_error') {
      setUrlMessage({
        type: 'error',
        text: 'An unexpected error occurred during email confirmation. Please try again.'
      })
    }
    
    // Clear URL parameters after showing message
    if (error || message) {
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('error')
      newUrl.searchParams.delete('message')
      router.replace(newUrl.pathname, { scroll: false })
    }
  }, [searchParams, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          if (onSuccess) {
            onSuccess()
          } else {
            router.push(redirectTo)
            router.refresh()
          }
        },
      }
    )
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

        {urlMessage && (
          <div className={urlMessage.type === 'error' ? loginFormStyles.errorMessage : loginFormStyles.successMessage}>
            {urlMessage.text}
          </div>
        )}

        {loginMutation.error && (
          <div className={loginFormStyles.errorMessage}>
            {loginMutation.error.message}
          </div>
        )}

        <div className={loginFormStyles.buttonWrapper}>
          <button
            type="submit"
            disabled={loginMutation.isPending}
            className={loginFormStyles.submitButton}
          >
            {loginMutation.isPending ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </form>
    </div>
  )
}
