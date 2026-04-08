import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getRoute } from "@/config/routes"
import DashboardLayoutClient from "@/components/dashboard/dashboard-layout/dashboard-layout-client"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(getRoute.auth.login())
  }

  return (
    <DashboardLayoutClient user={user}>
      {children}
    </DashboardLayoutClient>
  )
}
