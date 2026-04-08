import { User } from "@supabase/supabase-js"

export interface DashboardLayoutClientProps {
  children: React.ReactNode
  user: User
}