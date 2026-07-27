import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { Clock, Heart, Minus, Plus, Star, Truck, ShieldCheck, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { discountPct, formatINR, getProduct, productsByCategory } from "@/data/catalog";
import { useShop } from "@/store/shop";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    const related = productsByCategory(product.category).filter((p) => p.id !== product.id).slice(0, 8);
    return { product, related };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    if (!p) return { meta: [{ title: "Product — ZUNO" }, { name: "robots", content: "noindex" }] };
    const title = `${p.name} — ${p.brand} · ZUNO`;
    const desc = `${p.description} Delivered in ${p.deliveryMin} minutes. ${formatINR(p.price)}.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product, related } = Route.useLoaderData();
  const { cart, addToCart, setQty, toggleWishlist, isWishlisted, markRecent } = useShop();
  const inCart = cart.find((i) => i.id === product.id);
  const disc = discountPct(product);

  useEffect(() => { markRecent(product.id); }, [product.id, markRecent]);

  return (
    <div className="container-page py-6 md:py-10">
      <nav className="mb-4 text-xs text-ink-soft">
        <Link to="/" className="hover:text-ink">Home</Link> <span className="mx-1">/</span>
        <Link to="/category/$slug" params={{ slug: product.category }} className="hover:text-ink capitalize">{product.category}</Link> <span className="mx-1">/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-6 md:grid-cols-2 md:gap-10">
        <div className="relative overflow-hidden rounded-3xl bg-[#f5f0e8]">
          <img src={product.image} alt={product.name} width={1000} height={1000} className="aspect-square w-full object-cover" />
          {disc > 0 && (
            <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">{disc}% off</span>
          )}
        </div>

        <div className="flex flex-col">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">{product.brand}</p>
          <h1 className="mt-2 font-display text-3xl leading-tight text-ink md:text-4xl">{product.name}</h1>
          <p className="mt-1 text-sm text-ink-soft">{product.size}</p>
          <div className="mt-3 flex items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-1 font-semibold text-success">
              <Star className="h-3.5 w-3.5 fill-current" /> {product.rating}
            </span>
            <span className="text-ink-soft">{product.reviews.toLocaleString("en-IN")} reviews</span>
            <span className="inline-flex items-center gap-1 text-ink-soft"><Clock className="h-3.5 w-3.5 text-primary" /> {product.deliveryMin} min</span>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-4xl text-ink">{formatINR(product.price)}</span>
            {product.mrp && <span className="text-lg text-muted-foreground line-through">{formatINR(product.mrp)}</span>}
            {disc > 0 && <span className="text-sm font-semibold text-success">Save {formatINR((product.mrp ?? 0) - product.price)}</span>}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Inclusive of all taxes</p>

          <p className="mt-6 text-sm leading-relaxed text-ink-soft text-pretty">{product.description}</p>

          <div className="mt-6 flex items-center gap-3">
            {inCart ? (
              <div className="flex items-center gap-2 rounded-full bg-primary text-primary-foreground">
                <button onClick={() => setQty(product.id, inCart.qty - 1)} className="grid h-11 w-11 place-items-center rounded-full hover:bg-black/10" aria-label="Decrease"><Minus className="h-4 w-4" /></button>
                <span className="min-w-6 text-center text-base font-semibold">{inCart.qty}</span>
                <button onClick={() => setQty(product.id, inCart.qty + 1)} className="grid h-11 w-11 place-items-center rounded-full hover:bg-black/10" aria-label="Increase"><Plus className="h-4 w-4" /></button>
              </div>
            ) : (
              <button onClick={() => { addToCart(product.id); toast.success(`${product.name} added to basket`); }} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-90">
                Add to basket <ArrowRight className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={() => { toggleWishlist(product.id); toast.success(isWishlisted(product.id) ? "Removed" : "Saved to wishlist"); }}
              aria-label="Wishlist"
              className="grid h-11 w-11 place-items-center rounded-full border border-border hover:bg-muted"
            >
              <Heart className={`h-5 w-5 ${isWishlisted(product.id) ? "fill-primary text-primary" : ""}`} />
            </button>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              { i: Clock, t: `${product.deliveryMin} min`, d: "delivery" },
              { i: Truck, t: "Free", d: "over ₹199" },
              { i: ShieldCheck, t: "Easy", d: "returns" },
            ].map(({ i: Icon, t, d }) => (
              <div key={t} className="rounded-2xl border border-border p-3 text-center">
                <Icon className="mx-auto h-4 w-4 text-primary" />
                <p className="mt-1 text-sm font-semibold text-ink">{t}</p>
                <p className="text-[11px] text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-5 font-display text-2xl text-ink md:text-3xl">You may also like</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
