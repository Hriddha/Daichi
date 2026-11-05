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
      className={`glass-panel rounded-warm-lg p-6 transition-all duration-300 ${
        hoverEffect ? "hover:bg-white/80 hover:shadow-glass-hover hover:-translate-y-0.5" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}