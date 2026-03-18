import { useEffect, useMemo, useState } from "react";

function slugify(s) {
  return String(s || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export default function InfoPageLayout({
  title,
  subtitle,
  badge = "Threads & Trends",
  heroRight = null, // optional JSX (image/illustration)
  sections = [], // [{ title, content: JSX }]
}) {
  const items = useMemo(
    () => sections.map((s) => ({ ...s, id: s.id || slugify(s.title) })),
    [sections]
  );

  const [activeId, setActiveId] = useState(items[0]?.id || "");

  useEffect(() => {
    const handler = () => {
      const y = window.scrollY + 120;
      let current = items[0]?.id || "";
      for (const it of items) {
        const el = document.getElementById(it.id);
        if (!el) continue;
        if (el.offsetTop <= y) current = it.id;
      }
      setActiveId(current);
    };

    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [items]);

  return (
    <main className="w-full">
      {/* HERO */}
      <section className="border-b border-slate-800 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/60 px-3 py-1 text-xs text-slate-300">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                <span className="font-semibold">{badge}</span>
              </div>

              <h1 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight text-slate-50">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-3 text-sm md:text-base text-slate-300 max-w-2xl leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>

            <div className="md:justify-self-end">
              {heroRight ? (
                heroRight
              ) : (
                <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-6">
                  <div className="text-slate-300 text-sm">
                    Tip: Add an illustration here for a premium look.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* BODY */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* TOC */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 rounded-3xl border border-slate-800 bg-slate-950/40 p-4">
              <div className="text-xs uppercase tracking-[0.25em] text-slate-500 mb-3">
                On this page
              </div>
              <nav className="flex flex-col gap-1">
                {items.map((it) => (
                  <a
                    key={it.id}
                    href={`#${it.id}`}
                    className={`px-3 py-2 rounded-2xl text-sm transition ${
                      activeId === it.id
                        ? "bg-sky-500/10 text-sky-200 border border-sky-500/20"
                        : "text-slate-300 hover:bg-slate-900/60"
                    }`}
                  >
                    {it.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* CONTENT */}
          <div className="lg:col-span-9">
            <div className="space-y-6">
              {items.map((it) => (
                <section
                  key={it.id}
                  id={it.id}
                  className="rounded-3xl border border-slate-800 bg-slate-950/40 p-6 md:p-8"
                >
                  <h2 className="text-xl md:text-2xl font-bold text-slate-50">
                    {it.title}
                  </h2>
                  <div className="mt-4 text-sm md:text-base text-slate-300 leading-relaxed space-y-3">
                    {it.content}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-10 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900/40 to-slate-950 p-6 md:p-8">
              <div className="text-slate-50 text-lg font-bold">Need help?</div>
              <p className="mt-2 text-slate-300 text-sm leading-relaxed">
                If you have questions, contact us and we’ll respond as soon as possible.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-sky-500 text-slate-950 text-sm font-semibold hover:bg-sky-400 transition"
                >
                  Contact Us
                </a>
                <a
                  href="/shop-now"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-full border border-slate-700 text-slate-200 text-sm font-semibold hover:border-slate-500 transition"
                >
                  Browse Shop
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}