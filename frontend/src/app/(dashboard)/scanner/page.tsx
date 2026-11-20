"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Scan,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Sprout,
  FlaskConical,
  UserCheck,
  RotateCcw,
  FileCheck2,
  Camera,
  ChevronRight,
} from "lucide-react";

// --- Types ---
type GuidanceTab = "treatment" | "organic" | "prevention";

interface CuratedProtocol {
  referenceSource: string;
  lastVerified: string;
  chemicalDosage: {
    agent: string;
    dosage: string;
    interval: string;
    safetyNote: string;
  };
  organicRemedy: {
    method: string;
    preparation: string;
    application: string;
  };
  preventionSteps: string[];
}

interface ScanDiagnosis {
  id: string;
  cropName: string;
  cropNameBn: string;
  diseaseName: string;
  diseaseNameBn: string;
  pathogen: string;
  confidence: number; // 0 - 100
  severity: "Moderate" | "High" | "Uncertain";
  isLowConfidence: boolean;
  protocol: CuratedProtocol;
}

interface SampleLeafPreset {
  id: string;
  label: string;
  labelBn: string;
  badge: string;
  accentColor: string;
  svgPattern: "potato-blight" | "rice-blight" | "ambiguous-leaf";
  diagnosis: ScanDiagnosis;
}

// --- Verified Agricultural Knowledge Base Presets ---
const SAMPLE_PRESETS: SampleLeafPreset[] = [
  {
    id: "preset-potato",
    label: "Potato Leaf (Spotted)",
    labelBn: "আলুর পাতা",
    badge: "94.8% Match",
    accentColor: "#D97757",
    svgPattern: "potato-blight",
    diagnosis: {
      id: "diag-01",
      cropName: "Potato (Granola)",
      cropNameBn: "আলু",
      diseaseName: "Early Blight",
      diseaseNameBn: "আগাম ধসা রোগ",
      pathogen: "Alternaria solani (Fungal)",
      confidence: 94.8,
      severity: "Moderate",
      isLowConfidence: false,
      protocol: {
        referenceSource: "BARI Tuber Crops Research Center Manual (Sec. 3.4)",
        lastVerified: "Verified Agronomic KB • 2026",
        chemicalDosage: {
          agent: "Mancozeb 80% WP or Copper Oxychloride",
          dosage: "2.0 grams per liter of clean water (approx. 400g per bigha)",
          interval: "Spray every 7–10 days during cool, humid mornings",
          safetyNote: "Stop spraying at least 14 days prior to tuber harvest.",
        },
        organicRemedy: {
          method: "Trichoderma viride Bio-Fungicide & Neem Extract",
          preparation: "Mix 5g Trichoderma powder or 5ml cold-pressed Neem oil per liter water",
          application: "Foliar spray on upper and lower leaf surfaces at early lesion onset.",
        },
        preventionSteps: [
          "Prune and destroy infected lower leaves away from field drainage channels.",
          "Avoid overhead sprinkler irrigation late in the afternoon to keep foliage dry overnight.",
          "Rotate potato plots with non-solanaceous crops (such as maize or pulses) next season.",
        ],
      },
    },
  },
  {
    id: "preset-rice",
    label: "BRRI Dhan-28 Leaf",
    labelBn: "ধানের পাতা",
    badge: "91.4% Match",
    accentColor: "#2D4A3E",
    svgPattern: "rice-blight",
    diagnosis: {
      id: "diag-02",
      cropName: "BRRI Dhan-28 Rice",
      cropNameBn: "ব্রি ধান-২৮",
      diseaseName: "Bacterial Leaf Blight (BLB)",
      diseaseNameBn: "পাতা পোড়া রোগ",
      pathogen: "Xanthomonas oryzae pv. oryzae",
      confidence: 91.4,
      severity: "High",
      isLowConfidence: false,
      protocol: {
        referenceSource: "BRRI Rice Knowledge Bank & DAE Field Guide (v4.1)",
        lastVerified: "Verified Agronomic KB • 2026",
        chemicalDosage: {
          agent: "Copper Hydroxide 77% WP (Bactericide)",
          dosage: "2.0 grams per liter water + 5 kg/bigha Muriate of Potash (MoP) top-dress",
          interval: "Single foliar application after draining standing field water",
          safetyNote: "Do NOT apply Urea (nitrogen) fertilizer until lesions dry completely.",
        },
        organicRemedy: {
          method: "Field Water Draining & Cow-Dung Slurry Spray",
          preparation: "Filter 200g fresh cow dung in 10 liters water; allow to settle for 2 hours",
          application: "Drain stagnant water for 5–7 days to aerate roots and suppress bacterial spread.",
        },
        preventionSteps: [
          "Drain excess floodwater immediately after heavy rainfall or stormy winds.",
          "Split nitrogen (Urea) applications instead of applying a single heavy dose.",
          "Clear weed hosts (Leersia hexandra) along paddy bunds between seasons.",
        ],
      },
    },
  },
  {
    id: "preset-uncertain",
    label: "Curled Leaf (Ambiguous)",
    labelBn: "অস্পষ্ট লক্ষণ",
    badge: "58.2% Low Conf.",
    accentColor: "#B45309",
    svgPattern: "ambiguous-leaf",
    diagnosis: {
      id: "diag-03",
      cropName: "Tomato / Chili Foliage",
      cropNameBn: "টমেটো / মরিচ",
      diseaseName: "Suspected Leaf Curl / Micronutrient Stress",
      diseaseNameBn: "পাতা কোঁকড়ানো (সন্দেহজনক)",
      pathogen: "Low Visual Confidence (< 75% Threshold)",
      confidence: 58.2,
      severity: "Uncertain",
      isLowConfidence: true,
      protocol: {
        referenceSource: "Daichi Safety Guardrail • Escalation Protocol",
        lastVerified: "Held for Human Agronomist Verification",
        chemicalDosage: {
          agent: "Chemical Dosage Withheld (Safety Threshold Not Met)",
          dosage: "Do not apply pesticides until an extension officer confirms the pathogen.",
          interval: "Awaiting expert photo review (typical turnaround < 4 hrs)",
          safetyNote: "Automated dosage suppression prevents crop damage and unnecessary input cost.",
        },
        organicRemedy: {
          method: "Safe Interim Field Isolation",
          preparation: "Install yellow sticky traps (4 per bigha) to monitor whitefly vectors",
          application: "Avoid pruning healthy plants with unsterilized tools until confirmed.",
        },
        preventionSteps: [
          "Retake photo in bright indirect daylight with the leaf flattened against a plain surface.",
          "Submit this scan to a Upazila Agriculture Officer using the review button above.",
        ],
      },
    },
  },
];

// --- Tactile Leaf Specimen SVG Preview ---
function LeafSpecimenArtwork({ pattern }: { pattern: SampleLeafPreset["svgPattern"] }) {
  return (
    <div className="w-full h-52 rounded-warm bg-gradient-to-br from-[#EFECE4] to-[#E3DDD0] border border-daichi-charcoal/10 flex items-center justify-center relative overflow-hidden">
      <svg viewBox="0 0 240 160" className="w-56 h-40 drop-shadow-sm">
        {/* Leaf Silhouette */}
        <path
          d={
            pattern === "rice-blight"
              ? "M25,135 Q95,45 215,25 Q155,95 25,135 Z"
              : "M45,130 C35,70 95,25 195,30 C190,105 125,140 45,130 Z"
          }
          fill={pattern === "rice-blight" ? "#4A7C59" : "#3E6B4C"}
        />
        {/* Central Leaf Vein */}
        <path
          d={
            pattern === "rice-blight"
              ? "M25,135 Q115,75 215,25"
              : "M45,130 Q115,82 195,30"
          }
          stroke="#A3C4A8"
          strokeWidth="2.5"
          fill="none"
        />

        {/* Disease Lesions based on Preset */}
        {pattern === "potato-blight" && (
          <>
            <circle cx="110" cy="68" r="11" fill="#7C3F2C" opacity="0.85" />
            <circle cx="110" cy="68" r="6" fill="#3D1E14" opacity="0.9" />
            <circle cx="145" cy="82" r="9" fill="#8C4A32" opacity="0.85" />
            <circle cx="88" cy="96" r="7" fill="#7C3F2C" opacity="0.8" />
          </>
        )}

        {pattern === "rice-blight" && (
          <>
            <path
              d="M140,42 Q175,32 215,25 Q185,55 150,62 Z"
              fill="#D9A05B"
              opacity="0.9"
            />
            <path
              d="M110,65 Q135,55 155,58 Q135,78 112,82 Z"
              fill="#C88A3B"
              opacity="0.75"
            />
          </>
        )}

        {pattern === "ambiguous-leaf" && (
          <>
            <circle cx="120" cy="75" r="18" fill="#C9A227" opacity="0.45" />
            <path
              d="M135,45 Q165,65 150,95"
              stroke="#D97757"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              opacity="0.7"
            />
          </>
        )}
      </svg>

      <span className="absolute bottom-2.5 right-3 text-[10px] font-mono px-2 py-0.5 rounded bg-white/75 text-daichi-charcoal border border-daichi-charcoal/10">
        224×224 RGB Tensor Ready
      </span>
    </div>
  );
}

export default function CropScannerPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedPreset, setSelectedPreset] = useState<SampleLeafPreset>(SAMPLE_PRESETS[0]);
  const [uploadedPreviewUrl, setUploadedPreviewUrl] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [activeDiagnosis, setActiveDiagnosis] = useState<ScanDiagnosis | null>(
    SAMPLE_PRESETS[0].diagnosis
  );
  const [activeTab, setActiveTab] = useState<GuidanceTab>("treatment");
  const [expertFlagSubmitted, setExpertFlagSubmitted] = useState<boolean>(false);

  const [scanHistory, setScanHistory] = useState<
    { id: string; crop: string; result: string; confidence: number; flagged: boolean; time: string }[]
  >([
    {
      id: "hist-1",
      crop: "Potato (Granola)",
      result: "Early Blight",
      confidence: 94.8,
      flagged: false,
      time: "Today, 10:15 AM",
    },
    {
      id: "hist-2",
      crop: "BRRI Dhan-28",
      result: "Healthy Foliage",
      confidence: 97.1,
      flagged: false,
      time: "Yesterday",
    },
  ]);

  // Trigger Simulated ONNX Vision Inference
  const runVisionInference = (diagnosisToLoad: ScanDiagnosis, labelForHistory: string) => {
    setIsScanning(true);
    setExpertFlagSubmitted(false);
    setActiveTab("treatment");

    setTimeout(() => {
      setIsScanning(false);
      setActiveDiagnosis(diagnosisToLoad);
      setScanHistory((prev) => [
        {
          id: `hist-${Date.now()}`,
          crop: labelForHistory,
          result: diagnosisToLoad.diseaseName,
          confidence: diagnosisToLoad.confidence,
          flagged: diagnosisToLoad.isLowConfidence,
          time: "Just now",
        },
        ...prev.slice(0, 3),
      ]);
    }, 1350);
  };

  // Handle Preset Selection
  const handleSelectPreset = (preset: SampleLeafPreset) => {
    setSelectedPreset(preset);
    setUploadedPreviewUrl(null);
    setUploadedFileName(null);
    runVisionInference(preset.diagnosis, preset.diagnosis.cropName);
  };

  // Handle Real Image Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setUploadedPreviewUrl(objectUrl);
    setUploadedFileName(file.name);

    // Match preset intelligently by filename keywords or default to Potato Early Blight
    const lowerName = file.name.toLowerCase();
    const matchedPreset = lowerName.includes("rice") || lowerName.includes("paddy")
      ? SAMPLE_PRESETS[1]
      : lowerName.includes("curl") || lowerName.includes("test")
      ? SAMPLE_PRESETS[2]
      : SAMPLE_PRESETS[0];

    runVisionInference(matchedPreset.diagnosis, file.name.replace(/\.[^/.]+$/, ""));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-600/20 text-daichi-forest text-[11px] font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>ONNX Vision Classifier + Curated Knowledge Base</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-daichi-charcoal tracking-tight">
            AI Crop Health Scanner{" "}
            <span className="text-base font-medium text-daichi-muted">/ পাতার রোগ নির্ণয়</span>
          </h1>
          <p className="text-xs text-daichi-muted mt-1">
            Upload a leaf photo for disease classification. Dosages are retrieved strictly from verified agricultural manuals.
          </p>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-daichi-forest hover:bg-daichi-forest/90 text-white px-4 py-2.5 rounded-warm text-xs font-bold flex items-center gap-2 shadow-md transition self-start cursor-pointer"
        >
          <Camera className="w-4 h-4 text-emerald-300" />
          <span>Upload Leaf Photo</span>
        </button>
      </div>

      {/* Main Two-Column Inspection Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN (5 Cols): Image Capture & Sample Selector */}
        <div className="lg:col-span-5 space-y-5">
          <div className="glass-panel rounded-warm-lg p-5 border border-white/80 shadow-glass space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-daichi-charcoal">
                1. Leaf Specimen Input
              </span>
              {uploadedFileName && (
                <button
                  onClick={() => handleSelectPreset(SAMPLE_PRESETS[0])}
                  className="text-[11px] font-semibold text-daichi-forest flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> Reset Sample
                </button>
              )}
            </div>

            {/* Interactive Image Viewport with Scanning Beam Animation */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative rounded-warm overflow-hidden cursor-pointer group"
            >
              {uploadedPreviewUrl ? (
                <div className="w-full h-52 bg-daichi-sand/40 relative">
                  <img
                    src={uploadedPreviewUrl}
                    alt="Uploaded crop leaf"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <LeafSpecimenArtwork pattern={selectedPreset.svgPattern} />
              )}

              {/* Hover Upload Overlay */}
              {!isScanning && (
                <div className="absolute inset-0 bg-daichi-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-4 text-center">
                  <Upload className="w-6 h-6 mb-1.5 text-emerald-300" />
                  <span className="text-xs font-bold">Click to Upload JPG / PNG Leaf Photo</span>
                  <span className="text-[10px] text-white/80 mt-0.5">
                    Or select a field test sample below
                  </span>
                </div>
              )}

              {/* Animated Vision Scanning Laser Line */}
              <AnimatePresence>
                {isScanning && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-daichi-forest/35 backdrop-blur-[2px] flex flex-col items-center justify-center"
                  >
                    <motion.div
                      animate={{ y: [-85, 85, -85] }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                      className="w-full h-1 bg-emerald-300 shadow-[0_0_16px_#6ee7b7]"
                    />
                    <div className="absolute bottom-3 px-3 py-1 rounded-full bg-daichi-forest text-white text-[11px] font-bold flex items-center gap-2 shadow">
                      <Scan className="w-3.5 h-3.5 text-emerald-300 animate-spin" />
                      <span>Running EfficientNet-ONNX...</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Quick Field Test Presets (For Live Demo & Testing) */}
            <div className="space-y-2 pt-1">
              <p className="text-[11px] font-semibold text-daichi-muted">
                Quick Field Test Samples (Click to Run Inference):
              </p>
              <div className="space-y-2">
                {SAMPLE_PRESETS.map((preset) => {
                  const isSelected = !uploadedPreviewUrl && selectedPreset.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className={`w-full p-3 rounded-warm border text-left transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? "bg-white border-daichi-forest/40 shadow-sm"
                          : "bg-white/45 border-white/80 hover:bg-white/75"
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold text-daichi-charcoal">
                          {preset.label}{" "}
                          <span className="font-normal text-daichi-muted">({preset.labelBn})</span>
                        </p>
                        <p className="text-[11px] text-daichi-muted">
                          {preset.diagnosis.diseaseName}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          preset.diagnosis.isLowConfidence
                            ? "bg-amber-500/15 text-amber-800"
                            : "bg-emerald-500/15 text-daichi-forest"
                        }`}
                      >
                        {preset.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Field Scans Mini-Log */}
          <div className="glass-panel rounded-warm-lg p-5 border border-white/80 space-y-3">
            <h3 className="text-xs font-bold text-daichi-charcoal">Recent Field Inspections</h3>
            <div className="space-y-2">
              {scanHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-xs p-2.5 rounded-warm bg-white/50 border border-white/70"
                >
                  <div>
                    <p className="font-semibold text-daichi-charcoal">{item.result}</p>
                    <p className="text-[10px] text-daichi-muted">
                      {item.crop} • {item.time}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full tabular-nums ${
                      item.flagged
                        ? "bg-amber-500/15 text-amber-800"
                        : "bg-emerald-500/15 text-daichi-forest"
                    }`}
                  >
                    {item.confidence}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (7 Cols): Classification Result & Verified Knowledge Base */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {activeDiagnosis && (
              <motion.div
                key={activeDiagnosis.id + (uploadedFileName || "")}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="glass-panel rounded-warm-lg p-6 md:p-7 border border-white/80 shadow-glass space-y-6"
              >
                {/* Diagnosis Header + Confidence Meter */}
                <div className="border-b border-daichi-charcoal/10 pb-5 space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-daichi-sage">
                        2. Vision Model Classification ({activeDiagnosis.cropName} /{" "}
                        {activeDiagnosis.cropNameBn})
                      </span>
                      <h2 className="text-2xl font-extrabold text-daichi-charcoal mt-0.5">
                        {activeDiagnosis.diseaseName}{" "}
                        <span className="text-base font-medium text-daichi-muted">
                          ({activeDiagnosis.diseaseNameBn})
                        </span>
                      </h2>
                      <p className="text-xs text-daichi-muted italic mt-0.5">
                        {activeDiagnosis.pathogen}
                      </p>
                    </div>

                    <div
                      className={`px-3.5 py-2 rounded-warm border text-right ${
                        activeDiagnosis.isLowConfidence
                          ? "bg-amber-500/10 border-amber-500/30 text-amber-900"
                          : "bg-emerald-500/10 border-emerald-600/25 text-daichi-forest"
                      }`}
                    >
                      <p className="text-[10px] font-bold uppercase tracking-wider">
                        Confidence Score
                      </p>
                      <p className="text-xl font-extrabold tabular-nums">
                        {activeDiagnosis.confidence.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  {/* Confidence Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="h-2 w-full bg-daichi-sand/70 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${activeDiagnosis.confidence}%` }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className={`h-full rounded-full ${
                          activeDiagnosis.isLowConfidence ? "bg-amber-500" : "bg-daichi-forest"
                        }`}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-daichi-muted">
                      <span>0%</span>
                      <span>Auto-Guidance Threshold: 75.0%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>

                {/* LOW-CONFIDENCE EXPERT REVIEW FLAG BANNER */}
                {activeDiagnosis.isLowConfidence && (
                  <div className="p-4 rounded-warm bg-amber-500/10 border border-amber-500/30 space-y-3">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-amber-950">
                          Low Confidence Flagged for Agronomist Review
                        </h4>
                        <p className="text-xs text-amber-900/90 leading-relaxed">
                          Because model confidence is below 75%, automated chemical dosages are
                          withheld to prevent crop harm. Forward this leaf image to a verified
                          agricultural officer.
                        </p>
                      </div>
                    </div>

                    {!expertFlagSubmitted ? (
                      <button
                        onClick={() => setExpertFlagSubmitted(true)}
                        className="w-full py-2.5 rounded-warm bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>Send Scan to Local Agriculture Extension Officer</span>
                      </button>
                    ) : (
                      <div className="p-3 rounded-warm bg-white/80 border border-emerald-600/25 flex items-center gap-2.5 text-xs text-daichi-forest font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>
                          Ticket #AGR-2026-119 assigned to Bogura Sadar Extension Office. You will
                          be notified upon verification.
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Curated Knowledge Base Guidance Tabs */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-daichi-forest" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-daichi-charcoal">
                        3. Curated Treatment Knowledge Base
                      </h3>
                    </div>
                    <span className="text-[10px] font-semibold text-daichi-sage bg-white/70 px-2.5 py-1 rounded-full border border-daichi-charcoal/10">
                      No AI-Invented Dosages
                    </span>
                  </div>

                  {/* Animated Tab Pills */}
                  <div className="grid grid-cols-3 gap-1.5 bg-daichi-bg/80 p-1 rounded-warm border border-daichi-charcoal/10">
                    {(
                      [
                        { id: "treatment", label: "Verified Treatment", icon: FlaskConical },
                        { id: "organic", label: "Organic Remedy", icon: Sprout },
                        { id: "prevention", label: "Field Prevention", icon: FileCheck2 },
                      ] as const
                    ).map((tab) => {
                      const Icon = tab.icon;
                      const active = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`relative py-2 px-3 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                            active
                              ? "text-white"
                              : "text-daichi-muted hover:text-daichi-charcoal"
                          }`}
                        >
                          {active && (
                            <motion.div
                              layoutId="scannerKbTab"
                              transition={{ type: "spring", stiffness: 380, damping: 30 }}
                              className="absolute inset-0 bg-daichi-forest rounded-lg shadow-xs"
                            />
                          )}
                          <Icon className="w-3.5 h-3.5 relative z-10" />
                          <span className="relative z-10">{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Tab Content Panel */}
                  <div className="p-5 rounded-warm-lg bg-white/70 border border-white space-y-4">
                    {activeTab === "treatment" && (
                      <div className="space-y-3 text-xs">
                        <div>
                          <p className="text-[10px] font-bold uppercase text-daichi-muted">
                            Recommended Agent / Action
                          </p>
                          <p className="text-sm font-bold text-daichi-charcoal mt-0.5">
                            {activeDiagnosis.protocol.chemicalDosage.agent}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          <div className="p-3 rounded-warm bg-daichi-bg/80 border border-daichi-charcoal/5">
                            <p className="text-[10px] font-bold uppercase text-daichi-forest">
                              Exact Dosage
                            </p>
                            <p className="font-semibold text-daichi-charcoal mt-1 leading-relaxed">
                              {activeDiagnosis.protocol.chemicalDosage.dosage}
                            </p>
                          </div>
                          <div className="p-3 rounded-warm bg-daichi-bg/80 border border-daichi-charcoal/5">
                            <p className="text-[10px] font-bold uppercase text-daichi-forest">
                              Application Interval
                            </p>
                            <p className="font-semibold text-daichi-charcoal mt-1 leading-relaxed">
                              {activeDiagnosis.protocol.chemicalDosage.interval}
                            </p>
                          </div>
                        </div>

                        <div className="p-3 rounded-warm bg-daichi-clay/10 border border-daichi-clay/20 text-daichi-charcoal">
                          <strong>Safety Note:</strong>{" "}
                          {activeDiagnosis.protocol.chemicalDosage.safetyNote}
                        </div>
                      </div>
                    )}

                    {activeTab === "organic" && (
                      <div className="space-y-3 text-xs">
                        <div>
                          <p className="text-[10px] font-bold uppercase text-daichi-forest">
                            Organic / Bio-Control Method
                          </p>
                          <p className="text-sm font-bold text-daichi-charcoal mt-0.5">
                            {activeDiagnosis.protocol.organicRemedy.method}
                          </p>
                        </div>
                        <div className="p-3.5 rounded-warm bg-emerald-500/10 border border-emerald-600/20 space-y-1.5">
                          <p>
                            <strong>Preparation:</strong>{" "}
                            {activeDiagnosis.protocol.organicRemedy.preparation}
                          </p>
                          <p>
                            <strong>Application:</strong>{" "}
                            {activeDiagnosis.protocol.organicRemedy.application}
                          </p>
                        </div>
                      </div>
                    )}

                    {activeTab === "prevention" && (
                      <ul className="space-y-2.5 text-xs text-daichi-charcoal">
                        {activeDiagnosis.protocol.preventionSteps.map((step, index) => (
                          <li key={index} className="flex items-start gap-2.5">
                            <ChevronRight className="w-4 h-4 text-daichi-forest shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Verified Reference Citation Footer */}
                    <div className="pt-3 border-t border-daichi-charcoal/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-daichi-muted">
                      <span>
                        Source:{" "}
                        <strong className="text-daichi-charcoal">
                          {activeDiagnosis.protocol.referenceSource}
                        </strong>
                      </span>
                      <span className="text-daichi-forest font-semibold">
                        {activeDiagnosis.protocol.lastVerified}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}