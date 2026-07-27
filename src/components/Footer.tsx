import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo-zuno.png";
import { categories } from "@/data/catalog";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-surface">
      <div className="container-page py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <img src={logo} alt="ZUNO" className="h-6" />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Everyday essentials, delivered warm and fast. Curated with care for Indian homes.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Shop</p>
            <ul className="mt-4 space-y-2 text-sm">
              {categories.slice(0, 6).map((c) => (
                <li key={c.slug}>
                  <Link to="/category/$slug" params={{ slug: c.slug }} className="text-ink-soft hover:text-ink">{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Company</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a className="text-ink-soft hover:text-ink" href="#">About ZUNO</a></li>
              <li><a className="text-ink-soft hover:text-ink" href="#">Careers</a></li>
              <li><a className="text-ink-soft hover:text-ink" href="#">Press</a></li>
              <li><a className="text-ink-soft hover:text-ink" href="#">Contact</a></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Help</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a className="text-ink-soft hover:text-ink" href="#">Delivery</a></li>
              <li><a className="text-ink-soft hover:text-ink" href="#">Returns</a></li>
              <li><a className="text-ink-soft hover:text-ink" href="#">Privacy</a></li>
              <li><a className="text-ink-soft hover:text-ink" href="#">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} ZUNO. Made with care in India.</p>
          <p>Prices inclusive of taxes · Free delivery over ₹199</p>
        </div>
      </div>
    </footer>
  );
}
