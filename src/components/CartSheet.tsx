import { Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useShop } from "@/store/shop";
import { formatINR } from "@/data/catalog";

export function CartSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { cartProducts, cartSubtotal, cartSavings, deliveryFee, cartTotal, setQty, removeFromCart } = useShop();
  const navigate = useNavigate();
  const empty = cartProducts.length === 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-5 py-4">
          <SheetTitle className="font-display text-2xl">Your basket</SheetTitle>
        </SheetHeader>

        {empty ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-muted">
              <ShoppingBag className="h-7 w-7 text-ink-soft" />
            </div>
            <div>
              <p className="font-display text-xl">Your basket is empty</p>
              <p className="mt-1 text-sm text-muted-foreground">Add a few essentials to get started.</p>
            </div>
            <button onClick={() => { onOpenChange(false); navigate({ to: "/shop" }); }} className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">
              Start shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="space-y-3">
                {cartProducts.map((p) => (
                  <li key={p.id} className="flex gap-3 rounded-2xl border border-border bg-card p-3">
                    <Link to="/product/$id" params={{ id: p.id }} onClick={() => onOpenChange(false)} className="shrink-0">
                      <img src={p.image} alt={p.name} width={72} height={72} className="h-18 w-18 rounded-xl bg-[#f5f0e8] object-cover" loading="lazy" />
                    </Link>
                    <div className="grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)_auto] gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-ink">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.size}</p>
                        <div className="mt-1 flex items-baseline gap-1.5">
                          <span className="text-sm font-semibold text-ink">{formatINR(p.price * p.qty)}</span>
                          {p.mrp && <span className="text-xs text-muted-foreground line-through">{formatINR(p.mrp * p.qty)}</span>}
                        </div>
                      </div>
                      <button aria-label="Remove" onClick={() => removeFromCart(p.id)} className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-ink-soft hover:bg-muted">
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <div className="col-span-2 flex items-center justify-end gap-2">
                        <div className="flex items-center gap-1 rounded-full border border-border">
                          <button aria-label="Decrease" onClick={() => setQty(p.id, p.qty - 1)} className="grid h-8 w-8 place-items-center hover:bg-muted">
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="min-w-6 text-center text-sm font-semibold">{p.qty}</span>
                          <button aria-label="Increase" onClick={() => setQty(p.id, p.qty + 1)} className="grid h-8 w-8 place-items-center hover:bg-muted">
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border bg-surface px-5 py-4">
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between text-ink-soft"><dt>Subtotal</dt><dd>{formatINR(cartSubtotal)}</dd></div>
                {cartSavings > 0 && <div className="flex justify-between text-success"><dt>Savings</dt><dd>− {formatINR(cartSavings)}</dd></div>}
                <div className="flex justify-between text-ink-soft"><dt>Delivery</dt><dd>{deliveryFee === 0 ? <span className="text-success">Free</span> : formatINR(deliveryFee)}</dd></div>
                <div className="flex justify-between border-t border-border pt-2 text-base font-semibold text-ink"><dt>Total</dt><dd>{formatINR(cartTotal)}</dd></div>
              </dl>
              <button
                onClick={() => { onOpenChange(false); navigate({ to: "/checkout" }); }}
                className="mt-4 flex w-full items-center justify-between rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
              >
                <span>Checkout</span>
                <span>{formatINR(cartTotal)}</span>
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
