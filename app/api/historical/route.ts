import { cookies } from "next/headers"
import { NextResponse } from "next/server"
const { BreezeConnect } = require("breezeconnect") // CommonJS is correct here if you're not using ES module exports

export async function POST(req: Request) {
  const cookieStore = cookies()

  const appKey = cookieStore.get("breeze_app_key")?.value
  const appSecret = cookieStore.get("breeze_app_secret")?.value
  const apiSession = cookieStore.get("breeze_api_session")?.value

  if (!appKey || !appSecret || !apiSession) {
    return NextResponse.json(
      { error: "Missing Breeze credentials in cookies." },
      { status: 401 }
    )
  }

  try {
    // Initialize and authenticate
    const breeze = new BreezeConnect({ appKey })
    await breeze.generateSession(appSecret, apiSession)

    const body = await req.json()

    const payload = {
      ...body,
      strikePrice: parseFloat(body.strikePrice || "0"),
    }

    const data = await breeze.getHistoricalDatav2(payload)

    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 })
  }
}
