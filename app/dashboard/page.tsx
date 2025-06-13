"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, CheckCircle, Clock } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

interface Event {
  id: string
  title: string
  date: string
  time: string
  location: string
  description: string
  created_at: string
}

export default function Dashboard() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [pastEvents, setPastEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const today = new Date().toISOString().split("T")[0]

        // Fetch upcoming events
        const { data: upcoming, error: upcomingError } = await supabase
          .from("events")
          .select("*")
          .gte("date", today)
          .order("date", { ascending: true })
          .limit(3)

        if (upcomingError) throw upcomingError

        // Fetch past events
        const { data: past, error: pastError } = await supabase
          .from("events")
          .select("*")
          .lt("date", today)
          .order("date", { ascending: false })
          .limit(3)

        if (pastError) throw pastError

        setUpcomingEvents(upcoming || [])
        setPastEvents(past || [])
      } catch (error) {
        console.error("Error fetching events:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [supabase])

  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    return new Date(dateStr).toLocaleDateString("id-ID", options)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Admin PKK Kandri</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Acara</CardTitle>
            <CardDescription>Semua acara yang terdaftar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CalendarDays className="h-8 w-8 text-green-600 mr-3" />
              {loading ? (
                <Skeleton className="h-10 w-16" />
              ) : (
                <p className="text-3xl font-bold">{upcomingEvents.length + pastEvents.length}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Acara Mendatang</CardTitle>
            <CardDescription>Acara yang akan datang</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-blue-600 mr-3" />
              {loading ? (
                <Skeleton className="h-10 w-16" />
              ) : (
                <p className="text-3xl font-bold">{upcomingEvents.length}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Acara Selesai</CardTitle>
            <CardDescription>Acara yang telah dilaksanakan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-purple-600 mr-3" />
              {loading ? <Skeleton className="h-10 w-16" /> : <p className="text-3xl font-bold">{pastEvents.length}</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Acara Mendatang</h2>
          <Link href="/dashboard/acara" className="text-green-600 hover:text-green-800 text-sm">
            Lihat Semua
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : upcomingEvents.length > 0 ? (
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <Card key={event.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{event.title}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <CalendarDays className="h-4 w-4 mr-1" />
                        {formatDate(event.date)}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Clock className="h-4 w-4 mr-1" />
                        {event.time}
                      </div>
                    </div>
                    <Link
                      href={`/dashboard/acara/${event.id}`}
                      className="text-green-600 hover:text-green-800 text-sm self-start"
                    >
                      Detail
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-4 text-center text-gray-500">Tidak ada acara mendatang</CardContent>
          </Card>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Acara Selesai</h2>
          <Link href="/dashboard/acara" className="text-green-600 hover:text-green-800 text-sm">
            Lihat Semua
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : pastEvents.length > 0 ? (
          <div className="space-y-4">
            {pastEvents.map((event) => (
              <Card key={event.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{event.title}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <CalendarDays className="h-4 w-4 mr-1" />
                        {formatDate(event.date)}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Clock className="h-4 w-4 mr-1" />
                        {event.time}
                      </div>
                    </div>
                    <Link
                      href={`/dashboard/acara/${event.id}`}
                      className="text-green-600 hover:text-green-800 text-sm self-start"
                    >
                      Detail
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-4 text-center text-gray-500">Tidak ada acara selesai</CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
