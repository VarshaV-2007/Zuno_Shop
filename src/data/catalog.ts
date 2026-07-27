// ZUNO product catalog. All INR pricing. Every product has a unique image.
import catProduce from "@/assets/cat-produce.jpg";
import catDairy from "@/assets/cat-dairy.jpg";
import catPantry from "@/assets/cat-pantry.jpg";
import catSnacks from "@/assets/cat-snacks.jpg";
import catPersonal from "@/assets/cat-personal.jpg";
import catBeauty from "@/assets/cat-beauty.jpg";
import catHome from "@/assets/cat-home.jpg";
import catBaby from "@/assets/cat-baby.jpg";

import momentMorning from "@/assets/moment-morning.jpg";
import momentMovie from "@/assets/moment-movie.jpg";
import momentDinner from "@/assets/moment-dinner.jpg";
import momentSelfcare from "@/assets/moment-selfcare.jpg";
import momentHome from "@/assets/moment-home.jpg";
import momentWeekend from "@/assets/moment-weekend.jpg";

import pMilk from "@/assets/p-milk.jpg";
import pBread from "@/assets/p-bread.jpg";
import pBanana from "@/assets/p-banana.jpg";
import pTomato from "@/assets/p-tomato.jpg";
import pSpinach from "@/assets/p-spinach.jpg";
import pApple from "@/assets/p-apple.jpg";
import pButter from "@/assets/p-butter.jpg";
import pPaneer from "@/assets/p-paneer.jpg";
import pRice from "@/assets/p-rice.jpg";
import pAtta from "@/assets/p-atta.jpg";
import pDal from "@/assets/p-dal.jpg";
import pOil from "@/assets/p-oil.jpg";
import pChips from "@/assets/p-chips.jpg";
import pCola from "@/assets/p-cola.jpg";
import pChocolate from "@/assets/p-chocolate.jpg";
import pCookies from "@/assets/p-cookies.jpg";
import pShampoo from "@/assets/p-shampoo.jpg";
import pSoap from "@/assets/p-soap.jpg";
import pToothpaste from "@/assets/p-toothpaste.jpg";
import pFacewash from "@/assets/p-facewash.jpg";
import pMoisturizer from "@/assets/p-moisturizer.jpg";
import pLipstick from "@/assets/p-lipstick.jpg";
import pSunscreen from "@/assets/p-sunscreen.jpg";
import pKajal from "@/assets/p-kajal.jpg";
import pDetergent from "@/assets/p-detergent.jpg";
import pDishsoap from "@/assets/p-dishsoap.jpg";
import pFloorcleaner from "@/assets/p-floorcleaner.jpg";
import pTissue from "@/assets/p-tissue.jpg";
import pBabylotion from "@/assets/p-babylotion.jpg";
import pDiapers from "@/assets/p-diapers.jpg";
import pBabyshampoo from "@/assets/p-babyshampoo.jpg";
import pBabywipes from "@/assets/p-babywipes.jpg";

export type Category = {
  slug: string;
  name: string;
  image: string;
  tint: string;
};

export type Collection = {
  slug: string;
  name: string;
  tagline: string;
  image: string;
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  size: string;
  category: string; // category slug
  price: number; // INR
  mrp?: number; // INR original
  rating: number;
  reviews: number;
  deliveryMin: number;
  image: string;
  tags: string[];
  description: string;
  collections?: string[];
};

export const categories: Category[] = [
  { slug: "produce", name: "Fresh Produce", image: catProduce, tint: "oklch(0.94 0.05 140)" },
  { slug: "dairy", name: "Dairy & Bakery", image: catDairy, tint: "oklch(0.95 0.04 85)" },
  { slug: "pantry", name: "Pantry", image: catPantry, tint: "oklch(0.94 0.04 70)" },
  { slug: "snacks", name: "Snacks & Beverages", image: catSnacks, tint: "oklch(0.94 0.05 55)" },
  { slug: "personal", name: "Personal Care", image: catPersonal, tint: "oklch(0.95 0.03 30)" },
  { slug: "beauty", name: "Beauty", image: catBeauty, tint: "oklch(0.94 0.04 20)" },
  { slug: "home", name: "Home Essentials", image: catHome, tint: "oklch(0.94 0.04 220)" },
  { slug: "baby", name: "Baby Care", image: catBaby, tint: "oklch(0.95 0.03 240)" },
];

export const collections: Collection[] = [
  { slug: "morning-start", name: "Morning Start", tagline: "Wake up right", image: momentMorning },
  { slug: "movie-night", name: "Movie Night", tagline: "Snack-ready evenings", image: momentMovie },
  { slug: "quick-dinner", name: "Quick Dinner", tagline: "On the table in 20", image: momentDinner },
  { slug: "self-care", name: "Self Care", tagline: "A softer routine", image: momentSelfcare },
  { slug: "home-reset", name: "Home Reset", tagline: "Fresh and tidy", image: momentHome },
  { slug: "weekend-ready", name: "Weekend Ready", tagline: "Made to relax", image: momentWeekend },
];

export const products: Product[] = [
  // Produce
  { id: "banana-500g", name: "Robusta Bananas", brand: "ZUNO Farms", size: "500 g", category: "produce", price: 45, mrp: 55, rating: 4.6, reviews: 1820, deliveryMin: 12, image: pBanana, tags: ["fruit", "fresh"], description: "Naturally ripened robusta bananas, hand-picked at peak sweetness.", collections: ["morning-start"] },
  { id: "tomato-1kg", name: "Hybrid Tomatoes", brand: "ZUNO Farms", size: "1 kg", category: "produce", price: 39, mrp: 60, rating: 4.4, reviews: 940, deliveryMin: 12, image: pTomato, tags: ["vegetable"], description: "Farm-fresh red tomatoes, ideal for curries and salads.", collections: ["quick-dinner"] },
  { id: "spinach-250g", name: "Baby Spinach", brand: "Greenly", size: "250 g", category: "produce", price: 35, rating: 4.5, reviews: 610, deliveryMin: 12, image: pSpinach, tags: ["vegetable", "leafy"], description: "Tender baby spinach, washed and ready to cook." },
  { id: "apple-1kg", name: "Shimla Apples", brand: "Himalayan Basket", size: "1 kg", category: "produce", price: 179, mrp: 220, rating: 4.7, reviews: 2100, deliveryMin: 15, image: pApple, tags: ["fruit", "premium"], description: "Crisp, juicy Shimla apples straight from the orchards." },

  // Dairy & Bakery
  { id: "milk-1l", name: "Full Cream Milk", brand: "Amul", size: "1 L", category: "dairy", price: 68, rating: 4.8, reviews: 5240, deliveryMin: 10, image: pMilk, tags: ["dairy", "daily"], description: "Rich, full cream cow's milk in a returnable bottle.", collections: ["morning-start"] },
  { id: "bread-400g", name: "Whole Wheat Bread", brand: "Britannia", size: "400 g", category: "dairy", price: 55, mrp: 60, rating: 4.5, reviews: 3120, deliveryMin: 10, image: pBread, tags: ["bakery", "daily"], description: "Soft whole wheat sandwich loaf, freshly baked.", collections: ["morning-start"] },
  { id: "butter-100g", name: "Salted Butter", brand: "Amul", size: "100 g", category: "dairy", price: 62, rating: 4.7, reviews: 4100, deliveryMin: 10, image: pButter, tags: ["dairy"], description: "Classic yellow salted butter — perfect on toast." },
  { id: "paneer-200g", name: "Fresh Paneer", brand: "Mother Dairy", size: "200 g", category: "dairy", price: 95, mrp: 110, rating: 4.6, reviews: 1780, deliveryMin: 12, image: pPaneer, tags: ["dairy"], description: "Soft, fresh paneer block for curries and grills.", collections: ["quick-dinner"] },

  // Pantry
  { id: "rice-5kg", name: "Basmati Rice", brand: "India Gate", size: "5 kg", category: "pantry", price: 649, mrp: 749, rating: 4.8, reviews: 3800, deliveryMin: 20, image: pRice, tags: ["staple"], description: "Long-grain aged basmati rice, aromatic and fluffy." },
  { id: "atta-5kg", name: "Whole Wheat Atta", brand: "Aashirvaad", size: "5 kg", category: "pantry", price: 289, mrp: 320, rating: 4.7, reviews: 4500, deliveryMin: 20, image: pAtta, tags: ["staple"], description: "100% whole wheat atta made from finest chakki-ground grains." },
  { id: "dal-1kg", name: "Toor Dal", brand: "Tata Sampann", size: "1 kg", category: "pantry", price: 189, mrp: 220, rating: 4.6, reviews: 2200, deliveryMin: 20, image: pDal, tags: ["staple"], description: "Premium unpolished toor dal, cleaned and sorted." },
  { id: "oil-1l", name: "Sunflower Oil", brand: "Fortune", size: "1 L", category: "pantry", price: 145, mrp: 165, rating: 4.5, reviews: 1900, deliveryMin: 20, image: pOil, tags: ["staple"], description: "Refined sunflower cooking oil, light and heart-friendly." },

  // Snacks & Beverages
  { id: "chips-52g", name: "Classic Salted Chips", brand: "Lay's", size: "52 g", category: "snacks", price: 20, rating: 4.6, reviews: 8900, deliveryMin: 10, image: pChips, tags: ["snack"], description: "Crisp, thin, salted potato chips — a timeless classic.", collections: ["movie-night", "weekend-ready"] },
  { id: "cola-750ml", name: "Cola Bottle", brand: "Coca-Cola", size: "750 ml", category: "snacks", price: 45, mrp: 50, rating: 4.7, reviews: 12300, deliveryMin: 10, image: pCola, tags: ["drink"], description: "The original cola in a chilled glass bottle.", collections: ["movie-night"] },
  { id: "chocolate-90g", name: "Dark Chocolate 70%", brand: "Amul", size: "90 g", category: "snacks", price: 120, mrp: 140, rating: 4.7, reviews: 3400, deliveryMin: 10, image: pChocolate, tags: ["snack", "premium"], description: "Rich 70% dark chocolate with a smooth finish.", collections: ["movie-night", "self-care"] },
  { id: "cookies-120g", name: "Choco Cream Cookies", brand: "Oreo", size: "120 g", category: "snacks", price: 60, rating: 4.6, reviews: 5600, deliveryMin: 10, image: pCookies, tags: ["snack"], description: "Chocolate sandwich cookies with vanilla cream.", collections: ["weekend-ready"] },

  // Personal Care
  { id: "shampoo-340ml", name: "Damage Repair Shampoo", brand: "Dove", size: "340 ml", category: "personal", price: 285, mrp: 340, rating: 4.5, reviews: 3200, deliveryMin: 15, image: pShampoo, tags: ["haircare"], description: "Nourishing shampoo for dry, damaged hair.", collections: ["self-care"] },
  { id: "soap-100g", name: "Sandalwood Soap", brand: "Mysore Sandal", size: "100 g", category: "personal", price: 65, rating: 4.7, reviews: 4100, deliveryMin: 15, image: pSoap, tags: ["bathcare"], description: "Classic sandalwood bathing soap with pure oil." },
  { id: "toothpaste-150g", name: "Whitening Toothpaste", brand: "Colgate", size: "150 g", category: "personal", price: 129, mrp: 150, rating: 4.6, reviews: 2900, deliveryMin: 15, image: pToothpaste, tags: ["oralcare"], description: "Advanced whitening formula for a brighter smile." },
  { id: "facewash-100ml", name: "Neem Face Wash", brand: "Himalaya", size: "100 ml", category: "personal", price: 145, mrp: 175, rating: 4.6, reviews: 5100, deliveryMin: 15, image: pFacewash, tags: ["skincare"], description: "Purifying neem face wash for clear, healthy skin.", collections: ["self-care"] },

  // Beauty
  { id: "moisturizer-50g", name: "Hydrating Moisturizer", brand: "Neutrogena", size: "50 g", category: "beauty", price: 649, mrp: 750, rating: 4.7, reviews: 1800, deliveryMin: 20, image: pMoisturizer, tags: ["skincare", "premium"], description: "Lightweight gel moisturizer for all skin types.", collections: ["self-care"] },
  { id: "lipstick-4g", name: "Matte Lipstick — Rouge", brand: "Lakmé", size: "4 g", category: "beauty", price: 550, mrp: 650, rating: 4.6, reviews: 2400, deliveryMin: 20, image: pLipstick, tags: ["makeup"], description: "Long-lasting matte lipstick in a rich red." },
  { id: "sunscreen-80g", name: "SPF 50 Sunscreen", brand: "The Derma Co", size: "80 g", category: "beauty", price: 449, mrp: 549, rating: 4.7, reviews: 3300, deliveryMin: 20, image: pSunscreen, tags: ["skincare"], description: "Broad-spectrum SPF 50 mineral sunscreen." },
  { id: "kajal-0.35g", name: "Intense Black Kajal", brand: "Lakmé", size: "0.35 g", category: "beauty", price: 220, mrp: 250, rating: 4.6, reviews: 4600, deliveryMin: 20, image: pKajal, tags: ["makeup"], description: "Smudge-proof kohl for deep black definition." },

  // Home Essentials
  { id: "detergent-2kg", name: "Matic Front Load Detergent", brand: "Surf Excel", size: "2 kg", category: "home", price: 549, mrp: 620, rating: 4.7, reviews: 3900, deliveryMin: 25, image: pDetergent, tags: ["laundry"], description: "Powerful stain removal in front-load machines.", collections: ["home-reset"] },
  { id: "dishsoap-750ml", name: "Lemon Dishwash Liquid", brand: "Vim", size: "750 ml", category: "home", price: 199, mrp: 235, rating: 4.6, reviews: 5200, deliveryMin: 25, image: pDishsoap, tags: ["cleaning"], description: "Cuts grease fast, gentle on hands.", collections: ["home-reset"] },
  { id: "floorcleaner-975ml", name: "Floor Disinfectant", brand: "Lizol", size: "975 ml", category: "home", price: 210, mrp: 245, rating: 4.7, reviews: 4200, deliveryMin: 25, image: pFloorcleaner, tags: ["cleaning"], description: "Kills 99.9% of germs — hospital-grade clean.", collections: ["home-reset"] },
  { id: "tissue-100pcs", name: "Facial Tissue Box", brand: "Origami", size: "100 pulls", category: "home", price: 95, rating: 4.5, reviews: 2100, deliveryMin: 25, image: pTissue, tags: ["essentials"], description: "Soft 2-ply facial tissues for daily use." },

  // Baby
  { id: "babylotion-200ml", name: "Baby Lotion — Gentle", brand: "Johnson's", size: "200 ml", category: "baby", price: 235, mrp: 260, rating: 4.8, reviews: 5400, deliveryMin: 20, image: pBabylotion, tags: ["baby", "skincare"], description: "Clinically mild lotion for soft, baby-smooth skin." },
  { id: "diapers-pack-42", name: "Pants-Style Diapers L", brand: "Pampers", size: "42 pcs", category: "baby", price: 799, mrp: 999, rating: 4.7, reviews: 6800, deliveryMin: 20, image: pDiapers, tags: ["baby"], description: "Extra-absorbent pants-style diapers for active babies." },
  { id: "babyshampoo-200ml", name: "Tear-Free Baby Shampoo", brand: "Johnson's", size: "200 ml", category: "baby", price: 189, mrp: 220, rating: 4.8, reviews: 4900, deliveryMin: 20, image: pBabyshampoo, tags: ["baby"], description: "Gentle no-tears shampoo for baby's delicate hair." },
  { id: "babywipes-72pcs", name: "Aloe Baby Wipes", brand: "Mamaearth", size: "72 pcs", category: "baby", price: 199, mrp: 249, rating: 4.7, reviews: 3600, deliveryMin: 20, image: pBabywipes, tags: ["baby"], description: "Ultra-soft wipes with aloe and vitamin E." },
];

export function getProduct(id: string) {
  return products.find((p) => p.id === id);
}

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getCollection(slug: string) {
  return collections.find((c) => c.slug === slug);
}

export function productsByCategory(slug: string) {
  return products.filter((p) => p.category === slug);
}

export function productsByCollection(slug: string) {
  return products.filter((p) => p.collections?.includes(slug));
}

export function bestSellers(limit = 8) {
  return [...products].sort((a, b) => b.reviews - a.reviews).slice(0, limit);
}

export function bestDeals(limit = 8) {
  return products
    .filter((p) => p.mrp)
    .sort((a, b) => ((b.mrp! - b.price) / b.mrp!) - ((a.mrp! - a.price) / a.mrp!))
    .slice(0, limit);
}

export function trending(limit = 8) {
  return [...products].sort((a, b) => b.rating - a.rating).slice(0, limit);
}

export function under99(limit = 8) {
  return products.filter((p) => p.price < 100).slice(0, limit);
}

export function newArrivals(limit = 8) {
  // A stable pseudo-selection of "new" items
  return [products[3], products[7], products[10], products[15], products[19], products[22], products[27], products[30]].filter(Boolean).slice(0, limit);
}

export function searchProducts(q: string) {
  const s = q.trim().toLowerCase();
  if (!s) return [];
  return products.filter((p) =>
    p.name.toLowerCase().includes(s) ||
    p.brand.toLowerCase().includes(s) ||
    p.category.toLowerCase().includes(s) ||
    p.tags.some((t) => t.includes(s)),
  );
}

export function formatINR(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

export function discountPct(p: Product) {
  if (!p.mrp) return 0;
  return Math.round(((p.mrp - p.price) / p.mrp) * 100);
}
