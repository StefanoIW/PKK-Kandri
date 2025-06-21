import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { phone, message, eventId, eventDate } = await request.json()

    console.log("=== WhatsApp Send Request ===")
    console.log("Phone:", phone)
    console.log("Message length:", message.length)
    console.log("Event ID:", eventId)
    console.log("Event Date:", eventDate)

    if (!phone || !message) {
      console.log("❌ Missing phone or message")
      return NextResponse.json({ error: "Phone number and message are required" }, { status: 400 })
    }

    // Send WhatsApp message using Fonnte API
    console.log("🚀 Sending to Fonnte API...")
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

    console.log("📱 Fonnte API Response:")
    console.log("Status:", response.status)
    console.log("Response:", result)

    // Check if the request was successful
    if (!response.ok) {
      console.log("❌ Fonnte API Error:", result)
      return NextResponse.json(
        {
          error: "Failed to send WhatsApp message",
          details: result,
          status: response.status,
        },
        { status: response.status },
      )
    }

    // If there's an eventId and eventDate, schedule a reminder for H-1
    if (eventId && eventDate) {
      console.log("📅 Creating reminder for H-1...")
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ydqmhzcjcsrvxapaglfc.supabase.co",
          process.env.SUPABASE_SERVICE_ROLE_KEY ||
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkcW1oemNqY3NydnhhcGFnbGZjIiwicm9sZSI6ImFub24iLCJpYXQiOj",
        )

        const reminderDate = new Date(new Date(eventDate).getTime() - 24 * 60 * 60 * 1000).toISOString().split("T")[0]

        const { error: reminderError } = await supabase.from("reminders").insert([
          {
            event_id: eventId,
            reminder_date: reminderDate,
            phone: phone,
            sent: false,
          },
        ])

        if (reminderError) {
          console.log("⚠️ Reminder creation error:", reminderError)
        } else {
          console.log("✅ Reminder created for:", reminderDate)
        }
      } catch (reminderErr) {
        console.log("⚠️ Reminder creation failed:", reminderErr)
      }
    }

    console.log("✅ WhatsApp message sent successfully")
    return NextResponse.json({
      success: true,
      result,
      message: "WhatsApp message sent successfully",
    })
  } catch (error) {
    console.error("💥 Error sending WhatsApp message:", error)
    return NextResponse.json(
      {
        error: "Failed to send WhatsApp message",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
