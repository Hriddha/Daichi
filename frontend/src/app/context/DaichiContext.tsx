"use client";

import React, { createContext, useContext, useState, useMemo } from "react";

export type EntryCategory = "Sales" | "Seed" | "Fertilizer" | "Labor" | "Transport";

export interface LedgerEntry {
  id: string;
  receiptNo: string;
  date: string;
  title: string;
  counterparty: string;
  category: EntryCategory;
  type: "revenue" | "expense";
  amount: number;
  points: number;
  source: "Marketplace Sync" | "Auto-Receipt" | "Manual Entry";
}

export interface HarvestCycle {
  id: string;
  name: string;
  nameBn: string;
  season: string;
  status: "Active Harvest" | "In Cultivation";
  entries: LedgerEntry[];
}

export interface BuyerBid {
  id: string;
  buyerName: string;
  location: string;
  pricePerKg: number;
  totalAmount: number;
  paymentMethod: string;
  submittedAt: string;
  status: "Pending" | "Accepted" | "Declined";
}

export interface ProduceListing {
  id: string;
  harvestId: string;
  crop: string;
  cropBn: string;
  quantityKg: number;
  askingPricePerKg: number;
  harvestDate: string;
  grade: string;
  status: "Open for Bids" | "Sold • Delivery Scheduled";
  bids: BuyerBid[];
}

export interface AgriInputProduct {
  id: string;
  name: string;
  category: "Seed" | "Fertilizer";
  vendor: string;
  unit: string;
  price: number;
  pointsEarned: number;
}

interface DaichiContextType {
  harvests: HarvestCycle[];
  listings: ProduceListing[];
  inputProducts: AgriInputProduct[];
  totalPoints: number;
  acceptBid: (listingId: string, bidId: string) => void;
  purchaseInput: (productId: string, harvestId: string, redeemPoints: boolean) => void;
  addManualLedgerEntry: (
    harvestId: string,
    title: string,
    counterparty: string,
    category: EntryCategory,
    amount: number
  ) => void;
  redeemManualPoints: (pts: number) => void;
}

const INITIAL_HARVESTS: HarvestCycle[] = [
  {
    id: "aman-2026",
    name: "BRRI Dhan-28 Rice",
    nameBn: "ব্রি ধান-২৮",
    season: "Aman 2026",
    status: "Active Harvest",
    entries: [
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
        source: "Manual Entry",
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
        source: "Auto-Receipt",
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
        source: "Marketplace Sync",
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
        source: "Marketplace Sync",
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
        date: "Nov 10, 2026",
        title: "Early Harvest Pre-Booking Lot (1,200 kg)",
        counterparty: "FreshBasket Retail",
        category: "Sales",
        type: "revenue",
        amount: 56100,
        points: 120,
        source: "Marketplace Sync",
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
        source: "Marketplace Sync",
      },
    ],
  },
];

const INITIAL_LISTINGS: ProduceListing[] = [
  {
    id: "lst-1",
    harvestId: "aman-2026",
    crop: "Organic BRRI Dhan-28 Rice",
    cropBn: "জৈব ব্রি ধান-২৮",
    quantityKg: 1800,
    askingPricePerKg: 50,
    harvestDate: "Nov 15, 2026",
    grade: "Grade A",
    status: "Open for Bids",
    bids: [
      {
        id: "bid-1",
        buyerName: "Dhaka Agro Wholesalers",
        location: "Karwan Bazar, Dhaka",
        pricePerKg: 48,
        totalAmount: 86400,
        paymentMethod: "Payment on Delivery",
        submittedAt: "1 hour ago",
        status: "Pending",
      },
      {
        id: "bid-2",
        buyerName: "Meghna Grain Mills",
        location: "Narayanganj",
        pricePerKg: 46.5,
        totalAmount: 83700,
        paymentMethod: "Simulated Escrow",
        submittedAt: "4 hours ago",
        status: "Pending",
      },
    ],
  },
  {
    id: "lst-2",
    harvestId: "rabi-2026",
    crop: "Fresh Granola Red Potatoes",
    cropBn: "তাজা লাল আলু",
    quantityKg: 1000,
    askingPricePerKg: 24,
    harvestDate: "Nov 22, 2026",
    grade: "Grade A+",
    status: "Open for Bids",
    bids: [
      {
        id: "bid-3",
        buyerName: "Chaldal Direct Sourcing",
        location: "Dhaka North",
        pricePerKg: 23,
        totalAmount: 23000,
        paymentMethod: "Payment on Delivery",
        submittedAt: "35 mins ago",
        status: "Pending",
      },
    ],
  },
];

const INPUT_PRODUCTS: AgriInputProduct[] = [
  {
    id: "inp-1",
    name: "BADC Certified Urea Fertilizer (50 kg)",
    category: "Fertilizer",
    vendor: "Bogura BADC Hub",
    unit: "1 Bag",
    price: 1350,
    pointsEarned: 35,
  },
  {
    id: "inp-2",
    name: "Hybrid Potato Tuber Seed (50 kg Crate)",
    category: "Seed",
    vendor: "Shibganj Agro Seeds",
    unit: "1 Crate",
    price: 3200,
    pointsEarned: 80,
  },
  {
    id: "inp-3",
    name: "Organic Vermicompost & Potash Mix",
    category: "Fertilizer",
    vendor: "GreenEarth Inputs",
    unit: "40 kg Sack",
    price: 1800,
    pointsEarned: 45,
  },
];

const DaichiContext = createContext<DaichiContextType | undefined>(undefined);

export function DaichiProvider({ children }: { children: React.ReactNode }) {
  const [harvests, setHarvests] = useState<HarvestCycle[]>(INITIAL_HARVESTS);
  const [listings, setListings] = useState<ProduceListing[]>(INITIAL_LISTINGS);
  const [redeemedPoints, setRedeemedPoints] = useState<number>(0);

  const totalPoints = useMemo(() => {
    const earned = harvests.reduce(
      (sum, h) => sum + h.entries.reduce((s, e) => s + e.points, 0),
      0
    );
    return Math.max(0, earned - redeemedPoints);
  }, [harvests, redeemedPoints]);

  const acceptBid = (listingId: string, bidId: string) => {
    const targetListing = listings.find((l) => l.id === listingId);
    const targetBid = targetListing?.bids.find((b) => b.id === bidId);
    if (!targetListing || !targetBid) return;

    setListings((prev) =>
      prev.map((l) =>
        l.id === listingId
          ? {
              ...l,
              status: "Sold • Delivery Scheduled",
              bids: l.bids.map((b) => ({
                ...b,
                status: b.id === bidId ? "Accepted" : "Declined",
              })),
            }
          : l
      )
    );

    const autoRevenueEntry: LedgerEntry = {
      id: `tx-sale-${Date.now()}`,
      receiptNo: `RCP-2026-${Math.floor(9000 + Math.random() * 900)}`,
      date: "Nov 13, 2026",
      title: `${targetListing.crop} (${targetListing.quantityKg.toLocaleString()} kg @ ৳${targetBid.pricePerKg}/kg)`,
      counterparty: targetBid.buyerName,
      category: "Sales",
      type: "revenue",
      amount: targetBid.totalAmount,
      points: Math.round(targetBid.totalAmount / 400),
      source: "Marketplace Sync",
    };

    setHarvests((prev) =>
      prev.map((h) =>
        h.id === targetListing.harvestId
          ? { ...h, entries: [autoRevenueEntry, ...h.entries] }
          : h
      )
    );
  };

  const purchaseInput = (productId: string, harvestId: string, usePoints: boolean) => {
    const product = INPUT_PRODUCTS.find((p) => p.id === productId);
    if (!product) return;

    const discount = usePoints ? Math.min(totalPoints, Math.floor(product.price * 0.2)) : 0;
    const finalPaid = product.price - discount;

    if (discount > 0) {
      setRedeemedPoints((prev) => prev + discount);
    }

    const autoExpenseEntry: LedgerEntry = {
      id: `tx-buy-${Date.now()}`,
      receiptNo: `RCP-2026-${Math.floor(9000 + Math.random() * 900)}`,
      date: "Nov 13, 2026",
      title: `${product.name}${discount > 0 ? ` (Redeemed ${discount} pts)` : ""}`,
      counterparty: product.vendor,
      category: product.category,
      type: "expense",
      amount: finalPaid,
      points: product.pointsEarned,
      source: "Marketplace Sync",
    };

    setHarvests((prev) =>
      prev.map((h) =>
        h.id === harvestId ? { ...h, entries: [autoExpenseEntry, ...h.entries] } : h
      )
    );
  };

  const addManualLedgerEntry = (
    harvestId: string,
    title: string,
    counterparty: string,
    category: EntryCategory,
    amount: number
  ) => {
    const entry: LedgerEntry = {
      id: `tx-man-${Date.now()}`,
      receiptNo: `RCP-2026-${Math.floor(9000 + Math.random() * 900)}`,
      date: "Nov 13, 2026",
      title,
      counterparty: counterparty || "Local Provider",
      category,
      type: category === "Sales" ? "revenue" : "expense",
      amount,
      points: Math.max(10, Math.round(amount / 150)),
      source: "Manual Entry",
    };

    setHarvests((prev) =>
      prev.map((h) => (h.id === harvestId ? { ...h, entries: [entry, ...h.entries] } : h))
    );
  };

  const redeemManualPoints = (pts: number) => {
    setRedeemedPoints((prev) => prev + pts);
  };

  return (
    <DaichiContext.Provider
      value={{
        harvests,
        listings,
        inputProducts: INPUT_PRODUCTS,
        totalPoints,
        acceptBid,
        purchaseInput,
        addManualLedgerEntry,
        redeemManualPoints,
      }}
    >
      {children}
    </DaichiContext.Provider>
  );
}

export function useDaichi() {
  const ctx = useContext(DaichiContext);
  if (!ctx) throw new Error("useDaichi must be used inside DaichiProvider");
  return ctx;
}