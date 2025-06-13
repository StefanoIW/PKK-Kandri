const cron = require("node-cron")
// Menggunakan dynamic import untuk node-fetch karena versi terbaru menggunakan ESM
const fetchData = async (url) => {
  const { default: fetch } = await import("node-fetch")
  return fetch(url)
}

// Jalankan setiap hari jam 7 pagi
cron.schedule("0 7 * * *", async () => {
  try {
    console.log("Running reminder check at:", new Date().toISOString())
    const response = await fetchData("http://localhost:3000/api/check-reminders")
    const data = await response.json()
    console.log("Reminder check result:", data)
  } catch (error) {
    console.error("Error checking reminders:", error)
  }
})

console.log("Cron job started for reminder checks")
