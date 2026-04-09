"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
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
  const [showPassword, setShowPassword] = useState(false)
  const [urlMessage, setUrlMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const loginMutation = useLogin()

  // Handle URL parameters for messages
  useEffect(() => {
    const message = searchParams.get('message')
    
    if (message) {
      setUrlMessage({
        type: 'success',
        text: decodeURIComponent(message)
      })
      
      // Clear URL parameters after showing message
      const newUrl = new URL(window.location.href)
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
            <div className={loginFormStyles.passwordContainer}>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className={loginFormStyles.passwordInput}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                onMouseDown={(e) => e.preventDefault()}
                className={loginFormStyles.passwordToggle}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className={loginFormStyles.passwordIcon} />
                ) : (
                  <Eye className={loginFormStyles.passwordIcon} />
                )}
              </button>
            </div>
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
