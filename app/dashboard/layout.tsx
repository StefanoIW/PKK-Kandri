"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { CalendarDays, Home, LogOut, Menu, Plus } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push("/login")
        return
      }

      setLoading(false)
    }

    checkSession()
  }, [router, supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-24" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="hidden md:block">
              <Skeleton className="h-[calc(100vh-120px)] w-full" />
            </div>
            <div className="md:col-span-3">
              <Skeleton className="h-[calc(100vh-120px)] w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
              PKK
            </div>
            <h1 className="text-xl font-bold text-green-800">Admin PKK Kandri</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu />
            </Button>
            <Button variant="outline" size="sm" onClick={handleSignOut} className="hidden md:flex">
              <LogOut className="mr-2 h-4 w-4" /> Keluar
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-white p-4 rounded-lg shadow mb-4">
              <nav className="space-y-2">
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-2 p-2 rounded-md ${pathname === "/dashboard" ? "bg-green-100 text-green-800" : "hover:bg-gray-100"}`}
                >
                  <Home className="h-5 w-5" /> Dashboard
                </Link>
                <Link
                  href="/dashboard/acara"
                  className={`flex items-center gap-2 p-2 rounded-md ${pathname.includes("/dashboard/acara") ? "bg-green-100 text-green-800" : "hover:bg-gray-100"}`}
                >
                  <CalendarDays className="h-5 w-5" /> Manajemen Acara
                </Link>
                <Link
                  href="/dashboard/acara/tambah"
                  className={`flex items-center gap-2 p-2 rounded-md ${pathname === "/dashboard/acara/tambah" ? "bg-green-100 text-green-800" : "hover:bg-gray-100"}`}
                >
                  <Plus className="h-5 w-5" /> Tambah Acara
                </Link>
                <Button variant="outline" size="sm" onClick={handleSignOut} className="w-full justify-start">
                  <LogOut className="mr-2 h-4 w-4" /> Keluar
                </Button>
              </nav>
            </div>
          )}

          {/* Sidebar */}
          <div className="hidden md:block">
            <div className="bg-white p-4 rounded-lg shadow sticky top-24">
              <nav className="space-y-2">
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-2 p-2 rounded-md ${pathname === "/dashboard" ? "bg-green-100 text-green-800" : "hover:bg-gray-100"}`}
                >
                  <Home className="h-5 w-5" /> Dashboard
                </Link>
                <Link
                  href="/dashboard/acara"
                  className={`flex items-center gap-2 p-2 rounded-md ${pathname.includes("/dashboard/acara") && pathname !== "/dashboard/acara/tambah" ? "bg-green-100 text-green-800" : "hover:bg-gray-100"}`}
                >
                  <CalendarDays className="h-5 w-5" /> Manajemen Acara
                </Link>
                <Link
                  href="/dashboard/acara/tambah"
                  className={`flex items-center gap-2 p-2 rounded-md ${pathname === "/dashboard/acara/tambah" ? "bg-green-100 text-green-800" : "hover:bg-gray-100"}`}
                >
                  <Plus className="h-5 w-5" /> Tambah Acara
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="bg-white p-6 rounded-lg shadow min-h-[calc(100vh-180px)]">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
