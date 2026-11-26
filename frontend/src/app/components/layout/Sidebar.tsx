"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Store, Wallet, Scan, CloudLightning, Leaf, LogOut } from "lucide-react";

const navItems = [
  { name: "Marketplace", href: "/marketplace", icon: Store },
  { name: "Finance Ledger", href: "/ledger", icon: Wallet },
  { name: "Crop Scanner", href: "/scanner", icon: Scan },
  { name: "Harvest Risk", href: "/risk-alerts", icon: CloudLightning },
];

type StoredUser = {
  full_name: string;
  email: string;
  role: "farmer" | "bidder";
  region_or_org?: string;
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("daichi_user");
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("daichi_token");
    localStorage.removeItem("daichi_user");
    router.push("/login");
  };

  const initials = user?.full_name
    ? user.full_name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "GU";

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

      {/* Live Authenticated User Badge + Logout */}
      <div className="space-y-2">
        <div className="p-3 bg-white/50 rounded-warm border border-white/70 flex items-center gap-3 backdrop-blur-sm">
          <div className="w-9 h-9 rounded-full bg-daichi-forest text-emerald-200 flex items-center justify-center font-bold text-xs shrink-0 shadow-inner">
            {initials}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-xs font-bold text-daichi-charcoal truncate">
              {user?.full_name || "Guest User"}
            </p>
            <p className="text-[10px] text-daichi-muted truncate capitalize">
              {user?.role ? `${user.role} • ` : ""}
              {user?.region_or_org || "Bangladesh"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full py-2 px-3 rounded-warm text-xs font-semibold text-daichi-clay hover:bg-daichi-clay/10 border border-transparent hover:border-daichi-clay/20 flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}