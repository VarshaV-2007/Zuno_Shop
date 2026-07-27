import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Leaf, ShieldCheck, Truck } from "lucide-react";
import hero from "@/assets/hero-main.jpg";
import { categories, collections, bestSellers, bestDeals, trending, under99, productsByCollection } from "@/data/catalog";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ZUNO — Everyday essentials, delivered in 10 minutes" },
      { name: "description", content: "Groceries, personal care, beauty, and home essentials delivered warm and fast to Indian homes. Curated by ZUNO." },
      { property: "og:title", content: "ZUNO — Everyday essentials, delivered fast" },
      { property: "og:description", content: "Groceries, personal care, beauty, and home essentials delivered warm and fast." },
    ],
  }),
  component: HomePage,
});

function SectionHeading({ eyebrow, title, href }: { eyebrow?: string; title: string; href?: { to: string; params?: any } }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">{eyebrow}</p>}
        <h2 className="mt-1 font-display text-2xl leading-tight text-ink text-balance md:text-3xl">{title}</h2>
      </div>
      {href && (
        <Link to={href.to as any} params={href.params} className="hidden shrink-0 items-center gap-1 text-sm font-medium text-ink-soft hover:text-ink sm:inline-flex">
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

function HomePage() {
  const feature = productsByCollection("morning-start").slice(0, 4);
  return (
    <div>
      {/* Hero */}
      <section className="container-page pt-6 md:pt-10">
        <div className="relative overflow-hidden rounded-3xl bg-surface">
          <div className="grid gap-6 md:grid-cols-2 md:items-center">
            <div className="relative z-10 px-6 pt-8 md:px-12 md:py-16">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">10-min delivery</p>
              <h1 className="mt-3 font-display text-4xl leading-[1.05] text-ink text-balance md:text-6xl">
                Everyday essentials,<br />delivered warm.
              </h1>
              <p className="mt-4 max-w-md text-base text-ink-soft text-pretty">
                Fresh produce, dairy, pantry staples and self-care — curated by ZUNO and at your door in minutes.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/shop" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition hover:opacity-90">
                  Shop essentials <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/category/$slug" params={{ slug: "produce" }} className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-medium hover:border-foreground/30">
                  Fresh produce
                </Link>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-4 text-xs text-ink-soft">
                <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /><span>10-min ETA</span></div>
                <div className="flex items-center gap-2"><Truck className="h-4 w-4 text-primary" /><span>Free over ₹199</span></div>
                <div className="flex items-center gap-2"><Leaf className="h-4 w-4 text-primary" /><span>Farm fresh</span></div>
              </div>
            </div>
            <div className="relative">
              <img
                src={hero}
                alt="An overhead flat lay of fresh Indian grocery essentials"
                width={1200}
                height={900}
                className="h-64 w-full object-cover md:h-full md:min-h-[440px]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface/60 via-transparent to-transparent md:bg-gradient-to-r md:from-surface md:via-surface/40 md:to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-page mt-14">
        <SectionHeading eyebrow="Shop by category" title="What's in your basket today?" />
        <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 no-scrollbar md:mx-0 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:px-0 lg:grid-cols-8">
          {categories.map((c) => (
            <Link key={c.slug} to="/category/$slug" params={{ slug: c.slug }} className="group flex min-w-[104px] shrink-0 snap-start flex-col items-center gap-2 md:min-w-0">
              <div className="grid aspect-square w-full place-items-center overflow-hidden rounded-2xl border border-border transition group-hover:border-primary/30 group-hover:shadow-soft" style={{ background: c.tint }}>
                <img src={c.image} alt={c.name} width={200} height={200} loading="lazy" className="h-4/5 w-4/5 object-cover" />
              </div>
              <p className="text-center text-xs font-medium leading-tight text-ink md:text-sm">{c.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Best sellers */}
      <section className="container-page mt-14">
        <SectionHeading eyebrow="Loved by everyone" title="Best sellers" href={{ to: "/shop" }} />
        <ProductGridSection items={bestSellers(10)} />
      </section>

      {/* Shop by moment */}
      <section className="container-page mt-14">
        <SectionHeading eyebrow="Shop by moment" title="Made for what you're doing right now" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {collections.map((col) => (
            <Link key={col.slug} to="/collection/$slug" params={{ slug: col.slug }} className="group relative overflow-hidden rounded-2xl">
              <img src={col.image} alt={col.name} width={800} height={600} loading="lazy" className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <p className="text-[10px] font-semibold uppercase tracking-widest opacity-80">{col.tagline}</p>
                <p className="mt-1 font-display text-xl leading-tight md:text-2xl">{col.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Deals */}
      <section className="container-page mt-14">
        <SectionHeading eyebrow="Save more" title="Today's best deals" href={{ to: "/shop" }} />
        <ProductGridSection items={bestDeals(10)} />
      </section>

      {/* Feature strip */}
      <section className="container-page mt-14">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { i: Clock, t: "10-min delivery", d: "From nearest ZUNO store" },
            { i: Truck, t: "Free over ₹199", d: "Fast, contactless drop-off" },
            { i: Leaf, t: "Farm-fresh promise", d: "Sourced daily, never stale" },
            { i: ShieldCheck, t: "Easy returns", d: "No questions asked" },
          ].map(({ i: Icon, t, d }) => (
            <div key={t} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink">{t}</p>
                <p className="text-xs text-muted-foreground">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Under 99 */}
      <section className="container-page mt-14">
        <SectionHeading eyebrow="Small treats" title="Everything under ₹99" href={{ to: "/shop" }} />
        <ProductGridSection items={under99(10)} />
      </section>

      {/* Trending */}
      <section className="container-page mt-14 mb-6">
        <SectionHeading eyebrow="Rated 4.6+" title="Trending this week" href={{ to: "/shop" }} />
        <ProductGridSection items={trending(10)} />
      </section>

      {feature.length > 0 && (
        <section className="container-page mb-6 mt-14">
          <SectionHeading eyebrow="Morning start" title="Wake up right" href={{ to: "/collection/$slug", params: { slug: "morning-start" } }} />
          <ProductGridSection items={feature} />
        </section>
      )}
    </div>
  );
}

function ProductGridSection({ items }: { items: any[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-5">
      {items.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
