import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { getRoute } from '@/config/routes'

export async function GET(request: NextRequest) {
  try {
    const { searchParams, origin } = new URL(request.url)
    const supabase = await createClient()
    
    // Check if user is already authenticated (Supabase should have verified them)
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (user && !userError) {
      // User is authenticated - email confirmation was successful
      console.log('Email confirmation successful for user:', user.id)
      
      const redirectUrl = new URL(getRoute.dashboard.home(), origin)
      redirectUrl.searchParams.set('confirmed', 'true')
      return NextResponse.redirect(redirectUrl.toString())
    }
    
    // Check for error parameters from Supabase redirect
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')
    
    if (error) {
      console.error('Email confirmation error from Supabase:', error, errorDescription)
      
      const redirectUrl = new URL(getRoute.auth.login(), origin)
      redirectUrl.searchParams.set('error', 'confirmation_failed')
      
      // Use Supabase's error description or provide a fallback
      const message = errorDescription || 'Email confirmation failed. Please try again.'
      redirectUrl.searchParams.set('message', encodeURIComponent(message))
      
      return NextResponse.redirect(redirectUrl.toString())
    }
    
    // No user and no error - something went wrong
    console.warn('Email confirmation: No user found and no error reported')
    
    const redirectUrl = new URL(getRoute.auth.login(), origin)
    redirectUrl.searchParams.set('error', 'confirmation_incomplete')
    redirectUrl.searchParams.set('message', encodeURIComponent('Email confirmation could not be completed. Please try logging in or registering again.'))
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