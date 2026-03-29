import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, Menu, Package, Search, Settings, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetWishlistCount, useIsCallerAdmin } from "../hooks/useQueries";

const NAV_LINKS = [
  { label: "New In", href: "/catalog", category: "" },
  { label: "Crop Tops", href: "/catalog", category: "Crop Top Collection" },
  { label: "Dresses", href: "/catalog", category: "Dress Collection" },
  { label: "Tank Tops", href: "/catalog", category: "Tank Top Collection" },
  { label: "Bodycon", href: "/catalog", category: "Bodycon Collection" },
  { label: "Navratri", href: "/catalog", category: "Navratri Collection" },
  { label: "Sale", href: "/catalog", category: "", sale: "true" },
];

export default function Header() {
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { data: wishlistCount } = useGetWishlistCount();
  const { data: isAdmin } = useIsCallerAdmin();
  const { identity } = useInternetIdentity();
  const isLoggedIn = !!identity && !identity.getPrincipal().isAnonymous();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({
        to: "/catalog",
        search: {
          q: searchQuery.trim(),
          category: "",
          bestsellers: "",
          sale: "",
        },
      });
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-shadow duration-300 ${
        scrolled ? "shadow-card" : ""
      }`}
    >
      {/* Announcement bar */}
      <div className="bg-primary text-primary-foreground text-center py-2 px-4">
        <p className="text-xs tracking-widest uppercase">
          ✨ Anya Clothing — Free shipping on orders over ₹2000
        </p>
      </div>

      {/* Main header */}
      <div className="bg-background border-b border-warm-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0" data-ocid="nav.link">
              <span
                className="font-serif text-4xl font-bold tracking-widest text-foreground"
                style={{ letterSpacing: "0.25em" }}
              >
                ANYA
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav
              className="hidden lg:flex items-center gap-6"
              aria-label="Main navigation"
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  search={{
                    q: "",
                    category: link.category ?? "",
                    bestsellers: "",
                    sale: link.sale ?? "",
                  }}
                  className="text-xs font-medium tracking-widest uppercase text-warm-gray hover:text-primary transition-colors"
                  data-ocid="nav.link"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right icons */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-1 text-warm-gray hover:text-primary transition-colors"
                aria-label="Toggle search"
                data-ocid="nav.search_input"
              >
                {searchOpen ? <X size={18} /> : <Search size={18} />}
              </button>

              <Link
                to="/wishlist"
                className="relative p-1 text-warm-gray hover:text-primary transition-colors"
                data-ocid="nav.link"
              >
                <Heart size={18} />
                {wishlistCount !== undefined && Number(wishlistCount) > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-medium">
                    {Number(wishlistCount) > 99 ? "99+" : Number(wishlistCount)}
                  </span>
                )}
              </Link>

              {isLoggedIn && (
                <Link
                  to="/my-orders"
                  className="p-1 text-warm-gray hover:text-primary transition-colors"
                  title="My Orders"
                  data-ocid="nav.link"
                >
                  <Package size={18} />
                </Link>
              )}

              {isAdmin && identity && (
                <Link
                  to="/admin"
                  className="p-1 text-warm-gray hover:text-primary transition-colors"
                  data-ocid="nav.link"
                >
                  <Settings size={18} />
                </Link>
              )}

              <button
                type="button"
                className="lg:hidden p-1 text-warm-gray hover:text-primary"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>

          {/* Search bar */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <form onSubmit={handleSearch} className="pb-3">
                  <div className="relative">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-gray"
                    />
                    <Input
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products by name or category..."
                      className="pl-9 bg-secondary border-warm-border text-foreground placeholder:text-muted-foreground"
                      data-ocid="nav.search_input"
                    />
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile nav */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-warm-border overflow-hidden"
            >
              <nav className="px-4 py-3 flex flex-col gap-3">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    search={{
                      q: "",
                      category: link.category ?? "",
                      bestsellers: "",
                      sale: link.sale ?? "",
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-medium tracking-widest uppercase text-warm-gray hover:text-primary"
                    data-ocid="nav.link"
                  >
                    {link.label}
                  </Link>
                ))}
                {isLoggedIn && (
                  <Link
                    to="/my-orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-medium tracking-widest uppercase text-warm-gray hover:text-primary"
                    data-ocid="nav.link"
                  >
                    My Orders
                  </Link>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
