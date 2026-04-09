"use client"

import { useSearchParams } from "next/navigation"
import LoginForm from "@/components/auth/login-form/login-form"
import { getRoute } from "@/config/routes"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirectTo") || getRoute.dashboard.home()

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 sm:px-6 lg:px-8">
      <LoginForm redirectTo={redirectTo} />
    </div>
  )
}
