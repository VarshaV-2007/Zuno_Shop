import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { categories, products } from "@/data/catalog";
import { ProductGrid } from "@/components/ProductCard";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop everything — ZUNO" },
      { name: "description", content: "Browse the full ZUNO catalog — groceries, pantry, personal care, beauty, home and baby essentials, delivered in minutes." },
      { property: "og:title", content: "Shop everything — ZUNO" },
      { property: "og:description", content: "The full ZUNO catalog of everyday essentials." },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const [cat, setCat] = useState<string>("all");
  const [sort, setSort] = useState<"popular" | "price-asc" | "price-desc" | "rating">("popular");

  const items = useMemo(() => {
    let list = cat === "all" ? [...products] : products.filter((p) => p.category === cat);
    switch (sort) {
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "rating": list.sort((a, b) => b.rating - a.rating); break;
      default: list.sort((a, b) => b.reviews - a.reviews);
    }
    return list;
  }, [cat, sort]);

  return (
    <div className="container-page py-8 md:py-12">
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">Shop</p>
        <h1 className="mt-1 font-display text-3xl leading-tight text-ink md:text-5xl">Everything ZUNO</h1>
        <p className="mt-2 max-w-xl text-sm text-ink-soft">Browse {products.length} essentials across {categories.length} categories.</p>
      </header>

      <div className="-mx-4 mb-5 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 no-scrollbar md:mx-0 md:px-0">
        <FilterChip active={cat === "all"} onClick={() => setCat("all")}>All</FilterChip>
        {categories.map((c) => (
          <FilterChip key={c.slug} active={cat === c.slug} onClick={() => setCat(c.slug)}>{c.name}</FilterChip>
        ))}
      </div>

      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-ink-soft">{items.length} products</p>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-ink-soft">Sort</span>
          <select value={sort} onChange={(e) => setSort(e.target.value as any)} className="rounded-full border border-border bg-background px-3 py-1.5 text-sm outline-none">
            <option value="popular">Popular</option>
            <option value="rating">Top rated</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </label>
      </div>

      <ProductGrid items={items} priorityCount={4} />
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 snap-start whitespace-nowrap rounded-full border px-4 py-2 text-sm transition ${active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-ink-soft hover:border-foreground/20"}`}
    >
      {children}
    </button>
  );
}
