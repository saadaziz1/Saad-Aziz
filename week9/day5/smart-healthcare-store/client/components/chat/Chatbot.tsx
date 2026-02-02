'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import { MiniProductCard } from '@/components/products/MiniProductCard';
import { GoogleLoader } from '@/components/ui/GoogleLoader';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { messages, isSending: isApiSending, send, clearMessages } = useChat();
    const { isAuthenticated } = useAuth();

    const suggestions = [
        "Suggest vitamins for energy",
        "Best skincare for sensitive skin",
        "Heart rate monitors under $50",
        "Organic protein powder"
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Auto-clear chat on logout
    useEffect(() => {
        if (!isAuthenticated) {
            setIsOpen(false);
            clearMessages();
        }
    }, [isAuthenticated, clearMessages]);

    // Scroll to bottom effect
    useEffect(() => {
        scrollToBottom();
    }, [messages, isApiSending]);

    const handleSend = async () => {
        if (!input.trim() || isApiSending) return;
        const message = input;
        setInput('');
        try {
            await send(message);
        } catch (error) {
            toast.error('Failed to send message');
        }
    };

    const handleSuggestionClick = async (suggestion: string) => {
        if (isApiSending) return;
        try {
            await send(suggestion);
        } catch (error) {
            toast.error('Failed to send suggestion');
        }
    };

    return (
        <>
            {/* Floating Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-linear-to-tr from-primary to-secondary text-white rounded-2xl shadow-2xl flex items-center justify-center hover:rotate-6 transition-transform duration-300"
            >
                <MessageCircle size={32} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full border-2 border-white animate-pulse"></span>
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="chat-window"
                        initial={{ opacity: 0, y: 10, scale: 0.95, pointerEvents: 'none' }}
                        animate={{ opacity: 1, y: 0, scale: 1, pointerEvents: 'auto' }}
                        exit={{ opacity: 0, y: 10, scale: 0.95, pointerEvents: 'none' }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-24 right-4 md:bottom-28 md:right-8 z-50 w-[calc(100vw-2rem)] md:w-[380px] h-[550px] md:h-[520px] bg-white/90 backdrop-blur-xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col border border-white/40"
                    >
                        {/* Header */}
                        <div className="p-6 bg-linear-to-r from-primary to-secondary text-white flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                                    <Bot size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold">Health Buddy</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                        <span className="text-[10px] font-medium opacity-80 uppercase tracking-wider">AI Support Online</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform duration-300">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
                            {messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-8 opacity-60">
                                    <div className="p-4 bg-primary/10 rounded-3xl text-primary animate-pulse">
                                        <Sparkles size={48} />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="font-bold text-xl text-slate-800">Hi! I'm your health assistant.</p>
                                        <p className="text-sm font-medium text-slate-500">Ask me anything about our products.</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-sm">
                                        {suggestions.map((s, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleSuggestionClick(s)}
                                                className="bg-white border border-slate-200 hover:border-primary hover:text-primary text-xs font-bold text-slate-500 py-3 px-4 rounded-xl transition-all shadow-sm hover:shadow-md text-left"
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6 pb-4">
                                    {messages.map((msg, idx) => (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            key={idx}
                                            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                                        >
                                            <div
                                                className={`max-w-[85%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed wrap-break-word ${msg.role === 'user'
                                                    ? 'bg-slate-900 text-white rounded-br-none'
                                                    : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none'
                                                    }`}
                                            >
                                                {msg.role === 'assistant' ? (
                                                    <div className="[&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_li]:mb-1 [&_strong]:font-bold [&_strong]:text-slate-900">
                                                        <ReactMarkdown>
                                                            {msg.content}
                                                        </ReactMarkdown>
                                                    </div>
                                                ) : (
                                                    msg.content
                                                )}
                                            </div>

                                            {/* Product Cards Rendering */}
                                            {msg.products && msg.products.length > 0 && (
                                                <div className="mt-3 w-full max-w-[85%] space-y-2">
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                                                        Recommended Products
                                                    </p>
                                                    <div className="grid gap-2">
                                                        {msg.products.map((product) => (
                                                            <MiniProductCard
                                                                key={product._id}
                                                                product={product}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}

                                    {/* Typing indicator */}
                                    {isApiSending && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex justify-start"
                                        >
                                            <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm">
                                                <GoogleLoader />
                                            </div>
                                        </motion.div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-slate-50 border-t border-slate-100 shrink-0">
                            <div className="relative flex items-center gap-2">
                                <input
                                    type="text"
                                    maxLength={500}
                                    placeholder="Ask for health advice..."
                                    className="flex-1 pl-4 pr-12 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all text-slate-800 text-sm font-medium placeholder:text-slate-400 shadow-sm"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    disabled={isApiSending}
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isApiSending}
                                    className="p-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
                                >
                                    {isApiSending ? <div className="w-5 h-5"><GoogleLoader /></div> : <Send size={18} />}
                                </button>
                            </div>
                            <p className="text-[10px] text-center mt-3 text-slate-400 font-medium">
                                Powered by SmartHealth AI Engine
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
