"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  Leaf,
  Store,
  Wallet,
  Scan,
  CloudLightning,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const QUICK_ACTIONS = [
  {
    icon: Store,
    title: "Marketplace",
    desc: "Sell crops directly to buyers at fair market prices.",
    href: "/marketplace",
    badge: "Direct Bidding",
    color: "from-emerald-500/10 to-teal-500/5",
  },
  {
    icon: Scan,
    title: "Crop Health",
    desc: "Scan leaf photos for fast disease identification.",
    href: "/scanner",
    badge: "Instant Diagnosis",
    color: "from-green-500/10 to-emerald-500/5",
  },
  {
    icon: Wallet,
    title: "Finance Ledger",
    desc: "Track harvest costs, profit margins & loan status.",
    href: "/ledger",
    badge: "Exact Ledger",
    color: "from-teal-500/10 to-emerald-500/5",
  },
  {
    icon: CloudLightning,
    title: "Harvest Risk",
    desc: "Weather alerts combined with practical crop action advice.",
    href: "/risk-alerts",
    badge: "Weather Alert",
    color: "from-amber-500/10 to-emerald-500/5",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-daichi-bg text-daichi-charcoal relative overflow-hidden flex flex-col justify-between">
      {/* Dynamic Animated Green Ambient Background Orbs */}
      <div className="fixed -top-24 -left-24 w-[32rem] h-[32rem] bg-emerald-400/20 rounded-full blur-3xl pointer-events-none animate-ambient-green" />
      <div className="fixed top-1/2 -right-24 w-[28rem] h-[28rem] bg-daichi-forest/15 rounded-full blur-3xl pointer-events-none animate-ambient-green delay-1000" />
      <div className="fixed -bottom-24 left-1/3 w-[36rem] h-[36rem] bg-teal-300/20 rounded-full blur-3xl pointer-events-none animate-ambient-green delay-2000" />

      {/* Header */}
      <header className="relative z-20 max-w-6xl mx-auto w-full p-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-warm bg-daichi-forest flex items-center justify-center text-white shadow-md ring-4 ring-emerald-500/10">
            <Leaf className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <span className="font-bold text-xl text-daichi-charcoal tracking-tight flex items-center gap-2">
              Daichi <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300/50">ডিজিটাল কৃষি</span>
            </span>
            <span className="block text-[11px] font-medium text-daichi-sage">Direct Farmer-to-Buyer Ecosystem</span>
          </div>
        </div>

        {/* Live System Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel border border-emerald-500/20 text-xs font-semibold text-daichi-forest">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span>Live Market Connected</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-8 flex-1 flex flex-col justify-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8 text-center"
        >
          {/* Top Tagline */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-emerald-500/30 shadow-sm bg-white/50">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-daichi-forest">
              Simple • Direct • AI-Assisted Farming
            </span>
          </motion.div>

          {/* Hero Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl font-extrabold text-daichi-charcoal tracking-tight leading-tight max-w-3xl mx-auto"
          >
            Empowering Farmers with <span className="text-daichi-forest underline decoration-emerald-400 decoration-wavy underline-offset-8">Fair Prices & Smart Decisions</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-base md:text-lg text-daichi-muted max-w-2xl mx-auto leading-relaxed"
          >
            Sell harvest directly to buyers without middlemen, detect plant diseases from photos, and get actionable weather alerts.
          </motion.p>

          {/* Simple Large Action Button for Farmers */}
          <motion.div variants={itemVariants} className="pt-2">
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-3 bg-daichi-forest hover:bg-emerald-900 text-white px-9 py-4 rounded-warm-lg font-bold text-base shadow-lg hover:shadow-emerald-900/20 transition-all duration-300 ring-4 ring-emerald-500/20"
            >
              <span>Enter Platform</span>
              <ArrowRight className="w-5 h-5 text-emerald-300" />
            </Link>
          </motion.div>

          {/* Farmer-Friendly Feature Cards */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 pt-8 text-left"
          >
            {QUICK_ACTIONS.map((action, idx) => {
              const Icon = action.icon;
              return (
                <Link key={idx} href={action.href}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    className={`glass-panel green-glow-hover p-6 rounded-warm-lg border border-white/80 shadow-glass flex flex-col justify-between h-full group bg-gradient-to-br ${action.color}`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-warm bg-emerald-500/10 text-daichi-forest flex items-center justify-center group-hover:bg-daichi-forest group-hover:text-white transition-colors duration-300">
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full">
                          {action.badge}
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-daichi-charcoal mb-1.5">{action.title}</h3>
                      <p className="text-xs text-daichi-muted leading-relaxed">{action.desc}</p>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-emerald-500/10 flex items-center gap-1 text-xs font-bold text-daichi-forest group-hover:translate-x-1 transition-transform">
                      <span>Open Feature</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-6xl mx-auto w-full p-6 text-center text-xs text-daichi-muted border-t border-emerald-500/10">
        <p>© 2026 Daichi Platform • CSE 327 Project</p>
      </footer>
    </div>
  );
}