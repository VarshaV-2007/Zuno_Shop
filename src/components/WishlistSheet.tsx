import { Link } from "@tanstack/react-router";
import { Heart, Plus } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useShop } from "@/store/shop";
import { formatINR, products } from "@/data/catalog";

export function WishlistSheet({ open, onOpenChange, onAddedToCart }: { open: boolean; onOpenChange: (v: boolean) => void; onAddedToCart?: () => void }) {
  const { wishlist, toggleWishlist, addToCart } = useShop();
  const items = wishlist.map((id) => products.find((p) => p.id === id)).filter(Boolean) as typeof products;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-5 py-4">
          <SheetTitle className="font-display text-2xl">Wishlist</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-muted">
              <Heart className="h-7 w-7 text-ink-soft" />
            </div>
            <p className="font-display text-xl">Nothing saved yet</p>
            <p className="text-sm text-muted-foreground">Tap the heart on any product to save it here.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-5 py-4">
            <ul className="space-y-3">
              {items.map((p) => (
                <li key={p.id} className="flex gap-3 rounded-2xl border border-border bg-card p-3">
                  <Link to="/product/$id" params={{ id: p.id }} onClick={() => onOpenChange(false)} className="shrink-0">
                    <img src={p.image} alt={p.name} width={72} height={72} className="h-18 w-18 rounded-xl bg-[#f5f0e8] object-cover" loading="lazy" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.size}</p>
                    <p className="mt-1 text-sm font-semibold text-ink">{formatINR(p.price)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => { addToCart(p.id); toast.success(`${p.name} added`); onAddedToCart?.(); }}
                      className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                    >
                      <Plus className="h-3 w-3" /> Add
                    </button>
                    <button onClick={() => toggleWishlist(p.id)} className="text-xs text-ink-soft hover:text-ink">Remove</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
