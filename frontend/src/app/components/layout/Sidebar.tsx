"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Store, Wallet, Scan, CloudLightning, Leaf } from "lucide-react";

const navItems = [
  { name: "Marketplace", href: "/marketplace", icon: Store },
  { name: "Finance Ledger", href: "/ledger", icon: Wallet },
  { name: "Crop Scanner", href: "/scanner", icon: Scan },
  { name: "Harvest Risk", href: "/risk-alerts", icon: CloudLightning },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 glass-panel m-4 rounded-warm-lg p-6 flex flex-col justify-between shrink-0 sticky top-4 h-[calc(100vh-2rem)] border border-white/80 shadow-glass">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 rounded-warm bg-daichi-forest flex items-center justify-center text-white shadow-md">
            <Leaf className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-daichi-charcoal tracking-tight">Daichi</h1>
            <p className="text-[11px] font-medium text-daichi-sage">Agri-Intelligence</p>
          </div>
        </div>

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

      {/* User Status Badge */}
      <div className="p-3 bg-white/40 rounded-warm border border-white/60 flex items-center gap-3 backdrop-blur-sm">
        <div className="w-9 h-9 rounded-full bg-daichi-sand text-daichi-forest flex items-center justify-center font-bold text-xs shadow-inner">
          HP
        </div>
        <div className="overflow-hidden">
          <p className="text-xs font-semibold text-daichi-charcoal truncate">Hriddha Farmer</p>
          <p className="text-[10px] text-daichi-muted truncate">Bogura, Bangladesh</p>
        </div>
      </div>
    </aside>
  );
}