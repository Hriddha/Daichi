"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Store,
  Wallet,
  Scan,
  CloudLightning,
  Leaf,
  LogOut,
  ChevronUp,
  UserCheck,
  ArrowLeftRight,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const navItems = [
  { name: "Marketplace", href: "/marketplace", icon: Store },
  { name: "Finance Ledger", href: "/ledger", icon: Wallet },
  { name: "Crop Scanner", href: "/scanner", icon: Scan },
  { name: "Harvest Risk", href: "/risk-alerts", icon: CloudLightning },
];

type StoredUser = {
  id?: number;
  full_name?: string;
  name?: string;
  email?: string;
  role?: "farmer" | "bidder" | string;
  region_or_org?: string;
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<StoredUser | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const rawUser = localStorage.getItem("daichi_user");
      const token = localStorage.getItem("daichi_token");

      if (rawUser) {
        try {
          setUser(JSON.parse(rawUser));
        } catch {
          localStorage.removeItem("daichi_user");
        }
      }

      // Sync with FastAPI /api/auth/me if token exists so PostgreSQL data is always authoritative
      if (token) {
        try {
          const res = await fetch(`${API_BASE}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const freshUser = await res.json();
            setUser(freshUser);
            localStorage.setItem("daichi_user", JSON.stringify(freshUser));
          } else if (res.status === 401) {
            localStorage.removeItem("daichi_token");
            localStorage.removeItem("daichi_user");
            setUser(null);
          }
        } catch {
          // Keep cached localStorage user if backend is temporarily offline
        }
      }

      setLoaded(true);
    };

    loadUser();
    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("daichi_token");
    localStorage.removeItem("daichi_user");
    setUser(null);
    setMenuOpen(false);
    router.push("/login");
  };

  const displayName = user?.full_name || user?.name || (loaded ? "Not Signed In" : "Loading...");
  const initials =
    user?.full_name || user?.name
      ? (user.full_name || user.name || "")
          .trim()
          .split(/\s+/)
          .map((part) => part[0])
          .slice(0, 2)
          .join("")
          .toUpperCase()
      : "?";

  return (
    <aside className="w-64 glass-panel m-4 rounded-warm-lg p-6 flex flex-col justify-between shrink-0 sticky top-4 h-[calc(100vh-2rem)] border border-white/80 shadow-glass">
      <div>
        {/* Brand Header */}
        <Link href="/" className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 rounded-warm bg-daichi-forest flex items-center justify-center text-white shadow-md">
            <Leaf className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-daichi-charcoal tracking-tight">Daichi</h1>
            <p className="text-[11px] font-medium text-daichi-sage">Agri-Intelligence</p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-warm text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-daichi-forest text-white shadow-md"
                    : "text-daichi-charcoal hover:bg-white/60 hover:text-daichi-forest"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-emerald-300" : "text-daichi-sage"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Interactive Authenticated User Account Menu */}
      <div className="relative space-y-2">
        {menuOpen && user && (
          <div className="p-3.5 rounded-warm bg-white/95 backdrop-blur-xl border border-daichi-forest/15 shadow-xl space-y-3 text-xs">
            <div className="border-b border-daichi-charcoal/10 pb-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-daichi-charcoal truncate">{displayName}</span>
                <span className="px-2 py-0.5 rounded-full bg-daichi-forest/10 text-daichi-forest font-semibold text-[10px] uppercase">
                  {user.role || "Member"}
                </span>
              </div>
              {user.email && (
                <p className="text-[11px] text-daichi-muted truncate mt-0.5">{user.email}</p>
              )}
              {user.region_or_org && (
                <p className="text-[10px] text-daichi-sage truncate mt-0.5">{user.region_or_org}</p>
              )}
            </div>

            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="w-full py-2 px-2.5 rounded-lg text-daichi-charcoal hover:bg-daichi-sand/40 font-semibold flex items-center gap-2 transition"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-daichi-forest" />
              <span>Switch Role / Account</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full py-2 px-2.5 rounded-lg text-daichi-clay hover:bg-daichi-clay/10 font-semibold flex items-center gap-2 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        )}

        {user ? (
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="w-full p-3 bg-white/60 hover:bg-white/85 rounded-warm border border-white/80 flex items-center gap-3 backdrop-blur-sm transition text-left cursor-pointer shadow-sm"
          >
            <div className="w-9 h-9 rounded-full bg-daichi-forest text-emerald-200 flex items-center justify-center font-bold text-xs shrink-0 shadow-inner">
              {initials}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-bold text-daichi-charcoal truncate">{displayName}</p>
              <p className="text-[10px] text-daichi-muted truncate capitalize">
                {user.role ? `${user.role} • ` : ""}
                {user.region_or_org || "Bangladesh"}
              </p>
            </div>
            <ChevronUp
              className={`w-4 h-4 text-daichi-muted transition-transform shrink-0 ${
                menuOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        ) : (
          <Link
            href="/login"
            className="w-full p-3 bg-daichi-forest hover:bg-daichi-forest/90 text-white rounded-warm flex items-center justify-center gap-2 text-xs font-bold shadow-md transition"
          >
            <UserCheck className="w-4 h-4 text-emerald-300" />
            <span>Sign In / Register</span>
          </Link>
        )}
      </div>
    </aside>
  );
}