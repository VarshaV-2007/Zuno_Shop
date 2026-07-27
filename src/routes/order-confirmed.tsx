import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Clock, Package } from "lucide-react";
import { z } from "zod";

const search = z.object({
  id: z.string().optional(),
  eta: z.coerce.number().optional(),
});

export const Route = createFileRoute("/order-confirmed")({
  validateSearch: (s) => search.parse(s),
  head: () => ({
    meta: [
      { title: "Order confirmed — ZUNO" },
      { name: "description", content: "Your ZUNO order is confirmed and on its way." },
      { property: "og:title", content: "Order confirmed — ZUNO" },
      { property: "og:description", content: "Your ZUNO order is on its way." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Page,
});

function Page() {
  const { id, eta } = Route.useSearch();
  return (
    <div className="container-page grid min-h-[70vh] place-items-center py-16">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-soft">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success/10 text-success">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="mt-5 font-display text-3xl leading-tight text-ink">Order confirmed</h1>
        <p className="mt-2 text-sm text-ink-soft">Thank you — we're packing your order now.</p>

        {id && (
          <div className="mt-6 rounded-2xl bg-surface p-4 text-left">
            <p className="text-xs text-ink-soft">Order ID</p>
            <p className="font-mono text-sm font-semibold text-ink">#{id}</p>
          </div>
        )}

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border p-3 text-center">
            <Clock className="mx-auto h-4 w-4 text-primary" />
            <p className="mt-1 text-sm font-semibold">{eta ?? 15} min</p>
            <p className="text-[11px] text-muted-foreground">estimated delivery</p>
          </div>
          <div className="rounded-2xl border border-border p-3 text-center">
            <Package className="mx-auto h-4 w-4 text-primary" />
            <p className="mt-1 text-sm font-semibold">Packing</p>
            <p className="text-[11px] text-muted-foreground">at nearest store</p>
          </div>
        </div>

        <Link to="/" className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
          Back to home
        </Link>
      </div>
    </div>
  );
}
