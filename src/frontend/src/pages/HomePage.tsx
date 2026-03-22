import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import ProductCard from "../components/ProductCard";
import {
  useGetAllProducts,
  useGetBestsellers,
  useGetWishlist,
} from "../hooks/useQueries";

const COLLECTIONS = [
  {
    name: "Crop Top Collection",
    label: "Crop Tops",
    emoji: "🌸",
    gradient: "linear-gradient(135deg, #FBCFE8 0%, #F472B6 100%)",
    textColor: "#831843",
  },
  {
    name: "Dress Collection",
    label: "Dresses",
    emoji: "🌹",
    gradient: "linear-gradient(135deg, #FECDD3 0%, #FB7185 100%)",
    textColor: "#881337",
  },
  {
    name: "Tank Top Collection",
    label: "Tank Tops",
    emoji: "✨",
    gradient: "linear-gradient(135deg, #FED7AA 0%, #FB923C 100%)",
    textColor: "#7C2D12",
  },
  {
    name: "Bodycon Collection",
    label: "Bodycon",
    emoji: "💜",
    gradient: "linear-gradient(135deg, #E9D5FF 0%, #A855F7 100%)",
    textColor: "#581C87",
  },
  {
    name: "Navratri Collection",
    label: "Navratri",
    emoji: "🪔",
    gradient: "linear-gradient(135deg, #FEF08A 0%, #FB923C 100%)",
    textColor: "#78350F",
  },
  {
    name: "Mini Dress Collection",
    label: "Mini Dresses",
    emoji: "🌺",
    gradient: "linear-gradient(135deg, #FBCFE8 0%, #C084FC 100%)",
    textColor: "#701A75",
  },
];

export default function HomePage() {
  const { data: bestsellers, isLoading: bestsellersLoading } =
    useGetBestsellers();
  const { data: allProducts, isLoading: allLoading } = useGetAllProducts();
  const { data: wishlistIds = [] } = useGetWishlist();

  const newArrivals = allProducts?.slice(-4).reverse() ?? [];

  return (
    <main>
      {/* ── Hero Section ── */}
      <section
        className="relative w-full overflow-hidden"
        style={{ minHeight: "90vh" }}
        data-ocid="hero.section"
      >
        {/* Background image – Priya */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/assets/uploads/Snapchat-981362243-2.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center top",
          }}
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(139,58,90,0.82) 0%, rgba(139,58,90,0.55) 45%, rgba(139,58,90,0.10) 100%)",
          }}
        />

        <div className="relative z-10 flex items-center h-full min-h-[90vh] max-w-7xl mx-auto px-6 sm:px-10">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="max-w-xl"
          >
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-xs font-medium tracking-[0.35em] uppercase text-white/80 mb-5 flex items-center gap-2"
            >
              <Sparkles size={12} /> Anya Clothing — Spring Collection 2026
            </motion.p>
            <h1
              className="font-serif text-5xl sm:text-7xl text-white leading-tight mb-4"
              style={{ textShadow: "0 2px 20px rgba(0,0,0,0.25)" }}
            >
              Own Your Style
              <br />
              <span className="italic">with Anya ✨</span>
            </h1>
            <p className="text-white/80 text-base sm:text-lg mb-8 font-light tracking-wide">
              Be Bold. Be Feminine. Be You.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/catalog"
                search={{ q: "", category: "", bestsellers: "", sale: "" }}
              >
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 font-semibold tracking-wide shadow-lg"
                  data-ocid="hero.primary_button"
                >
                  Shop Now <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
              <Link
                to="/catalog"
                search={{ q: "", category: "", bestsellers: "", sale: "" }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/15 font-medium tracking-wide backdrop-blur-sm"
                  data-ocid="hero.secondary_button"
                >
                  Explore Collections
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24"
          style={{
            background:
              "linear-gradient(to top, oklch(0.972 0.018 350), transparent)",
          }}
        />
      </section>

      {/* ── Brand Ambassador Section ── */}
      <section
        className="py-20"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.942 0.04 350) 0%, oklch(0.96 0.025 345) 50%, oklch(0.91 0.055 35 / 0.3) 100%)",
        }}
        data-ocid="ambassador.section"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <p className="text-xs tracking-[0.35em] uppercase text-primary/60 mb-2">
              The Face of Anya
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl text-foreground">
              Meet Our Brand Ambassador
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Images mosaic */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative grid grid-cols-2 gap-3"
            >
              <div
                className="col-span-1 rounded-2xl overflow-hidden shadow-card-hover"
                style={{ aspectRatio: "3/4" }}
              >
                <img
                  src="/assets/uploads/Snapchat-981362243-2.jpg"
                  alt="Priya - Anya Brand Ambassador"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div
                className="col-span-1 rounded-2xl overflow-hidden shadow-card-hover mt-10"
                style={{ aspectRatio: "3/4" }}
              >
                <img
                  src="/assets/uploads/Snapchat-1824187759-1.jpg"
                  alt="Priya - Anya Brand Ambassador"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              {/* Decorative badge */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-6 py-2 rounded-full text-xs font-medium tracking-widest uppercase shadow-lg whitespace-nowrap">
                Anya Brand Ambassador ✨
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="pt-8 md:pt-0 text-center md:text-left"
            >
              <p
                className="font-serif text-7xl sm:text-8xl text-primary/10 leading-none mb-2 select-none"
                aria-hidden="true"
              >
                &ldquo;
              </p>
              <blockquote className="font-serif text-2xl sm:text-3xl text-foreground leading-relaxed italic mb-6 -mt-8">
                Fashion is how you tell the world who you are without saying a
                word.
              </blockquote>
              <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">
                — Priya
              </p>
              <div className="inline-block text-4xl font-serif font-bold text-primary tracking-widest mb-4">
                Priya
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                Priya brings the spirit of Anya to life — bold, feminine, and
                unapologetically herself. She inspires every woman to own her
                unique style with confidence.
              </p>
              <Link
                to="/catalog"
                search={{ q: "", category: "", bestsellers: "", sale: "" }}
                className="inline-flex items-center gap-2 mt-6 text-primary font-medium text-sm hover:gap-3 transition-all"
                data-ocid="ambassador.link"
              >
                Shop Priya&apos;s Picks <ChevronRight size={16} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Collections Grid ── */}
      <section
        className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        data-ocid="collections.section"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-xs tracking-[0.35em] uppercase text-muted-foreground mb-2">
            Shop by Collection
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl">
            Discover Our Collections
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {COLLECTIONS.map((col, i) => (
            <motion.div
              key={col.name}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link
                to="/catalog"
                search={{
                  q: "",
                  category: col.name,
                  bestsellers: "",
                  sale: "",
                }}
                data-ocid="collections.link"
              >
                <div
                  className="relative overflow-hidden rounded-2xl cursor-pointer group shadow-card hover:shadow-card-hover transition-shadow duration-300"
                  style={{
                    background: col.gradient,
                    aspectRatio: "4/3",
                  }}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    <span className="text-4xl mb-3">{col.emoji}</span>
                    <h3
                      className="font-serif text-xl sm:text-2xl font-semibold text-center"
                      style={{ color: col.textColor }}
                    >
                      {col.label}
                    </h3>
                    <span
                      className="text-xs tracking-widest uppercase mt-2 flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity"
                      style={{ color: col.textColor }}
                    >
                      Shop now <ChevronRight size={11} />
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300 rounded-2xl" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Bestsellers Section ── */}
      <section className="py-20 bg-secondary" data-ocid="bestsellers.section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">
              Most Loved
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl">Bestsellers</h2>
          </motion.div>

          {bestsellersLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                  <Skeleton className="w-full aspect-[3/4]" />
                  <Skeleton className="h-4 mt-3 w-3/4" />
                  <Skeleton className="h-4 mt-2 w-1/2" />
                </div>
              ))}
            </div>
          ) : bestsellers && bestsellers.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {bestsellers.slice(0, 4).map((product, i) => (
                <ProductCard
                  key={String(product.id)}
                  product={product}
                  wishlistIds={wishlistIds}
                  index={i}
                />
              ))}
            </div>
          ) : (
            <div
              className="text-center py-12"
              data-ocid="bestsellers.empty_state"
            >
              <p className="text-muted-foreground text-sm">
                No bestsellers yet. Seed products from the admin panel!
              </p>
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              to="/catalog"
              search={{ q: "", category: "", bestsellers: "true", sale: "" }}
            >
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90 tracking-widest text-xs uppercase px-8"
                data-ocid="bestsellers.primary_button"
              >
                View All Bestsellers
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── New Arrivals ── */}
      <section
        className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        data-ocid="new_arrivals.section"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-1">
              Just Dropped
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl">New Arrivals</h2>
          </div>
          <Link
            to="/catalog"
            search={{ q: "", category: "", bestsellers: "", sale: "" }}
            className="text-xs tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            data-ocid="new_arrivals.link"
          >
            Show All <ChevronRight size={14} />
          </Link>
        </motion.div>

        {allLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <Skeleton className="w-full aspect-[3/4]" />
                <Skeleton className="h-4 mt-3 w-3/4" />
              </div>
            ))}
          </div>
        ) : newArrivals.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map((product, i) => (
              <ProductCard
                key={String(product.id)}
                product={product}
                wishlistIds={wishlistIds}
                index={i}
              />
            ))}
          </div>
        ) : (
          <div
            className="text-center py-12"
            data-ocid="new_arrivals.empty_state"
          >
            <p className="text-muted-foreground text-sm">
              New arrivals coming soon!
            </p>
          </div>
        )}
      </section>

      {/* ── Free Shipping Banner ── */}
      <section
        className="py-14 text-center"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.42 0.115 345) 0%, oklch(0.52 0.14 350) 100%)",
        }}
        data-ocid="banner.section"
      >
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs tracking-[0.35em] uppercase text-white/70 mb-3">
            Limited Time Offer
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-white mb-4">
            🚚 Free Shipping on Orders Over ₹2000
          </h2>
          <p className="text-white/70 text-sm mb-6">
            Shop the latest collections and get free delivery to your doorstep.
          </p>
          <Link
            to="/catalog"
            search={{ q: "", category: "", bestsellers: "", sale: "" }}
          >
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white/15 tracking-widest text-xs uppercase backdrop-blur-sm"
              data-ocid="banner.primary_button"
            >
              Shop Now <ArrowRight size={14} className="ml-2" />
            </Button>
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
