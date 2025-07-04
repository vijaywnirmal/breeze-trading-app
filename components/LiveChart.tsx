"use client"

import { useEffect, useRef, useState } from "react"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts"

const stockOptions = [
    { label: "RELIANCE", token: "4.1!2885" },
    { label: "WIPRO", token: "4.1!3787" },
    { label: "SBIN", token: "4.1!3045" },
    { label: "INFY", token: "4.1!1594" },
    { label: "TCS", token: "4.1!11536" }
]

export default function LiveChart() {
    const [data, setData] = useState<any[]>([])
    const [selectedToken, setSelectedToken] = useState(stockOptions[0].token)
    const [selectedLabel, setSelectedLabel] = useState(stockOptions[0].label)
    const dataRef = useRef<any[]>([])
    const breeze = (typeof window !== "undefined" && (window as any).breeze) || null

    useEffect(() => {
        if (!breeze) {
            console.warn("Breeze SDK not available")
            return
        }

        breeze.wsConnect()

        breeze.onTicks = (ticks: any[]) => {
            console.log("Received ticks:", ticks)
            const tick = ticks[0]
            if (!tick) return


            const now = new Date()
            const time = now.toLocaleTimeString()
            const price = tick.last || tick.close || tick.open || 0

            const newPoint = { time, price: parseFloat(price) }
            dataRef.current = [...dataRef.current.slice(-49), newPoint]
            setData([...dataRef.current])
        }

        breeze.subscribeFeeds({
            stockToken: selectedToken,
            getExchangeQuotes: true
        }).then(console.log)


        return () => {
            breeze.unsubscribeFeeds({ stockToken: selectedToken }).then(console.log)
            breeze.wsDisconnect()
        }
    }, [selectedToken])

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = stockOptions.find(opt => opt.token === e.target.value)
        if (!selected) return

        setSelectedToken(selected.token)
        setSelectedLabel(selected.label)
        dataRef.current = []
        setData([])
    }

    return (
        <div className="w-full bg-white rounded-xl shadow p-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Live Price Chart</h2>
                <select
                    className="border px-2 py-1 rounded text-sm"
                    value={selectedToken}
                    onChange={handleChange}
                >
                    {stockOptions.map(stock => (
                        <option key={stock.token} value={stock.token}>
                            {stock.label}
                        </option>
                    ))}
                </select>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={["auto", "auto"]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="price" stroke="#3b82f6" dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}
