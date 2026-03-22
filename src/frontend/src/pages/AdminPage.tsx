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
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  ExternalLink,
  Layers,
  Loader2,
  Package,
  Pencil,
  Plus,
  Star,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
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
import { useStorageClient } from "../hooks/useStorageClient";

const SIZES_OPTIONS = ["XS", "S", "M", "L"];

const BASE_COLLECTIONS = [
  "Crop Top Collection",
  "Dress Collection",
  "Tank Top Collection",
  "Bodycon Collection",
  "Navratri Collection",
  "Mini Dress Collection",
];

const SAMPLE_PRODUCTS: ProductInput[] = [
  // ── Crop Top Collection ──
  {
    name: "Cherry Blossom Crop",
    category: "Crop Top Collection",
    description:
      "Flirty cropped tee with cherry blossom print and raw hem, perfect for high-waist fits.",
    price: 599,
    sizes: ["S", "M", "L"],
    colors: [
      { name: "Cherry Pink", hex: "#F9A8D4" },
      { name: "White", hex: "#FFF0F5" },
    ],
    imageUrls: ["/assets/generated/product-placeholder.dim_400x533.jpg"],
    isBestseller: true,
  },
  {
    name: "Lace Trim Corset Crop",
    category: "Crop Top Collection",
    description:
      "Structured corset-style crop top with delicate lace trim for an edgy-feminine look.",
    price: 849,
    sizes: ["XS", "S", "M"],
    colors: [
      { name: "Blush", hex: "#FBCFE8" },
      { name: "Black", hex: "#1A1A1A" },
    ],
    imageUrls: ["/assets/generated/product-placeholder.dim_400x533.jpg"],
    isBestseller: false,
  },
  {
    name: "Knotted Bralette Top",
    category: "Crop Top Collection",
    description:
      "Playful knotted front bralette crop in soft jersey for effortless street style.",
    price: 449,
    sizes: ["S", "M", "L"],
    colors: [
      { name: "Lavender", hex: "#E9D5FF" },
      { name: "Dusty Rose", hex: "#F0A0B8" },
    ],
    imageUrls: ["/assets/generated/product-placeholder.dim_400x533.jpg"],
    isBestseller: false,
  },
  {
    name: "Sequin Halter Crop",
    category: "Crop Top Collection",
    description:
      "Dazzling sequin halter crop that catches every light — day to night, always iconic.",
    price: 1199,
    sizes: ["XS", "S", "M"],
    colors: [
      { name: "Rose Gold", hex: "#F4A5A5" },
      { name: "Silver", hex: "#D1D5DB" },
    ],
    imageUrls: ["/assets/generated/product-placeholder.dim_400x533.jpg"],
    isBestseller: true,
  },
  {
    name: "Ribbed Pastel Crop",
    category: "Crop Top Collection",
    description:
      "Soft ribbed knit crop in dreamy pastel tones — cozy, minimal, effortlessly cute.",
    price: 399,
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Mint", hex: "#A7F3D0" },
      { name: "Lilac", hex: "#DDD6FE" },
    ],
    imageUrls: ["/assets/generated/product-placeholder.dim_400x533.jpg"],
    isBestseller: false,
  },
  {
    name: "Floral Smocked Crop",
    category: "Crop Top Collection",
    description:
      "Smocked bodice crop with delicate floral print and ruffle hem — cottage-core chic.",
    price: 699,
    sizes: ["S", "M", "L"],
    colors: [
      { name: "Garden Pink", hex: "#F9A8D4" },
      { name: "Sky Blue", hex: "#BAE6FD" },
    ],
    imageUrls: ["/assets/generated/product-placeholder.dim_400x533.jpg"],
    isBestseller: false,
  },
  // ── Dress Collection ──
  {
    name: "Sundrop Wrap Dress",
    category: "Dress Collection",
    description:
      "Breezy wrap dress in a golden floral print — effortlessly feminine for any daytime occasion.",
    price: 1299,
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Sunflower Yellow", hex: "#FDE68A" },
      { name: "Cream", hex: "#FFFBEB" },
    ],
    imageUrls: ["/assets/generated/product-placeholder.dim_400x533.jpg"],
    isBestseller: true,
  },
  {
    name: "Midnight Slip Dress",
    category: "Dress Collection",
    description:
      "Satin slip dress in deep midnight hues with adjustable straps and a subtle side slit.",
    price: 1799,
    sizes: ["XS", "S", "M"],
    colors: [
      { name: "Midnight Blue", hex: "#1E3A5F" },
      { name: "Black", hex: "#1A1A1A" },
    ],
    imageUrls: ["/assets/generated/product-placeholder.dim_400x533.jpg"],
    isBestseller: false,
  },
  {
    name: "Boho Maxi Floral",
    category: "Dress Collection",
    description:
      "Floor-sweeping boho maxi with tiered hem and vibrant floral print — free-spirited and gorgeous.",
    price: 2299,
    sizes: ["S", "M", "L"],
    colors: [
      { name: "Terracotta", hex: "#C2704D" },
      { name: "Ivory", hex: "#FFFFF0" },
    ],
    imageUrls: ["/assets/generated/product-placeholder.dim_400x533.jpg"],
    isBestseller: true,
  },
  {
    name: "Linen Shirt Dress",
    category: "Dress Collection",
    description:
      "Relaxed linen shirt dress with belted waist — casual sophistication for sunny days.",
    price: 1599,
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Sand", hex: "#D4C4A8" },
      { name: "Sage", hex: "#9DC08B" },
    ],
    imageUrls: ["/assets/generated/product-placeholder.dim_400x533.jpg"],
    isBestseller: false,
  },
  {
    name: "Puff Sleeve Mini Dress",
    category: "Dress Collection",
    description:
      "Playful mini with statement puff sleeves and a cinched waist — party-ready glamour.",
    price: 1399,
    sizes: ["XS", "S", "M"],
    colors: [
      { name: "Blush Pink", hex: "#FBCFE8" },
      { name: "Lilac", hex: "#DDD6FE" },
    ],
    imageUrls: ["/assets/generated/product-placeholder.dim_400x533.jpg"],
    isBestseller: false,
  },
  {
    name: "Pleated Chiffon Midi",
    category: "Dress Collection",
    description:
      "Flowing pleated chiffon midi with V-neck and flutter sleeves — romantic and versatile.",
    price: 1899,
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Blush", hex: "#FBD5D5" },
      { name: "Sky Blue", hex: "#BAE6FD" },
    ],
    imageUrls: ["/assets/generated/product-placeholder.dim_400x533.jpg"],
    isBestseller: true,
  },
  // ── Tank Top Collection ──
  {
    name: "Essential Rib Tank",
    category: "Tank Top Collection",
    description:
      "Fine-rib knit tank in a versatile neutral palette — your everyday layering essential.",
    price: 299,
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Black", hex: "#1A1A1A" },
      { name: "Nude", hex: "#E8C4A8" },
    ],
    imageUrls: ["/assets/generated/product-placeholder.dim_400x533.jpg"],
    isBestseller: true,
  },
  {
    name: "Cowl Neck Satin Tank",
    category: "Tank Top Collection",
    description:
      "Luxe satin tank with draped cowl neck — dress it up or down for effortless style.",
    price: 799,
    sizes: ["XS", "S", "M"],
    colors: [
      { name: "Champagne", hex: "#F5E6C8" },
      { name: "Dusty Rose", hex: "#D4909C" },
    ],
    imageUrls: ["/assets/generated/product-placeholder.dim_400x533.jpg"],
    isBestseller: false,
  },
  {
    name: "Crochet Beach Tank",
    category: "Tank Top Collection",
    description:
      "Hand-crochet inspired tank with wide straps and open-weave texture — pure summer vibes.",
    price: 599,
    sizes: ["S", "M", "L"],
    colors: [
      { name: "Natural", hex: "#F5F0E8" },
      { name: "Terracotta", hex: "#C2704D" },
    ],
    imageUrls: ["/assets/generated/product-placeholder.dim_400x533.jpg"],
    isBestseller: false,
  },
  {
    name: "Velvet Square Tank",
    category: "Tank Top Collection",
    description:
      "Plush velvet tank with a square neckline and structured fit — evening-ready and elegant.",
    price: 899,
    sizes: ["XS", "S", "M"],
    colors: [
      { name: "Deep Plum", hex: "#581C87" },
      { name: "Forest Green", hex: "#166534" },
    ],
    imageUrls: ["/assets/generated/product-placeholder.dim_400x533.jpg"],
    isBestseller: false,
  },
  {
    name: "Printed Bandeau Tank",
    category: "Tank Top Collection",
    description:
      "Colorful bandeau-style tank with abstract print and bungee hem detail — bold and playful.",
    price: 449,
    sizes: ["XS", "S", "M"],
    colors: [{ name: "Multicolor", hex: "#F59E0B" }],
    imageUrls: ["/assets/generated/product-placeholder.dim_400x533.jpg"],
    isBestseller: false,
  },
  {
    name: "Mesh Overlay Tank",
    category: "Tank Top Collection",
    description:
      "Lined mesh overlay tank with floral embroidery at hem — sheer delicacy meets bold style.",
    price: 699,
    sizes: ["S", "M", "L"],
    colors: [
      { name: "Black", hex: "#1A1A1A" },
      { name: "White", hex: "#FFFFFF" },
    ],
    imageUrls: ["/assets/generated/product-placeholder.dim_400x533.jpg"],
    isBestseller: false,
  },
  // ── Bodycon Collection ──
  {
    name: "Neon Nights Bodycon",
    category: "Bodycon Collection",
    description:
      "Eye-catching neon bodycon in power-stretch fabric that sculpts and celebrates your curves.",
    price: 1499,
    sizes: ["XS", "S", "M"],
    colors: [
      { name: "Neon Pink", hex: "#FF007F" },
      { name: "Neon Lime", hex: "#ADFF2F" },
    ],
    imageUrls: ["/assets/generated/product-placeholder.dim_400x533.jpg"],
    isBestseller: true,
  },
  {
    name: "Second Skin Bandage",
    category: "Bodycon Collection",
    description:
      "Classic bandage bodycon with horizontal strapping for a powerful, confident silhouette.",
    price: 1899,
    sizes: ["XS", "S", "M"],
    colors: [
      { name: "Black", hex: "#1A1A1A" },
      { name: "Nude", hex: "#E8C4A8" },
    ],
    imageUrls: ["/assets/generated/product-placeholder.dim_400x533.jpg"],
    isBestseller: false,
  },
  {
    name: "Velvet Crush Midi",
    category: "Bodycon Collection",
    description:
      "Rich velvet bodycon midi with off-shoulder neckline — born for the spotlight.",
    price: 2199,
    sizes: ["S", "M", "L"],
    colors: [
      { name: "Deep Burgundy", hex: "#7A2040" },
      { name: "Royal Navy", hex: "#1E3A5F" },
    ],
    imageUrls: ["/assets/generated/product-placeholder.dim_400x533.jpg"],
    isBestseller: true,
  },
  {
    name: "Shimmer Web Bodycon",
    category: "Bodycon Collection",
    description:
      "Metallic shimmer bodycon with subtle mesh detailing for a party-ready look.",
    price: 1699,
    sizes: ["XS", "S", "M"],
    colors: [
      { name: "Gold", hex: "#D4AF37" },
      { name: "Silver", hex: "#C0C0C0" },
    ],
    imageUrls: ["/assets/generated/product-placeholder.dim_400x533.jpg"],
    isBestseller: false,
  },
  {
    name: "Rose Petal Cut-Out",
    category: "Bodycon Collection",
    description:
      "Bodycon with strategic rose-petal cut-outs on the waist — daring and feminine.",
    price: 1399,
    sizes: ["XS", "S", "M"],
    colors: [
      { name: "Dusty Rose", hex: "#D4909C" },
      { name: "Mauve", hex: "#C084A0" },
    ],
    imageUrls: ["/assets/generated/product-placeholder.dim_400x533.jpg"],
    isBestseller: false,
  },
  {
    name: "Noir Power Strapless",
    category: "Bodycon Collection",
    description:
      "Strapless bodycon with boned bust for a sleek, strapless silhouette all night long.",
    price: 1599,
    sizes: ["XS", "S", "M"],
    colors: [
      { name: "Black", hex: "#1A1A1A" },
      { name: "Deep Red", hex: "#8B0000" },
    ],
    imageUrls: ["/assets/generated/product-placeholder.dim_400x533.jpg"],
    isBestseller: false,
  },
  // ── Navratri Collection ──
  {
    name: "Marigold Lehenga Set",
    category: "Navratri Collection",
    description:
      "Vibrant marigold lehenga with mirror-work blouse, perfect for all 9 nights of Navratri.",
    price: 3499,
    sizes: ["S", "M", "L"],
    colors: [
      { name: "Marigold", hex: "#F59E0B" },
      { name: "Orange", hex: "#F97316" },
    ],
    imageUrls: ["/assets/generated/product-placeholder.dim_400x533.jpg"],
    isBestseller: true,
  },
  {
    name: "Rani Pink Chaniya Choli",
    category: "Navratri Collection",
    description:
      "Stunning rani pink chaniya choli with heavy embroidery and traditional mirror work.",
    price: 3999,
    sizes: ["S", "M", "L"],
    colors: [
      { name: "Rani Pink", hex: "#E91E8C" },
      { name: "Fuchsia", hex: "#FF007F" },
    ],
    imageUrls: ["/assets/uploads/Snapchat-1824187759-1.jpg"],
    isBestseller: true,
  },
  {
    name: "Bandhani Crop & Skirt",
    category: "Navratri Collection",
    description:
      "Traditional bandhani print two-piece set with crop blouse and flared skirt.",
    price: 2499,
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Red", hex: "#DC2626" },
      { name: "Teal", hex: "#0F766E" },
    ],
    imageUrls: ["/assets/uploads/Snapchat-981362243-2.jpg"],
    isBestseller: false,
  },
  {
    name: "Mirror Work Lehenga Set",
    category: "Navratri Collection",
    description:
      "Exquisite lehenga with intricate mirror work — turn heads on every night of the festival.",
    price: 4000,
    sizes: ["S", "M", "L"],
    colors: [{ name: "Multicolor", hex: "#F59E0B" }],
    imageUrls: ["/assets/uploads/IMG-20250927-WA0063-1.jpg"],
    isBestseller: true,
  },
  {
    name: "Cloud White Puff Sleeve Dress",
    category: "Navratri Collection",
    description:
      "Effortlessly chic white mini with square neckline and puff sleeves — the perfect clean-girl Navratri look.",
    price: 1800,
    sizes: ["XS", "S", "M", "L"],
    colors: [{ name: "White", hex: "#FFFFFF" }],
    imageUrls: ["/assets/uploads/Screenshot_20260322_130516-4.jpg"],
    isBestseller: false,
  },
  {
    name: "Sage Halter Denim Mini",
    category: "Navratri Collection",
    description:
      "Washed olive halter mini with contrast stitching — edgy, minimal, and totally festival-ready.",
    price: 1500,
    sizes: ["XS", "S", "M"],
    colors: [{ name: "Olive Green", hex: "#6B7C52" }],
    imageUrls: ["/assets/uploads/Screenshot_20260322_130540-5.jpg"],
    isBestseller: false,
  },
  {
    name: "Crimson Blossom Mini",
    category: "Navratri Collection",
    description:
      "Deep red A-line mini adorned with scattered stone embellishments — bold, festive, and impossibly pretty.",
    price: 2200,
    sizes: ["XS", "S", "M", "L"],
    colors: [{ name: "Crimson", hex: "#8B0000" }],
    imageUrls: ["/assets/uploads/Screenshot_20260322_130503-6.jpg"],
    isBestseller: false,
  },
  {
    name: "Rainbow Bandhani Ghagra",
    category: "Navratri Collection",
    description:
      "Multi-hued bandhani ghagra with flared hem and matching dupatta — a riot of festive colour.",
    price: 4500,
    sizes: ["S", "M", "L"],
    colors: [{ name: "Multicolor", hex: "#F59E0B" }],
    imageUrls: ["/assets/uploads/Screenshot_20260322_130419-1-7.jpg"],
    isBestseller: true,
  },
  {
    name: "Noir Artisan Chaniya Choli",
    category: "Navratri Collection",
    description:
      "Dramatic black chaniya choli with gold zari embroidery and mirror accents — for those who dare.",
    price: 3800,
    sizes: ["XS", "S", "M"],
    colors: [{ name: "Black & Gold", hex: "#1A1A1A" }],
    imageUrls: ["/assets/uploads/Screenshot_20260322_122124-1-8.jpg"],
    isBestseller: false,
  },
  {
    name: "Rang Mahotsav Lehenga Set",
    category: "Navratri Collection",
    description:
      "Vibrant festival lehenga bursting with colour — made to celebrate and be celebrated.",
    price: 4200,
    sizes: ["S", "M", "L"],
    colors: [{ name: "Multicolor", hex: "#F59E0B" }],
    imageUrls: ["/assets/uploads/Screenshot_20260322_130419-2-1.jpg"],
    isBestseller: false,
  },
  {
    name: "Kaali Kiran Chaniya Choli",
    category: "Navratri Collection",
    description:
      "Regal black chaniya choli with shimmering zari detail and festive dupatta — night-sky glamour.",
    price: 5500,
    sizes: ["XS", "S", "M", "L"],
    colors: [{ name: "Black", hex: "#1A1A1A" }],
    imageUrls: ["/assets/uploads/Screenshot_20260322_122124-2-2.jpg"],
    isBestseller: true,
  },
  // ── Mini Dress Collection ──
  {
    name: "Denim Micro Mini",
    category: "Mini Dress Collection",
    description:
      "Classic denim micro mini with frayed hem and gold button closure — street-style perfection.",
    price: 1199,
    sizes: ["XS", "S", "M"],
    colors: [
      { name: "Light Wash", hex: "#93C5FD" },
      { name: "Dark Wash", hex: "#1E3A5F" },
    ],
    imageUrls: ["/assets/generated/product-placeholder.dim_400x533.jpg"],
    isBestseller: false,
  },
  {
    name: "Ruffle Hem Party Mini",
    category: "Mini Dress Collection",
    description:
      "Bodycon mini with triple ruffle hem and off-shoulder neckline — dance-floor ready.",
    price: 1599,
    sizes: ["XS", "S", "M"],
    colors: [
      { name: "Coral", hex: "#F97316" },
      { name: "Black", hex: "#1A1A1A" },
    ],
    imageUrls: ["/assets/generated/product-placeholder.dim_400x533.jpg"],
    isBestseller: true,
  },
  {
    name: "Garden Bloom Chiffon Mini",
    category: "Mini Dress Collection",
    description:
      "Lightweight floral chiffon mini with puff sleeves and smocked waist — effortlessly feminine.",
    price: 1299,
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Garden Pink", hex: "#F9A8D4" },
      { name: "Cream", hex: "#FFFBEB" },
    ],
    imageUrls: ["/assets/generated/mini-dress-floral-chiffon.dim_400x533.jpg"],
    isBestseller: false,
  },
  {
    name: "Noir Sequin Off-Shoulder Mini",
    category: "Mini Dress Collection",
    description:
      "Dazzling black sequin mini with off-shoulder neckline and flared hem — born for the spotlight.",
    price: 1899,
    sizes: ["XS", "S", "M"],
    colors: [
      { name: "Black", hex: "#1A1A1A" },
      { name: "Silver", hex: "#C0C0C0" },
    ],
    imageUrls: ["/assets/generated/mini-dress-black-sequin.dim_400x533.jpg"],
    isBestseller: true,
  },
  {
    name: "Blush Ruched Mini",
    category: "Mini Dress Collection",
    description:
      "Hot pink bodycon mini with flattering ruched sides and delicate spaghetti straps — a going-out essential.",
    price: 1499,
    sizes: ["XS", "S", "M"],
    colors: [
      { name: "Hot Pink", hex: "#FF007F" },
      { name: "Blush", hex: "#FBCFE8" },
    ],
    imageUrls: ["/assets/generated/mini-dress-pink-ruched.dim_400x533.jpg"],
    isBestseller: true,
  },
  {
    name: "Burnout Velvet Mini",
    category: "Mini Dress Collection",
    description:
      "Burnout velvet mini with floral pattern and flared hem — retro glam at its finest.",
    price: 1599,
    sizes: ["S", "M", "L"],
    colors: [
      { name: "Deep Plum", hex: "#581C87" },
      { name: "Burgundy", hex: "#7A2040" },
    ],
    imageUrls: ["/assets/generated/product-placeholder.dim_400x533.jpg"],
    isBestseller: false,
  },
];

type ColorInput = { name: string; hex: string };

const DEFAULT_FORM: ProductInput = {
  name: "",
  category: "",
  description: "",
  price: 0,
  sizes: [],
  colors: [],
  imageUrls: [""],
  isBestseller: false,
};

export default function AdminPage() {
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: products, isLoading: productsLoading } = useGetAllProducts();
  const { login, loginStatus } = useInternetIdentity();
  const storageClient = useStorageClient();

  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [activeTab, setActiveTab] = useState("products");
  const [customCollections, setCustomCollections] = useState<string[]>([]);
  const [addCollectionOpen, setAddCollectionOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductInput>(DEFAULT_FORM);
  const [categoryCustomMode, setCategoryCustomMode] = useState(false);
  const [colorInput, setColorInput] = useState<ColorInput>({
    name: "",
    hex: "#000000",
  });
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isPending = addProduct.isPending || updateProduct.isPending;

  const allCollections = [...BASE_COLLECTIONS, ...customCollections];

  // Compute collection stats from products
  const collectionStats = allCollections.map((col) => ({
    name: col,
    count: products ? products.filter((p) => p.category === col).length : 0,
  }));

  function openAdd() {
    setEditingProduct(null);
    setFormData(DEFAULT_FORM);
    setColorInput({ name: "", hex: "#000000" });
    setCategoryCustomMode(false);
    setDialogOpen(true);
  }

  function openEdit(product: Product) {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description,
      price: Number(product.price),
      sizes: [...product.sizes],
      colors: product.colors.map((c: Color) => ({ name: c.name, hex: c.hex })),
      imageUrls: [...product.imageUrls],
      isBestseller: product.isBestseller,
    });
    setColorInput({ name: "", hex: "#000000" });
    setCategoryCustomMode(!allCollections.includes(product.category));
    setDialogOpen(true);
  }

  function toggleSize(size: string) {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  }

  function addColor() {
    if (colorInput.name.trim()) {
      setFormData((prev) => ({
        ...prev,
        colors: [
          ...prev.colors,
          { name: colorInput.name.trim(), hex: colorInput.hex },
        ],
      }));
      setColorInput({ name: "", hex: "#000000" });
    }
  }

  function removeColor(idx: number) {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== idx),
    }));
  }

  function addImageUrl() {
    setFormData((prev) => ({ ...prev, imageUrls: [...prev.imageUrls, ""] }));
  }

  function updateImageUrl(idx: number, val: string) {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.map((u, i) => (i === idx ? val : u)),
    }));
  }

  function removeImageUrl(idx: number) {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== idx),
    }));
  }

  async function handleImageUpload(file: File) {
    if (!storageClient) {
      toast.error("Storage not ready. Please try again.");
      return;
    }
    setIsUploading(true);
    setUploadProgress(0);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const { hash } = await storageClient.putFile(bytes, (pct) =>
        setUploadProgress(Math.round(pct * 100)),
      );
      const url = await storageClient.getDirectURL(hash);
      setFormData((prev) => ({
        ...prev,
        imageUrls: prev.imageUrls.some((u) => u === "")
          ? prev.imageUrls.map((u) => (u === "" ? url : u))
          : [...prev.imageUrls, url],
      }));
      toast.success("Image uploaded!");
    } catch {
      toast.error("Image upload failed.");
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const input: ProductInput = {
      ...formData,
      imageUrls: formData.imageUrls.filter((u) => u.trim()),
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
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteProduct.mutateAsync(deleteTarget.id);
      toast.success("Product deleted.");
      setDeleteTarget(null);
    } catch {
      toast.error("Delete failed.");
    }
  }

  async function handleSeedProducts() {
    if (products && products.length > 0) {
      toast.warning(
        "Products already seeded. Clear existing products first or add individually.",
      );
      return;
    }
    setSeeding(true);
    try {
      for (const product of SAMPLE_PRODUCTS) {
        await addProduct.mutateAsync(product);
      }
      toast.success(`${SAMPLE_PRODUCTS.length} products seeded successfully!`);
    } catch {
      toast.error("Seeding failed.");
    } finally {
      setSeeding(false);
    }
  }

  function handleAddCollection() {
    const trimmed = newCollectionName.trim();
    if (!trimmed) return;
    if (allCollections.includes(trimmed)) {
      toast.error("Collection already exists.");
      return;
    }
    setCustomCollections((prev) => [...prev, trimmed]);
    setNewCollectionName("");
    setAddCollectionOpen(false);
    toast.success(`Collection "${trimmed}" added!`);
  }

  if (adminLoading) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-12">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="max-w-md mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-3xl mb-4">Admin Access</h1>
        <p className="text-muted-foreground text-sm mb-6">
          Please log in to access the admin panel.
        </p>
        <Button
          onClick={login}
          disabled={loginStatus === "logging-in"}
          className="bg-primary text-primary-foreground"
          data-ocid="admin.primary_button"
        >
          {loginStatus === "logging-in" ? (
            <Loader2 size={16} className="mr-2 animate-spin" />
          ) : null}
          Login
        </Button>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-4xl">Admin Panel</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage your Anya Clothing product catalog
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleSeedProducts}
              disabled={seeding}
              className="border-warm-border text-xs tracking-widest uppercase"
              data-ocid="admin.secondary_button"
            >
              {seeding ? (
                <Loader2 size={14} className="mr-2 animate-spin" />
              ) : null}
              Seed {SAMPLE_PRODUCTS.length} Products
            </Button>
            <Button
              onClick={openAdd}
              className="bg-primary text-primary-foreground text-xs tracking-widest uppercase"
              data-ocid="admin.primary_button"
            >
              <Plus size={14} className="mr-2" /> Add Product
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 bg-secondary border border-warm-border">
            <TabsTrigger
              value="products"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs tracking-widest uppercase gap-1.5"
              data-ocid="admin.tab"
            >
              <Package size={14} /> Products
            </TabsTrigger>
            <TabsTrigger
              value="collections"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs tracking-widest uppercase gap-1.5"
              data-ocid="admin.tab"
            >
              <Layers size={14} /> Collections
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            {productsLoading ? (
              <div className="space-y-3" data-ocid="admin.loading_state">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : products && products.length > 0 ? (
              <div className="border border-warm-border rounded-xl overflow-hidden">
                <table className="w-full text-sm" data-ocid="admin.table">
                  <thead>
                    <tr className="bg-secondary border-b border-warm-border">
                      <th className="px-4 py-3 w-14 hidden sm:table-cell" />
                      <th className="text-left px-4 py-3 font-medium tracking-wide text-muted-foreground text-xs uppercase">
                        Product
                      </th>
                      <th className="text-left px-4 py-3 font-medium tracking-wide text-muted-foreground text-xs uppercase hidden md:table-cell">
                        Collection
                      </th>
                      <th className="text-left px-4 py-3 font-medium tracking-wide text-muted-foreground text-xs uppercase">
                        Price
                      </th>
                      <th className="text-left px-4 py-3 font-medium tracking-wide text-muted-foreground text-xs uppercase hidden sm:table-cell">
                        Sizes
                      </th>
                      <th className="text-right px-4 py-3 font-medium tracking-wide text-muted-foreground text-xs uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, idx) => (
                      <tr
                        key={String(product.id)}
                        className="border-b border-warm-border last:border-0 hover:bg-secondary/50 transition-colors"
                        data-ocid={`admin.item.${idx + 1}`}
                      >
                        <td className="px-4 py-3 hidden sm:table-cell">
                          {product.imageUrls[0] ? (
                            <img
                              src={product.imageUrls[0]}
                              alt={product.name}
                              className="w-10 h-10 object-cover rounded"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-secondary rounded" />
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{product.name}</span>
                            {product.isBestseller && (
                              <Star
                                size={12}
                                className="text-primary fill-primary"
                              />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                          <Badge
                            variant="secondary"
                            className="text-xs font-normal"
                          >
                            {product.category}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 font-medium">
                          ₹{Number(product.price).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <div className="flex gap-1 flex-wrap">
                            {product.sizes.map((s: string) => (
                              <span
                                key={s}
                                className="text-[11px] border border-warm-border px-1.5 py-0.5 rounded"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEdit(product)}
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                              data-ocid={`admin.edit_button.${idx + 1}`}
                            >
                              <Pencil size={14} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteTarget(product)}
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                              data-ocid={`admin.delete_button.${idx + 1}`}
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
            ) : (
              <div
                className="text-center py-20 border border-dashed border-warm-border rounded-xl"
                data-ocid="admin.empty_state"
              >
                <p className="text-muted-foreground text-sm mb-4">
                  No products yet. Seed the catalog or add your first product.
                </p>
                <Button
                  variant="outline"
                  onClick={handleSeedProducts}
                  disabled={seeding}
                  className="border-warm-border text-xs tracking-widest uppercase"
                >
                  {seeding ? (
                    <Loader2 size={14} className="mr-2 animate-spin" />
                  ) : null}
                  Seed Sample Products
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Collections Tab */}
          <TabsContent value="collections">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                {allCollections.length} collections total
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAddCollectionOpen(true)}
                className="border-warm-border text-xs tracking-widest uppercase"
                data-ocid="admin.open_modal_button"
              >
                <Plus size={12} className="mr-1.5" /> Add Collection
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {collectionStats.map((col, idx) => (
                <motion.div
                  key={col.name}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border border-warm-border rounded-xl p-5 bg-secondary/40 hover:bg-secondary/60 transition-colors"
                  data-ocid={`admin.item.${idx + 1}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Layers size={18} className="text-primary" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {col.count} {col.count === 1 ? "product" : "products"}
                      </Badge>
                      {customCollections.includes(col.name) && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setCustomCollections((prev) =>
                              prev.filter((c) => c !== col.name),
                            )
                          }
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                          data-ocid={`admin.delete_button.${idx + 1}`}
                        >
                          <Trash2 size={13} />
                        </Button>
                      )}
                    </div>
                  </div>
                  <h3 className="font-serif text-lg leading-tight mb-3">
                    {col.name}
                  </h3>
                  <a
                    href={`/catalog?category=${encodeURIComponent(col.name)}`}
                    className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline tracking-wide uppercase"
                    data-ocid="admin.link"
                  >
                    View Products <ExternalLink size={11} />
                  </a>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Add / Edit Product Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="max-w-lg max-h-[90vh] overflow-y-auto"
          data-ocid="admin.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Fill in the product details below.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <Label
                htmlFor="name"
                className="text-xs uppercase tracking-widest"
              >
                Name
              </Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="border-warm-border"
                data-ocid="admin.input"
              />
            </div>

            {/* Category (Select + Custom) */}
            <div className="space-y-1.5">
              <Label
                htmlFor="category"
                className="text-xs uppercase tracking-widest"
              >
                Collection
              </Label>
              {categoryCustomMode ? (
                <div className="flex gap-2">
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    placeholder="Enter custom collection name"
                    className="border-warm-border flex-1"
                    data-ocid="admin.input"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCategoryCustomMode(false);
                      setFormData((prev) => ({ ...prev, category: "" }));
                    }}
                    className="border-warm-border h-10 text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Select
                  value={formData.category}
                  onValueChange={(val) => {
                    if (val === "__other__") {
                      setCategoryCustomMode(true);
                      setFormData((prev) => ({ ...prev, category: "" }));
                    } else {
                      setFormData((prev) => ({ ...prev, category: val }));
                    }
                  }}
                >
                  <SelectTrigger
                    id="category"
                    className="border-warm-border"
                    data-ocid="admin.select"
                  >
                    <SelectValue placeholder="Select a collection" />
                  </SelectTrigger>
                  <SelectContent>
                    {allCollections.map((col) => (
                      <SelectItem key={col} value={col}>
                        {col}
                      </SelectItem>
                    ))}
                    <SelectItem
                      value="__other__"
                      className="text-muted-foreground italic"
                    >
                      Other...
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label
                htmlFor="desc"
                className="text-xs uppercase tracking-widest"
              >
                Description
              </Label>
              <Textarea
                id="desc"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
                className="border-warm-border resize-none"
                data-ocid="admin.textarea"
              />
            </div>

            {/* Price */}
            <div className="space-y-1.5">
              <Label
                htmlFor="price"
                className="text-xs uppercase tracking-widest"
              >
                Price (₹)
              </Label>
              <Input
                id="price"
                type="number"
                min={0}
                required
                value={formData.price || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    price: Number(e.target.value),
                  }))
                }
                className="border-warm-border"
                data-ocid="admin.input"
              />
            </div>

            {/* Sizes */}
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-widest">Sizes</Label>
              <div className="flex gap-3 flex-wrap">
                {SIZES_OPTIONS.map((size) => (
                  <label
                    key={size}
                    htmlFor={`size-${size}`}
                    className="flex items-center gap-1.5 cursor-pointer"
                  >
                    <Checkbox
                      id={`size-${size}`}
                      checked={formData.sizes.includes(size)}
                      onCheckedChange={() => toggleSize(size)}
                      data-ocid="admin.checkbox"
                    />
                    <span className="text-sm">{size}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-widest">
                Colors
              </Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.colors.map((color, idx) => (
                  <div
                    key={color.name}
                    className="flex items-center gap-1.5 bg-secondary rounded-full px-3 py-1 text-xs"
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-warm-border"
                      style={{ backgroundColor: color.hex }}
                    />
                    {color.name}
                    <button
                      type="button"
                      onClick={() => removeColor(idx)}
                      className="text-muted-foreground hover:text-foreground ml-1"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Color name"
                  value={colorInput.name}
                  onChange={(e) =>
                    setColorInput((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="border-warm-border flex-1"
                  data-ocid="admin.input"
                />
                <input
                  type="color"
                  value={colorInput.hex}
                  onChange={(e) =>
                    setColorInput((prev) => ({ ...prev, hex: e.target.value }))
                  }
                  className="w-10 h-10 cursor-pointer rounded border border-warm-border"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addColor}
                  className="border-warm-border h-10"
                >
                  Add
                </Button>
              </div>
            </div>

            {/* Image URLs + Upload */}
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-widest">
                Images
              </Label>
              {formData.imageUrls.map((url, idx) => (
                <div key={String(idx)} className="space-y-1">
                  <div className="flex gap-2">
                    <Input
                      value={url}
                      onChange={(e) => updateImageUrl(idx, e.target.value)}
                      placeholder="/assets/generated/... or upload below"
                      className="border-warm-border flex-1"
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
                  {url.trim() && (
                    <img
                      src={url}
                      alt="Preview"
                      className="w-12 h-12 object-cover rounded border border-warm-border"
                    />
                  )}
                </div>
              ))}

              {/* Upload progress */}
              {isUploading && uploadProgress !== null && (
                <div className="space-y-1" data-ocid="admin.loading_state">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-1.5" />
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addImageUrl}
                  className="border-warm-border text-xs"
                >
                  <Plus size={12} className="mr-1" /> Add URL
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                    e.target.value = "";
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading || !storageClient}
                  className="border-warm-border text-xs"
                  data-ocid="admin.upload_button"
                >
                  {isUploading ? (
                    <Loader2 size={12} className="mr-1 animate-spin" />
                  ) : (
                    <Upload size={12} className="mr-1" />
                  )}
                  Upload Image
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

      {/* Add Collection Dialog */}
      <Dialog open={addCollectionOpen} onOpenChange={setAddCollectionOpen}>
        <DialogContent className="max-w-sm" data-ocid="admin.dialog">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              Add Collection
            </DialogTitle>
            <DialogDescription className="text-xs">
              Enter a name for the new collection.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Input
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              placeholder="e.g. Summer Collection"
              className="border-warm-border"
              onKeyDown={(e) => e.key === "Enter" && handleAddCollection()}
              data-ocid="admin.input"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setAddCollectionOpen(false);
                setNewCollectionName("");
              }}
              className="border-warm-border"
              data-ocid="admin.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddCollection}
              disabled={!newCollectionName.trim()}
              className="bg-primary text-primary-foreground"
              data-ocid="admin.confirm_button"
            >
              Add Collection
            </Button>
          </DialogFooter>
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
