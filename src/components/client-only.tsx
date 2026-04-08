'use client'

import { useSyncExternalStore } from 'react'

interface ClientOnlyProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

const emptySubscribe = () => () => {}

export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,  // client
    () => false  // server
  )

  if (!isClient) {
    return <>{fallback}</>
  }

  return <>{children}</>
}