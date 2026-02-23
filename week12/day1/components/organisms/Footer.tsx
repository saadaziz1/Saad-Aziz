'use client'

import { Disc3, Github, Twitter, Globe } from 'lucide-react'
import { motion } from 'framer-motion'

export const Footer = () => {
    return (
        <footer className="w-full py-12 px-6 border-t border-white/5 bg-black/40 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="col-span-1 md:col-span-2 space-y-4">
                    <div className="flex items-center gap-2">
                        <Disc3 className="w-6 h-6 text-blue-400" />
                        <span className="text-xl font-bold text-white tracking-tight">
                            BhaiKaSikka
                        </span>
                    </div>
                    <p className="text-sm text-white/40 max-w-sm leading-relaxed">
                        The world's first premium ERC-20 token dashboard on Kasplex zkEVM. Experience seamless assets management with state-of-the-art design.
                    </p>
                    <div className="flex items-center gap-4 pt-2">
                        <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                            <Twitter className="w-4 h-4 text-white/60" />
                        </a>
                        <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                            <Github className="w-4 h-4 text-white/60" />
                        </a>
                        <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                            <Globe className="w-4 h-4 text-white/60" />
                        </a>
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Resources</h3>
                    <ul className="space-y-2">
                        <li><a href="#" className="text-sm text-white/40 hover:text-white transition-colors">Documentation</a></li>
                        <li><a href="#" className="text-sm text-white/40 hover:text-white transition-colors">Whitepaper</a></li>
                        <li><a href="#" className="text-sm text-white/40 hover:text-white transition-colors">Explorer</a></li>
                        <li><a href="#" className="text-sm text-white/40 hover:text-white transition-colors">Faucets</a></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Network</h3>
                    <ul className="space-y-2 text-sm text-white/40">
                        <li>Kasplex zkEVM Testnet</li>
                        <li>Chain ID: 167012</li>
                        <li>Currency: KAS</li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-xs text-white/20">
                    © 2026 BhaiKaSikka. All rights reserved.
                </p>
                <div className="flex gap-6">
                    <a href="#" className="text-xs text-white/20 hover:text-white transition-colors">Privacy Policy</a>
                    <a href="#" className="text-xs text-white/20 hover:text-white transition-colors">Terms of Service</a>
                </div>
            </div>
        </footer>
    )
}
