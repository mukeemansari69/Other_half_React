import { Link } from "react-router-dom";

const normalizeBreadcrumbItem = (item) => {
  if (!item || typeof item !== "object") {
    return null;
  }

  const label = String(item.label || item.name || "").trim();
  const href = String(item.href || item.path || "").trim();

  if (!label) {
    return null;
  }

  return {
    label,
    href,
  };
};

const BreadcrumbTrail = ({ items = [], className = "" }) => {
  const breadcrumbItems = items.map(normalizeBreadcrumbItem).filter(Boolean);

  if (breadcrumbItems.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1 text-sm font-normal leading-7 text-[#8F8F8F] sm:text-base">
        {breadcrumbItems.map((item, index) => {
          const isLastItem = index === breadcrumbItems.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1">
              {item.href && !isLastItem ? (
                <Link
                  to={item.href}
                  className="transition-colors hover:text-[#0F4A12]"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLastItem ? "page" : undefined}
                  className={isLastItem ? "font-semibold text-[#1A1A1A]" : ""}
                >
                  {item.label}
                </span>
              )}

              {!isLastItem ? <span className="text-[#B7B7B7]">&gt;</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default BreadcrumbTrail;
