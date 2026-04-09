import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { getRoute } from '@/config/routes'

export async function GET(request: NextRequest) {
  try {
    const { searchParams, origin } = new URL(request.url)
    const supabase = await createClient()
    
    // Get the authorization code from Supabase redirect
    const code = searchParams.get('code')
    
    if (code) {
      // Exchange the code for a session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (!error && data.user) {
        // Email confirmation successful - user is now logged in
        console.log('Email confirmation successful for user:', data.user.id)
        
        const redirectUrl = new URL(getRoute.dashboard.home(), origin)
        redirectUrl.searchParams.set('confirmed', 'true')
        return NextResponse.redirect(redirectUrl.toString())
      } else {
        // Code exchange failed
        console.error('Code exchange error:', error)
        
        const redirectUrl = new URL(getRoute.auth.login(), origin)
        redirectUrl.searchParams.set('error', 'confirmation_failed')
        
        const message = error?.message || 'Email confirmation failed. Please try again.'
        redirectUrl.searchParams.set('message', encodeURIComponent(message))
        
        return NextResponse.redirect(redirectUrl.toString())
      }
    }
    
    // Check for error parameters from Supabase redirect
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')
    
    if (error) {
      console.error('Email confirmation error from Supabase:', error, errorDescription)
      
      const redirectUrl = new URL(getRoute.auth.login(), origin)
      redirectUrl.searchParams.set('error', 'confirmation_failed')
      
      const message = errorDescription || 'Email confirmation failed. Please try again.'
      redirectUrl.searchParams.set('message', encodeURIComponent(message))
      
      return NextResponse.redirect(redirectUrl.toString())
    }
    
    // No code and no error - invalid request
    console.warn('Email confirmation: No code or error parameters found')
    
    const redirectUrl = new URL(getRoute.auth.login(), origin)
    redirectUrl.searchParams.set('error', 'invalid_confirmation_link')
    redirectUrl.searchParams.set('message', encodeURIComponent('Invalid confirmation link. Please try registering again.'))
    return NextResponse.redirect(redirectUrl.toString())
    
  } catch (error) {
    console.error('Confirmation handler error:', error)
    const { origin } = new URL(request.url)
    const redirectUrl = new URL(getRoute.auth.login(), origin)
    redirectUrl.searchParams.set('error', 'confirmation_error')
    redirectUrl.searchParams.set('message', encodeURIComponent('An unexpected error occurred during confirmation'))
    return NextResponse.redirect(redirectUrl.toString())
  }
}