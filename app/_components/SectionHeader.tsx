import React from "react";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d4002a]">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-2xl font-semibold text-zinc-900">{title}</h2>
        {subtitle ? (
          <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
        ) : null}
      </div>
      {action ? <div className="flex items-center gap-3">{action}</div> : null}
    </div>
  );
}
