import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export default function GlassCard({
  children,
  className = "",
  hoverEffect = true,
}: GlassCardProps) {
  return (
    <div
      className={`glass-panel relative overflow-hidden rounded-[1.6rem] p-6 transition-all duration-300 ${
        hoverEffect ? "hover:-translate-y-1 hover:bg-white/80 hover:shadow-glass-hover" : ""
      } ${className}`}
    >
      <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent" />
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#dfead8]/70 blur-2xl" />
      {children}
    </div>
  );
}