import { NextRequest, NextResponse } from 'next/server'
import { getRoute } from '@/config/routes'

export async function GET(request: NextRequest) {
  try {
    const { origin } = new URL(request.url)
    
    // Simple redirect to login page with a message
    const redirectUrl = new URL(getRoute.auth.login(), origin)
    redirectUrl.searchParams.set('message', encodeURIComponent('Please check your email and click the confirmation link, then return to login.'))
    
    return NextResponse.redirect(redirectUrl.toString())
    
  } catch (error) {
    console.error('Confirmation handler error:', error)
    const { origin } = new URL(request.url)
    const redirectUrl = new URL(getRoute.auth.login(), origin)
    return NextResponse.redirect(redirectUrl.toString())
  }
}