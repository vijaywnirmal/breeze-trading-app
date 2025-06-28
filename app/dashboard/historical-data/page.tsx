"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

interface Candle {
  open: number
  high: number
  low: number
  close: number
  strike_price: number
  volume: number
  open_interest: number
  datetime: string
}

function formatDateTime(isoString: string): { date: string; time: string } {
  const dateObj = new Date(isoString)
  const date = dateObj.toLocaleDateString("en-IN")
  const time = dateObj.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  })
  return { date, time }
}

export default function HistoricalDataPage() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit } = useForm({
    defaultValues: {
      interval: "1minute",
      fromDate: "2025-01-01T09:15:00.000Z",
      toDate: "2025-01-01T09:20:00.000Z",
      stockCode: "NIFTY",
      exchangeCode: "NFO",
      productType: "options",
      expiryDate: "2025-01-02T15:30:00.000Z",
      right: "call",
      strikePrice: "23650"
    }
  })

  const onSubmit = async (formData: any) => {
    setLoading(true)
    setError(null)
    setData(null)

    try {
      const res = await fetch("/api/historical", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.error || "Unknown error")
      setData(result)
    } catch (err: any) {
      setError(err.message || "Failed to fetch historical data")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Download Historical Data</CardTitle>
          <CardDescription>Enter details to fetch historical data for a stock, option, or future.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Interval</Label>
              <select {...register("interval")} className="w-full border rounded px-2 py-1">
                <option value="1second">1 second</option>
                <option value="1minute">1 minute</option>
                <option value="5minute">5 minute</option>
                <option value="30minute">30 minute</option>
                <option value="1day">1 day</option>
              </select>
            </div>
            <div>
              <Label>Stock Code</Label>
              <Input {...register("stockCode")} placeholder="e.g. NIFTY" />
            </div>
            <div>
              <Label>Exchange Code</Label>
              <select {...register("exchangeCode")} className="w-full border rounded px-2 py-1">
                <option value="NSE">NSE</option>
                <option value="BSE">BSE</option>
                <option value="NFO">NFO</option>
                <option value="MCX">MCX</option>
              </select>
            </div>
            <div>
              <Label>Product Type</Label>
              <select {...register("productType")} className="w-full border rounded px-2 py-1">
                <option value="cash">Cash</option>
                <option value="futures">Futures</option>
                <option value="options">Options</option>
              </select>
            </div>
            <div>
              <Label>From Date (ISO)</Label>
              <Input {...register("fromDate")} type="text" placeholder="2025-01-01T09:15:00.000Z" />
            </div>
            <div>
              <Label>To Date (ISO)</Label>
              <Input {...register("toDate")} type="text" placeholder="2025-01-01T15:30:00.000Z" />
            </div>
            <div>
              <Label>Expiry Date (for derivatives)</Label>
              <Input {...register("expiryDate")} type="text" placeholder="2025-01-30T07:00:00.000Z" />
            </div>
            <div>
              <Label>Right</Label>
              <select {...register("right")} className="w-full border rounded px-2 py-1">
                <option value="call">Call</option>
                <option value="put">Put</option>
                <option value="others">Others</option>
              </select>
            </div>
            <div>
              <Label>Strike Price</Label>
              <Input {...register("strikePrice")} type="number" step="0.01" placeholder="e.g. 38000" />
            </div>
            <div className="md:col-span-2">
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Fetch Data
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="mt-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {data?.Success && Array.isArray(data.Success) && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Results</CardTitle>
            <CardDescription>
              Displaying first 5 of {data.Success.length} data points fetched
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border border-gray-300 text-sm">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="px-3 py-2 border">Date</th>
                    <th className="px-3 py-2 border">Time</th>
                    <th className="px-3 py-2 border">Open</th>
                    <th className="px-3 py-2 border">High</th>
                    <th className="px-3 py-2 border">Low</th>
                    <th className="px-3 py-2 border">Close</th>
                    <th className="px-3 py-2 border">Strike Price</th>
                    <th className="px-3 py-2 border">Volume</th>
                    <th className="px-3 py-2 border">Open Interest</th>
                  </tr>
                </thead>
                <tbody>
                  {data.Success.slice(0, 5).map((row: Candle, index: number) => {
                    const { date, time } = formatDateTime(row.datetime)
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-3 py-2 border whitespace-nowrap">{date}</td>
                        <td className="px-3 py-2 border whitespace-nowrap">{time}</td>
                        <td className="px-3 py-2 border">{row.open}</td>
                        <td className="px-3 py-2 border">{row.high}</td>
                        <td className="px-3 py-2 border">{row.low}</td>
                        <td className="px-3 py-2 border">{row.close}</td>
                        <td className="px-3 py-2 border">{row.strike_price}</td>
                        <td className="px-3 py-2 border">{row.volume}</td>
                        <td className="px-3 py-2 border">{row.open_interest}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
