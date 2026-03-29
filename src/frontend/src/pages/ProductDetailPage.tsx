import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle,
  Heart,
  Loader2,
  MessageCircle,
  ShoppingBag,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useAddToWishlist,
  useGetProductById,
  useGetWishlist,
  usePlaceOrder,
  useRemoveFromWishlist,
} from "../hooks/useQueries";

const WHATSAPP_NUMBER = "918347548407";

export default function ProductDetailPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const navigate = useNavigate();

  const productId = id ? BigInt(id) : null;
  const { data: product, isLoading } = useGetProductById(productId);
  const { data: wishlistIds = [] } = useGetWishlist();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const placeOrder = usePlaceOrder();

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<bigint | null>(null);

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    address: "",
  });

  const isInWishlist = wishlistIds.some((wid) => wid === productId);

  const handleWishlist = async () => {
    if (!product) return;
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

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    const selectedColor = product.colors[selectedColorIdx];

    try {
      const orderId = await placeOrder.mutateAsync({
        productId: product.id,
        productName: product.name,
        customerName: form.customerName,
        phone: form.phone,
        email: form.email,
        address: form.address,
        size: selectedSize ?? "",
        color: selectedColor?.name ?? "",
        price: product.price,
        paymentMethod: "Cash on Delivery",
      });
      setPlacedOrderId(orderId);
      setCheckoutOpen(false);
      setConfirmOpen(true);
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to place order. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Skeleton className="w-full aspect-[3/4] rounded-none" />
          <div className="space-y-4 py-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-10 w-14" />
              ))}
            </div>
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground text-lg">Product not found.</p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() =>
            navigate({
              to: "/catalog",
              search: { q: "", category: "", bestsellers: "", sale: "" },
            })
          }
        >
          Back to Catalog
        </Button>
      </main>
    );
  }

  const imageUrl =
    product.imageUrls[0] ||
    `https://placehold.co/600x800/F3EBDD/6E6A63?text=${encodeURIComponent(product.name)}`;

  const selectedColor = product.colors[selectedColorIdx];

  const whatsappText = encodeURIComponent(
    `Hi, I just placed an order for ${product.name} (Size: ${selectedSize ?? "N/A"}, Color: ${selectedColor?.name ?? "N/A"}). Order ID: ${placedOrderId?.toString() ?? ""}`,
  );

  return (
    <main
      className="max-w-6xl mx-auto px-4 sm:px-6 py-8"
      data-ocid="product.page"
    >
      {/* Back button */}
      <button
        type="button"
        onClick={() =>
          navigate({
            to: "/catalog",
            search: { q: "", category: "", bestsellers: "", sale: "" },
          })
        }
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
        data-ocid="product.link"
      >
        <ArrowLeft
          size={16}
          className="transition-transform group-hover:-translate-x-1"
        />
        Back to Catalog
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {/* Image */}
        <div
          className="relative overflow-hidden bg-secondary"
          style={{ aspectRatio: "3/4" }}
        >
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.isBestseller && (
            <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-[10px] tracking-widest uppercase px-2.5 py-1">
              Bestseller
            </span>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-6 py-2">
          <div>
            <Badge
              variant="outline"
              className="mb-3 text-xs tracking-widest uppercase font-normal rounded-none border-warm-border text-warm-gray"
            >
              {product.category}
            </Badge>
            <h1 className="font-display text-3xl font-semibold text-foreground leading-tight mb-3">
              {product.name}
            </h1>
            <p className="text-2xl font-semibold text-primary">
              ₹{product.price.toLocaleString("en-IN")}
            </p>
          </div>

          {product.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Color selector */}
          {product.colors.length > 0 && (
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-warm-gray mb-3">
                Color{selectedColor ? `: ${selectedColor.name}` : ""}
              </p>
              <div className="flex gap-2.5 flex-wrap">
                {product.colors.map((color, i) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => setSelectedColorIdx(i)}
                    title={color.name}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-150 ${
                      selectedColorIdx === i
                        ? "ring-2 ring-offset-2 ring-primary border-primary"
                        : "border-warm-border hover:border-primary"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    aria-label={color.name}
                    data-ocid={`product.toggle.${i + 1}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size selector */}
          {product.sizes.length > 0 && (
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-warm-gray mb-3">
                Size{selectedSize ? `: ${selectedSize}` : " — please select"}
              </p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[3rem] px-3 py-2 text-sm border transition-all duration-150 ${
                      selectedSize === size
                        ? "bg-foreground text-background border-foreground"
                        : "border-warm-border text-foreground hover:border-foreground"
                    }`}
                    data-ocid="product.toggle.size"
                  >
                    {size}
                  </button>
                ))}
              </div>
              {!selectedSize && (
                <p className="text-xs text-rose-400 mt-2">
                  Select a size to place order
                </p>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 mt-2">
            <Button
              onClick={() => setCheckoutOpen(true)}
              disabled={product.sizes.length > 0 && !selectedSize}
              className="flex-1 h-12 text-sm tracking-widest uppercase rounded-none bg-foreground text-background hover:bg-primary hover:text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed"
              data-ocid="product.primary_button"
            >
              <ShoppingBag size={16} className="mr-2" />
              Place Order
            </Button>
            <Button
              variant="outline"
              onClick={handleWishlist}
              className={`h-12 w-12 rounded-none border-warm-border flex-shrink-0 ${
                isInWishlist
                  ? "text-red-500 border-red-300"
                  : "text-warm-gray hover:text-red-400"
              }`}
              aria-label={
                isInWishlist ? "Remove from wishlist" : "Add to wishlist"
              }
              data-ocid="product.toggle"
            >
              <Heart size={18} fill={isInWishlist ? "currentColor" : "none"} />
            </Button>
          </div>
        </div>
      </div>

      {/* Checkout Form Dialog */}
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent
          className="max-w-md rounded-none"
          data-ocid="product.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              Complete Your Order
            </DialogTitle>
          </DialogHeader>

          {/* Order summary */}
          <div className="bg-secondary/60 rounded-sm px-4 py-3 text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Product</span>
              <span className="font-medium text-right max-w-[55%]">
                {product.name}
              </span>
            </div>
            {selectedSize && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Size</span>
                <span className="font-medium">{selectedSize}</span>
              </div>
            )}
            {selectedColor && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Color</span>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-warm-border"
                    style={{ backgroundColor: selectedColor.hex }}
                  />
                  <span className="font-medium">{selectedColor.name}</span>
                </div>
              </div>
            )}
            <div className="flex justify-between pt-1 border-t border-warm-border">
              <span className="text-muted-foreground">Total</span>
              <span className="font-semibold text-primary">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <form onSubmit={handleCheckoutSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <Label
                htmlFor="customerName"
                className="text-xs uppercase tracking-widest"
              >
                Full Name *
              </Label>
              <Input
                id="customerName"
                required
                placeholder="Your full name"
                value={form.customerName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, customerName: e.target.value }))
                }
                className="rounded-none border-warm-border"
                data-ocid="product.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="phone"
                className="text-xs uppercase tracking-widest"
              >
                Phone Number *
              </Label>
              <Input
                id="phone"
                required
                type="tel"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={(e) =>
                  setForm((p) => ({ ...p, phone: e.target.value }))
                }
                className="rounded-none border-warm-border"
                data-ocid="product.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-xs uppercase tracking-widest"
              >
                Email *
              </Label>
              <Input
                id="email"
                required
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
                className="rounded-none border-warm-border"
                data-ocid="product.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="address"
                className="text-xs uppercase tracking-widest"
              >
                Delivery Address *
              </Label>
              <Textarea
                id="address"
                required
                placeholder="House no., Street, City, State, PIN"
                value={form.address}
                onChange={(e) =>
                  setForm((p) => ({ ...p, address: e.target.value }))
                }
                rows={3}
                className="rounded-none border-warm-border resize-none"
                data-ocid="product.textarea"
              />
            </div>

            <div className="flex items-center justify-between py-2 px-3 bg-green-50 border border-green-200 rounded-sm">
              <span className="text-xs font-medium text-green-800 tracking-widest uppercase">
                Payment
              </span>
              <Badge className="bg-green-100 text-green-800 border border-green-300 text-xs">
                Cash on Delivery
              </Badge>
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCheckoutOpen(false)}
                className="rounded-none border-warm-border"
                data-ocid="product.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={placeOrder.isPending}
                className="rounded-none bg-foreground text-background hover:bg-primary hover:text-primary-foreground flex-1"
                data-ocid="product.submit_button"
              >
                {placeOrder.isPending ? (
                  <>
                    <Loader2 size={14} className="mr-2 animate-spin" />{" "}
                    Placing...
                  </>
                ) : (
                  "Confirm & Place Order"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Order Confirmation Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent
          className="max-w-sm rounded-none text-center"
          data-ocid="product.dialog"
        >
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold mb-1">
                Order Placed! 🎉
              </h2>
              <p className="text-muted-foreground text-sm">
                Thank you for shopping with Anya. We'll contact you soon.
              </p>
            </div>

            <div className="w-full bg-secondary/60 rounded-sm px-4 py-3 text-sm space-y-1 text-left">
              {placedOrderId !== null && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order ID</span>
                  <span className="font-medium">
                    #{placedOrderId.toString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Product</span>
                <span className="font-medium text-right max-w-[55%]">
                  {product.name}
                </span>
              </div>
              {selectedSize && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Size</span>
                  <span className="font-medium">{selectedSize}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment</span>
                <span className="font-medium">Cash on Delivery</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-warm-border">
                <span className="text-muted-foreground">Total</span>
                <span className="font-semibold text-primary">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
              data-ocid="product.link"
            >
              <Button className="w-full rounded-none bg-[#25D366] hover:bg-[#1eb857] text-white tracking-wide">
                <MessageCircle size={16} className="mr-2" />
                Chat on WhatsApp
              </Button>
            </a>

            <Button
              variant="outline"
              onClick={() => {
                setConfirmOpen(false);
                navigate({
                  to: "/catalog",
                  search: { q: "", category: "", bestsellers: "", sale: "" },
                });
              }}
              className="w-full rounded-none border-warm-border"
              data-ocid="product.secondary_button"
            >
              Continue Shopping
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
