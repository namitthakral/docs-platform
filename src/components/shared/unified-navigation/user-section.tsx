"use client"

import { User } from "@supabase/supabase-js"
import { User as UserIcon, LogOut } from "lucide-react"
import { unifiedNavigationStyles } from "./unified-navigation.styles"

interface UserSectionProps {
  user: User
  onSignOut: () => Promise<void>
  styles: typeof unifiedNavigationStyles
}

export function UserSection({ user, onSignOut, styles }: UserSectionProps) {
  return (
    <div className={styles.userSection.container}>
      <div className={styles.userSection.content}>
        {/* User Email */}
        <div className={styles.userSection.userInfo.container}>
          <div className={styles.userSection.userInfo.avatar}>
            <UserIcon className={styles.userSection.userInfo.avatarIcon} />
          </div>
          <div className={styles.userSection.userInfo.email}>
            <p className={styles.userSection.userInfo.emailText}>
              {user.email}
            </p>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={onSignOut}
          className={styles.userSection.signOut.button}
        >
          <LogOut className={styles.userSection.signOut.icon} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )
}