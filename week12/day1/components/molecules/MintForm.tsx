'use client'

import { useState } from 'react'
import { useToken } from '@/hooks/useToken'
import { Card } from '@/components/atoms/Card'
import { Input } from '@/components/atoms/Input'
import { Button } from '@/components/atoms/Button'
import { Coins } from 'lucide-react'
import { toast } from 'react-hot-toast'

export const MintForm = () => {
    const { mint, isLoading, isOwner, isConnected } = useToken()
    const [recipient, setRecipient] = useState('')
    const [amount, setAmount] = useState('')

    const handleMint = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!recipient || !amount) {
            toast.error('Please fill in all fields')
            return
        }
        try {
            await mint(recipient, amount)
            setRecipient('')
            setAmount('')
        } catch (error) {
            console.error(error)
        }
    }

    if (!isConnected || !isOwner) return null

    return (
        <Card className="flex flex-col gap-6 border-blue-500/20 bg-blue-500/5">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <Coins className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-white">Mint New Tokens</h2>
                    <p className="text-xs text-blue-400/60 mt-1">Authorized Owner Access Only</p>
                </div>
            </div>

            <form onSubmit={handleMint} className="space-y-4">
                <Input
                    label="Recipient Address"
                    placeholder="0x..."
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    disabled={isLoading}
                    className="bg-blue-500/5 border-blue-500/10 focus:ring-blue-500/10 focus:border-blue-500/20"
                />
                <Input
                    label="Amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={isLoading}
                    className="bg-blue-500/5 border-blue-500/10 focus:ring-blue-500/10 focus:border-blue-500/20"
                />
                <Button
                    type="submit"
                    className="w-full mt-2"
                    isLoading={isLoading}
                    variant="secondary"
                >
                    Mint Tokens
                </Button>
            </form>
        </Card>
    )
}
