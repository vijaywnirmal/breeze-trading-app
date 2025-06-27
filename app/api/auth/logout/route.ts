import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    const cookieStore = await cookies()

    // Clear all Breeze-related cookies
    cookieStore.delete("breeze_app_key")
    cookieStore.delete("breeze_app_secret")
    cookieStore.delete("breeze_api_session")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Logout failed" }, { status: 500 })
  }
}
