// app/api/funds/set/route.ts
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

// Dynamically require to avoid SSR issues
const { BreezeConnect } = require("breezeconnect")

export async function POST(req: Request) {
  try {
    const { transactionType, amount, segment } = await req.json()

    const cookieStore = cookies()

    const appKey = cookieStore.get("breeze_app_key")?.value
    const appSecret = cookieStore.get("breeze_app_secret")?.value
    const apiSession = cookieStore.get("breeze_api_session")?.value

    if (!appKey || !appSecret || !apiSession) {
      return NextResponse.json({ error: "Missing Breeze credentials in cookies" }, { status: 401 })
    }

    const breeze = new BreezeConnect({ appKey })
    await breeze.generateSession(appSecret, apiSession)

    const result = await breeze.setFunds({
      transactionType,
      amount,
      segment,
    })

    return NextResponse.json(result)
  } catch (err: any) {
    console.error("SetFunds Error:", err)
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 })
  }
}
