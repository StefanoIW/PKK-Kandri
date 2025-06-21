"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export default function AddEventPage() {
  const [title, setTitle] = useState("")
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !date || !time || !location || !description) {
      setError("Semua field harus diisi")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Format date to ISO string (YYYY-MM-DD)
      const formattedDate = format(date, "yyyy-MM-dd")

      // Insert event to Supabase
      const { data, error: insertError } = await supabase
        .from("events")
        .insert([
          {
            title,
            date: formattedDate,
            time,
            location,
            description,
          },
        ])
        .select()

      if (insertError) throw insertError

      // Send WhatsApp notification
      if (data && data.length > 0) {
        const event = data[0]
        await sendWhatsAppNotification(event)
      }

      setSuccess(true)

      // Reset form
      setTitle("")
      setDate(undefined)
      setTime("")
      setLocation("")
      setDescription("")

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/dashboard/acara")
      }, 2000)
    } catch (error: any) {
      console.error("Error adding event:", error)
      setError(error.message || "Terjadi kesalahan saat menambahkan acara")
    } finally {
      setLoading(false)
    }
  }

  const sendWhatsAppNotification = async (event: any) => {
    try {
      const formattedDate = format(new Date(event.date), "EEEE, dd MMMM yyyy", { locale: id })

      const message = `*🌟 PEMBERITAHUAN ACARA PKK KANDRI 🌟*

📣 *${event.title.toUpperCase()}* 📣

📅 *Tanggal:* ${formattedDate}
⏰ *Waktu:* ${event.time}
📍 *Lokasi:* ${event.location}

📝 *Deskripsi Acara:*
${event.description}

✨ Mari kita hadiri bersama untuk mempererat silaturahmi dan membangun komunitas yang lebih baik! ✨

🔔 *Informasi Penting:*
• Mohon hadir tepat waktu
• Pakaian rapi dan sopan
• Bawa perlengkapan sesuai kebutuhan acara
• Konfirmasi kehadiran kepada koordinator RT masing-masing

📲 Untuk informasi lebih lanjut, silakan hubungi koordinator acara.

👥 *Bersama Kita Wujudkan PKK Kandri yang Maju dan Sejahtera!* 👥

Terima kasih. 🙏`

      // Call server action to send WhatsApp message
      await fetch("/api/send-whatsapp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: "6287878099411", // Nomor koordinator yang baru
          message,
          eventId: event.id,
          eventDate: event.date,
        }),
      })
    } catch (error) {
      console.error("Error sending WhatsApp notification:", error)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tambah Acara Baru</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
          <AlertDescription>Acara berhasil ditambahkan dan notifikasi WhatsApp telah dikirim!</AlertDescription>
        </Alert>
      )}

      <Card className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="title">Judul Acara</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Masukkan judul acara"
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid gap-2">
                <Label htmlFor="date">Tanggal</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={"outline"}
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                      disabled={loading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP", { locale: id }) : <span>Pilih tanggal</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus locale={id} />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="time">Waktu</Label>
                <Input
                  id="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="Contoh: 09:00 - 12:00 WIB"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Lokasi</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Masukkan lokasi acara"
                disabled={loading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Masukkan deskripsi acara"
                rows={5}
                disabled={loading}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/acara")}
                disabled={loading}
              >
                Batal
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan Acara"}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  )
}
