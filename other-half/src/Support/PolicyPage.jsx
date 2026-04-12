import React from "react";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { Link } from "react-router-dom";

import "/public/Support/css/policyPages.css";

import { customerCareLinks } from "./customerCareLinks";

const ActionLink = ({ action, className, showArrow = true }) => {
  const content = (
    <>
      <span>{action.label}</span>
      {showArrow ? <ArrowRight size={16} /> : null}
    </>
  );

  if (action.href) {
    const isWebUrl = action.href.startsWith("http");

    return (
      <a
        href={action.href}
        className={className}
        target={isWebUrl ? "_blank" : undefined}
        rel={isWebUrl ? "noreferrer" : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <Link to={action.to} className={className}>
      {content}
    </Link>
  );
};

const PolicyPage = ({ page }) => {
  if (!page) {
    return null;
  }

  const customSection =
    typeof page.customSection === "function"
      ? page.customSection()
      : page.customSection;

  return (
    <main className={`w-full flex flex-col support-page ${page.themeClass}`}>
      <section className="w-full support-hero">
        <div className="support-shell grid support-hero__layout">
          <div className="w-full support-hero__copy">
            <span className="support-kicker">{page.eyebrow}</span>
            <h1 className="support-hero__title">{page.title}</h1>
            <p className="support-hero__text">{page.intro}</p>

            <div className="flex support-hero__actions">
              {page.actions.map((action) => (
                <ActionLink
                  key={action.label}
                  action={action}
                  className={`support-button ${
                    action.variant === "secondary"
                      ? "support-button--secondary"
                      : "support-button--primary"
                  }`}
                />
              ))}
            </div>

            <div className="grid support-stat-grid">
              {page.stats.map((stat) => (
                <article key={stat.label} className="support-stat-card">
                  <span className="support-stat-card__label">{stat.label}</span>
                  <p className="support-stat-card__value">{stat.value}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="w-full support-hero__visual">
            <div className="support-hero__image-frame">
              <div className="support-hero__image-glow" aria-hidden="true" />
              <img src={page.image} alt={page.imageAlt} className="support-hero__image" />
            </div>

            <div className="grid support-highlight-grid">
              {page.highlights.map((highlight) => {
                const Icon = highlight.icon;

                return (
                <article key={highlight.title} className="support-highlight-card">
                  <div className="support-highlight-card__icon">
                    <Icon size={20} />
                  </div>
                  <h2 className="support-highlight-card__title">{highlight.title}</h2>
                  <p className="support-highlight-card__text">{highlight.text}</p>
                </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {customSection ? (
        <section className="w-full support-extra">
          <div className="support-shell">{customSection}</div>
        </section>
      ) : null}

      <section className="w-full support-body">
        <div className="support-shell grid support-body__layout">
          <aside className="w-full flex flex-col support-sidebar">
            <div className="support-side-card">
              <p className="support-side-card__eyebrow">On this page</p>
              <div className="flex flex-col support-anchor-list">
                {page.sections.map((section) => (
                  <a key={section.id} href={`#${section.id}`} className="support-anchor-link">
                    {section.title}
                  </a>
                ))}
              </div>
            </div>

            <div className="support-side-card">
              <p className="support-side-card__eyebrow">Customer care pages</p>
              <div className="flex flex-col support-page-link-list">
                {customerCareLinks.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`support-page-link ${
                      item.path === page.path ? "is-active" : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          <div className="w-full flex flex-col support-main">
            {page.sections.map((section) => (
              <article key={section.id} id={section.id} className="support-section">
                <div className="flex support-section__heading-row">
                  <h2 className="support-section__title">{section.title}</h2>
                </div>

                <div className="support-section__body">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="support-section__paragraph">
                      {paragraph}
                    </p>
                  ))}

                  {section.listTitle ? (
                    <h3 className="support-section__subheading">{section.listTitle}</h3>
                  ) : null}

                  {section.list ? (
                    <ul className="flex flex-col support-list">
                      {section.list.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}

                  {section.callout ? (
                    <div className="support-callout">
                      <BadgeCheck size={18} />
                      <p>{section.callout}</p>
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
          </div>

          <aside className="w-full flex flex-col support-rail">
            {page.infoCards.map((card) => {
              const Icon = card.icon;

              return (
              <article key={card.title} className="support-rail-card">
                <div className="support-rail-card__icon">
                  <Icon size={20} />
                </div>
                <h2 className="support-rail-card__title">{card.title}</h2>
                <p className="support-rail-card__text">{card.text}</p>
                {card.action ? (
                  <ActionLink
                    action={card.action}
                    className="support-rail-card__link"
                    showArrow={false}
                  />
                ) : null}
              </article>
              );
            })}
          </aside>
        </div>
      </section>

      <section className="w-full support-cta">
        <div className="support-shell">
          <div className="support-cta__panel">
            <div className="support-cta__shape support-cta__shape--one" aria-hidden="true" />
            <div className="support-cta__shape support-cta__shape--two" aria-hidden="true" />

            <span className="support-cta__eyebrow">{page.cta.eyebrow}</span>
            <h2 className="support-cta__title">{page.cta.title}</h2>
            <p className="support-cta__text">{page.cta.text}</p>

            <div className="flex support-cta__actions">
              {page.cta.actions.map((action) => (
                <ActionLink
                  key={action.label}
                  action={action}
                  className={`support-button ${
                    action.variant === "outline"
                      ? "support-button--outline"
                      : "support-button--light"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PolicyPage;


