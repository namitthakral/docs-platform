import { Database } from "@/types/database"
import { User } from "@supabase/supabase-js"

export type Category = Database["public"]["Tables"]["categories"]["Row"]

export interface DocsLayoutProps {
  children: React.ReactNode
  categories: Category[]
  user: User | null
}