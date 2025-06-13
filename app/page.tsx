import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, Clock, MapPin, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { format } from "date-fns"
import { id } from "date-fns/locale"

// Tambahkan interface untuk tipe data Event
interface Event {
  id: string
  title: string
  date: string
  time: string
  location: string
  description: string
}

// Ubah fungsi page menjadi async untuk fetching data
export default async function Home() {
  // Inisialisasi Supabase client
  const supabase = createServerComponentClient({ cookies })

  // Ambil tanggal hari ini
  const today = new Date().toISOString().split("T")[0]

  // Fetch acara mendatang dari database
  const { data: upcomingEvents } = await supabase
    .from("events")
    .select("*")
    .gte("date", today)
    .order("date", { ascending: true })
    .limit(3)

  // Format tanggal
  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), "EEEE, dd MMMM yyyy", { locale: id })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
              PKK
            </div>
            <h1 className="text-xl font-bold text-green-800">PKK Kandri</h1>
          </div>
          <Link href="/login">
            <Button variant="outline">Login Admin</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="mb-16 text-center">
          <h1 className="text-4xl font-bold text-green-800 mb-4">Selamat Datang di Website PKK Kandri</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Platform resmi untuk informasi dan manajemen kegiatan PKK Kelurahan Kandri
          </p>
        </section>

        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-green-800 mb-4">Tentang PKK Kandri</h2>
              <p className="text-gray-600 mb-4">
                PKK Kandri adalah organisasi yang berfokus pada pemberdayaan keluarga untuk meningkatkan kesejahteraan
                masyarakat di Kelurahan Kandri. Kami menyelenggarakan berbagai kegiatan untuk mendukung program-program
                pembangunan masyarakat.
              </p>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Users className="text-green-600" />
                  <span>Beranggotakan ibu-ibu dari seluruh RT di Kelurahan Kandri</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="text-green-600" />
                  <span>Kegiatan rutin bulanan dan program khusus</span>
                </div>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/images/pkk-kandri.png"
                alt="Kegiatan PKK Kandri"
                width={600}
                height={400}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">Acara Mendatang</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents && upcomingEvents.length > 0 ? (
              upcomingEvents.map((event: Event) => (
                <Card key={event.id} className="overflow-hidden">
                  <div className="h-48 bg-green-100 flex items-center justify-center">
                    <CalendarDays className="h-16 w-16 text-green-600" />
                  </div>
                  <CardHeader>
                    <CardTitle>{event.title}</CardTitle>
                    <CardDescription>
                      <div className="flex items-center gap-1 text-green-600">
                        <CalendarDays className="h-4 w-4" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-green-600">
                        <Clock className="h-4 w-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-1 text-green-600">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 line-clamp-3">{event.description}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="col-span-3">
                <CardContent className="p-8 text-center">
                  <CalendarDays className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Tidak ada acara mendatang</h3>
                  <p className="text-gray-500">
                    Saat ini belum ada acara yang dijadwalkan. Silakan periksa kembali nanti.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-green-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">PKK Kandri</h3>
              <p>Meningkatkan kesejahteraan keluarga dan masyarakat Kelurahan Kandri</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Kontak</h3>
              <p>Kelurahan Kandri, Kecamatan Gunungpati</p>
              <p>Semarang, Jawa Tengah</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Sosial Media</h3>
              <div className="flex gap-4">
                <a href="#" className="hover:text-green-300">
                  Instagram
                </a>
                <a href="#" className="hover:text-green-300">
                  Facebook
                </a>
                <a href="#" className="hover:text-green-300">
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-green-700 text-center">
            <p>&copy; {new Date().getFullYear()} PKK Kandri. Hak Cipta Dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
