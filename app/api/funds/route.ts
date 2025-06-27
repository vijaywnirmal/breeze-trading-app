import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

// Import the actual BreezeConnect package
const { BreezeConnect } = require("breezeconnect")

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const appKey = cookieStore.get("breeze_app_key")?.value
    const appSecret = cookieStore.get("breeze_app_secret")?.value
    const apiSession = cookieStore.get("breeze_api_session")?.value

    if (!appKey || !appSecret || !apiSession) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Initialize BreezeConnect
    const breeze = new BreezeConnect({ appKey: appKey })

    try {
      // Generate session
      await breeze.generateSession(appSecret, apiSession)

      // Fetch funds data from Breeze API
      const fundsResponse = await breeze.getFunds()

      console.log("Funds response:", fundsResponse)

      return NextResponse.json({
        success: true,
        funds: fundsResponse,
      })
    } catch (breezeError) {
      console.error("Breeze API error:", breezeError)
      return NextResponse.json(
        {
          error: "Failed to fetch funds data from Breeze API",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Funds API error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch funds data",
      },
      { status: 500 },
    )
  }
}
