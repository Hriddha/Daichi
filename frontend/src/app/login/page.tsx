"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from "@react-oauth/google";
import {
  Leaf,
  Sprout,
  Store,
  Mail,
  Lock,
  User,
  MapPin,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

type UserRole = "farmer" | "bidder";
type AuthMode = "login" | "register";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

function AgritechStoryIllustration({ role }: { role: UserRole }) {
  const isFarmer = role === "farmer";

  return (
    <div
      className={`relative h-full w-full overflow-hidden p-8 md:p-10 flex flex-col justify-between transition-colors duration-700 ${
        isFarmer
          ? "bg-gradient-to-br from-[#233D32] via-[#2D4A3E] to-[#3E6353]"
          : "bg-gradient-to-br from-[#2C3639] via-[#3F4E4F] to-[#2D4A3E]"
      } text-white`}
    >
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.45, 0.65, 0.45] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute -top-16 -right-16 w-72 h-72 rounded-full blur-3xl pointer-events-none ${
          isFarmer ? "bg-amber-300/30" : "bg-emerald-300/25"
        }`}
      />

      <div className="relative z-10 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-warm bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center">
            <Leaf className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight block leading-none">
              Daichi
            </span>
            <span className="text-[10px] text-emerald-200/80 uppercase tracking-widest">
              ডিজিটাল কৃষি বাজার
            </span>
          </div>
        </Link>

        <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-semibold text-emerald-200">
          {isFarmer ? "Farmer Portal • কৃষক" : "Buyer Portal • ক্রেতা"}
        </span>
      </div>

      <div className="relative z-10 my-6 flex items-center justify-center">
        <svg viewBox="0 0 380 250" className="w-full max-w-sm drop-shadow-xl">
          <motion.circle
            cx={isFarmer ? "285" : "95"}
            cy="58"
            r="32"
            fill={isFarmer ? "#F4C97B" : "#9AD0C2"}
            opacity="0.85"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.path
            d="M65,68 Q75,52 95,55 Q110,42 130,55 Q148,55 150,70 Z"
            fill="#FFFFFF"
            opacity="0.16"
            animate={{ x: [0, 14, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />

          <path
            d="M0,175 Q95,120 195,165 T380,150 L380,250 L0,250 Z"
            fill="#1D332A"
            opacity="0.7"
          />
          <path
            d="M0,192 Q130,145 250,185 T380,175 L380,250 L0,250 Z"
            fill="#4F7765"
            opacity="0.65"
          />
          <path
            d="M0,208 Q190,182 380,212 L380,250 L0,250 Z"
            fill="#EAE3D2"
            opacity="0.2"
          />

          <motion.g
            animate={{ rotate: [-2, 3, -2] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "85px 215px" }}
          >
            <path
              d="M85,215 Q82,165 68,125"
              stroke="#A3C9A8"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M85,215 Q92,160 105,118"
              stroke="#E9C46A"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            <ellipse cx="64" cy="122" rx="4" ry="8" transform="rotate(-25 64 122)" fill="#F4A261" />
            <ellipse cx="108" cy="115" rx="4" ry="8" transform="rotate(20 108 115)" fill="#E9C46A" />
          </motion.g>

          <g transform="translate(142, 128)">
            <rect x="14" y="42" width="68" height="44" rx="10" fill="#D97757" />
            <rect x="10" y="36" width="76" height="10" rx="5" fill="#E68A6B" />
            <circle cx="32" cy="33" r="11" fill="#E9C46A" />
            <circle cx="49" cy="30" r="13" fill="#8AB17D" />
            <circle cx="65" cy="34" r="10" fill="#F4A261" />
            <rect x="26" y="54" width="44" height="18" rx="6" fill="#FAF8F5" />
            <text
              x="48"
              y="66"
              textAnchor="middle"
              fill="#2D4A3E"
              fontSize="9"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              ৳ DIRECT
            </text>
          </g>

          <motion.g
            animate={{ rotate: [2, -2.5, 2] }}
            transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "300px 215px" }}
          >
            <path
              d="M300,215 Q295,165 282,130"
              stroke="#8AB17D"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M300,215 Q308,168 320,136"
              stroke="#E9C46A"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          </motion.g>
        </svg>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={role}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 space-y-2.5"
        >
          <h2 className="text-2xl font-extrabold leading-snug tracking-tight">
            {isFarmer
              ? "Sell Harvests Directly & Keep Every Taka You Earn."
              : "Source Verified Crops Directly from Farm Gates."}
          </h2>
          <p className="text-xs text-emerald-100/80 leading-relaxed">
            {isFarmer
              ? "Compare real-time buyer bids, auto-sync receipts to your finance ledger, and protect crops with AI leaf diagnostics."
              : "Place transparent bids on graded paddy, potatoes, and seasonal produce with traceable harvest dates and delivery tracking."}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function LoginContent() {
  const router = useRouter();

  const [role, setRole] = useState<UserRole>("farmer");
  const [mode, setMode] = useState<AuthMode>("login");

  const [fullName, setFullName] = useState("");
  const [regionOrOrg, setRegionOrOrg] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const completeAuthSession = (data: {
    access_token: string;
    user: { full_name: string; email: string; role: UserRole; region_or_org?: string };
  }) => {
    localStorage.setItem("daichi_token", data.access_token);
    localStorage.setItem("daichi_user", JSON.stringify(data.user));
    setSuccessMsg(`Welcome, ${data.user.full_name}! Redirecting to workspace...`);

    setTimeout(() => {
      router.push("/marketplace");
    }, 650);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const body =
        mode === "login"
          ? { email, password, role }
          : {
              full_name: fullName,
              email,
              password,
              role,
              region_or_org: regionOrOrg,
            };

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Authentication failed.");
      }

      completeAuthSession(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unable to connect to Daichi server.";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  // Real Google Identity Services Callback
  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!credentialResponse.credential) {
      setErrorMsg("Google did not return a valid credential token.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          credential: credentialResponse.credential,
          role,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Google authentication failed.");
      }

      completeAuthSession(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to verify Google account.";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const isGoogleConfigured =
    GOOGLE_CLIENT_ID && !GOOGLE_CLIENT_ID.startsWith("your-google");

  return (
    <div className="min-h-screen bg-daichi-bg text-daichi-charcoal flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      <div className="fixed -top-28 -left-28 w-96 h-96 bg-daichi-sand/70 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed -bottom-28 -right-28 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-5xl rounded-warm-lg bg-white/85 backdrop-blur-xl border border-white shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12"
      >
        <div className="lg:col-span-6 min-h-[340px] lg:min-h-[620px]">
          <AgritechStoryIllustration role={role} />
        </div>

        <div className="lg:col-span-6 p-7 sm:p-10 md:p-12 flex flex-col justify-center space-y-6 bg-[#FCFBF9]">
          {/* Dual-Role Switcher */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-daichi-muted block">
              Select Account Mode
            </span>
            <div className="grid grid-cols-2 gap-2 p-1.5 rounded-warm bg-daichi-sand/50 border border-daichi-charcoal/5">
              {(
                [
                  { id: "farmer", title: "Farmer", bn: "কৃষক", icon: Sprout },
                  { id: "bidder", title: "Bidder / Buyer", bn: "ক্রেতা", icon: Store },
                ] as const
              ).map((item) => {
                const Icon = item.icon;
                const active = role === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setRole(item.id);
                      setErrorMsg(null);
                    }}
                    className={`relative py-2.5 px-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                      active
                        ? "text-white"
                        : "text-daichi-charcoal hover:text-daichi-forest"
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="loginRolePill"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        className="absolute inset-0 bg-daichi-forest rounded-xl shadow-sm"
                      />
                    )}
                    <Icon className="w-4 h-4 relative z-10" />
                    <span className="relative z-10">
                      {item.title}{" "}
                      <span
                        className={`font-normal ${
                          active ? "text-emerald-200" : "text-daichi-muted"
                        }`}
                      >
                        ({item.bn})
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-daichi-charcoal tracking-tight">
              {mode === "login"
                ? `Sign in as ${role === "farmer" ? "a Farmer" : "a Bidder"}`
                : `Create ${role === "farmer" ? "Farmer" : "Bidder"} Account`}
            </h1>
            <p className="text-xs text-daichi-muted mt-1">
              {mode === "login"
                ? "Access your listings, deterministic ledger, and live market bids."
                : "Join Daichi to trade directly without middlemen."}
            </p>
          </div>

          {/* Official Google Sign-In Popup Button */}
          <div className="w-full flex flex-col items-center">
            {isGoogleConfigured ? (
              <div className="w-full flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() =>
                    setErrorMsg("Google Sign-In popup was closed or failed.")
                  }
                  text="continue_with"
                  shape="rectangular"
                  size="large"
                  width="380"
                />
              </div>
            ) : (
              <div className="w-full p-3 rounded-warm bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs">
                Add <code>NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> in{" "}
                <code>frontend/.env.local</code> and restart Next.js to activate the
                Google account chooser.
              </div>
            )}
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-daichi-charcoal/10 w-full" />
            <span className="bg-[#FCFBF9] px-3 text-[11px] text-daichi-muted shrink-0">
              or use email & password
            </span>
            <div className="border-t border-daichi-charcoal/10 w-full" />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-warm bg-daichi-clay/15 border border-daichi-clay/30 text-daichi-clay text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-warm bg-emerald-500/15 border border-emerald-600/30 text-daichi-forest text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-3.5 text-xs">
            {mode === "register" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-daichi-charcoal mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-daichi-muted absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder={
                        role === "farmer" ? "e.g., Abdul Karim" : "e.g., Rahim Traders"
                      }
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-warm bg-white border border-daichi-charcoal/15 focus:outline-none focus:border-daichi-forest"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-daichi-charcoal mb-1">
                    {role === "farmer" ? "District / Upazila" : "Business / Market"}
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-daichi-muted absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder={
                        role === "farmer" ? "e.g., Bogura Sadar" : "e.g., Karwan Bazar"
                      }
                      value={regionOrOrg}
                      onChange={(e) => setRegionOrOrg(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-warm bg-white border border-daichi-charcoal/15 focus:outline-none focus:border-daichi-forest"
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block font-semibold text-daichi-charcoal mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-daichi-muted absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-warm bg-white border border-daichi-charcoal/15 focus:outline-none focus:border-daichi-forest"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-daichi-charcoal mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-daichi-muted absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-warm bg-white border border-daichi-charcoal/15 focus:outline-none focus:border-daichi-forest"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-warm bg-daichi-forest hover:bg-daichi-forest/90 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50 mt-2"
            >
              <span>
                {loading
                  ? "Authenticating..."
                  : mode === "login"
                  ? `Sign In as ${role === "farmer" ? "Farmer" : "Bidder"}`
                  : `Register ${role === "farmer" ? "Farmer" : "Bidder"} Account`}
              </span>
              <ArrowRight className="w-4 h-4 text-emerald-300" />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-daichi-muted">
            {mode === "login" ? (
              <p>
                New to Daichi?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setErrorMsg(null);
                  }}
                  className="font-bold text-daichi-forest hover:underline cursor-pointer"
                >
                  Create a {role} account
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setErrorMsg(null);
                  }}
                  className="font-bold text-daichi-forest hover:underline cursor-pointer"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-daichi-muted">
            <ShieldCheck className="w-3.5 h-3.5 text-daichi-sage" />
            <span>JWT Role-Based Auth • PostgreSQL + FastAPI Verified</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID || "placeholder"}>
      <LoginContent />
    </GoogleOAuthProvider>
  );
}