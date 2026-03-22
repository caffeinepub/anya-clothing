import { Heart } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend.d";
import { useAddToWishlist, useRemoveFromWishlist } from "../hooks/useQueries";

interface ProductCardProps {
  product: Product;
  wishlistIds: bigint[];
  index?: number;
  showRemove?: boolean;
  onRemove?: () => void;
}

export default function ProductCard({
  product,
  wishlistIds,
  index = 0,
  showRemove,
  onRemove,
}: ProductCardProps) {
  const [selectedColor, setSelectedColor] = useState(0);
  const isInWishlist = wishlistIds.some((id) => id === product.id);
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist) {
      await removeFromWishlist.mutateAsync(product.id);
      toast.success("Removed from wishlist");
    } else {
      if (wishlistIds.length >= 800) {
        toast.error("Wishlist is full! Maximum 800 items allowed.");
        return;
      }
      await addToWishlist.mutateAsync(product.id);
      toast.success("Added to wishlist!");
    }
  };

  const imageUrl =
    product.imageUrls[0] ||
    `https://placehold.co/400x533/F3EBDD/6E6A63?text=${encodeURIComponent(product.name)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="group cursor-pointer"
      data-ocid={`products.item.${index + 1}`}
    >
      {/* Image container */}
      <div
        className="relative overflow-hidden bg-secondary"
        style={{ aspectRatio: "3/4" }}
      >
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Wishlist button */}
        <button
          type="button"
          onClick={handleWishlist}
          className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-200 hover:scale-110 ${
            isInWishlist ? "text-red-500" : "text-warm-gray hover:text-red-400"
          }`}
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          data-ocid={`products.toggle.${index + 1}`}
        >
          <Heart size={14} fill={isInWishlist ? "currentColor" : "none"} />
        </button>
        {/* Bestseller badge */}
        {product.isBestseller && (
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] tracking-widest uppercase px-2 py-1">
            Bestseller
          </span>
        )}
      </div>

      {/* Info */}
      <div className="mt-3 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-medium text-foreground leading-tight line-clamp-2">
            {product.name}
          </h3>
          <span className="text-sm font-semibold text-foreground whitespace-nowrap">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
        </div>
        <p className="text-xs text-muted-foreground tracking-wide uppercase">
          {product.category}
        </p>

        {/* Color swatches */}
        {product.colors.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {product.colors.slice(0, 6).map((color, i) => (
              <button
                key={color.name}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedColor(i);
                }}
                title={color.name}
                className={`w-4 h-4 rounded-full border transition-all duration-150 ${
                  selectedColor === i
                    ? "ring-1 ring-offset-1 ring-foreground"
                    : "border-warm-border"
                }`}
                style={{ backgroundColor: color.hex }}
                aria-label={color.name}
              />
            ))}
            {product.colors.length > 6 && (
              <span className="text-[10px] text-muted-foreground self-center">
                +{product.colors.length - 6}
              </span>
            )}
          </div>
        )}

        {/* Size chips */}
        {product.sizes.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {product.sizes.map((size) => (
              <span
                key={size}
                className="text-[10px] px-1.5 py-0.5 border border-warm-border text-warm-gray"
              >
                {size}
              </span>
            ))}
          </div>
        )}

        {/* Remove button (wishlist page) */}
        {showRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-xs text-muted-foreground underline hover:text-destructive transition-colors mt-1"
            data-ocid={`wishlist.delete_button.${index + 1}`}
          >
            Remove
          </button>
        )}
      </div>
    </motion.div>
  );
}
