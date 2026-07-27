import { Link } from "@tanstack/react-router";
import { Heart, Plus, Minus, Star, Clock } from "lucide-react";
import { toast } from "sonner";
import { discountPct, formatINR, type Product } from "@/data/catalog";
import { useShop } from "@/store/shop";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { cart, addToCart, setQty, toggleWishlist, isWishlisted } = useShop();
  const inCart = cart.find((i) => i.id === product.id);
  const disc = discountPct(product);

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:shadow-card">
      <Link
        to="/product/$id"
        params={{ id: product.id }}
        className="relative block aspect-square overflow-hidden bg-[#f5f0e8]"
      >
        <img
          src={product.image}
          alt={product.name}
          width={600}
          height={600}
          loading={priority ? "eager" : "lazy"}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {disc > 0 && (
          <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">
            {disc}% off
          </span>
        )}
        <button
          aria-label={isWishlisted(product.id) ? "Remove from wishlist" : "Add to wishlist"}
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
            toast.success(isWishlisted(product.id) ? "Removed from wishlist" : "Saved to wishlist");
          }}
          className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-background/90 text-ink shadow-soft backdrop-blur transition hover:bg-background"
        >
          <Heart className={`h-4 w-4 ${isWishlisted(product.id) ? "fill-primary text-primary" : ""}`} />
        </button>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-3 md:p-4">
        <div className="flex items-center gap-1 text-[11px] text-ink-soft">
          <Clock className="h-3 w-3 text-primary" />
          <span>{product.deliveryMin} min</span>
        </div>
        <div className="min-w-0">
          <Link to="/product/$id" params={{ id: product.id }} className="line-clamp-2 text-sm font-medium leading-snug text-ink hover:text-primary">
            {product.name}
          </Link>
          <p className="mt-0.5 text-xs text-muted-foreground">{product.size}</p>
        </div>
        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <div className="min-w-0">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-semibold text-ink">{formatINR(product.price)}</span>
              {product.mrp && (
                <span className="text-xs text-muted-foreground line-through">{formatINR(product.mrp)}</span>
              )}
            </div>
            <div className="mt-0.5 flex items-center gap-1 text-[11px] text-ink-soft">
              <Star className="h-3 w-3 fill-current text-amber-500" />
              <span>{product.rating}</span>
            </div>
          </div>
          {inCart ? (
            <div className="flex shrink-0 items-center gap-2 rounded-full bg-primary text-primary-foreground">
              <button aria-label="Decrease" onClick={() => setQty(product.id, inCart.qty - 1)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-black/10">
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="min-w-4 text-center text-sm font-semibold">{inCart.qty}</span>
              <button aria-label="Increase" onClick={() => setQty(product.id, inCart.qty + 1)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-black/10">
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => { addToCart(product.id); toast.success(`${product.name} added`); }}
              className="shrink-0 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
            >
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProductGrid({ items, priorityCount = 0 }: { items: Product[]; priorityCount?: number }) {
  if (!items.length) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
        No products here yet.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < priorityCount} />
      ))}
    </div>
  );
}
