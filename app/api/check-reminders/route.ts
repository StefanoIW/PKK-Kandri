import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { format } from "date-fns"
import { id } from "date-fns/locale"

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ydqmhzcjcsrvxapaglfc.supabase.co",
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkcW1oemNqY3NydnhhcGFnbGZjIiwicm9sZSI6ImFub24iLCJpYXQiOj",
    )

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0]

    // Get all unsent reminders for today
    const { data: reminders, error } = await supabase
      .from("reminders")
      .select("*, events(*)")
      .eq("reminder_date", today)
      .eq("sent", false)

    if (error) {
      throw error
    }

    // Send reminders
    const results = []
    for (const reminder of reminders || []) {
      const event = reminder.events

      if (!event) continue

      const formattedDate = format(new Date(event.date), "EEEE, dd MMMM yyyy", { locale: id })

      const message = `*🔔 PENGINGAT ACARA PKK KANDRI 🔔*

⚠️ *${event.title.toUpperCase()}* akan dilaksanakan *BESOK!* ⚠️

📅 *Tanggal:* ${formattedDate}
⏰ *Waktu:* ${event.time}
📍 *Lokasi:* ${event.location}

📝 *Deskripsi Acara:*
${event.description}

✅ *Persiapan yang perlu dibawa:*
• Buku catatan & alat tulis
• Kartu anggota PKK
• Semangat dan senyuman terbaik! 😊

⭐ Kehadiran Anda sangat berarti bagi kemajuan program PKK Kandri!

🌸 *Jangan lupa untuk:*
• Datang tepat waktu
• Mengajak tetangga yang juga anggota PKK
• Berbagi informasi ini ke grup RT masing-masing

📲 Untuk konfirmasi kehadiran atau pertanyaan, silakan hubungi koordinator RT.

👭 *Bersama Kita Wujudkan Keluarga Sejahtera!* 👭

Terima kasih. 🙏`

      // Send WhatsApp message using Fonnte API
      const response = await fetch("https://api.fonnte.com/send", {
        method: "POST",
        headers: {
          Authorization: "KChLR9EBA65W2eaqkwBV",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          target: reminder.phone,
          message: message,
        }),
      })

      const result = await response.json()

      // Mark reminder as sent
      await supabase.from("reminders").update({ sent: true }).eq("id", reminder.id)

      results.push({
        reminder_id: reminder.id,
        event_id: event.id,
        result,
      })
    }

    return NextResponse.json({ success: true, sent_reminders: results.length, results })
  } catch (error) {
    console.error("Error checking reminders:", error)
    return NextResponse.json({ error: "Failed to check reminders" }, { status: 500 })
  }
}
