import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import ProductCard from "../components/ProductCard";
import {
  useGetAllProducts,
  useGetBestsellers,
  useGetWishlist,
} from "../hooks/useQueries";

export default function HomePage() {
  const { data: bestsellers, isLoading: bestsellersLoading } =
    useGetBestsellers();
  const { data: allProducts, isLoading: allLoading } = useGetAllProducts();
  const { data: wishlistIds = [] } = useGetWishlist();

  const newArrivals = allProducts?.slice(-4).reverse() ?? [];

  return (
    <main>
      {/* Hero Section */}
      <section
        className="relative w-full overflow-hidden"
        style={{ minHeight: "85vh" }}
        data-ocid="hero.section"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/assets/generated/hero-model.dim_1400x900.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

        <div className="relative z-10 flex items-center h-full min-h-[85vh] max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-md"
          >
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-white/80 mb-4">
              New Collection 2026
            </p>
            <h1 className="font-serif text-5xl sm:text-6xl text-white leading-tight mb-6">
              Elegant Essentials for the Modern Woman
            </h1>
            <p className="text-white/70 text-sm mb-8 leading-relaxed">
              Discover curated pieces that celebrate femininity — crafted with
              care, worn with confidence.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/catalog"
                search={{ q: "", category: "", bestsellers: "", sale: "" }}
              >
                <Button
                  size="lg"
                  className="bg-white text-warm-dark hover:bg-white/90 font-medium tracking-wide"
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
                  className="border-white text-white hover:bg-white/10 font-medium tracking-wide"
                  data-ocid="hero.secondary_button"
                >
                  Bestsellers
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section
        className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        data-ocid="categories.section"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-serif text-3xl sm:text-4xl text-center mb-2">
            Shop by Category
          </h2>
          <p className="text-center text-muted-foreground text-sm mb-10">
            Find your perfect style
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              name: "Dresses",
              style: {
                background: "linear-gradient(135deg, #f9e4e4 0%, #fce8d8 100%)",
              },
            },
            {
              name: "Tops",
              style: {
                background: "linear-gradient(135deg, #e8f0e8 0%, #d8ead8 100%)",
              },
            },
            {
              name: "Accessories",
              style: {
                background: "linear-gradient(135deg, #f5f0e4 0%, #ede4d4 100%)",
              },
            },
          ].map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link
                to="/catalog"
                search={{ q: "", category: "", bestsellers: "", sale: "" }}
                data-ocid="categories.link"
              >
                <div
                  className="relative overflow-hidden group cursor-pointer"
                  style={{ ...cat.style, aspectRatio: "4/3" }}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <h3 className="font-serif text-3xl text-foreground mb-2">
                      {cat.name}
                    </h3>
                    <span className="text-xs tracking-widest uppercase text-muted-foreground group-hover:text-foreground transition-colors flex items-center gap-1">
                      Shop now <ChevronRight size={12} />
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className="py-16 bg-secondary" data-ocid="bestsellers.section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">
              Most Loved
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl uppercase tracking-widest">
              Bestsellers
            </h2>
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
                No bestsellers yet. Check back soon!
              </p>
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              to="/catalog"
              search={{ q: "", category: "", bestsellers: "", sale: "" }}
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

      {/* New Arrivals */}
      <section
        className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        data-ocid="new_arrivals.section"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-1">
              Just dropped
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl">New Arrivals</h2>
          </div>
          <Link
            to="/catalog"
            search={{ q: "", category: "", bestsellers: "", sale: "" }}
            className="text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
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

      {/* Banner strip */}
      <section
        className="bg-primary text-primary-foreground py-10 text-center"
        data-ocid="banner.section"
      >
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs tracking-[0.3em] uppercase mb-3">
            Limited Time
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl mb-4">
            Free Shipping on Orders Over ₹2000
          </h2>
          <Link
            to="/catalog"
            search={{ q: "", category: "", bestsellers: "", sale: "" }}
          >
            <Button
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 tracking-widest text-xs uppercase"
              data-ocid="banner.primary_button"
            >
              Shop Now
            </Button>
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
