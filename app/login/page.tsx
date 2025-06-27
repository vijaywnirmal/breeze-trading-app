"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    appKey: "",
    appSecret: "",
    apiSession: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showSecret, setShowSecret] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        router.push("/dashboard")
      } else {
        setError(data.error || "Login failed")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const loginUrl = formData.appKey
    ? `https://api.icicidirect.com/apiuser/login?api_key=${encodeURI(formData.appKey)}`
    : ""

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Connect to Breeze API</CardTitle>
          <CardDescription className="text-center">
            Enter your ICICI Securities API credentials to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="appKey">API Key</Label>
              <Input
                id="appKey"
                name="appKey"
                type="text"
                placeholder="Enter your API key"
                value={formData.appKey}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="appSecret">App Secret</Label>
              <div className="relative">
                <Input
                  id="appSecret"
                  name="appSecret"
                  type={showSecret ? "text" : "password"}
                  placeholder="Enter your app secret"
                  value={formData.appSecret}
                  onChange={handleInputChange}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => setShowSecret(!showSecret)}
                >
                  {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiSession">API Session</Label>
              <Input
                id="apiSession"
                name="apiSession"
                type="text"
                placeholder="Enter your API session key"
                value={formData.apiSession}
                onChange={handleInputChange}
                required
              />
              {loginUrl && (
                <p className="text-sm text-gray-600">
                  Get your session key from:{" "}
                  <a
                    href={loginUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {loginUrl}
                  </a>
                </p>
              )}
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Connect to Breeze"
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-sm mb-2">How to get your credentials:</h3>
            <ol className="text-sm text-gray-600 space-y-1">
              <li>1. Register for ICICI Securities API access</li>
              <li>2. Get your API Key and App Secret from the developer portal</li>
              <li>3. Visit the login URL above to get your session key</li>
              <li>4. Enter all credentials here to connect</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
