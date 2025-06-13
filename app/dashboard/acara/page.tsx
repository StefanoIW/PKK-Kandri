"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Clock, MapPin, Plus, Search } from "lucide-react"
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

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("semua")
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase.from("events").select("*").order("date", { ascending: false })

        if (error) throw error

        setEvents(data || [])
        setFilteredEvents(data || [])
      } catch (error) {
        console.error("Error fetching events:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [supabase])

  useEffect(() => {
    filterEvents()
  }, [searchQuery, activeTab, events])

  const filterEvents = () => {
    const today = new Date().toISOString().split("T")[0]

    let filtered = events

    // Filter by tab
    if (activeTab === "mendatang") {
      filtered = events.filter((event) => event.date >= today)
    } else if (activeTab === "selesai") {
      filtered = events.filter((event) => event.date < today)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query),
      )
    }

    setFilteredEvents(filtered)
  }

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manajemen Acara</h1>
        <Link href="/dashboard/acara/tambah">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Tambah Acara
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Cari acara..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="semua" className="mb-6" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="semua">Semua Acara</TabsTrigger>
          <TabsTrigger value="mendatang">Acara Mendatang</TabsTrigger>
          <TabsTrigger value="selesai">Acara Selesai</TabsTrigger>
        </TabsList>
      </Tabs>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="bg-green-100 p-4 md:w-1/4 flex flex-col justify-center items-center">
                    <CalendarDays className="h-10 w-10 text-green-600 mb-2" />
                    <p className="text-center font-medium">{formatDate(event.date)}</p>
                  </div>
                  <div className="p-4 md:w-3/4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg">{event.title}</h3>
                      <Link href={`/dashboard/acara/${event.id}`}>
                        <Button variant="outline" size="sm">
                          Detail
                        </Button>
                      </Link>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-2" />
                        {event.time}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-2" />
                        {event.location}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <CalendarDays className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">Tidak ada acara ditemukan</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery ? "Tidak ada acara yang sesuai dengan pencarian Anda" : "Belum ada acara yang ditambahkan"}
            </p>
            <Link href="/dashboard/acara/tambah">
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Tambah Acara Baru
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
