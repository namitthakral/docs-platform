import { User } from '@supabase/supabase-js'

export interface DashboardHeaderProps {
  user: User
  onMobileMenuToggle?: () => void
}