import { Link } from "@tanstack/react-router";
import { Search, ShoppingBag, Heart, Menu, X, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import logo from "@/assets/logo-zuno.png";
import { useShop } from "@/store/shop";
import { CartSheet } from "@/components/CartSheet";
import { WishlistSheet } from "@/components/WishlistSheet";
import { SearchOverlay } from "@/components/SearchOverlay";
import { categories } from "@/data/catalog";

export function Header() {
  const { cartCount, wishlist } = useShop();
  const [cartOpen, setCartOpen] = useState(false);
  const [wishOpen, setWishOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className={`sticky top-0 z-40 border-b transition-all ${scrolled ? "border-border bg-background/85 backdrop-blur-md" : "border-transparent bg-background"}`}>
        <div className="container-page">
          {/* top row */}
          <div className="grid h-16 grid-cols-[auto_1fr_auto] items-center gap-3 md:h-20 md:grid-cols-[auto_1fr_auto] md:gap-6">
            <div className="flex items-center gap-2">
              <button
                aria-label="Open menu"
                onClick={() => setMobileOpen(true)}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-ink hover:bg-muted md:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <Link to="/" className="flex shrink-0 items-center" aria-label="ZUNO home">
                <img src={logo} alt="ZUNO" className="h-6 w-auto md:h-7" />
              </Link>
            </div>

            {/* desktop search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden min-w-0 items-center gap-3 rounded-full border border-border bg-surface px-4 py-2.5 text-left text-sm text-muted-foreground transition hover:border-foreground/20 md:flex"
            >
              <Search className="h-4 w-4 shrink-0" />
              <span className="truncate">Search milk, atta, chips, kajal…</span>
              <kbd className="ml-auto hidden shrink-0 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground lg:inline">⌘K</kbd>
            </button>

            <div className="flex items-center gap-1 md:gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-ink hover:bg-muted md:hidden"
              >
                <Search className="h-5 w-5" />
              </button>
              <button
                onClick={() => setWishOpen(true)}
                aria-label="Wishlist"
                className="relative hidden h-10 w-10 shrink-0 place-items-center rounded-full text-ink hover:bg-muted sm:grid"
              >
                <Heart className="h-5 w-5" />
                {wishlist.length > 0 && (
                  <span className="absolute right-0 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                    {wishlist.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setCartOpen(true)}
                aria-label="Cart"
                className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full text-ink hover:bg-muted"
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute right-0 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Delivery strip + desktop nav */}
          <div className="hidden items-center justify-between gap-6 border-t border-border py-2.5 text-sm md:flex">
            <div className="flex items-center gap-2 text-ink-soft">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="font-medium text-ink">Delivery in 10–20 min</span>
              <span className="text-muted-foreground">· to your address</span>
            </div>
            <nav className="flex items-center gap-5 text-ink-soft">
              <Link to="/shop" className="hover:text-ink">Shop all</Link>
              {categories.slice(0, 5).map((c) => (
                <Link key={c.slug} to="/category/$slug" params={{ slug: c.slug }} className="hover:text-ink">
                  {c.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 border-t border-border py-2 text-xs md:hidden">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
            <span className="truncate"><span className="font-semibold text-ink">10 min</span> <span className="text-muted-foreground">delivery · to your address</span></span>
          </div>
        </div>
      </header>

      {/* mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-[85%] max-w-xs flex-col bg-background shadow-lift">
            <div className="flex items-center justify-between px-5 py-4">
              <img src={logo} alt="ZUNO" className="h-6" />
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="grid h-10 w-10 place-items-center rounded-full hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-2 pb-6">
              <Link to="/shop" onClick={() => setMobileOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-medium hover:bg-muted">Shop all</Link>
              {categories.map((c) => (
                <Link key={c.slug} to="/category/$slug" params={{ slug: c.slug }} onClick={() => setMobileOpen(false)} className="block rounded-xl px-4 py-3 text-sm hover:bg-muted">
                  {c.name}
                </Link>
              ))}
              <div className="mt-4 border-t border-border pt-4">
                <button onClick={() => { setMobileOpen(false); setWishOpen(true); }} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm hover:bg-muted">
                  <Heart className="h-4 w-4" /> Wishlist {wishlist.length > 0 && <span className="ml-auto text-xs text-muted-foreground">{wishlist.length}</span>}
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}

      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
      <WishlistSheet open={wishOpen} onOpenChange={setWishOpen} onAddedToCart={() => { setWishOpen(false); setCartOpen(true); }} />
      <SearchOverlay open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
