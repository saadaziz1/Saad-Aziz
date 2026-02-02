'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Zap, Sparkles, HeartPulse, Stethoscope, Activity } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-50 overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 md:pt-48 md:pb-32 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-primary/10 rounded-full blur-[100px] animate-float"></div>
          <div className="absolute top-[20%] right-[10%] w-96 h-96 bg-secondary/10 rounded-full blur-[120px]" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-[10%] left-[20%] w-80 h-80 bg-accent/10 rounded-full blur-[100px]" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-6 py-2 bg-white rounded-full shadow-sm border border-slate-100 mb-8"
          >
            <Sparkles size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-widest text-slate-800">Revolutionizing Healthcare</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.9]"
          >
            Your Health, <br />
            <span className="text-primary italic">Refined</span> by AI.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-500 max-w-3xl mx-auto mb-12 font-medium leading-relaxed"
          >
            SmartHealth combines premium supplements with intelligent intent-based search to guide you toward your wellness goals faster and smarter.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link href="/products" className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-[24px] font-black text-xl shadow-2xl shadow-slate-900/20 hover:bg-slate-800 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 group">
              Shop Now
              <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/login" className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 rounded-[24px] font-black text-xl border border-slate-200 hover:bg-slate-50 transition-all duration-300 flex items-center justify-center">
              Sign In
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 px-6 md:py-32 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: <ShieldCheck size={40} />, title: "Certified Purity", desc: "Every product in our store is lab-tested and certified for 100% purity and potency." },
              { icon: <Zap size={40} />, title: "AI-Powered", desc: "Our intent search understands your needs even when you don't know the exact product name." },
              { icon: <Activity size={40} />, title: "Personalized", desc: "Smart health assistants are available 24/7 to provide tailored recommendations." }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-10 rounded-[40px] bg-slate-50 hover:bg-white hover:shadow-2xl hover:shadow-primary/10 border border-transparent hover:border-primary/20 transition-all duration-500"
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Quote / CTA */}
      <section className="py-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto glass rounded-[60px] p-12 md:p-24 text-center relative overflow-hidden border border-white/40 shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-primary/5 to-secondary/5 -z-10"></div>
          <HeartPulse size={80} className="mx-auto text-primary mb-12 animate-pulse opacity-20" />
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 tracking-tighter">
            Better insight into your <br /> <span className="text-secondary italic">Daily Wellness.</span>
          </h2>
          <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto mb-12">
            Join thousands of users who have optimized their healthcare routine with our intelligent platform.
          </p>
          <Link href="/signup" className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-white rounded-[24px] font-black text-xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20">
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer-ish */}
      <footer className="py-12 px-6 border-t border-slate-100 text-center text-slate-400 font-medium text-sm">
        &copy; 2026 SmartHealth Store. Developed with Passion for Excellence.
      </footer>
    </main>
  );
}
