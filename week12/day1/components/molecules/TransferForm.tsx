'use client'

import { useState } from 'react'
import { useToken } from '@/hooks/useToken'
import { Card } from '@/components/atoms/Card'
import { Input } from '@/components/atoms/Input'
import { Button } from '@/components/atoms/Button'
import { Send } from 'lucide-react'
import { toast } from 'react-hot-toast'

export const TransferForm = () => {
    const { transfer, isLoading, isConnected } = useToken()
    const [recipient, setRecipient] = useState('')
    const [amount, setAmount] = useState('')

    const handleTransfer = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!recipient || !amount) {
            toast.error('Please fill in all fields')
            return
        }
        try {
            await transfer(recipient, amount)
            setRecipient('')
            setAmount('')
        } catch (error) {
            console.error(error)
        }
    }

    if (!isConnected) return null

    return (
        <Card className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                    <Send className="w-5 h-5 text-white/80" />
                </div>
                <h2 className="text-xl font-semibold text-white">Transfer Tokens</h2>
            </div>

            <form onSubmit={handleTransfer} className="space-y-4">
                <Input
                    label="Recipient Address"
                    placeholder="0x..."
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    disabled={isLoading}
                />
                <Input
                    label="Amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={isLoading}
                />
                <Button
                    type="submit"
                    className="w-full mt-2"
                    isLoading={isLoading}
                    variant="primary"
                >
                    Send Tokens
                </Button>
            </form>
        </Card>
    )
}
