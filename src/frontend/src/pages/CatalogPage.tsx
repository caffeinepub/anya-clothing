import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { useSearch } from "@tanstack/react-router";
import { ChevronDown, ChevronUp, SlidersHorizontal, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import {
  useGetAllProducts,
  useGetWishlist,
  useSearchProducts,
} from "../hooks/useQueries";

const SIZES = ["XS", "S", "M", "L"];
const COLLECTIONS = [
  "All",
  "Crop Top Collection",
  "Dress Collection",
  "Tank Top Collection",
  "Bodycon Collection",
  "Navratri Collection",
  "Mini Dress Collection",
];

const ALL_COLORS = [
  { name: "Rose", hex: "#E8A0A0" },
  { name: "Blush", hex: "#F2C4C4" },
  { name: "Ivory", hex: "#F5F0E4" },
  { name: "Cream", hex: "#F3EBDD" },
  { name: "Sage", hex: "#A0B89A" },
  { name: "Emerald", hex: "#50A070" },
  { name: "Navy", hex: "#2D3A5A" },
  { name: "Midnight Blue", hex: "#1A2040" },
  { name: "Burgundy", hex: "#7A2040" },
  { name: "Taupe", hex: "#A09080" },
  { name: "Beige", hex: "#D4C4A8" },
  { name: "Camel", hex: "#C89060" },
  { name: "Dusty Rose", hex: "#D4909C" },
  { name: "Lilac", hex: "#C4A8D0" },
  { name: "Teal", hex: "#408888" },
  { name: "Orange", hex: "#E07840" },
  { name: "Pink", hex: "#F0A0B8" },
  { name: "Black", hex: "#1A1A1A" },
  { name: "White", hex: "#F8F8F8" },
  { name: "Brown", hex: "#7A5040" },
];

type SortOption = "newest" | "price-asc" | "price-desc";

export default function CatalogPage() {
  const search = useSearch({ from: "/catalog" }) as Record<string, string>;
  const searchQuery = search.q || "";

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([200, 7000]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (search.category) setSelectedCategory(search.category);
    else setSelectedCategory("All");
  }, [search.category]);

  const { data: allProducts = [], isLoading } = useGetAllProducts();
  const { data: searchResults = [], isLoading: searchLoading } =
    useSearchProducts(searchQuery);
  const { data: wishlistIds = [] } = useGetWishlist();

  const baseProducts = searchQuery ? searchResults : allProducts;

  const dynamicCollections = useMemo(() => {
    const fromProducts = [...new Set(allProducts.map((p) => p.category))];
    const merged = [
      "All",
      ...COLLECTIONS.filter((c) => c !== "All"),
      ...fromProducts.filter((c) => !COLLECTIONS.includes(c)),
    ];
    return merged;
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    let result = [...baseProducts];

    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }
    if (selectedSizes.length > 0) {
      result = result.filter((p) =>
        selectedSizes.some((s) => p.sizes.includes(s)),
      );
    }
    if (selectedColors.length > 0) {
      result = result.filter((p) =>
        selectedColors.some((c) =>
          p.colors.some((pc) => pc.name.toLowerCase() === c.toLowerCase()),
        ),
      );
    }
    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1],
    );

    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    else result.sort((a, b) => Number(b.createdAt) - Number(a.createdAt));

    return result;
  }, [
    baseProducts,
    selectedCategory,
    selectedSizes,
    selectedColors,
    priceRange,
    sortBy,
  ]);

  const toggleSize = (size: string) =>
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );

  const toggleColor = (color: string) =>
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color],
    );

  const clearFilters = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange([200, 7000]);
    setSelectedCategory("All");
  };

  const SidebarContent = () => (
    <aside className="space-y-6" data-ocid="catalog.panel">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-xs tracking-widest uppercase">
          Filters
        </h3>
        <button
          type="button"
          onClick={clearFilters}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          data-ocid="catalog.cancel_button"
        >
          Clear All
        </button>
      </div>

      {/* Collection */}
      <div>
        <h4 className="text-xs font-medium tracking-widest uppercase mb-3">
          Collection
        </h4>
        <div className="space-y-2">
          {dynamicCollections.map((col) => (
            <button
              type="button"
              key={col}
              onClick={() => setSelectedCategory(col)}
              className={`block w-full text-left text-sm px-3 py-1.5 transition-colors ${
                selectedCategory === col
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
              data-ocid="catalog.tab"
            >
              {col}
            </button>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h4 className="text-xs font-medium tracking-widest uppercase mb-3">
          Size
        </h4>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              type="button"
              key={size}
              onClick={() => toggleSize(size)}
              className={`px-3 py-1.5 text-xs border transition-all ${
                selectedSizes.includes(size)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-warm-border text-foreground hover:border-foreground"
              }`}
              data-ocid="catalog.toggle"
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <h4 className="text-xs font-medium tracking-widest uppercase mb-3">
          Color
        </h4>
        <div className="grid grid-cols-5 gap-2">
          {ALL_COLORS.map((color) => (
            <button
              type="button"
              key={color.name}
              onClick={() => toggleColor(color.name)}
              title={color.name}
              className={`w-7 h-7 rounded-sm border-2 transition-all ${
                selectedColors.includes(color.name)
                  ? "ring-2 ring-foreground ring-offset-1 border-transparent"
                  : "border-warm-border hover:border-foreground"
              }`}
              style={{ backgroundColor: color.hex }}
              aria-label={color.name}
              data-ocid="catalog.toggle"
            />
          ))}
        </div>
        {selectedColors.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {selectedColors.map((c) => (
              <span
                key={c}
                className="inline-flex items-center gap-1 text-[10px] bg-secondary px-2 py-0.5"
              >
                {c}
                <button
                  type="button"
                  onClick={() => toggleColor(c)}
                  aria-label={`Remove ${c}`}
                >
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-xs font-medium tracking-widest uppercase mb-3">
          Price Range
        </h4>
        <div className="flex justify-between text-xs text-muted-foreground mb-3">
          <span>₹{priceRange[0].toLocaleString("en-IN")}</span>
          <span>₹{priceRange[1].toLocaleString("en-IN")}</span>
        </div>
        <Slider
          min={200}
          max={7000}
          step={100}
          value={priceRange}
          onValueChange={(v) => setPriceRange(v as [number, number])}
          className="w-full"
          data-ocid="catalog.toggle"
        />
      </div>

      <Button
        type="button"
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 tracking-widest text-xs uppercase"
        data-ocid="catalog.primary_button"
      >
        Apply Filters
      </Button>
    </aside>
  );

  return (
    <main className="min-h-screen" data-ocid="catalog.page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl">
              {searchQuery
                ? `Search: "${searchQuery}"`
                : selectedCategory === "All"
                  ? "All Products"
                  : selectedCategory}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isLoading || searchLoading
                ? "Loading..."
                : `${filteredProducts.length} products`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Mobile filter toggle */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="lg:hidden border-warm-border"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              data-ocid="catalog.secondary_button"
            >
              <SlidersHorizontal size={14} className="mr-2" /> Filters
            </Button>

            {/* Desktop sidebar toggle */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="hidden lg:flex border-warm-border"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              data-ocid="catalog.secondary_button"
            >
              {sidebarOpen ? (
                <ChevronUp size={14} className="mr-1" />
              ) : (
                <ChevronDown size={14} className="mr-1" />
              )}
              {sidebarOpen ? "Hide" : "Show"} Filters
            </Button>

            <Select
              value={sortBy}
              onValueChange={(v) => setSortBy(v as SortOption)}
            >
              <SelectTrigger
                className="w-36 border-warm-border text-sm"
                data-ocid="catalog.select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-asc">Price: Low–High</SelectItem>
                <SelectItem value="price-desc">Price: High–Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Mobile sidebar */}
        {mobileSidebarOpen && (
          <div className="lg:hidden mb-6 p-4 bg-card border border-warm-border">
            <SidebarContent />
          </div>
        )}

        <div className="flex gap-8">
          {/* Desktop sidebar */}
          {sidebarOpen && (
            <div className="hidden lg:block w-56 flex-shrink-0">
              <SidebarContent />
            </div>
          )}

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {isLoading || searchLoading ? (
              <div
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                data-ocid="catalog.loading_state"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i}>
                    <Skeleton className="w-full aspect-[3/4]" />
                    <Skeleton className="h-4 mt-3 w-3/4" />
                    <Skeleton className="h-4 mt-2 w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
                data-ocid="catalog.empty_state"
              >
                <p className="font-serif text-2xl text-muted-foreground mb-4">
                  No products found
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  Try adjusting your filters or search term.
                </p>
                <Button
                  type="button"
                  onClick={clearFilters}
                  variant="outline"
                  className="border-warm-border"
                  data-ocid="catalog.secondary_button"
                >
                  Clear Filters
                </Button>
              </motion.div>
            ) : (
              <div
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
                data-ocid="catalog.list"
              >
                {filteredProducts.map((product, i) => (
                  <ProductCard
                    key={String(product.id)}
                    product={product}
                    wishlistIds={wishlistIds}
                    index={i}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
