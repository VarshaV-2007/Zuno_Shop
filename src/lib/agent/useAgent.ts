// BuyBuddy AI — client-side executor + agent loop.
// Gemini decides WHICH tool to run; this file is the only thing that runs it,
// against the real ZUNO catalogue, the real cart and the real router.
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useShop } from "@/store/shop";
import { COUPONS } from "@/store/shop";
import { categories, collections, discountPct, formatINR, products, type Product } from "@/data/catalog";
import { runAgentStep, type AgentTurn, type JsonObject, type JsonValue } from "./agent.functions";
import { MUTATING_TOOLS, type ToolName } from "./tools";

export type AgentPhase =
  | "idle"
  | "understanding"
  | "planning"
  | "searching"
  | "checking"
  | "executing"
  | "verifying"
  | "completed"
  | "failed";

export type StepStatus = "running" | "ok" | "failed";
export type AgentStep = {
  id: string;
  tool: ToolName | string;
  label: string;
  args: JsonObject;
  status: StepStatus;
  summary?: string;
  verified?: boolean;
  mutating: boolean;
};

const PHASE_FOR: Record<string, AgentPhase> = {
  search_products: "searching",
  filter_products: "searching",
  sort_products: "searching",
  compare_products: "checking",
  get_product_details: "checking",
  check_stock: "checking",
  get_cart: "verifying",
  calculate_cart_total: "verifying",
  get_order_status: "checking",
  add_to_cart: "executing",
  remove_from_cart: "executing",
  update_cart_quantity: "executing",
  apply_coupon: "executing",
  navigate_to_page: "executing",
};

const LABELS: Record<string, string> = {
  search_products: "Searching catalogue",
  filter_products: "Filtering products",
  sort_products: "Ranking options",
  compare_products: "Comparing options",
  get_product_details: "Reading product details",
  check_stock: "Checking availability",
  get_cart: "Reading real cart",
  calculate_cart_total: "Calculating totals",
  get_order_status: "Checking order status",
  add_to_cart: "Adding to cart",
  remove_from_cart: "Removing from cart",
  update_cart_quantity: "Updating quantity",
  apply_coupon: "Applying coupon",
  navigate_to_page: "Navigating the site",
};

function slim(p: Product) {
  return {
    id: p.id,
    name: p.name,
    brand: p.brand,
    size: p.size,
    category: p.category,
    price: p.price,
    mrp: p.mrp ?? null,
    discount_pct: discountPct(p),
    rating: p.rating,
    reviews: p.reviews,
    delivery_min: p.deliveryMin,
    tags: p.tags,
  };
}

const str = (v: JsonValue | undefined) => (typeof v === "string" ? v : undefined);
const num = (v: JsonValue | undefined) => (typeof v === "number" && Number.isFinite(v) ? v : undefined);

export function useBuyBuddyAgent() {
  const shop = useShop();
  const navigate = useNavigate();
  const shopRef = useRef(shop);
  useEffect(() => {
    shopRef.current = shop;
  });

  const [goal, setGoal] = useState<string>("");
  const [phase, setPhase] = useState<AgentPhase>("idle");
  const [steps, setSteps] = useState<AgentStep[]>([]);
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [running, setRunning] = useState(false);
  const cancelled = useRef(false);

  const execute = useCallback(
    async (name: string, args: JsonObject): Promise<JsonObject> => {
      const s = shopRef.current;
      const byId = (id?: string) => products.find((p) => p.id === id);

      switch (name as ToolName) {
        case "search_products": {
          const q = (str(args.query) ?? "").toLowerCase().trim();
          const limit = num(args.limit) ?? 12;
          const found = products.filter(
            (p) =>
              p.name.toLowerCase().includes(q) ||
              p.brand.toLowerCase().includes(q) ||
              p.category.includes(q) ||
              p.description.toLowerCase().includes(q) ||
              p.tags.some((t) => t.includes(q)),
          );
          return {
            query: q,
            count: found.length,
            results: found.slice(0, limit).map(slim),
            note: found.length === 0 ? "ZUNO does not carry anything matching this query." : null,
          };
        }
        case "get_product_details": {
          const p = byId(str(args.product_id));
          if (!p) return { ok: false, error: "No such product id in the ZUNO catalogue." };
          return { ok: true, product: { ...slim(p), description: p.description, collections: p.collections ?? [] } };
        }
        case "check_stock": {
          const p = byId(str(args.product_id));
          if (!p) return { ok: false, error: "No such product id." };
          return { ok: true, product_id: p.id, name: p.name, in_stock: true, delivery_min: p.deliveryMin };
        }
        case "compare_products": {
          const ids = Array.isArray(args.product_ids) ? (args.product_ids as JsonValue[]).map(String) : [];
          const rows = ids.map(byId).filter(Boolean) as Product[];
          if (rows.length === 0) return { ok: false, error: "None of those product ids exist." };
          return { ok: true, comparison: rows.map(slim) };
        }
        case "filter_products": {
          const q = (str(args.query) ?? "").toLowerCase().trim();
          let list = products.slice();
          if (q) list = list.filter((p) => (p.name + p.brand + p.tags.join(" ") + p.description).toLowerCase().includes(q));
          const cat = str(args.category);
          if (cat) list = list.filter((p) => p.category === cat);
          const maxP = num(args.max_price);
          if (maxP !== undefined) list = list.filter((p) => p.price <= maxP);
          const minP = num(args.min_price);
          if (minP !== undefined) list = list.filter((p) => p.price >= minP);
          const minR = num(args.min_rating);
          if (minR !== undefined) list = list.filter((p) => p.rating >= minR);
          const maxD = num(args.max_delivery_min);
          if (maxD !== undefined) list = list.filter((p) => p.deliveryMin <= maxD);
          if (args.on_sale === true) list = list.filter((p) => discountPct(p) > 0);
          return { count: list.length, results: list.slice(0, num(args.limit) ?? 12).map(slim) };
        }
        case "sort_products": {
          const ids = Array.isArray(args.product_ids) ? (args.product_ids as JsonValue[]).map(String) : [];
          const rows = (ids.map(byId).filter(Boolean) as Product[]).slice();
          const by = str(args.by) ?? "popularity";
          const cmp: Record<string, (a: Product, b: Product) => number> = {
            price_asc: (a, b) => a.price - b.price,
            price_desc: (a, b) => b.price - a.price,
            rating: (a, b) => b.rating - a.rating,
            popularity: (a, b) => b.reviews - a.reviews,
            discount: (a, b) => discountPct(b) - discountPct(a),
            delivery: (a, b) => a.deliveryMin - b.deliveryMin,
          };
          rows.sort(cmp[by] ?? cmp.popularity);
          return { sorted_by: by, results: rows.map(slim) };
        }
        case "add_to_cart": {
          const p = byId(str(args.product_id));
          if (!p) return { ok: false, error: "Cannot add: no such product id." };
          const qty = Math.max(1, Math.min(20, Math.round(num(args.quantity) ?? 1)));
          s.addToCart(p.id, qty);
          return { ok: true, added: { id: p.id, name: p.name, quantity: qty, price: p.price }, note: "Call get_cart to verify." };
        }
        case "remove_from_cart": {
          const id = str(args.product_id) ?? "";
          const present = s.cart.some((i) => i.id === id);
          if (!present) return { ok: false, error: "That product is not in the cart." };
          s.removeFromCart(id);
          return { ok: true, removed: id, note: "Call get_cart to verify." };
        }
        case "update_cart_quantity": {
          const p = byId(str(args.product_id));
          if (!p) return { ok: false, error: "No such product id." };
          const qty = Math.max(0, Math.min(20, Math.round(num(args.quantity) ?? 1)));
          if (!s.cart.some((i) => i.id === p.id) && qty > 0) s.addToCart(p.id, qty);
          else s.setQty(p.id, qty);
          return { ok: true, product_id: p.id, name: p.name, quantity: qty, note: "Call get_cart to verify." };
        }
        case "get_cart": {
          return {
            items: s.cartProducts.map((p) => ({ id: p.id, name: p.name, quantity: p.qty, price: p.price, line_total: p.price * p.qty })),
            item_count: s.cartCount,
            subtotal: s.cartSubtotal,
            coupon: s.coupon ? s.coupon.code : null,
          };
        }
        case "calculate_cart_total": {
          return {
            subtotal: s.cartSubtotal,
            savings_vs_mrp: s.cartSavings,
            coupon: s.coupon ? { code: s.coupon.code, discount: s.couponDiscount } : null,
            delivery_fee: s.deliveryFee,
            total_payable: s.cartTotal,
            formatted_total: formatINR(s.cartTotal),
          };
        }
        case "apply_coupon": {
          if (s.cartCount === 0) return { ok: false, error: "Cart is empty — nothing to apply a coupon to." };
          const res = s.applyCoupon(str(args.code) ?? "");
          return { ok: res.ok, message: res.message, valid_codes: res.ok ? null : Object.keys(COUPONS) };
        }
        case "get_order_status": {
          const id = str(args.order_id);
          const order = id ? s.orders.find((o) => o.id === id) : s.orders[0];
          if (!order) return { ok: false, error: "No orders have been placed from this device yet." };
          return { ok: true, order: { ...order } };
        }
        case "navigate_to_page": {
          const page = str(args.page) ?? "home";
          const slug = str(args.slug) ?? "";
          const pid = str(args.product_id) ?? "";
          try {
            if (page === "home") navigate({ to: "/" });
            else if (page === "shop") navigate({ to: "/shop" });
            else if (page === "cart" || page === "checkout") navigate({ to: "/checkout" });
            else if (page === "category") {
              if (!categories.some((c) => c.slug === slug)) return { ok: false, error: "Unknown category slug." };
              navigate({ to: "/category/$slug", params: { slug } });
            } else if (page === "collection") {
              if (!collections.some((c) => c.slug === slug)) return { ok: false, error: "Unknown collection slug." };
              navigate({ to: "/collection/$slug", params: { slug } });
            } else if (page === "product") {
              if (!byId(pid)) return { ok: false, error: "Unknown product id." };
              navigate({ to: "/product/$id", params: { id: pid } });
            } else return { ok: false, error: "Unknown page." };
            return { ok: true, navigated_to: page, slug: slug || pid || null };
          } catch {
            return { ok: false, error: "Navigation failed." };
          }
        }
        default:
          return { ok: false, error: `Unknown tool ${name}` };
      }
    },
    [navigate],
  );

  const reset = useCallback(() => {
    cancelled.current = true;
    setPhase("idle");
    setSteps([]);
    setResult("");
    setError("");
    setGoal("");
    setRunning(false);
  }, []);

  const run = useCallback(
    async (userGoal: string) => {
      const trimmed = userGoal.trim();
      if (!trimmed || running) return;
      cancelled.current = false;
      setGoal(trimmed);
      setSteps([]);
      setResult("");
      setError("");
      setRunning(true);
      setPhase("understanding");

      const turns: AgentTurn[] = [{ role: "user", parts: [{ text: trimmed }] }];

      try {
        for (let i = 0; i < 8; i++) {
          if (cancelled.current) return;
          setPhase(i === 0 ? "planning" : (prev) => prev);
          const decision = await runAgentStep({ data: { turns } });
          if (cancelled.current) return;

          if (decision.status === "error") {
            setError(decision.message ?? "The agent could not continue.");
            setPhase("failed");
            return;
          }
          if (decision.status === "done") {
            setResult(decision.message ?? "Done.");
            setPhase("completed");
            return;
          }

          turns.push({ role: "model", parts: decision.calls.map((c) => ({ functionCall: { name: c.name, args: c.args } })) });

          const responses: AgentTurn["parts"] = [];
          for (const call of decision.calls) {
            if (cancelled.current) return;
            const stepId = `${i}-${call.name}-${responses.length}`;
            const mutating = MUTATING_TOOLS.includes(call.name as ToolName);
            setPhase(PHASE_FOR[call.name] ?? "executing");
            setSteps((prev) => [
              ...prev,
              { id: stepId, tool: call.name, label: LABELS[call.name] ?? call.name, args: call.args, status: "running", mutating },
            ]);
            let out: JsonObject;
            try {
              out = await execute(call.name, call.args);
            } catch (e) {
              out = { ok: false, error: e instanceof Error ? e.message : "Tool execution failed." };
            }
            await new Promise((r) => setTimeout(r, 260));
            const failed = out.ok === false;
            setSteps((prev) =>
              prev.map((st) =>
                st.id === stepId
                  ? {
                      ...st,
                      status: failed ? "failed" : "ok",
                      verified: call.name === "get_cart" || call.name === "calculate_cart_total",
                      summary: summarize(call.name, out),
                    }
                  : st,
              ),
            );
            responses.push({ functionResponse: { name: call.name, response: out } });
          }
          turns.push({ role: "user", parts: responses });
        }
        setError("The agent hit its step limit before finishing. Try a narrower goal.");
        setPhase("failed");
      } catch {
        setError("Something interrupted the agent. Please try again.");
        setPhase("failed");
      } finally {
        setRunning(false);
      }
    },
    [execute, running],
  );

  return { goal, phase, steps, result, error, running, run, reset };
}

function summarize(tool: string, out: JsonObject): string {
  if (out.ok === false) return String(out.error ?? "failed");
  if (typeof out.count === "number") return `${out.count} match${out.count === 1 ? "" : "es"} found`;
  if (tool === "get_cart") return `${out.item_count ?? 0} item(s) in cart`;
  if (tool === "calculate_cart_total") return `Total ${String(out.formatted_total ?? "")}`;
  if (tool === "add_to_cart") {
    const a = out.added as { name?: string; quantity?: number } | undefined;
    return `Added ${a?.name ?? ""} ×${a?.quantity ?? 1}`;
  }
  if (tool === "check_stock") return out.in_stock ? "Available" : "Out of stock";
  if (tool === "navigate_to_page") return `Opened ${String(out.navigated_to ?? "")}`;
  if (typeof out.message === "string") return out.message;
  return "done";
}
