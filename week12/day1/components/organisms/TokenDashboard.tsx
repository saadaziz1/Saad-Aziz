'use client'

import { useToken } from '@/hooks/useToken'
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { WalletInfo } from '@/components/molecules/WalletInfo'
import { TransferForm } from '@/components/molecules/TransferForm'
import { MintForm } from '@/components/molecules/MintForm'
import { motion } from 'framer-motion'
import { Info, Activity, ShieldCheck } from 'lucide-react'

export const TokenDashboard = () => {
    const { name, symbol, totalSupply, isConnected, isOwner, isWrongNetwork, chain } = useToken()

    if (!isConnected) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tighter">
                        Bhai Ka <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-emerald-400">Sikka</span>
                    </h1>
                    <p className="text-lg text-white/60 mb-8 max-w-xl mx-auto leading-relaxed">
                        The premier ERC-20 token dashboard on Kasplex. Connect your wallet to manage your assets, transfer tokens, and explore the ecosystem.
                    </p>
                </motion.div>
            </div>
        )
    }

    if (isWrongNetwork) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-24">
                <Card className="border-red-500/50 bg-red-500/5 text-center py-12">
                    <ShieldCheck className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Wrong Network</h2>
                    <p className="text-white/60 mb-6">
                        You are connected to <span className="text-white font-semibold">{chain?.name || 'Unknown Network'}</span>.<br />
                        Please switch to <span className="text-blue-400 font-semibold">Kasplex zkEVM Testnet</span> to view your tokens.
                    </p>
                </Card>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-24 space-y-8">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-white/40 mb-2">
                        <Info className="w-4 h-4" />
                        <span className="text-xs font-semibold uppercase tracking-wider">Token Name</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-white tracking-tight">{name}</span>
                        <Badge variant="primary">{symbol}</Badge>
                    </div>
                </Card>

                <Card className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-white/40 mb-2">
                        <Activity className="w-4 h-4" />
                        <span className="text-xs font-semibold uppercase tracking-wider">Total Supply</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-white">{totalSupply}</span>
                        <span className="text-xs text-white/40 font-mono">{symbol}</span>
                    </div>
                </Card>

                <Card className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-white/40 mb-2">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-xs font-semibold uppercase tracking-wider">Contract Role</span>
                    </div>
                    <div>
                        <Badge variant={isOwner ? "success" : "outline"}>
                            {isOwner ? "Contract Owner" : "Token Holder"}
                        </Badge>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Main Actions */}
                <div className="lg:col-span-8 space-y-8">
                    <WalletInfo />
                    <TransferForm />
                </div>

                {/* Sidebar Actions */}
                <div className="lg:col-span-4">
                    <MintForm />
                </div>
            </div>
        </div>
    )
}
