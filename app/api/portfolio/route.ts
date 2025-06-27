import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

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

    const breeze = new BreezeConnect({ appKey: appKey })

    try {
      await breeze.generateSession(appSecret, apiSession)

      // Get portfolio holdings
      const portfolioResponse = await breeze.getPortfolioHoldings()

      console.log("Portfolio response:", portfolioResponse)

      return NextResponse.json({
        success: true,
        portfolio: portfolioResponse,
      })
    } catch (breezeError) {
      console.error("Breeze Portfolio API error:", breezeError)
      return NextResponse.json(
        {
          error: "Failed to fetch portfolio data from Breeze API",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Portfolio API error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch portfolio data",
      },
      { status: 500 },
    )
  }
}
