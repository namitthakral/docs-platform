"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { getRoute } from "@/config/routes"
import { useRegister } from "@/hooks/use-auth-mutations"
import { RegisterFormProps } from "./register-form.props"
import { registerFormStyles } from "./register-form.styles"

export default function RegisterForm({ 
  onSuccess,
  className = ""
}: RegisterFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const registerMutation = useRegister()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(null)

    // Client-side validation
    if (password !== confirmPassword) {
      setValidationError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters")
      return
    }

    registerMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          if (onSuccess) {
            onSuccess()
          }
        },
      }
    )
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
            <div className={registerFormStyles.passwordContainer}>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                className={registerFormStyles.passwordInput}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                onMouseDown={(e) => e.preventDefault()}
                className={registerFormStyles.passwordToggle}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className={registerFormStyles.passwordIcon} />
                ) : (
                  <Eye className={registerFormStyles.passwordIcon} />
                )}
              </button>
            </div>
          </div>
          <div className={registerFormStyles.inputWrapper}>
            <label htmlFor="confirm-password" className={registerFormStyles.label}>
              Confirm Password
            </label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="text"
              autoComplete="new-password"
              required
              className={registerFormStyles.confirmPasswordInput}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        {(validationError || registerMutation.error) && (
          <div className={registerFormStyles.errorMessage}>
            {validationError || registerMutation.error?.message}
          </div>
        )}

        {registerMutation.isSuccess && (
          <div className={registerFormStyles.successMessage}>
            Check your email for a confirmation link!
          </div>
        )}

        <div className={registerFormStyles.buttonWrapper}>
          <button
            type="submit"
            disabled={registerMutation.isPending}
            className={registerFormStyles.submitButton}
          >
            {registerMutation.isPending ? "Creating account..." : "Create account"}
          </button>
        </div>
      </form>
    </div>
  )
}