import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getCategory, productsByCategory } from "@/data/catalog";
import { ProductGrid } from "@/components/ProductCard";

export const Route = createFileRoute("/category/$slug")({
  loader: ({ params }) => {
    const cat = getCategory(params.slug);
    if (!cat) throw notFound();
    return { cat, items: productsByCategory(params.slug) };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.cat.name ?? "Category";
    return {
      meta: [
        { title: `${name} — ZUNO` },
        { name: "description", content: `Shop ${name.toLowerCase()} on ZUNO. Fresh, curated and delivered in minutes.` },
        { property: "og:title", content: `${name} — ZUNO` },
        { property: "og:description", content: `Shop ${name.toLowerCase()} on ZUNO, delivered in minutes.` },
      ],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { cat, items } = Route.useLoaderData();
  return (
    <div className="container-page py-8 md:py-12">
      <nav className="mb-4 text-xs text-ink-soft">
        <Link to="/" className="hover:text-ink">Home</Link> <span className="mx-1">/</span>
        <Link to="/shop" className="hover:text-ink">Shop</Link> <span className="mx-1">/</span>
        <span className="text-ink">{cat.name}</span>
      </nav>
      <div className="mb-8 grid items-center gap-6 rounded-3xl border border-border p-6 md:grid-cols-[1fr_auto] md:p-8" style={{ background: cat.tint }}>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">Category</p>
          <h1 className="mt-1 font-display text-3xl leading-tight text-ink md:text-5xl">{cat.name}</h1>
          <p className="mt-2 text-sm text-ink-soft">{items.length} products · 10–25 min delivery</p>
        </div>
        <img src={cat.image} alt={cat.name} width={200} height={200} className="hidden h-32 w-32 rounded-2xl object-cover md:block" />
      </div>
      <ProductGrid items={items} priorityCount={4} />
    </div>
  );
}
