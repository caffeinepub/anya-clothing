import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Pencil, Plus, Star, Trash2, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Color, Product, ProductInput } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddProduct,
  useDeleteProduct,
  useGetAllProducts,
  useIsCallerAdmin,
  useUpdateProduct,
} from "../hooks/useQueries";

const SIZES_OPTIONS = ["XS", "S", "M", "L"];

const SAMPLE_PRODUCTS: ProductInput[] = [
  {
    name: "Floral Wrap Dress",
    category: "Dresses",
    description:
      "A beautiful floral wrap dress with elegant silhouette, perfect for any occasion.",
    price: 1299,
    sizes: ["S", "M", "L"],
    colors: [
      { name: "Rose", hex: "#E8A0A0" },
      { name: "Sage", hex: "#A0B89A" },
      { name: "Cream", hex: "#F3EBDD" },
    ],
    imageUrls: ["/assets/generated/product-floral-wrap-dress.dim_400x533.jpg"],
    isBestseller: false,
  },
  {
    name: "Silk Blouse",
    category: "Tops",
    description:
      "Luxurious silk blouse with a refined drape for effortless elegance.",
    price: 899,
    sizes: ["XS", "S", "M"],
    colors: [
      { name: "Ivory", hex: "#F5F0E4" },
      { name: "Blush", hex: "#F2C4C4" },
      { name: "Black", hex: "#1A1A1A" },
    ],
    imageUrls: ["/assets/generated/product-silk-blouse.dim_400x533.jpg"],
    isBestseller: false,
  },
  {
    name: "High-Waist Palazzo",
    category: "Bottoms",
    description:
      "Wide-leg palazzo pants with a flattering high waist for a sophisticated look.",
    price: 749,
    sizes: ["S", "M", "L"],
    colors: [
      { name: "Navy", hex: "#2D3A5A" },
      { name: "Emerald", hex: "#50A070" },
      { name: "Taupe", hex: "#A09080" },
    ],
    imageUrls: ["/assets/generated/product-palazzo.dim_400x533.jpg"],
    isBestseller: false,
  },
  {
    name: "Embroidered Kurti",
    category: "Apparel",
    description:
      "Handcrafted embroidered kurti featuring intricate floral motifs in vibrant hues.",
    price: 599,
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Pink", hex: "#F0A0B8" },
      { name: "Orange", hex: "#E07840" },
      { name: "Teal", hex: "#408888" },
    ],
    imageUrls: ["/assets/generated/product-embroidered-kurti.dim_400x533.jpg"],
    isBestseller: true,
  },
  {
    name: "Linen Co-ord Set",
    category: "Apparel",
    description:
      "Breathable linen co-ord set with relaxed silhouette for modern everyday dressing.",
    price: 1899,
    sizes: ["S", "M", "L"],
    colors: [
      { name: "Beige", hex: "#D4C4A8" },
      { name: "Dusty Rose", hex: "#D4909C" },
    ],
    imageUrls: ["/assets/generated/product-linen-coord.dim_400x533.jpg"],
    isBestseller: true,
  },
  {
    name: "Chiffon Maxi Dress",
    category: "Dresses",
    description:
      "Flowing chiffon maxi dress with delicate drape for an effortlessly romantic look.",
    price: 2199,
    sizes: ["S", "M", "L"],
    colors: [
      { name: "Burgundy", hex: "#7A2040" },
      { name: "Midnight Blue", hex: "#1A2040" },
    ],
    imageUrls: ["/assets/generated/product-chiffon-maxi.dim_400x533.jpg"],
    isBestseller: true,
  },
  {
    name: "Crop Jacket",
    category: "Tops",
    description:
      "Structured crop jacket with tailored shoulders — the perfect layering piece.",
    price: 3499,
    sizes: ["XS", "S", "M"],
    colors: [
      { name: "Camel", hex: "#C89060" },
      { name: "White", hex: "#F8F8F8" },
      { name: "Black", hex: "#1A1A1A" },
    ],
    imageUrls: ["/assets/generated/product-crop-jacket.dim_400x533.jpg"],
    isBestseller: false,
  },
  {
    name: "Pearl Embellished Top",
    category: "Tops",
    description:
      "Delicate pearl embellished top with lustrous accents along the neckline.",
    price: 1599,
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Ivory", hex: "#F5F0E4" },
      { name: "Lilac", hex: "#C4A8D0" },
    ],
    imageUrls: ["/assets/generated/product-pearl-top.dim_400x533.jpg"],
    isBestseller: true,
  },
];

interface ProductFormData {
  name: string;
  category: string;
  description: string;
  price: string;
  sizes: string[];
  colors: Color[];
  imageUrls: string[];
  isBestseller: boolean;
}

const defaultForm = (): ProductFormData => ({
  name: "",
  category: "Dresses",
  description: "",
  price: "",
  sizes: [],
  colors: [],
  imageUrls: [""],
  isBestseller: false,
});

export default function AdminPage() {
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: products = [], isLoading: productsLoading } =
    useGetAllProducts();
  const { login, loginStatus } = useInternetIdentity();
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(defaultForm());
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#E8A0A0");
  const [seeding, setSeeding] = useState(false);

  const openAdd = () => {
    setEditingProduct(null);
    setFormData(defaultForm());
    setDialogOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description,
      price: String(product.price),
      sizes: [...product.sizes],
      colors: [...product.colors],
      imageUrls: product.imageUrls.length > 0 ? [...product.imageUrls] : [""],
      isBestseller: product.isBestseller,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const input: ProductInput = {
      name: formData.name,
      category: formData.category,
      description: formData.description,
      price: Number(formData.price),
      sizes: formData.sizes,
      colors: formData.colors,
      imageUrls: formData.imageUrls.filter((u) => u.trim() !== ""),
      isBestseller: formData.isBestseller,
    };
    try {
      if (editingProduct) {
        await updateProduct.mutateAsync({ id: editingProduct.id, input });
        toast.success("Product updated!");
      } else {
        await addProduct.mutateAsync(input);
        toast.success("Product added!");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Something went wrong.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProduct.mutateAsync(deleteTarget.id);
      toast.success("Product deleted.");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete.");
    }
  };

  const handleSeedProducts = async () => {
    setSeeding(true);
    try {
      await Promise.all(SAMPLE_PRODUCTS.map((p) => addProduct.mutateAsync(p)));
      toast.success("8 sample products seeded!");
    } catch {
      toast.error("Seeding failed.");
    }
    setSeeding(false);
  };

  const addColorEntry = () => {
    if (!newColorName.trim()) return;
    setFormData((prev) => ({
      ...prev,
      colors: [...prev.colors, { name: newColorName.trim(), hex: newColorHex }],
    }));
    setNewColorName("");
    setNewColorHex("#E8A0A0");
  };

  const removeColor = (idx: number) =>
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== idx),
    }));

  const addImageUrl = () =>
    setFormData((prev) => ({ ...prev, imageUrls: [...prev.imageUrls, ""] }));

  const updateImageUrl = (idx: number, val: string) =>
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.map((u, i) => (i === idx ? val : u)),
    }));

  const removeImageUrl = (idx: number) =>
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== idx),
    }));

  const toggleFormSize = (size: string) =>
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));

  const isPending = addProduct.isPending || updateProduct.isPending;

  if (adminLoading) {
    return (
      <div
        className="max-w-6xl mx-auto px-4 py-12"
        data-ocid="admin.loading_state"
      >
        <Skeleton className="h-10 w-48 mb-4" />
        <Skeleton className="h-4 w-64 mb-8" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 mb-2" />
        ))}
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        data-ocid="admin.error_state"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm px-6"
        >
          <h1 className="font-serif text-3xl mb-4">Access Denied</h1>
          <p className="text-muted-foreground text-sm mb-8">
            You must be an admin to access this panel.
          </p>
          <Button
            onClick={login}
            disabled={loginStatus === "logging-in"}
            className="bg-primary text-primary-foreground hover:bg-primary/90 tracking-widest text-xs uppercase"
            data-ocid="admin.primary_button"
          >
            {loginStatus === "logging-in" ? (
              <Loader2 size={14} className="mr-2 animate-spin" />
            ) : null}
            Login to Continue
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen" data-ocid="admin.page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl">Admin Panel</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {products.length} products in catalogue
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleSeedProducts}
              disabled={seeding}
              className="border-warm-border text-xs tracking-widest uppercase"
              data-ocid="admin.secondary_button"
            >
              {seeding ? (
                <Loader2 size={12} className="mr-2 animate-spin" />
              ) : null}
              Seed Sample Products
            </Button>
            <Button
              type="button"
              onClick={openAdd}
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs tracking-widest uppercase"
              data-ocid="admin.open_modal_button"
            >
              <Plus size={14} className="mr-2" /> Add Product
            </Button>
          </div>
        </div>

        {/* Products table */}
        {productsLoading ? (
          <div className="space-y-2" data-ocid="admin.loading_state">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20" data-ocid="admin.empty_state">
            <p className="font-serif text-2xl text-muted-foreground mb-4">
              No products yet
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Add your first product or seed sample data.
            </p>
            <Button
              type="button"
              onClick={openAdd}
              className="bg-primary text-primary-foreground"
              data-ocid="admin.primary_button"
            >
              <Plus size={14} className="mr-2" /> Add Product
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto" data-ocid="admin.table">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-warm-border text-left">
                  <th className="pb-3 pr-4 text-xs font-medium tracking-widest uppercase text-muted-foreground">
                    Product
                  </th>
                  <th className="pb-3 pr-4 text-xs font-medium tracking-widest uppercase text-muted-foreground hidden sm:table-cell">
                    Category
                  </th>
                  <th className="pb-3 pr-4 text-xs font-medium tracking-widest uppercase text-muted-foreground">
                    Price
                  </th>
                  <th className="pb-3 pr-4 text-xs font-medium tracking-widest uppercase text-muted-foreground hidden md:table-cell">
                    Status
                  </th>
                  <th className="pb-3 text-xs font-medium tracking-widest uppercase text-muted-foreground text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, i) => (
                  <tr
                    key={String(product.id)}
                    className="border-b border-warm-border hover:bg-secondary/50 transition-colors"
                    data-ocid={`admin.row.${i + 1}`}
                  >
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            product.imageUrls[0] ||
                            `https://placehold.co/60x80/F3EBDD/6E6A63?text=${encodeURIComponent(product.name)}`
                          }
                          alt={product.name}
                          className="w-10 h-14 object-cover flex-shrink-0"
                        />
                        <span className="font-medium line-clamp-2">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-muted-foreground hidden sm:table-cell">
                      {product.category}
                    </td>
                    <td className="py-4 pr-4 font-medium">
                      ₹{product.price.toLocaleString("en-IN")}
                    </td>
                    <td className="py-4 pr-4 hidden md:table-cell">
                      {product.isBestseller && (
                        <Badge className="bg-amber-100 text-amber-800 border-0 text-[10px]">
                          <Star size={10} className="mr-1" /> Bestseller
                        </Badge>
                      )}
                    </td>
                    <td className="py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => openEdit(product)}
                          className="h-8 w-8 p-0"
                          data-ocid={`admin.edit_button.${i + 1}`}
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteTarget(product)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          data-ocid={`admin.delete_button.${i + 1}`}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="max-w-xl max-h-[90vh] overflow-y-auto"
          data-ocid="admin.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              {editingProduct
                ? "Update product details below."
                : "Fill in the details for the new product."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label className="text-xs tracking-widest uppercase mb-1.5 block">
                  Product Name *
                </Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                  placeholder="e.g. Floral Wrap Dress"
                  className="border-warm-border"
                  data-ocid="admin.input"
                />
              </div>
              <div>
                <Label className="text-xs tracking-widest uppercase mb-1.5 block">
                  Category *
                </Label>
                <Input
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  required
                  placeholder="Dresses, Tops..."
                  className="border-warm-border"
                  data-ocid="admin.input"
                />
              </div>
              <div>
                <Label className="text-xs tracking-widest uppercase mb-1.5 block">
                  Price (₹) *
                </Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, price: e.target.value }))
                  }
                  required
                  min={200}
                  max={7000}
                  placeholder="1299"
                  className="border-warm-border"
                  data-ocid="admin.input"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs tracking-widest uppercase mb-1.5 block">
                Description
              </Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Describe the product..."
                rows={3}
                className="border-warm-border resize-none"
                data-ocid="admin.textarea"
              />
            </div>

            {/* Sizes */}
            <div>
              <Label className="text-xs tracking-widest uppercase mb-1.5 block">
                Sizes
              </Label>
              <div className="flex gap-2">
                {SIZES_OPTIONS.map((size) => (
                  <div key={size} className="flex items-center gap-1.5">
                    <Checkbox
                      id={`size-${size}`}
                      checked={formData.sizes.includes(size)}
                      onCheckedChange={() => toggleFormSize(size)}
                      data-ocid="admin.checkbox"
                    />
                    <Label
                      htmlFor={`size-${size}`}
                      className="text-sm cursor-pointer"
                    >
                      {size}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div>
              <Label className="text-xs tracking-widest uppercase mb-1.5 block">
                Colors
              </Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.colors.map((color, idx) => (
                  <span
                    key={`${color.name}-${idx}`}
                    className="inline-flex items-center gap-1.5 text-xs bg-secondary px-2 py-1"
                  >
                    <span
                      className="w-3 h-3 rounded-full border"
                      style={{ backgroundColor: color.hex }}
                    />
                    {color.name}
                    <button
                      type="button"
                      onClick={() => removeColor(idx)}
                      aria-label="Remove color"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newColorName}
                  onChange={(e) => setNewColorName(e.target.value)}
                  placeholder="Color name (e.g. Rose)"
                  className="border-warm-border flex-1 text-sm"
                  data-ocid="admin.input"
                />
                <input
                  type="color"
                  value={newColorHex}
                  onChange={(e) => setNewColorHex(e.target.value)}
                  className="w-10 h-10 cursor-pointer rounded border border-warm-border"
                  aria-label="Color picker"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addColorEntry}
                  className="border-warm-border"
                >
                  <Plus size={14} />
                </Button>
              </div>
            </div>

            {/* Image URLs */}
            <div>
              <Label className="text-xs tracking-widest uppercase mb-1.5 block">
                Image URLs
              </Label>
              <div className="space-y-2">
                {formData.imageUrls.map((url, idx) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: image urls have no stable ids
                  <div key={`img-${idx}`} className="flex gap-2">
                    <Input
                      value={url}
                      onChange={(e) => updateImageUrl(idx, e.target.value)}
                      placeholder="https://..."
                      className="border-warm-border flex-1 text-sm"
                      data-ocid="admin.input"
                    />
                    {formData.imageUrls.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeImageUrl(idx)}
                        className="h-10 w-10 p-0"
                      >
                        <X size={14} />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addImageUrl}
                  className="border-warm-border text-xs"
                >
                  <Plus size={12} className="mr-1" /> Add URL
                </Button>
              </div>
            </div>

            {/* Bestseller */}
            <div className="flex items-center gap-3">
              <Switch
                id="bestseller"
                checked={formData.isBestseller}
                onCheckedChange={(v) =>
                  setFormData((prev) => ({ ...prev, isBestseller: v }))
                }
                data-ocid="admin.switch"
              />
              <Label htmlFor="bestseller" className="cursor-pointer text-sm">
                Mark as Bestseller
              </Label>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="border-warm-border"
                data-ocid="admin.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-primary text-primary-foreground"
                data-ocid="admin.submit_button"
              >
                {isPending ? (
                  <Loader2 size={14} className="mr-2 animate-spin" />
                ) : null}
                {editingProduct ? "Update Product" : "Add Product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent data-ocid="admin.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif">
              Delete Product?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>{deleteTarget?.name}</strong>? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="admin.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
              data-ocid="admin.confirm_button"
            >
              {deleteProduct.isPending ? (
                <Loader2 size={14} className="mr-2 animate-spin" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
