import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { phone, message, eventId, eventDate } = await request.json()

    if (!phone || !message) {
      return NextResponse.json({ error: "Phone number and message are required" }, { status: 400 })
    }

    // Send WhatsApp message using Fonnte API
    const response = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        Authorization: "pUHPiTDPi4aeGQo9Q4PW",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        target: phone,
        message: message,
      }),
    })

    const result = await response.json()

    // If there's an eventId and eventDate, schedule a reminder for H-1
    if (eventId && eventDate) {
      // Store the reminder in Supabase
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ydqmhzcjcsrvxapaglfc.supabase.co",
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkcW1oemNqY3NydnhhcGFnbGZjIiwicm9sZSI6ImFub24iLCJpYXQiOj",
      )

      await supabase.from("reminders").insert([
        {
          event_id: eventId,
          reminder_date: new Date(new Date(eventDate).getTime() - 24 * 60 * 60 * 1000).toISOString().split("T")[0], // H-1
          phone: phone,
          sent: false,
        },
      ])
    }

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error("Error sending WhatsApp message:", error)
    return NextResponse.json({ error: "Failed to send WhatsApp message" }, { status: 500 })
  }
}
