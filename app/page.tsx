import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, Shield, BarChart3, Wallet } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Breeze Trading Platform</h1>
          <p className="text-xl text-gray-600 mb-8">Connect to ICICI Securities and manage your trading portfolio</p>
          <div className="flex gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="px-8">
                Get Started
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="px-8 bg-transparent">
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader className="text-center">
              <TrendingUp className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <CardTitle>Real-time Trading</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Execute orders in real-time with live market data and instant updates</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Wallet className="h-12 w-12 mx-auto text-green-600 mb-4" />
              <CardTitle>Portfolio Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Manage your complete investment portfolio with detailed analytics</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto text-purple-600 mb-4" />
              <CardTitle>Historical Data</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Access 10 years of historical market data including OHLC data</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 mx-auto text-red-600 mb-4" />
              <CardTitle>Secure API</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Bank-grade security with encrypted API connections to ICICI Securities</CardDescription>
            </CardContent>
          </Card>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-center">How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="font-semibold mb-2">Connect Your Account</h3>
                <p className="text-gray-600">
                  Enter your ICICI Securities API credentials to establish a secure connection
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h3 className="font-semibold mb-2">View Your Portfolio</h3>
                <p className="text-gray-600">Access real-time portfolio data, funds, and trading positions</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="font-semibold mb-2">Start Trading</h3>
                <p className="text-gray-600">Execute trades, monitor positions, and manage your investments</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
