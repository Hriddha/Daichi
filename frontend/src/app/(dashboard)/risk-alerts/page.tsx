"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import { useDaichi } from "@/app/context/DaichiContext";
import {
  CloudRain,
  Wind,
  Droplets,
  Thermometer,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Circle,
  ArrowRight,
  RefreshCw,
  MapPin,
  Layers,
  CalendarClock,
  SlidersHorizontal,
} from "lucide-react";

// --- Types ---
type WeatherScenarioId = "forecast-rain" | "severe-squall" | "optimal-dry";

interface DayForecast {
  day: string;
  date: string;
  condition: string;
  rainfallMm: number;
  windKmh: number;
  humidityPct: number;
  tempRange: string;
}

interface WeatherScenario {
  id: WeatherScenarioId;
  label: string;
  badge: string;
  region: string;
  summary: string;
  totalRainfall72h: number;
  peakWindKmh: number;
  avgHumidityPct: number;
  soilSaturationPct: number;
  daily: DayForecast[];
}

interface RuleTrigger {
  ruleCode: string;
  description: string;
  observedValue: string;
  threshold: string;
  weightAdded: number;
}

interface MitigationStep {
  id: string;
  titleEn: string;
  titleBn: string;
  detailEn: string;
  detailBn: string;
  urgency: "Immediate" | "Within 24h" | "Preventive";
  linkedRoute?: {
    label: string;
    href: string;
  };
}

// --- Deterministic Weather Telemetry Scenarios (Open-Meteo Schema) ---
const WEATHER_SCENARIOS: Record<WeatherScenarioId, WeatherScenario> = {
  "forecast-rain": {
    id: "forecast-rain",
    label: "Live 72h Forecast (Heavy Rain)",
    badge: "Active Alert",
    region: "Bogura Sadar • 24.85°N, 89.37°E",
    summary: "Low-pressure trough bringing 54mm rainfall and 88% humidity over the next 72 hours.",
    totalRainfall72h: 54,
    peakWindKmh: 32,
    avgHumidityPct: 88,
    soilSaturationPct: 84,
    daily: [
      {
        day: "Tomorrow",
        date: "Nov 22",
        condition: "Moderate Showers",
        rainfallMm: 18,
        windKmh: 24,
        humidityPct: 85,
        tempRange: "21°–26°C",
      },
      {
        day: "Monday",
        date: "Nov 23",
        condition: "Heavy Downpour",
        rainfallMm: 28,
        windKmh: 32,
        humidityPct: 92,
        tempRange: "20°–24°C",
      },
      {
        day: "Tuesday",
        date: "Nov 24",
        condition: "Overcast & Humid",
        rainfallMm: 8,
        windKmh: 18,
        humidityPct: 87,
        tempRange: "21°–27°C",
      },
    ],
  },
  "severe-squall": {
    id: "severe-squall",
    label: "Simulate Cyclone / Squall",
    badge: "Extreme Test",
    region: "Bogura Sadar • 24.85°N, 89.37°E",
    summary: "Severe convective squall with 58 km/h wind gusts and 86mm intense rainfall.",
    totalRainfall72h: 86,
    peakWindKmh: 58,
    avgHumidityPct: 94,
    soilSaturationPct: 95,
    daily: [
      {
        day: "Tomorrow",
        date: "Nov 22",
        condition: "Gusty Squalls",
        rainfallMm: 42,
        windKmh: 58,
        humidityPct: 95,
        tempRange: "19°–23°C",
      },
      {
        day: "Monday",
        date: "Nov 23",
        condition: "Waterlogging Rain",
        rainfallMm: 34,
        windKmh: 44,
        humidityPct: 94,
        tempRange: "19°–22°C",
      },
      {
        day: "Tuesday",
        date: "Nov 24",
        condition: "Residual Drizzle",
        rainfallMm: 10,
        windKmh: 22,
        humidityPct: 91,
        tempRange: "20°–25°C",
      },
    ],
  },
  "optimal-dry": {
    id: "optimal-dry",
    label: "Simulate Dry Harvest Window",
    badge: "Low Risk Test",
    region: "Bogura Sadar • 24.85°N, 89.37°E",
    summary: "Clear post-monsoon skies with dry northwesterly breeze ideal for harvesting & sun-drying.",
    totalRainfall72h: 2,
    peakWindKmh: 14,
    avgHumidityPct: 62,
    soilSaturationPct: 41,
    daily: [
      {
        day: "Tomorrow",
        date: "Nov 22",
        condition: "Clear & Sunny",
        rainfallMm: 0,
        windKmh: 12,
        humidityPct: 60,
        tempRange: "18°–28°C",
      },
      {
        day: "Monday",
        date: "Nov 23",
        condition: "Dry Breeze",
        rainfallMm: 0,
        windKmh: 14,
        humidityPct: 61,
        tempRange: "18°–29°C",
      },
      {
        day: "Tuesday",
        date: "Nov 24",
        condition: "Partly Cloudy",
        rainfallMm: 2,
        windKmh: 11,
        humidityPct: 65,
        tempRange: "19°–28°C",
      },
    ],
  },
};

// --- Animated Risk Score Number ---
function AnimatedRiskScore({ value }: { value: number }) {
  const spring = useSpring(value, { mass: 0.8, stiffness: 95, damping: 18 });
  const display = useTransform(spring, (current) => Math.round(current).toString());

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span className="tabular-nums">{display}</motion.span>;
}

export default function HarvestRiskAlertsPage() {
  const { harvests, listings } = useDaichi();

  const [selectedHarvestId, setSelectedHarvestId] = useState<string>(
    harvests[0]?.id || "aman-2026"
  );
  const [scenarioId, setScenarioId] = useState<WeatherScenarioId>("forecast-rain");
  const [adviceLang, setAdviceLang] = useState<"en" | "bn">("en");
  const [isRefreshingAdvice, setIsRefreshingAdvice] = useState<boolean>(false);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const activeHarvest = useMemo(
    () => harvests.find((h) => h.id === selectedHarvestId) || harvests[0],
    [harvests, selectedHarvestId]
  );

  const linkedListing = useMemo(
    () => listings.find((l) => l.harvestId === selectedHarvestId),
    [listings, selectedHarvestId]
  );

  const scenario = WEATHER_SCENARIOS[scenarioId];

  // --- Deterministic Meteorological + Agronomic Rule Engine ---
  const riskAssessment = useMemo(() => {
    const isRice = selectedHarvestId === "aman-2026";
    const triggers: RuleTrigger[] = [];
    let score = 8; // Baseline environmental exposure

    // Rule 1: 72-Hour Cumulative Rainfall Threshold
    if (scenario.totalRainfall72h >= 50) {
      const pts = isRice ? 44 : 48; // Root tubers (potato) suffer acute rot in saturated soil
      score += pts;
      triggers.push({
        ruleCode: "R-RAIN-72H",
        description: isRice
          ? "Heavy rainfall during mature paddy harvest window (grain shattering & lodging risk)"
          : "Excess rainfall exceeding potato ridge drainage capacity (tuber rot risk)",
        observedValue: `${scenario.totalRainfall72h} mm`,
        threshold: "> 35 mm / 72h",
        weightAdded: pts,
      });
    } else if (scenario.totalRainfall72h >= 20) {
      score += 24;
      triggers.push({
        ruleCode: "R-RAIN-MOD",
        description: "Moderate precipitation disrupting field drying operations",
        observedValue: `${scenario.totalRainfall72h} mm`,
        threshold: "> 20 mm / 72h",
        weightAdded: 24,
      });
    }

    // Rule 2: Wind Gust Lodging Threshold
    if (scenario.peakWindKmh >= 45) {
      const pts = isRice ? 32 : 16;
      score += pts;
      triggers.push({
        ruleCode: "R-WIND-LODGE",
        description: "High wind gusts capable of flattening standing ripe rice stalks",
        observedValue: `${scenario.peakWindKmh} km/h`,
        threshold: "> 45 km/h",
        weightAdded: pts,
      });
    } else if (scenario.peakWindKmh >= 30) {
      score += 14;
      triggers.push({
        ruleCode: "R-WIND-MOD",
        description: "Brisk gusts increasing moisture lodging on heavy panicles",
        observedValue: `${scenario.peakWindKmh} km/h`,
        threshold: "> 30 km/h",
        weightAdded: 14,
      });
    }

    // Rule 3: Post-Harvest Spoilage & Fungal Humidity Threshold
    if (scenario.avgHumidityPct >= 85) {
      score += 18;
      triggers.push({
        ruleCode: "R-HUM-MOLD",
        description: "Sustained relative humidity > 85% accelerates fungal blight & grain discoloration",
        observedValue: `${scenario.avgHumidityPct}% RH`,
        threshold: "> 85% RH",
        weightAdded: 18,
      });
    }

    const clampedScore = Math.min(98, score);
    const level: "HIGH RISK" | "MODERATE RISK" | "LOW RISK" =
      clampedScore >= 65
        ? "HIGH RISK"
        : clampedScore >= 35
        ? "MODERATE RISK"
        : "LOW RISK";

    // Financial Exposure Calculation linked to Marketplace Listing
    const lotKg = linkedListing?.quantityKg || (isRice ? 1800 : 1000);
    const unitPrice = linkedListing?.askingPricePerKg || (isRice ? 48 : 23);
    const totalCropValue = lotKg * unitPrice;
    const estimatedLossAtRisk = Math.round(totalCropValue * (clampedScore / 100) * 0.42);

    // Structured LLM Action Plan tailored to Crop + Weather Triggers
    const steps: MitigationStep[] =
      level === "LOW RISK"
        ? [
            {
              id: "step-dry-1",
              titleEn: "Proceed with Scheduled Harvest & Sun-Drying",
              titleBn: "নির্ধারিত সময়ে ফসল কাটা ও রোদে শুকানো চালিয়ে যান",
              detailEn: `Humidity at ${scenario.avgHumidityPct}% allows grain moisture to drop below 13% within 2 days of sun-drying.`,
              detailBn: `বাতাসের আর্দ্রতা ${scenario.avgHumidityPct}% থাকায় ২ দিন রোদে শুকালেই আর্দ্রতা ১৩%-এর নিচে নামবে।`,
              urgency: "Preventive",
              linkedRoute: { label: "Compare Buyer Bids", href: "/marketplace" },
            },
            {
              id: "step-dry-2",
              titleEn: "Lock In Current High Buyer Offers",
              titleBn: "বর্তমান ভালো বাজারদরে ক্রেতার অফার নিশ্চিত করুন",
              detailEn:
                "Dry-weather supply surges often soften local mandi prices next week. Accepting top bids now protects margin.",
              detailBn:
                "শুষ্ক আবহাওয়ায় বাজারে সরবরাহ বাড়লে দাম কমতে পারে। এখনই সেরা অফার গ্রহণ করে লাভ নিশ্চিত করুন।",
              urgency: "Within 24h",
              linkedRoute: { label: "Open Marketplace", href: "/marketplace" },
            },
          ]
        : isRice
        ? [
            {
              id: "step-rice-1",
              titleEn: "Reap Mature Panicles Immediately Before Monday Downpour",
              titleBn: "সোমবারের ভারী বৃষ্টির আগেই পাকা ধান কেটে ফেলুন",
              detailEn: `With ${scenario.totalRainfall72h}mm rain forecast, harvesting ripe BRRI Dhan-28 48 hours early prevents grain shattering and stalk lodging.`,
              detailBn: `আগামী ৭২ ঘণ্টায় ${scenario.totalRainfall72h} মি.মি. বৃষ্টির পূর্বাভাস রয়েছে। ৪৮ ঘণ্টা আগে ধান কাটলে ঝরে পড়া ও হেলে পড়া রোধ হবে।`,
              urgency: "Immediate",
              linkedRoute: { label: "Log Labor Crew in Ledger", href: "/ledger" },
            },
            {
              id: "step-rice-2",
              titleEn: "Cut Perimeter Bund Channels to Drain Standing Water",
              titleBn: "জমির আইল কেটে জমে থাকা পানি বের করার নালা তৈরি করুন",
              detailEn:
                "Open 15cm drainage outlets at the lowest plot corner so rainwater exits within 3 hours instead of submerging cut sheaves.",
              detailBn:
                "জমির নিচু কোণায় নালা কেটে দিন যাতে বৃষ্টির পানি ৩ ঘণ্টার মধ্যে নেমে যায় এবং কাটা ধান ভিজে না যায়।",
              urgency: "Immediate",
            },
            {
              id: "step-rice-3",
              titleEn: "Move Threshed Paddy Under Tarpaulin & Confirm Buyer Pickup",
              titleBn: "মাড়াইকৃত ধান ত্রিপলের নিচে রাখুন ও ক্রেতার ডেলিভারি নিশ্চিত করুন",
              detailEn:
                "Stack bagged paddy on wooden pallets off damp floors and schedule immediate buyer dispatch on Daichi Marketplace.",
              detailBn:
                "স্যাঁতসেঁতে মেঝে থেকে উঁচুতে কাঠের পাটাতনে বস্তা রাখুন এবং মার্কেটপ্লেসে দ্রুত ডেলিভারি নিশ্চিত করুন।",
              urgency: "Within 24h",
              linkedRoute: { label: "Schedule Buyer Dispatch", href: "/marketplace" },
            },
          ]
        : [
            {
              id: "step-pot-1",
              titleEn: "Deepen Furrow Trenches Between Potato Ridges",
              titleBn: "আলুর সারির মাঝের নালাগুলো আরও গভীর করে দিন",
              detailEn: `Soil saturation is projected at ${scenario.soilSaturationPct}%. Clearing furrow exits prevents waterlogging and bacterial soft rot in Granola tubers.`,
              detailBn: `মাটির আর্দ্রতা ${scenario.soilSaturationPct}% পর্যন্ত পৌঁছাতে পারে। নালা পরিষ্কার রাখলে জলাবদ্ধতা ও আলু পচা রোগ রোধ হবে।`,
              urgency: "Immediate",
              linkedRoute: { label: "Record Field Prep Cost", href: "/ledger" },
            },
            {
              id: "step-pot-2",
              titleEn: "Apply Preventive Copper Fungicide Before Rain Onset",
              titleBn: "বৃষ্টি শুরুর আগেই প্রতিরোধক ছত্রাকনাশক স্প্রে করুন",
              detailEn:
                "High humidity (88%+) triggers Late/Early Blight spores immediately after rainfall. Apply protective spray while foliage is still dry.",
              detailBn:
                "অতিরিক্ত আর্দ্রতায় (৮৮%+) বৃষ্টির পরপরই মড়ক রোগ ছড়ায়। পাতা শুকনো থাকা অবস্থায় প্রতিরোধক স্প্রে করুন।",
              urgency: "Within 24h",
              linkedRoute: { label: "Check Dosage in Scanner", href: "/scanner" },
            },
            {
              id: "step-pot-3",
              titleEn: "Pre-Book Early Harvest Lot to Lock Cashflow",
              titleBn: "আগাম ফসল বিক্রির অর্ডার নিশ্চিত করে নগদ অর্থ সুরক্ষিত করুন",
              detailEn:
                "Confirm buyer pickup terms so harvested tubers move directly to ventilated storage without field delay.",
              detailBn:
                "ক্রেতার সাথে দ্রুত পরিবহন নিশ্চিত করুন যাতে তোলা আলু মাঠে পড়ে না থেকে সরাসরি সংরক্ষণাগারে যায়।",
              urgency: "Within 24h",
              linkedRoute: { label: "View Buyer Offers", href: "/marketplace" },
            },
          ];

    return {
      score: clampedScore,
      level,
      triggers,
      lotKg,
      totalCropValue,
      estimatedLossAtRisk,
      steps,
    };
  }, [selectedHarvestId, scenario, linkedListing]);

  const handleRegenerateAdvice = () => {
    setIsRefreshingAdvice(true);
    setTimeout(() => setIsRefreshingAdvice(false), 650);
  };

  const toggleStep = (id: string) => {
    setCompletedSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isHighRisk = riskAssessment.level === "HIGH RISK";
  const isModerate = riskAssessment.level === "MODERATE RISK";

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-600/20 text-daichi-forest text-[11px] font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Rule-Based Weather Scorer + LLM Action Synthesis</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-daichi-charcoal tracking-tight">
            AI Harvest Risk Alerts{" "}
            <span className="text-base font-medium text-daichi-muted">/ আবহাওয়া ঝুঁকি সতর্কতা</span>
          </h1>
          <p className="text-xs text-daichi-muted mt-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-daichi-sage" />
            <span>{scenario.region} • Synchronized with your active harvest calendar</span>
          </p>
        </div>

        {/* Weather Scenario Simulator Switcher (For Live Demo) */}
        <div className="flex flex-wrap items-center gap-1.5 glass-panel p-1.5 rounded-warm-lg border border-white/80">
          <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-daichi-muted flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3" /> Weather Feed:
          </span>
          {(Object.values(WEATHER_SCENARIOS) as WeatherScenario[]).map((sc) => {
            const active = sc.id === scenarioId;
            return (
              <button
                key={sc.id}
                onClick={() => {
                  setScenarioId(sc.id);
                  handleRegenerateAdvice();
                }}
                className={`relative px-3 py-1.5 rounded-warm text-xs font-semibold transition-colors cursor-pointer ${
                  active ? "text-white" : "text-daichi-charcoal hover:text-daichi-forest"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="weatherScenarioPill"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute inset-0 bg-daichi-forest rounded-warm shadow-xs"
                  />
                )}
                <span className="relative z-10">{sc.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Harvest Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 glass-panel p-2 rounded-warm-lg border border-white/80">
        <div className="flex items-center gap-1.5">
          {harvests.map((h) => {
            const active = h.id === selectedHarvestId;
            return (
              <button
                key={h.id}
                onClick={() => setSelectedHarvestId(h.id)}
                className={`relative px-4 py-2 rounded-warm text-xs font-semibold transition-colors cursor-pointer ${
                  active ? "text-white" : "text-daichi-charcoal hover:text-daichi-forest"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="riskHarvestTab"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute inset-0 bg-daichi-forest rounded-warm shadow-xs"
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <span>{h.name}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      active
                        ? "bg-white/15 text-emerald-200"
                        : "bg-daichi-sand/60 text-daichi-muted"
                    }`}
                  >
                    {h.nameBn}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="px-3 text-xs text-daichi-muted flex items-center gap-2">
          <CalendarClock className="w-3.5 h-3.5 text-daichi-sage" />
          <span>
            Target Harvest:{" "}
            <strong className="text-daichi-charcoal">
              {linkedListing?.harvestDate || "Nov 15, 2026"}
            </strong>{" "}
            ({riskAssessment.lotKg.toLocaleString()} kg)
          </span>
        </div>
      </div>

      {/* Top Grid: Deterministic Risk Gauge (5 Cols) + 72h Weather Telemetry Strip (7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Deterministic Risk Score & Financial Exposure */}
        <motion.div
          layout
          className={`lg:col-span-5 glass-panel rounded-warm-lg p-6 border-l-4 shadow-glass flex flex-col justify-between space-y-5 ${
            isHighRisk
              ? "border-l-daichi-clay"
              : isModerate
              ? "border-l-amber-500"
              : "border-l-daichi-forest"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-daichi-muted">
                Deterministic Loss Risk Index
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span
                  className={`text-4xl font-extrabold tracking-tight ${
                    isHighRisk
                      ? "text-daichi-clay"
                      : isModerate
                      ? "text-amber-700"
                      : "text-daichi-forest"
                  }`}
                >
                  <AnimatedRiskScore value={riskAssessment.score} />
                </span>
                <span className="text-sm font-bold text-daichi-muted">/ 100</span>
              </div>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wide ${
                isHighRisk
                  ? "bg-daichi-clay text-white"
                  : isModerate
                  ? "bg-amber-500 text-white"
                  : "bg-daichi-forest text-white"
              }`}
            >
              {riskAssessment.level}
            </span>
          </div>

          {/* Animated Risk Bar */}
          <div className="space-y-1.5">
            <div className="h-2.5 w-full bg-daichi-sand/70 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${riskAssessment.score}%` }}
                transition={{ duration: 0.65, ease: "easeOut" }}
                className={`h-full rounded-full ${
                  isHighRisk
                    ? "bg-daichi-clay"
                    : isModerate
                    ? "bg-amber-500"
                    : "bg-daichi-forest"
                }`}
              />
            </div>
            <div className="flex justify-between text-[10px] text-daichi-muted">
              <span>0 Safe</span>
              <span>35 Moderate</span>
              <span>65+ High Alert</span>
            </div>
          </div>

          {/* Financial Value at Risk linked to Marketplace/Ledger */}
          <div className="p-4 rounded-warm bg-white/60 border border-white space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-daichi-muted">Active Harvest Lot Value</span>
              <strong className="text-daichi-charcoal tabular-nums">
                ৳{riskAssessment.totalCropValue.toLocaleString()}
              </strong>
            </div>
            <div className="flex justify-between items-center text-xs border-t border-daichi-charcoal/10 pt-2">
              <span className="text-daichi-muted">Unmitigated Weather Exposure</span>
              <strong
                className={`tabular-nums ${
                  isHighRisk ? "text-daichi-clay" : "text-daichi-forest"
                }`}
              >
                {riskAssessment.level === "LOW RISK"
                  ? "Minimal (< ৳1,500)"
                  : `~৳${riskAssessment.estimatedLossAtRisk.toLocaleString()} at risk`}
              </strong>
            </div>
          </div>
        </motion.div>

        {/* Right: 72-Hour Micro-Climate Telemetry */}
        <div className="lg:col-span-7 glass-panel rounded-warm-lg p-6 border border-white/80 shadow-glass flex flex-col justify-between space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold text-daichi-charcoal">
                72-Hour Field Weather Window
              </h2>
              <p className="text-xs text-daichi-muted mt-0.5">{scenario.summary}</p>
            </div>
          </div>

          {/* 4 Key Telemetry Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-warm bg-white/65 border border-white">
              <div className="flex items-center gap-1.5 text-[11px] text-daichi-muted mb-1">
                <CloudRain className="w-3.5 h-3.5 text-daichi-forest" />
                <span>72h Rainfall</span>
              </div>
              <p className="text-lg font-extrabold text-daichi-charcoal tabular-nums">
                {scenario.totalRainfall72h} mm
              </p>
            </div>

            <div className="p-3 rounded-warm bg-white/65 border border-white">
              <div className="flex items-center gap-1.5 text-[11px] text-daichi-muted mb-1">
                <Wind className="w-3.5 h-3.5 text-daichi-sage" />
                <span>Peak Gusts</span>
              </div>
              <p className="text-lg font-extrabold text-daichi-charcoal tabular-nums">
                {scenario.peakWindKmh} km/h
              </p>
            </div>

            <div className="p-3 rounded-warm bg-white/65 border border-white">
              <div className="flex items-center gap-1.5 text-[11px] text-daichi-muted mb-1">
                <Droplets className="w-3.5 h-3.5 text-teal-700" />
                <span>Avg Humidity</span>
              </div>
              <p className="text-lg font-extrabold text-daichi-charcoal tabular-nums">
                {scenario.avgHumidityPct}%
              </p>
            </div>

            <div className="p-3 rounded-warm bg-white/65 border border-white">
              <div className="flex items-center gap-1.5 text-[11px] text-daichi-muted mb-1">
                <Layers className="w-3.5 h-3.5 text-daichi-clay" />
                <span>Soil Moisture</span>
              </div>
              <p className="text-lg font-extrabold text-daichi-charcoal tabular-nums">
                {scenario.soilSaturationPct}%
              </p>
            </div>
          </div>

          {/* 3-Day Breakdown Strip */}
          <div className="grid grid-cols-3 gap-3">
            {scenario.daily.map((d, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-warm bg-daichi-bg/75 border border-daichi-charcoal/5 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-daichi-charcoal">{d.day}</span>
                  <span className="text-[10px] text-daichi-muted">{d.date}</span>
                </div>
                <p className="text-[11px] font-medium text-daichi-forest">{d.condition}</p>
                <div className="pt-1 flex items-center justify-between text-[11px] text-daichi-muted tabular-nums">
                  <span>{d.rainfallMm}mm rain</span>
                  <span>{d.windKmh}km/h</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Deterministic Rule Audit (5 Cols) + LLM Action Plan Checklist (7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Transparent Rule-Based Threshold Audit */}
        <div className="lg:col-span-5 glass-panel rounded-warm-lg p-6 border border-white/80 shadow-glass space-y-4">
          <div className="flex items-center justify-between border-b border-daichi-charcoal/10 pb-3">
            <div>
              <h3 className="text-sm font-bold text-daichi-charcoal">
                Rule Engine Audit Log
              </h3>
              <p className="text-[11px] text-daichi-muted">
                Exact agronomic thresholds triggered before LLM synthesis
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-daichi-sand/70 text-daichi-charcoal">
              Deterministic
            </span>
          </div>

          {riskAssessment.triggers.length === 0 ? (
            <div className="p-5 rounded-warm bg-emerald-500/10 border border-emerald-600/20 text-xs text-daichi-forest space-y-1">
              <p className="font-bold">Zero Hazard Thresholds Exceeded</p>
              <p className="text-daichi-muted leading-relaxed">
                Rainfall, wind gusts, and relative humidity remain safely within dry harvest
                tolerances for {activeHarvest.name}.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {riskAssessment.triggers.map((rule) => (
                <div
                  key={rule.ruleCode}
                  className="p-3.5 rounded-warm bg-white/65 border border-white space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-daichi-clay">
                      {rule.ruleCode}
                    </span>
                    <span className="text-[11px] font-extrabold text-daichi-charcoal bg-daichi-sand/60 px-2 py-0.5 rounded-full tabular-nums">
                      +{rule.weightAdded} risk pts
                    </span>
                  </div>
                  <p className="text-xs font-medium text-daichi-charcoal leading-relaxed">
                    {rule.description}
                  </p>
                  <div className="flex justify-between text-[11px] text-daichi-muted pt-1 border-t border-daichi-charcoal/5 tabular-nums">
                    <span>
                      Forecast: <strong className="text-daichi-charcoal">{rule.observedValue}</strong>
                    </span>
                    <span>Limit: {rule.threshold}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Personalized LLM Action Advice & Farmer Checklist */}
        <div className="lg:col-span-7 glass-panel rounded-warm-lg p-6 border border-white/80 shadow-glass space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-daichi-charcoal/10 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-warm bg-daichi-forest text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4 text-emerald-300" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-daichi-charcoal">
                  AI Harvest Mitigation Plan
                </h3>
                <p className="text-[11px] text-daichi-muted">
                  Tailored for {activeHarvest.name} ({activeHarvest.season})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Bilingual Toggle (English / Bangla) */}
              <div className="flex items-center bg-daichi-bg/90 p-0.5 rounded-warm border border-daichi-charcoal/10 text-[11px] font-bold">
                <button
                  onClick={() => setAdviceLang("en")}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    adviceLang === "en"
                      ? "bg-daichi-forest text-white"
                      : "text-daichi-muted hover:text-daichi-charcoal"
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setAdviceLang("bn")}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    adviceLang === "bn"
                      ? "bg-daichi-forest text-white"
                      : "text-daichi-muted hover:text-daichi-charcoal"
                  }`}
                >
                  বাংলা
                </button>
              </div>

              <button
                onClick={handleRegenerateAdvice}
                title="Refresh AI Guidance"
                className="p-2 rounded-warm bg-white/70 hover:bg-white border border-daichi-charcoal/10 text-daichi-forest transition cursor-pointer"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isRefreshingAdvice ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>

          {/* Actionable Checklist */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedHarvestId}-${scenarioId}-${adviceLang}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: isRefreshingAdvice ? 0.45 : 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-3"
            >
              {riskAssessment.steps.map((step) => {
                const isDone = !!completedSteps[step.id];
                return (
                  <div
                    key={step.id}
                    onClick={() => toggleStep(step.id)}
                    className={`p-4 rounded-warm-lg border transition-all cursor-pointer ${
                      isDone
                        ? "bg-emerald-500/10 border-emerald-600/25 opacity-80"
                        : "bg-white/75 border-white hover:bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        className="mt-0.5 text-daichi-forest shrink-0 cursor-pointer"
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <Circle className="w-5 h-5 text-daichi-sage" />
                        )}
                      </button>

                      <div className="flex-1 space-y-1.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4
                            className={`text-xs sm:text-sm font-bold ${
                              isDone
                                ? "line-through text-daichi-muted"
                                : "text-daichi-charcoal"
                            }`}
                          >
                            {adviceLang === "en" ? step.titleEn : step.titleBn}
                          </h4>
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                              step.urgency === "Immediate"
                                ? "bg-daichi-clay/15 text-daichi-clay"
                                : "bg-daichi-sand/80 text-daichi-forest"
                            }`}
                          >
                            {step.urgency}
                          </span>
                        </div>

                        <p className="text-xs text-daichi-muted leading-relaxed">
                          {adviceLang === "en" ? step.detailEn : step.detailBn}
                        </p>

                        {step.linkedRoute && (
                          <div className="pt-1.5" onClick={(e) => e.stopPropagation()}>
                            <Link
                              href={step.linkedRoute.href}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-daichi-forest hover:underline"
                            >
                              <span>{step.linkedRoute.label}</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}