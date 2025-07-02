import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

// Import the actual BreezeConnect package
const { BreezeConnect } = require("breezeconnect")

interface BreezeCredentials {
  appKey: string
  appSecret: string
  apiSession: string
}

export async function POST(request: NextRequest) {
  try {
    const body: BreezeCredentials = await request.json()
    const { appKey, appSecret, apiSession } = body

    if (!appKey || !appSecret || !apiSession) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Initialize BreezeConnect with the API key
    const breeze = new BreezeConnect({ appKey: appKey })

    try {
      // Generate session with the Breeze API
      const sessionResponse = await breeze.generateSession(appSecret, apiSession)

      console.log("Breeze session generated:", sessionResponse)

      // Store credentials securely in cookies
      const cookieStore = await cookies()

      cookieStore.set("breeze_app_key", appKey, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 24 hours
      })

      cookieStore.set("breeze_app_secret", appSecret, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24,
      })

      cookieStore.set("breeze_api_session", apiSession, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24,
      })

      cookieStore.set("isLoggedIn", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 24 hours
      })
      
      return NextResponse.json({
        success: true,
        message: "Login successful",
        sessionData: sessionResponse,
      })
    } catch (breezeError) {
      console.error("Breeze API error:", breezeError)
      return NextResponse.json(
        {
          error: "Failed to authenticate with Breeze API. Please check your credentials.",
        },
        { status: 401 },
      )
    }
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      {
        error: "Login failed. Please check your credentials.",
      },
      { status: 500 },
    )
  }
}
