'use client'

import { useToken } from '@/hooks/useToken'
import { Card } from '@/components/atoms/Card'
import { Wallet, Copy, Check } from 'lucide-react'
import { useState, useCallback } from 'react'

export const WalletInfo = () => {
    const { address, isConnected, balance, symbol } = useToken()
    const [copied, setCopied] = useState(false)

    const copyToClipboard = useCallback(() => {
        if (!address) return
        navigator.clipboard.writeText(address)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }, [address])

    if (!isConnected) return null

    return (
        <Card className="flex items-center gap-4 py-4 px-6 overflow-hidden">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 shrink-0">
                <Wallet className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs text-white/40 font-medium">Connected Wallet</span>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-white font-mono truncate">
                        {address}
                    </span>
                    <button
                        onClick={copyToClipboard}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors shrink-0"
                        title="Copy address"
                    >
                        {copied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                            <Copy className="w-3.5 h-3.5 text-white/40" />
                        )}
                    </button>
                </div>
            </div>
            <div className="ml-auto flex flex-col items-end">
                <span className="text-xs text-white/40 font-medium whitespace-nowrap">Your Balance</span>
                <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-white leading-none">{balance}</span>
                    <span className="text-xs font-medium text-white/40 uppercase leading-none">{symbol}</span>
                </div>
            </div>
        </Card>
    )
}
