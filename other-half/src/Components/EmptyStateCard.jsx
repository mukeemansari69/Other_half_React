import { PawPrint } from "lucide-react";

import { LoadingLink } from "./LoadingControl.jsx";

const EmptyStateCard = ({
  icon = PawPrint,
  eyebrow = "",
  title,
  description,
  chips = [],
  primaryAction = null,
  secondaryAction = null,
  className = "",
  children = null,
}) => {
  const IconComponent = icon;

  return (
    <div
      className={`relative overflow-hidden rounded-[32px] border border-[#E6DFCF] bg-white p-6 shadow-[0_24px_80px_rgba(34,30,18,0.08)] md:p-8 ${className}`}
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#EBF466]/55 blur-3xl" />
      <div className="pointer-events-none absolute -left-12 bottom-0 h-28 w-28 rounded-full bg-[#E8754C]/12 blur-3xl" />

      <div className="relative">
        <div className="flex flex-col gap-4 md:flex-row md:items-start">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EEF6E7] text-[#0F4A12] shadow-[0_12px_24px_rgba(15,74,18,0.08)]">
            <IconComponent size={28} />
          </div>

          <div className="flex-1">
            {eyebrow ? (
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0F4A12]">
                {eyebrow}
              </p>
            ) : null}

            <h2 className="mt-2 text-3xl font-semibold leading-tight text-[#1A1A1A]">
              {title}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#5F5B4F] md:text-base">
              {description}
            </p>
          </div>
        </div>

        {chips.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-[#D9D1BF] bg-[#FBF8EF] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#4F4A3E]"
              >
                {chip}
              </span>
            ))}
          </div>
        ) : null}

        {children}

        {primaryAction || secondaryAction ? (
          <div className="mt-6 flex flex-wrap gap-3">
            {primaryAction ? (
              <LoadingLink
                to={primaryAction.to}
                className="inline-flex rounded-full bg-[#0F4A12] px-5 py-3 text-sm font-semibold text-white"
                loadingText={primaryAction.loadingText || "Opening..."}
              >
                {primaryAction.label}
              </LoadingLink>
            ) : null}

            {secondaryAction ? (
              <LoadingLink
                to={secondaryAction.to}
                className="inline-flex rounded-full border border-[#D6D0C1] px-5 py-3 text-sm font-semibold text-[#1A1A1A]"
                loadingText={secondaryAction.loadingText || "Opening..."}
              >
                {secondaryAction.label}
              </LoadingLink>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default EmptyStateCard;
