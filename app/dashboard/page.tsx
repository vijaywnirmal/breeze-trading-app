"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Loader2,
  LogOut,
  RefreshCw,
  Wallet,
  DollarSign,
  Download,
  Menu,
  BarChart2,
  Eye,
  EyeOff
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import dynamic from "next/dynamic"

const LiveChart = dynamic(() => import("@/components/LiveChart").then(mod => mod.default), { ssr: false })

interface FundsData {
  [key: string]: any
}

export default function DashboardPage() {
  const [funds, setFunds] = useState<FundsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState("")
  const [showSidebar, setShowSidebar] = useState(true)
  const [activeView, setActiveView] = useState<"dashboard" | "chart">("dashboard")
  const [showBalance, setShowBalance] = useState(true) // State for toggling balance visibility

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
      return `₹${Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
    }
    return String(value)
  }

  const displayFields = [
    "demat_account",
    "demat_name",
    "total_bank_balance",
    "block_by_trade_equity",
    "block_by_trade_fno",
    "block_by_trade_commodity",
    "block_by_trade_currency"
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
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      {showSidebar && (
        <aside className="w-64 bg-white border-r px-4 py-6 space-y-4 transition-all duration-300">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Navigation</h2>

          <Button
            variant={activeView === "dashboard" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveView("dashboard")}
          >
            Dashboard
          </Button>

          <Button
            variant={activeView === "chart" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveView("chart")}
          >
            <BarChart2 className="h-4 w-4 mr-2" />
            View Live Chart
          </Button>

          <Link href="/dashboard/historical-data">
            <Button variant="secondary" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Download Historical Data
            </Button>
          </Link>
        </aside>
      )}

      {/* Main Content */}
      <div className="flex-1">
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setShowSidebar(!showSidebar)}>
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">
                {activeView === "chart" ? "Live Chart" : "Trading Dashboard"}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              {activeView === "dashboard" && funds && (
                <div className="flex items-center gap-2 text-sm text-gray-800 border px-3 py-1 rounded-md bg-gray-100">
                  <span>Bank Account Balance:</span>
                  <span className="font-semibold">
                    {showBalance
                      ? formatValue("unallocated_balance", funds["unallocated_balance"])
                      : "••••••••"}
                  </span>
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="focus:outline-none"
                  >
                    {showBalance ? (
                      <Eye className="h-4 w-4 text-gray-600" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-600" />
                    )}
                  </button>
                </div>
              )}
              <div className="flex gap-2">
                {activeView === "dashboard" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchFunds(true)}
                    disabled={refreshing}
                  >
                    {refreshing ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    Refresh
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {activeView === "dashboard" && funds && (
            <>
              {/* This div creates the two-column grid layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                {/* Trading Balance Card */}
                <Card className="mb-0"> {/* Removed mb-8 */}
                  <CardHeader>
                    <CardTitle>Trading Balance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Equity</span>
                        <span className="font-medium">
                          {formatValue("allocated_equity", funds["allocated_equity"])}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>FnO</span>
                        <span className="font-medium">
                          {formatValue("allocated_fno", funds["allocated_fno"])}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Commodity</span>
                        <span className="font-medium">
                          {formatValue("allocated_commodity", funds["allocated_commodity"])}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Currency</span>
                        <span className="font-medium">
                          {formatValue("allocated_currency", funds["allocated_currency"])}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Account Breakdown Card */}
                <Card className="mb-0"> {/* Removed mb-8 */}
                  <CardHeader>
                    <CardTitle>Account Breakdown</CardTitle>
                    <CardDescription>
                      Breakup of allocations and trade blocks
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {displayFields.slice(3).map((key) => (
                        <div
                          key={key}
                          className="flex justify-between border-b pb-1 text-sm"
                        >
                          <span className="text-gray-600 capitalize">
                            {key.replace(/_/g, " ")}
                          </span>
                          <span className="font-medium text-gray-900">
                            {formatValue(key, funds[key])}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Funds in Settlement Card */}
                <Card className="mb-0"> {/* Removed mb-6 */}
                  <CardHeader>
                    <CardTitle>Funds in Settlement</CardTitle>
                    <CardDescription>
                      This is the amount temporarily held for trading fees, margin settlements, etc.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-semibold">
                      {formatValue("block_by_trade_balance", funds["block_by_trade_balance"])}
                    </div>
                  </CardContent>
                </Card>

                {/* Add or Remove Funds Card */}
                <Card className="mb-0"> {/* Removed mb-8 */}
                  <CardHeader>
                    <CardTitle>Add or Remove Funds</CardTitle>
                    <CardDescription>
                      Use this form to manage funds across segments.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault()
                        const form = e.target as HTMLFormElement
                        const transactionType = (form.transactionType as HTMLSelectElement).value
                        const segment = (form.segment as HTMLSelectElement).value
                        const amount = (form.amount as HTMLInputElement).value

                        try {
                          const res = await fetch("/api/funds/set", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              transactionType,
                              amount,
                              segment
                            })
                          })

                          const result = await res.json()
                          if (!res.ok) throw new Error(result.error || "Failed to allocate funds")
                          alert("Funds updated successfully.")
                          fetchFunds(true)
                        } catch (err: any) {
                          alert("Error: " + (err.message || "Unknown error"))
                        }
                      }}
                      className="grid md:grid-cols-3 gap-4"
                    >
                      <div>
                        <label className="block mb-1 font-medium">Transaction Type</label>
                        <select name="transactionType" className="w-full border rounded px-2 py-1">
                          <option value="credit">Allocate (Credit)</option>
                          <option value="debit">Unallocate (Debit)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block mb-1 font-medium">Segment</label>
                        <select name="segment" className="w-full border rounded px-2 py-1">
                          <option value="Equity">Equity</option>
                          <option value="FNO">F&O</option>
                          <option value="Commodity">Commodity</option>
                          <option value="Currency">Currency</option>
                        </select>
                      </div>
                      <div>
                        <label className="block mb-1 font-medium">Amount</label>
                        <input
                          name="amount"
                          type="number"
                          min="0"
                          step="0.01"
                          required
                          className="w-full border rounded px-2 py-1"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <Button type="submit" className="mt-2">
                          Submit
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div> {/* End of grid container */}

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">
                  This is a demo dashboard. Additional trading features can be implemented using the Breeze API.
                </p>
              </div>
            </>
          )}

          {activeView === "chart" && (
            <LiveChart stockToken="4.1!1594" />
          )}
        </main>
      </div>
    </div>
  )
}