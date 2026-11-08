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
    <aside className="glass-panel relative z-10 m-3 flex w-auto shrink-0 flex-col justify-between rounded-warm-lg border border-white/80 p-4 shadow-glass md:sticky md:top-6 md:m-6 md:h-[calc(100vh-3rem)] md:w-60 md:p-5">
      <div>
        {/* Brand Header */}
        <div className="mb-5 flex items-center gap-3 px-1 md:mb-9 md:px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-daichi-forest text-white shadow-md">
            <Leaf className="brand-leaf h-5 w-5 text-emerald-200" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-daichi-charcoal">Daichi</h1>
            <p className="text-[11px] font-medium text-daichi-sage">Agri-Intelligence</p>
          </div>
        </div>

        {/* Navigation */}
        <nav aria-label="Main navigation" className="flex flex-wrap gap-2 md:flex-col">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex min-w-0 flex-1 basis-[calc(50%-0.25rem)] items-center gap-2 rounded-xl px-3 py-3 text-xs font-medium transition-all duration-200 md:flex-none md:gap-3 md:px-3.5 md:text-sm ${
                  isActive
                    ? "bg-daichi-forest text-white shadow-md"
                    : "text-daichi-charcoal hover:bg-white/70 hover:text-daichi-forest"
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 md:h-5 md:w-5 ${isActive ? "text-emerald-200" : "text-daichi-sage"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Status Badge */}
      <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/70 bg-white/50 p-2.5 backdrop-blur-sm md:mt-0 md:p-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-daichi-sand text-xs font-bold text-daichi-forest shadow-inner">
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