const AuthHeroPanel = ({ eyebrow, title, description, highlights = [], footer }) => {
  return (
    <section className="rounded-[36px] bg-[#163B1D] p-8 text-white shadow-[0_32px_100px_rgba(13,32,18,0.22)] md:p-12">
      <span className="inline-flex rounded-full bg-white/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#E8F0C7]">
        {eyebrow}
      </span>
      <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight md:text-5xl">
        {title}
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-7 text-white/78 md:text-lg">
        {description}
      </p>

      {highlights.length > 0 ? (
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {highlights.map((highlight) => (
            <article
              key={highlight.title}
              className="rounded-[28px] border border-white/10 bg-white/8 p-5 backdrop-blur-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#EBF466]">
                {highlight.title}
              </p>
              <p className="mt-3 text-sm leading-6 text-white/72">{highlight.text}</p>
            </article>
          ))}
        </div>
      ) : null}

      {footer ? (
        <div className="mt-10 rounded-[28px] border border-white/10 bg-white/10 p-5 text-sm leading-7 text-white/78">
          {footer}
        </div>
      ) : null}
    </section>
  );
};

export default AuthHeroPanel;
