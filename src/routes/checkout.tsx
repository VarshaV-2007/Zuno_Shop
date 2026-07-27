import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight, MapPin, CreditCard, Wallet, Banknote, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useShop } from "@/store/shop";
import { formatINR } from "@/data/catalog";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — ZUNO" },
      { name: "description", content: "Complete your ZUNO order — fast delivery, secure payment." },
      { property: "og:title", content: "Checkout — ZUNO" },
      { property: "og:description", content: "Complete your ZUNO order." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { cartProducts, cartSubtotal, cartSavings, deliveryFee, cartTotal, clearCart } = useShop();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [pay, setPay] = useState<"upi" | "card" | "cod">("upi");
  const [placing, setPlacing] = useState(false);

  if (cartProducts.length === 0) {
    return (
      <div className="container-page grid min-h-[60vh] place-items-center py-16">
        <div className="text-center">
          <h1 className="font-display text-3xl">Your basket is empty</h1>
          <p className="mt-2 text-sm text-muted-foreground">Add a few things before checking out.</p>
          <Link to="/shop" className="mt-5 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">Continue shopping</Link>
        </div>
      </div>
    );
  }

  const canPlace = name && phone.length >= 10 && address && pincode.length === 6;

  const place = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canPlace) { toast.error("Please fill in delivery details"); return; }
    setPlacing(true);
    const orderId = "ZN" + Math.random().toString(36).slice(2, 8).toUpperCase();
    const eta = Math.min(...cartProducts.map((p) => p.deliveryMin));
    setTimeout(() => {
      clearCart();
      navigate({ to: "/order-confirmed", search: { id: orderId, eta } });
    }, 700);
  };

  return (
    <div className="container-page py-8 md:py-12">
      <nav className="mb-4 text-xs text-ink-soft">
        <Link to="/" className="hover:text-ink">Home</Link> <ChevronRight className="mx-1 inline h-3 w-3" />
        <span className="text-ink">Checkout</span>
      </nav>
      <h1 className="font-display text-3xl leading-tight md:text-5xl">Checkout</h1>

      <form onSubmit={place} className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-5 md:p-6">
            <div className="mb-4 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <h2 className="font-display text-xl">Delivery details</h2>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <Input label="Full name" value={name} onChange={setName} placeholder="Priya Sharma" />
              <Input label="Phone" value={phone} onChange={(v) => setPhone(v.replace(/\D/g, "").slice(0, 10))} placeholder="10-digit mobile" inputMode="numeric" />
              <div className="md:col-span-2">
                <Input label="Address" value={address} onChange={setAddress} placeholder="Flat, building, street, area" />
              </div>
              <Input label="Pincode" value={pincode} onChange={(v) => setPincode(v.replace(/\D/g, "").slice(0, 6))} placeholder="6-digit pincode" inputMode="numeric" />
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 md:p-6">
            <div className="mb-4 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              <h2 className="font-display text-xl">Payment method</h2>
            </div>
            <div className="grid gap-2 md:grid-cols-3">
              <PayOption active={pay === "upi"} onClick={() => setPay("upi")} icon={Wallet} title="UPI" sub="Pay via any UPI app" />
              <PayOption active={pay === "card"} onClick={() => setPay("card")} icon={CreditCard} title="Card" sub="Credit or debit card" />
              <PayOption active={pay === "cod"} onClick={() => setPay("cod")} icon={Banknote} title="Cash" sub="Pay on delivery" />
            </div>
            <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-ink-soft"><ShieldCheck className="h-3.5 w-3.5 text-success" /> Payments are secure and encrypted.</p>
          </section>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="mb-4 font-display text-xl">Order summary</h2>
            <ul className="space-y-3 border-b border-border pb-4">
              {cartProducts.map((p) => (
                <li key={p.id} className="flex items-center gap-3">
                  <img src={p.image} alt="" width={48} height={48} className="h-12 w-12 shrink-0 rounded-lg bg-[#f5f0e8] object-cover" loading="lazy" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">Qty {p.qty} · {p.size}</p>
                  </div>
                  <span className="text-sm font-semibold">{formatINR(p.price * p.qty)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-1.5 text-sm">
              <Row label="Subtotal" value={formatINR(cartSubtotal)} />
              {cartSavings > 0 && <Row label="Savings" value={`− ${formatINR(cartSavings)}`} success />}
              <Row label="Delivery" value={deliveryFee === 0 ? "Free" : formatINR(deliveryFee)} />
              <div className="flex justify-between border-t border-border pt-2 text-base font-semibold text-ink"><dt>Total</dt><dd>{formatINR(cartTotal)}</dd></div>
            </dl>
            <button type="submit" disabled={placing} className="mt-5 w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition hover:opacity-90 disabled:opacity-60">
              {placing ? "Placing order…" : `Place order · ${formatINR(cartTotal)}`}
            </button>
          </div>
        </aside>
      </form>
    </div>
  );
}

function Input({ label, value, onChange, placeholder, inputMode }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; inputMode?: "text" | "numeric" }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-xs font-medium text-ink-soft">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}

function PayOption({ active, onClick, icon: Icon, title, sub }: { active: boolean; onClick: () => void; icon: any; title: string; sub: string }) {
  return (
    <button type="button" onClick={onClick} className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${active ? "border-primary bg-primary/5" : "border-border hover:border-foreground/20"}`}>
      <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${active ? "bg-primary text-primary-foreground" : "bg-muted text-ink"}`}><Icon className="h-4 w-4" /></div>
      <div className="min-w-0">
        <p className="text-sm font-semibold">{title}</p>
        <p className="truncate text-xs text-muted-foreground">{sub}</p>
      </div>
    </button>
  );
}

function Row({ label, value, success }: { label: string; value: string; success?: boolean }) {
  return (
    <div className={`flex justify-between ${success ? "text-success" : "text-ink-soft"}`}>
      <dt>{label}</dt><dd>{value}</dd>
    </div>
  );
}
