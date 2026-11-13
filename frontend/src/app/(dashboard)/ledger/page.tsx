"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  ShieldCheck,
  Award,
  Landmark,
  Plus,
  X,
  CheckCircle2,
  Sparkles,
  Filter,
  FileText,
  Coins,
} from "lucide-react";

// --- Types ---
type EntryCategory = "Sales" | "Seed" | "Fertilizer" | "Labor" | "Transport";

interface LedgerEntry {
  id: string;
  receiptNo: string;
  date: string;
  title: string;
  counterparty: string;
  category: EntryCategory;
  type: "revenue" | "expense";
  amount: number;
  points: number;
  autoCaptured: boolean;
}

interface HarvestCycle {
  id: string;
  name: string;
  nameBn: string;
  season: string;
  status: "Active Harvest" | "In Cultivation";
  entries: LedgerEntry[];
}

// --- Deterministic Seed Data (2026 Cycles) ---
const INITIAL_HARVESTS: HarvestCycle[] = [
  {
    id: "aman-2026",
    name: "BRRI Dhan-28 Rice",
    nameBn: "ব্রি ধান-২৮",
    season: "Aman 2026",
    status: "Active Harvest",
    entries: [
      {
        id: "tx-101",
        receiptNo: "RCP-2026-8841",
        date: "Nov 11, 2026",
        title: "Grade-A Paddy Sale (1,800 kg)",
        counterparty: "Dhaka Agro Wholesalers",
        category: "Sales",
        type: "revenue",
        amount: 86400,
        points: 180,
        autoCaptured: true,
      },
      {
        id: "tx-102",
        receiptNo: "RCP-2026-8819",
        date: "Nov 06, 2026",
        title: "Harvesting & Threshing Crew (6 Workers)",
        counterparty: "Bogura Krishi Labor Co-op",
        category: "Labor",
        type: "expense",
        amount: 14500,
        points: 30,
        autoCaptured: false,
      },
      {
        id: "tx-103",
        receiptNo: "RCP-2026-8790",
        date: "Nov 02, 2026",
        title: "Mini-Truck Cold-Chain Dispatch",
        counterparty: "Northern Express Logistics",
        category: "Transport",
        type: "expense",
        amount: 6200,
        points: 25,
        autoCaptured: true,
      },
      {
        id: "tx-104",
        receiptNo: "RCP-2026-8612",
        date: "Oct 14, 2026",
        title: "Urea & TSP Balanced Fertilizer (4 Bags)",
        counterparty: "BADC Authorized Dealer #14",
        category: "Fertilizer",
        type: "expense",
        amount: 9800,
        points: 95,
        autoCaptured: true,
      },
      {
        id: "tx-105",
        receiptNo: "RCP-2026-8405",
        date: "Sep 18, 2026",
        title: "Certified Foundation Paddy Seed (45 kg)",
        counterparty: "BRRI Seed Center",
        category: "Seed",
        type: "expense",
        amount: 5400,
        points: 60,
        autoCaptured: true,
      },
    ],
  },
  {
    id: "rabi-2026",
    name: "Granola Red Potato",
    nameBn: "গ্রানোলা লাল আলু",
    season: "Rabi 2026",
    status: "In Cultivation",
    entries: [
      {
        id: "tx-201",
        receiptNo: "RCP-2026-8902",
        date: "Nov 12, 2026",
        title: "Early Harvest Pre-Booking Lot (1,200 kg)",
        counterparty: "FreshBasket Retail",
        category: "Sales",
        type: "revenue",
        amount: 56100,
        points: 120,
        autoCaptured: true,
      },
      {
        id: "tx-202",
        receiptNo: "RCP-2026-8874",
        date: "Nov 04, 2026",
        title: "Potash & Organic Compost Mix",
        counterparty: "GreenEarth Agro Inputs",
        category: "Fertilizer",
        type: "expense",
        amount: 11400,
        points: 110,
        autoCaptured: true,
      },
      {
        id: "tx-203",
        receiptNo: "RCP-2026-8755",
        date: "Oct 22, 2026",
        title: "Cold-Storage Tuber Seed (300 kg)",
        counterparty: "Shibganj Seed Vault",
        category: "Seed",
        type: "expense",
        amount: 16800,
        points: 140,
        autoCaptured: true,
      },
      {
        id: "tx-204",
        receiptNo: "RCP-2026-8710",
        date: "Oct 19, 2026",
        title: "Soil Ridging & Irrigation Prep",
        counterparty: "Local Field Team",
        category: "Labor",
        type: "expense",
        amount: 4100,
        points: 15,
        autoCaptured: false,
      },
    ],
  },
];

const CATEGORIES: ("All" | EntryCategory)[] = [
  "All",
  "Sales",
  "Seed",
  "Fertilizer",
  "Labor",
  "Transport",
];

// --- Smooth Rolling Number Component ---
function RollingCurrency({
  value,
  prefix = "৳",
  suffix = "",
  decimals = 0,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const spring = useSpring(value, { mass: 0.8, stiffness: 90, damping: 18 });
  const display = useTransform(spring, (current) =>
    `${prefix}${current.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`
  );

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span className="tabular-nums">{display}</motion.span>;
}

export default function FinanceLedgerPage() {
  const [harvests, setHarvests] = useState<HarvestCycle[]>(INITIAL_HARVESTS);
  const [activeHarvestId, setActiveHarvestId] = useState<string>("aman-2026");
  const [selectedCategory, setSelectedCategory] = useState<"All" | EntryCategory>("All");

  // Interactive Modal / Drawer States
  const [activeReceipt, setActiveReceipt] = useState<LedgerEntry | null>(null);
  const [isLoanDrawerOpen, setIsLoanDrawerOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Loan & Points Interactive State
  const [loanAmount, setLoanAmount] = useState<number>(45000);
  const [loanSubmitted, setLoanSubmitted] = useState(false);
  const [redeemedPoints, setRedeemedPoints] = useState<number>(0);

  // New Entry Form State
  const [newTitle, setNewTitle] = useState("");
  const [newCounterparty, setNewCounterparty] = useState("");
  const [newCategory, setNewCategory] = useState<EntryCategory>("Fertilizer");
  const [newAmount, setNewAmount] = useState("");

  const activeHarvest = useMemo(
    () => harvests.find((h) => h.id === activeHarvestId) || harvests[0],
    [harvests, activeHarvestId]
  );

  // Deterministic Financial Calculations (Zero AI)
  const metrics = useMemo(() => {
    const revenue = activeHarvest.entries
      .filter((e) => e.type === "revenue")
      .reduce((acc, e) => acc + e.amount, 0);

    const expenses = activeHarvest.entries
      .filter((e) => e.type === "expense")
      .reduce((acc, e) => acc + e.amount, 0);

    const netProfit = revenue - expenses;
    const profitMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;

    // Expense breakdown by category for visual allocation bar
    const expenseCategories: EntryCategory[] = ["Seed", "Fertilizer", "Labor", "Transport"];
    const breakdown = expenseCategories.map((cat) => {
      const total = activeHarvest.entries
        .filter((e) => e.category === cat)
        .reduce((acc, e) => acc + e.amount, 0);
      return {
        category: cat,
        total,
        pct: expenses > 0 ? (total / expenses) * 100 : 0,
      };
    });

    // Total reward points across all verified receipts
    const totalPoints =
      harvests.reduce(
        (sum, h) => sum + h.entries.reduce((s, e) => s + e.points, 0),
        0
      ) - redeemedPoints;

    // Deterministic Micro-Loan Credit Limit (1.6x net profit capped at ৳120,000)
    const maxLoanEligible = Math.min(120000, Math.max(15000, Math.round(netProfit * 1.6)));

    return {
      revenue,
      expenses,
      netProfit,
      profitMargin,
      breakdown,
      totalPoints,
      maxLoanEligible,
    };
  }, [activeHarvest, harvests, redeemedPoints]);

  const filteredEntries = useMemo(() => {
    if (selectedCategory === "All") return activeHarvest.entries;
    return activeHarvest.entries.filter((e) => e.category === selectedCategory);
  }, [activeHarvest, selectedCategory]);

  // Add Deterministic Transaction
  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(newAmount);
    if (!newTitle.trim() || isNaN(numericAmount) || numericAmount <= 0) return;

    const isRevenue = newCategory === "Sales";
    const earnedPts = Math.max(10, Math.round(numericAmount / 150));

    const entry: LedgerEntry = {
      id: `tx-${Date.now()}`,
      receiptNo: `RCP-2026-${Math.floor(9000 + Math.random() * 900)}`,
      date: "Nov 13, 2026",
      title: newTitle.trim(),
      counterparty: newCounterparty.trim() || "Verified Local Vendor",
      category: newCategory,
      type: isRevenue ? "revenue" : "expense",
      amount: numericAmount,
      points: earnedPts,
      autoCaptured: true,
    };

    setHarvests((prev) =>
      prev.map((h) =>
        h.id === activeHarvestId ? { ...h, entries: [entry, ...h.entries] } : h
      )
    );

    setNewTitle("");
    setNewCounterparty("");
    setNewAmount("");
    setIsAddModalOpen(false);
  };

  const categoryColorMap: Record<EntryCategory, string> = {
    Sales: "bg-emerald-500",
    Seed: "bg-daichi-forest",
    Fertilizer: "bg-teal-600",
    Labor: "bg-daichi-clay",
    Transport: "bg-amber-600",
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Bar: Editorial Title + Audit Badge + Action */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-600/20 text-daichi-forest text-[11px] font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Deterministic Ledger • Exact & Auditable</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-daichi-charcoal tracking-tight">
            Farm Finance Ledger{" "}
            <span className="text-base font-medium text-daichi-muted">/ হিসাব খাতা</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsAddModalOpen(true)}
            className="bg-daichi-forest hover:bg-daichi-forest/90 text-white px-4 py-2.5 rounded-warm text-xs font-semibold flex items-center gap-2 shadow-md transition cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-300" />
            <span>Record Purchase / Sale</span>
          </motion.button>
        </div>
      </div>

      {/* Harvest Cycle Selector Pills (Shared Layout Animation) */}
      <div className="flex flex-wrap items-center justify-between gap-3 glass-panel p-2 rounded-warm-lg border border-white/80">
        <div className="flex items-center gap-1.5">
          {harvests.map((harvest) => {
            const isActive = harvest.id === activeHarvestId;
            return (
              <button
                key={harvest.id}
                onClick={() => {
                  setActiveHarvestId(harvest.id);
                  setSelectedCategory("All");
                }}
                className={`relative px-4 py-2 rounded-warm text-xs font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? "text-white"
                    : "text-daichi-charcoal hover:text-daichi-forest"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeHarvestPill"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute inset-0 bg-daichi-forest rounded-warm shadow-sm"
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <span>{harvest.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? "bg-white/15 text-emerald-200"
                        : "bg-daichi-sand/60 text-daichi-muted"
                    }`}
                  >
                    {harvest.season}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="px-3 text-[11px] text-daichi-muted hidden sm:flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Status: <strong className="text-daichi-charcoal">{activeHarvest.status}</strong></span>
        </div>
      </div>

      {/* Asymmetric Bento Grid: Left P&L Statement (8 cols) + Right Rewards & Loan Pass (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Harvest Financial Position */}
        <motion.div
          layout
          className="lg:col-span-8 glass-panel rounded-warm-lg p-6 md:p-7 border border-white/80 shadow-glass flex flex-col justify-between space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-daichi-charcoal/10 pb-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-daichi-muted mb-1">
                Net Harvest Profit ({activeHarvest.nameBn})
              </p>
              <div className="text-3xl md:text-4xl font-extrabold text-daichi-charcoal tracking-tight">
                <RollingCurrency value={metrics.netProfit} />
              </div>
              <p className="text-xs text-daichi-muted mt-1">
                Calculated deterministically from {activeHarvest.entries.length} verified receipt records
              </p>
            </div>

            {/* Profit Margin Indicator */}
            <div className="bg-white/70 border border-emerald-500/20 rounded-warm px-4 py-3 text-right shrink-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-daichi-muted">
                Profit Margin
              </p>
              <p className="text-2xl font-extrabold text-daichi-forest">
                <RollingCurrency value={metrics.profitMargin} prefix="" suffix="%" decimals={1} />
              </p>
            </div>
          </div>

          {/* Revenue vs Expenses Split */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-warm bg-white/55 border border-white/80">
              <div className="flex items-center justify-between text-xs text-daichi-muted mb-1">
                <span>Harvest Revenue</span>
                <ArrowUpRight className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-xl font-bold text-daichi-forest">
                <RollingCurrency value={metrics.revenue} />
              </p>
            </div>

            <div className="p-4 rounded-warm bg-white/55 border border-white/80">
              <div className="flex items-center justify-between text-xs text-daichi-muted mb-1">
                <span>Total Input & Ops Cost</span>
                <ArrowDownRight className="w-4 h-4 text-daichi-clay" />
              </div>
              <p className="text-xl font-bold text-daichi-clay">
                <RollingCurrency value={metrics.expenses} />
              </p>
            </div>
          </div>

          {/* Expense Allocation Bar */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-[11px]">
              <span className="font-semibold text-daichi-charcoal">Cost Structure Breakdown</span>
              <span className="text-daichi-muted">100% Receipt-Backed</span>
            </div>

            <div className="h-2.5 w-full bg-daichi-sand/60 rounded-full overflow-hidden flex gap-0.5">
              {metrics.breakdown.map((item) => (
                <motion.div
                  key={item.category}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.pct}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className={`h-full ${categoryColorMap[item.category]}`}
                  title={`${item.category}: ৳${item.total.toLocaleString()}`}
                />
              ))}
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-1.5 pt-1">
              {metrics.breakdown.map((item) => (
                <div key={item.category} className="flex items-center gap-1.5 text-[11px] text-daichi-muted">
                  <span className={`w-2 h-2 rounded-full ${categoryColorMap[item.category]}`} />
                  <span>{item.category}:</span>
                  <strong className="text-daichi-charcoal tabular-nums">
                    ৳{item.total.toLocaleString()}
                  </strong>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right: Tactile Points & Micro-Loan Credit Pass */}
        <div className="lg:col-span-4 rounded-warm-lg p-6 bg-daichi-forest text-white shadow-glass flex flex-col justify-between relative overflow-hidden">
          {/* Subtle organic glow inside card */}
          <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-emerald-400/15 blur-2xl pointer-events-none" />

          <div className="space-y-5 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">
                Daichi Farmer Credit Pass
              </span>
              <Award className="w-5 h-5 text-emerald-300" />
            </div>

            <div>
              <p className="text-xs text-emerald-100/80">Redeemable Input Points</p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl font-extrabold tracking-tight tabular-nums">
                  {metrics.totalPoints}
                </span>
                <span className="text-xs text-emerald-300 font-medium">
                  pts (≈ ৳{metrics.totalPoints} discount)
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-warm bg-white/10 border border-white/15 space-y-1.5 backdrop-blur-sm">
              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-100">Micro-Loan Limit</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 text-[10px] font-bold">
                  Pre-Qualified
                </span>
              </div>
              <p className="text-xl font-bold text-white tabular-nums">
                Up to ৳{metrics.maxLoanEligible.toLocaleString()}
              </p>
              <p className="text-[11px] text-emerald-100/75 leading-relaxed">
                Verified by {activeHarvest.entries.length} auditable ledger entries &{" "}
                {metrics.profitMargin.toFixed(0)}% margin.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-6 relative z-10">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              disabled={metrics.totalPoints < 50}
              onClick={() => setRedeemedPoints((prev) => prev + 50)}
              className="px-3 py-2.5 rounded-warm bg-white/15 hover:bg-white/25 disabled:opacity-40 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Coins className="w-3.5 h-3.5 text-emerald-300" />
              <span>Redeem 50pt</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setLoanAmount(Math.round(metrics.maxLoanEligible * 0.6));
                setLoanSubmitted(false);
                setIsLoanDrawerOpen(true);
              }}
              className="px-3 py-2.5 rounded-warm bg-emerald-400 hover:bg-emerald-300 text-daichi-forest text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>Request Loan</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Ledger Entries Table + Animated Category Filters */}
      <div className="glass-panel rounded-warm-lg border border-white/80 shadow-glass overflow-hidden">
        <div className="p-5 border-b border-daichi-charcoal/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-daichi-forest" />
            <h2 className="font-bold text-sm text-daichi-charcoal">
              Harvest Ledger Entries
            </h2>
            <span className="text-[11px] text-daichi-muted">
              (Click any row to inspect digital receipt)
            </span>
          </div>

          {/* Animated Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1 bg-daichi-bg/80 p-1 rounded-warm border border-daichi-charcoal/5">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`relative px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    active ? "text-daichi-forest font-bold" : "text-daichi-muted hover:text-daichi-charcoal"
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="ledgerCategoryTab"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                      className="absolute inset-0 bg-white rounded-lg shadow-xs border border-daichi-charcoal/5"
                    />
                  )}
                  <span className="relative z-10">{cat}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Entries List */}
        <div className="divide-y divide-daichi-charcoal/5">
          <AnimatePresence mode="popLayout">
            {filteredEntries.map((entry) => (
              <motion.div
                key={entry.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.22 }}
                onClick={() => setActiveReceipt(entry)}
                className="p-4 sm:px-6 hover:bg-white/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer group"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-warm flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                      entry.type === "revenue"
                        ? "bg-emerald-500/15 text-daichi-forest"
                        : "bg-daichi-sand/70 text-daichi-charcoal"
                    }`}
                  >
                    <Receipt className="w-4 h-4" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-sm text-daichi-charcoal group-hover:text-daichi-forest transition-colors">
                        {entry.title}
                      </span>
                      {entry.autoCaptured && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-800">
                          Auto-Receipt
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-daichi-muted mt-0.5">
                      <span>{entry.date}</span>
                      <span>•</span>
                      <span>{entry.counterparty}</span>
                      <span>•</span>
                      <span className="font-mono text-[11px]">{entry.receiptNo}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-5 pl-14 sm:pl-0">
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-daichi-bg border border-daichi-charcoal/10 text-daichi-charcoal">
                    {entry.category}
                  </span>

                  <div className="text-right min-w-[110px]">
                    <p
                      className={`text-sm font-bold tabular-nums ${
                        entry.type === "revenue" ? "text-daichi-forest" : "text-daichi-clay"
                      }`}
                    >
                      {entry.type === "revenue" ? "+" : "-"}৳{entry.amount.toLocaleString()}
                    </p>
                    <p className="text-[10px] font-semibold text-emerald-700">
                      +{entry.points} pts earned
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* --- MODAL 1: Digital Auditable Receipt Inspector --- */}
      <AnimatePresence>
        {activeReceipt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveReceipt(null)}
            className="fixed inset-0 bg-daichi-charcoal/30 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#FCFBF9] rounded-warm-lg border border-daichi-charcoal/10 shadow-2xl p-6 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-dashed border-daichi-charcoal/20 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-daichi-forest">
                    Daichi Verified Digital Receipt
                  </span>
                  <h3 className="font-mono text-sm font-bold text-daichi-charcoal mt-0.5">
                    {activeReceipt.receiptNo}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveReceipt(null)}
                  className="p-1.5 rounded-full hover:bg-daichi-sand/60 text-daichi-muted cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-daichi-muted">Harvest Cycle</span>
                  <span className="font-semibold text-daichi-charcoal">{activeHarvest.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-daichi-muted">Date Issued</span>
                  <span className="font-semibold text-daichi-charcoal">{activeReceipt.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-daichi-muted">Vendor / Buyer</span>
                  <span className="font-semibold text-daichi-charcoal">{activeReceipt.counterparty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-daichi-muted">Category</span>
                  <span className="font-semibold text-daichi-charcoal">{activeReceipt.category}</span>
                </div>
              </div>

              <div className="p-4 rounded-warm bg-daichi-sand/40 border border-daichi-charcoal/10 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-daichi-muted">Exact Amount</p>
                  <p className="text-xl font-extrabold text-daichi-charcoal tabular-nums">
                    ৳{activeReceipt.amount.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-daichi-muted">Points Credited</p>
                  <p className="text-sm font-bold text-daichi-forest">+{activeReceipt.points} pts</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-daichi-muted pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Recorded via deterministic ledger transaction. Eligible for micro-loan underwriting.
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- DRAWER 2: Micro-Loan Application Simulator --- */}
      <AnimatePresence>
        {isLoanDrawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLoanDrawerOpen(false)}
            className="fixed inset-0 bg-daichi-charcoal/30 backdrop-blur-xs z-50 flex justify-end"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#FAF8F5] h-full p-6 md:p-8 shadow-2xl border-l border-white flex flex-col justify-between overflow-y-auto"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-daichi-charcoal/10 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-daichi-charcoal">
                      Harvest Micro-Loan Request
                    </h3>
                    <p className="text-xs text-daichi-muted">
                      Underwritten directly by your verified ledger history
                    </p>
                  </div>
                  <button
                    onClick={() => setIsLoanDrawerOpen(false)}
                    className="p-1.5 rounded-full hover:bg-daichi-sand/60 text-daichi-muted cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {!loanSubmitted ? (
                  <>
                    <div className="p-4 rounded-warm bg-white border border-emerald-600/20 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-daichi-muted">Verified Net Surplus</span>
                        <span className="font-bold text-daichi-forest tabular-nums">
                          ৳{metrics.netProfit.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-daichi-muted">Max Eligible Credit</span>
                        <span className="font-bold text-daichi-charcoal tabular-nums">
                          ৳{metrics.maxLoanEligible.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-baseline">
                        <label className="text-xs font-bold text-daichi-charcoal">
                          Select Loan Amount
                        </label>
                        <span className="text-2xl font-extrabold text-daichi-forest tabular-nums">
                          ৳{loanAmount.toLocaleString()}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={10000}
                        max={metrics.maxLoanEligible}
                        step={1000}
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(Number(e.target.value))}
                        className="w-full accent-daichi-forest cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-daichi-muted">
                        <span>৳10,000</span>
                        <span>৳{metrics.maxLoanEligible.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-warm bg-daichi-sand/40 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-daichi-muted">Seasonal Agri-Rate (4% flat)</span>
                        <span className="font-semibold tabular-nums">
                          ৳{Math.round(loanAmount * 0.04).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-daichi-charcoal/10 pt-2 font-bold text-daichi-charcoal">
                        <span>Post-Harvest Repayment</span>
                        <span className="tabular-nums">
                          ৳{Math.round(loanAmount * 1.04).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 rounded-warm-lg bg-white border border-emerald-500/30 text-center space-y-3"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-500/15 text-daichi-forest flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-base text-daichi-charcoal">
                      Loan Application Submitted
                    </h4>
                    <p className="text-xs text-daichi-muted leading-relaxed">
                      Your request for <strong>৳{loanAmount.toLocaleString()}</strong> has been
                      packaged with your deterministic ledger audit report (Ref: #LN-2026-409).
                    </p>
                  </motion.div>
                )}
              </div>

              {!loanSubmitted ? (
                <button
                  onClick={() => setLoanSubmitted(true)}
                  className="w-full py-3.5 rounded-warm bg-daichi-forest hover:bg-daichi-forest/90 text-white font-bold text-xs shadow-md transition cursor-pointer"
                >
                  Submit Application with Ledger Report
                </button>
              ) : (
                <button
                  onClick={() => setIsLoanDrawerOpen(false)}
                  className="w-full py-3 rounded-warm bg-daichi-sand text-daichi-charcoal font-bold text-xs cursor-pointer"
                >
                  Return to Ledger
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MODAL 3: Record New Purchase / Sale --- */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsAddModalOpen(false)}
            className="fixed inset-0 bg-daichi-charcoal/30 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          >
            <motion.form
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleAddEntry}
              className="w-full max-w-md bg-[#FAF8F5] rounded-warm-lg border border-white shadow-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-daichi-charcoal/10 pb-3">
                <h3 className="font-bold text-base text-daichi-charcoal">
                  Record Harvest Transaction
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 rounded-full hover:bg-daichi-sand/60 text-daichi-muted cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-daichi-charcoal mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as EntryCategory)}
                    className="w-full px-3 py-2.5 rounded-warm bg-white border border-daichi-charcoal/15 text-daichi-charcoal font-medium"
                  >
                    <option value="Seed">Seed (Expense)</option>
                    <option value="Fertilizer">Fertilizer (Expense)</option>
                    <option value="Labor">Labor (Expense)</option>
                    <option value="Transport">Transport (Expense)</option>
                    <option value="Sales">Produce Sale (Revenue)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-daichi-charcoal mb-1">
                    Item Description
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., DAP Fertilizer 2 Bags"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-warm bg-white border border-daichi-charcoal/15 text-daichi-charcoal"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-daichi-charcoal mb-1">
                    Vendor or Buyer Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Bogura Agro Store"
                    value={newCounterparty}
                    onChange={(e) => setNewCounterparty(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-warm bg-white border border-daichi-charcoal/15 text-daichi-charcoal"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-daichi-charcoal mb-1">
                    Exact Amount (৳ BDT)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="3200"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-warm bg-white border border-daichi-charcoal/15 text-daichi-charcoal font-bold"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-warm text-xs font-semibold text-daichi-muted hover:text-daichi-charcoal cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-warm bg-daichi-forest text-white text-xs font-bold shadow-md hover:bg-daichi-forest/90 cursor-pointer"
                >
                  Save & Generate Receipt
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}