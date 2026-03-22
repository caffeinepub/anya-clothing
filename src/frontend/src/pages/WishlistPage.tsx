import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import ProductCard from "../components/ProductCard";
import {
  useGetAllProducts,
  useGetWishlist,
  useRemoveFromWishlist,
} from "../hooks/useQueries";

const WISHLIST_LIMIT = 800;

export default function WishlistPage() {
  const { data: wishlistIds = [], isLoading: wishlistLoading } =
    useGetWishlist();
  const { data: allProducts = [], isLoading: productsLoading } =
    useGetAllProducts();
  const removeFromWishlist = useRemoveFromWishlist();

  const wishlistProducts = allProducts.filter((p) =>
    wishlistIds.some((id) => id === p.id),
  );

  const handleRemove = async (productId: bigint) => {
    await removeFromWishlist.mutateAsync(productId);
    toast.success("Removed from wishlist");
  };

  const isLoading = wishlistLoading || productsLoading;
  const count = wishlistIds.length;
  const progressPct = Math.min((count / WISHLIST_LIMIT) * 100, 100);

  return (
    <main className="min-h-screen" data-ocid="wishlist.page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl mb-1">
              My Wishlist
            </h1>
            <p className="text-sm text-muted-foreground">
              {count} of {WISHLIST_LIMIT} items saved
            </p>
          </div>
          <Heart size={28} className="text-muted-foreground mt-1" />
        </div>

        {/* Limit bar */}
        {count > 0 && (
          <div className="mb-8">
            <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
              <span>Wishlist capacity</span>
              <span>
                {count}/{WISHLIST_LIMIT}
              </span>
            </div>
            <Progress value={progressPct} className="h-1.5" />
            {count >= WISHLIST_LIMIT - 50 && (
              <p className="text-xs text-amber-600 mt-1.5">
                ⚠ Almost full! You can save up to {WISHLIST_LIMIT} items.
              </p>
            )}
          </div>
        )}

        {/* Products */}
        {isLoading ? (
          <div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            data-ocid="wishlist.loading_state"
          >
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <Skeleton className="w-full aspect-[3/4]" />
                <Skeleton className="h-4 mt-3 w-3/4" />
              </div>
            ))}
          </div>
        ) : wishlistProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-24"
            data-ocid="wishlist.empty_state"
          >
            <Heart
              size={56}
              className="text-muted-foreground mx-auto mb-6 opacity-30"
            />
            <h2 className="font-serif text-2xl mb-3">Your wishlist is empty</h2>
            <p className="text-muted-foreground text-sm mb-8">
              Save your favourite pieces and find them here anytime.
            </p>
            <Link
              to="/catalog"
              search={{ q: "", category: "", bestsellers: "", sale: "" }}
            >
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90 tracking-widest text-xs uppercase px-8"
                data-ocid="wishlist.primary_button"
              >
                <ShoppingBag size={14} className="mr-2" /> Browse Products
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
            data-ocid="wishlist.list"
          >
            {wishlistProducts.map((product, i) => (
              <ProductCard
                key={String(product.id)}
                product={product}
                wishlistIds={wishlistIds}
                index={i}
                showRemove
                onRemove={() => handleRemove(product.id)}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
