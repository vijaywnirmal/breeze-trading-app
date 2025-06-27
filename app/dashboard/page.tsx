"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import {
  Loader2,
  LogOut,
  RefreshCw,
  Wallet,
  TrendingUp,
  DollarSign,
  Download
} from "lucide-react"

interface FundsData {
  [key: string]: any
}

export default function DashboardPage() {
  const [funds, setFunds] = useState<FundsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const fetchFunds = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/funds")
      const data = await response.json()

      if (response.ok) {
        setFunds(data.funds?.Success || {})
      } else {
        if (response.status === 401) {
          router.push("/login")
          return
        }
        setError(data.error || "Failed to fetch funds")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/")
    } catch (err) {
      console.error("Logout error:", err)
      router.push("/")
    }
  }

  useEffect(() => {
    fetchFunds()
  }, [])

  const formatValue = (key: string, value: any) => {
    if (value === null || value === undefined || value === "") return "—"
    if (!isNaN(value) && !key.toLowerCase().includes("account")) {
      return `₹${Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
    }
    return String(value)
  }

  const displayFields = [
    "bank_account",
    "total_bank_balance",
    "allocated_equity",
    "allocated_fno",
    "allocated_commodity",
    "allocated_currency",
    "block_by_trade_equity",
    "block_by_trade_fno",
    "block_by_trade_commodity",
    "block_by_trade_currency",
    "block_by_trade_balance",
    "unallocated_balance"
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading your portfolio...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Trading Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => fetchFunds(true)} disabled={refreshing}>
              {refreshing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {funds && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {displayFields.slice(0, 3).map((key) => (
              <Card key={key}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{key.replace(/_/g, " ")}</CardTitle>
                  {key.toLowerCase().includes("balance") ? (
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                  )}
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold">{formatValue(key, funds[key])}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Account Breakdown</CardTitle>
            <CardDescription>Breakup of allocations and trade blocks</CardDescription>
          </CardHeader>
          <CardContent>
            {funds ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayFields.slice(3).map((key) => (
                  <div key={key} className="flex justify-between border-b pb-1 text-sm">
                    <span className="text-gray-600 capitalize">{key.replace(/_/g, " ")}</span>
                    <span className="font-medium text-gray-900">{formatValue(key, funds[key])}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No breakdown available</p>
            )}
          </CardContent>
        </Card>

        <div className="text-center">
          <Link href="/dashboard/historical-data">
            <Button variant="secondary">
              <Download className="h-4 w-4 mr-2" />
              Download Historical Data
            </Button>
          </Link>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            This is a demo dashboard. Additional trading features can be implemented using the Breeze API.
          </p>
        </div>
      </main>
    </div>
  )
}
