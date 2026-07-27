import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getCollection, productsByCollection } from "@/data/catalog";
import { ProductGrid } from "@/components/ProductCard";

export const Route = createFileRoute("/collection/$slug")({
  loader: ({ params }) => {
    const col = getCollection(params.slug);
    if (!col) throw notFound();
    return { col, items: productsByCollection(params.slug) };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.col.name ?? "Collection";
    const tagline = loaderData?.col.tagline ?? "";
    const image = loaderData?.col.image;
    const meta: Array<Record<string, string>> = [
      { title: `${name} — ZUNO` },
      { name: "description", content: `${name}: ${tagline}. Curated by ZUNO and delivered in minutes.` },
      { property: "og:title", content: `${name} — ZUNO` },
      { property: "og:description", content: `${name}: ${tagline}. Curated by ZUNO.` },
    ];
    if (image && typeof image === "string" && image.startsWith("http")) {
      meta.push({ property: "og:image", content: image });
      meta.push({ name: "twitter:image", content: image });
    }
    return { meta };
  },
  component: CollectionPage,
});

function CollectionPage() {
  const { col, items } = Route.useLoaderData();
  return (
    <div className="container-page py-8 md:py-12">
      <nav className="mb-4 text-xs text-ink-soft">
        <Link to="/" className="hover:text-ink">Home</Link> <span className="mx-1">/</span>
        <span className="text-ink">{col.name}</span>
      </nav>
      <div className="relative mb-8 overflow-hidden rounded-3xl">
        <img src={col.image} alt={col.name} width={1600} height={600} className="h-56 w-full object-cover md:h-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] opacity-80">{col.tagline}</p>
          <h1 className="mt-1 font-display text-3xl leading-tight md:text-5xl">{col.name}</h1>
        </div>
      </div>
      <ProductGrid items={items} priorityCount={4} />
    </div>
  );
}
