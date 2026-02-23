'use client'

import { ConnectKitButton } from 'connectkit'
import { Disc3 } from 'lucide-react'
import { motion } from 'framer-motion'

export const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between backdrop-blur-md bg-black/20 border border-white/10 rounded-2xl px-6 py-3">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2"
                >
                    <div className="p-2 bg-white/10 rounded-xl">
                        <Disc3 className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight hidden sm:block">
                        BhaiKaSikka
                    </span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <ConnectKitButton.Custom>
                        {({ isConnected, show, truncatedAddress, ensName }) => {
                            return (
                                <button
                                    onClick={show}
                                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl px-4 py-2 text-sm font-medium transition-all backdrop-blur-md"
                                >
                                    {isConnected ? ensName ?? truncatedAddress : 'Connect Wallet'}
                                </button>
                            )
                        }}
                    </ConnectKitButton.Custom>
                </motion.div>
            </div>
        </nav>
    )
}
