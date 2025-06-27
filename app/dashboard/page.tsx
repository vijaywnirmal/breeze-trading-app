"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, LogOut, RefreshCw, Wallet, TrendingUp, DollarSign } from "lucide-react"

interface FundsData {
  cash?: number
  used_margin?: number
  available_margin?: number
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
        setFunds(data.funds)
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
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available Cash</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{funds.cash ? funds.cash.toLocaleString("en-IN") : "0"}</div>
                <p className="text-xs text-muted-foreground">Available for trading</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Used Margin</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹{funds.used_margin ? funds.used_margin.toLocaleString("en-IN") : "0"}
                </div>
                <p className="text-xs text-muted-foreground">Currently utilized</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available Margin</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹{funds.available_margin ? funds.available_margin.toLocaleString("en-IN") : "0"}
                </div>
                <p className="text-xs text-muted-foreground">Available margin</p>
              </CardContent>
            </Card>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>Complete funds information from your ICICI Securities account</CardDescription>
          </CardHeader>
          <CardContent>
            {funds ? (
              <div className="space-y-4">
                <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">{JSON.stringify(funds, null, 2)}</pre>
              </div>
            ) : (
              <p className="text-gray-500">No funds data available</p>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            This is a demo dashboard. Additional trading features can be implemented using the Breeze API.
          </p>
        </div>
      </main>
    </div>
  )
}
