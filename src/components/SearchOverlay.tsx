import { Link } from "@tanstack/react-router";
import { Search, X, TrendingUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { formatINR, searchProducts, products } from "@/data/catalog";

const HINTS = ["milk", "atta", "chips", "kajal", "dal", "shampoo", "paneer"];

export function SearchOverlay({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [q, setQ] = useState("");
  const results = useMemo(() => (q ? searchProducts(q).slice(0, 12) : []), [q]);

  useEffect(() => {
    if (open) setQ("");
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  if (!open) return null;

  const trending = products.slice(0, 6);

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
      <div className="relative mx-auto mt-0 flex h-full w-full max-w-2xl flex-col bg-background md:mt-16 md:h-auto md:max-h-[80vh] md:rounded-2xl md:shadow-lift">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <Search className="h-5 w-5 text-ink-soft" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search for products, brands, categories…"
            className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
          <button onClick={() => onOpenChange(false)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          {!q && (
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Try searching</p>
              <div className="flex flex-wrap gap-2">
                {HINTS.map((h) => (
                  <button key={h} onClick={() => setQ(h)} className="rounded-full border border-border px-3 py-1.5 text-sm text-ink-soft hover:border-primary hover:text-ink">
                    {h}
                  </button>
                ))}
              </div>
              <div className="mt-6">
                <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink-soft"><TrendingUp className="h-3.5 w-3.5" /> Trending</p>
                <ul className="grid gap-2">
                  {trending.map((p) => (
                    <li key={p.id}>
                      <Link to="/product/$id" params={{ id: p.id }} onClick={() => onOpenChange(false)} className="flex items-center gap-3 rounded-xl p-2 hover:bg-muted">
                        <img src={p.image} alt="" width={44} height={44} className="h-11 w-11 rounded-lg bg-[#f5f0e8] object-cover" loading="lazy" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{p.size}</p>
                        </div>
                        <span className="text-sm font-semibold">{formatINR(p.price)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {q && (
            results.length === 0 ? (
              <div className="py-16 text-center text-sm text-muted-foreground">
                No matches for "<span className="text-ink">{q}</span>". Try a different word.
              </div>
            ) : (
              <ul className="grid gap-2">
                {results.map((p) => (
                  <li key={p.id}>
                    <Link to="/product/$id" params={{ id: p.id }} onClick={() => onOpenChange(false)} className="flex items-center gap-3 rounded-xl p-2 hover:bg-muted">
                      <img src={p.image} alt="" width={44} height={44} className="h-11 w-11 rounded-lg bg-[#f5f0e8] object-cover" loading="lazy" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.brand} · {p.size}</p>
                      </div>
                      <span className="text-sm font-semibold">{formatINR(p.price)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )
          )}
        </div>
      </div>
    </div>
  );
}
