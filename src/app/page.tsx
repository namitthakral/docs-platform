"use client"

import Link from "next/link"
import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, BookOpen, Zap, Lock } from "lucide-react"
import { getRoute } from "@/config/routes"

export default function Home() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Handle auth code redirects
  useEffect(() => {
    const code = searchParams.get('code')
    
    if (code) {
      // Redirect to the auth confirmation handler with the code
      router.replace(`/auth/confirm?code=${code}`)
      return
    }
  }, [searchParams, router])
  return (
    <div className="min-h-screen md:h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 md:overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 mask-[linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:mask-[linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"></div>

      <div className="relative min-h-screen md:h-full flex flex-col justify-center py-8 md:py-0">
        {/* Hero Section */}
        <div className="shrink-0 px-4 pt-4 md:pt-8 pb-4">
          <div className="text-center max-w-4xl mx-auto">
            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold bg-linear-to-r from-gray-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent mb-3 md:mb-4 leading-tight">
              Your Documentation
              <span className="block">Hub</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed px-2">
              Create, organize, and share knowledge effortlessly. Find what you
              need instantly with powerful search.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
              <Link
                href={getRoute.docs()}
                className="w-full sm:w-auto group relative inline-flex items-center justify-center px-6 py-3 text-sm sm:text-base font-semibold text-white bg-linear-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                Explore Documentation
              </Link>

              <Link
                href={getRoute.dashboard.home()}
                className="w-full sm:w-auto group inline-flex items-center justify-center px-6 py-3 text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-200 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-blue-300 dark:hover:border-blue-500 hover:bg-white dark:hover:bg-gray-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:rotate-12 transition-transform" />
                Manage Content
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="shrink-0 px-4 pb-6 md:pb-8 pt-6">
          <div className="container mx-auto">
            <div className="text-center mb-4 md:mb-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 px-2">
                Everything you need to manage knowledge
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
                Streamlined tools for creating, organizing, and discovering
                information
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 max-w-5xl mx-auto">
              {/* Search Feature */}
              <div className="group relative p-3 sm:p-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl border border-blue-100 dark:border-blue-800 hover:shadow-lg transition-all duration-300">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-lg flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">
                  Instant Search
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  Find any information instantly with our powerful full-text
                  search that highlights relevant content.
                </p>
              </div>

              {/* Organization Feature */}
              <div className="group relative p-3 sm:p-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl border border-green-100 dark:border-green-800 hover:shadow-lg transition-all duration-300">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-lg flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">
                  Smart Organization
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  Organize content with categories and tags. Keep everything
                  structured and easy to navigate.
                </p>
              </div>

              {/* Collaboration Feature */}
              <div className="group relative p-3 sm:p-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl border border-purple-100 dark:border-purple-800 hover:shadow-lg transition-all duration-300">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500 rounded-lg flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">
                  Secure & Accessible
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  Control access with role-based permissions while keeping
                  information discoverable for your team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
