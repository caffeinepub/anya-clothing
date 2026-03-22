import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  return (
    <footer className="bg-warm-dark text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h2 className="font-serif text-3xl text-white mb-4 tracking-widest">
              ANYA
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Sophisticated female clothing for the modern woman. Elegance in
              every thread.
            </p>
            <div className="flex gap-4 mt-5">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-white font-medium tracking-widest uppercase text-xs mb-4">
              Shop
            </h3>
            <ul className="space-y-2.5">
              {[
                "New In",
                "Dresses",
                "Tops",
                "Bottoms",
                "Accessories",
                "Sale",
              ].map((item) => (
                <li key={item}>
                  <Link
                    to="/catalog"
                    search={{ q: "", category: "", bestsellers: "", sale: "" }}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-white font-medium tracking-widest uppercase text-xs mb-4">
              Help
            </h3>
            <ul className="space-y-2.5">
              {[
                "Size Guide",
                "Shipping & Returns",
                "Track Order",
                "Contact Us",
                "FAQs",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="https://caffeine.ai"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-medium tracking-widest uppercase text-xs mb-4">
              Newsletter
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Get updates on new collections and exclusive offers.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setEmail("");
              }}
              className="flex gap-2"
            >
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="bg-warm-charcoal border-gray-600 text-white placeholder:text-gray-500 text-sm flex-1"
              />
              <Button
                type="submit"
                size="sm"
                className="bg-white text-warm-dark hover:bg-gray-100"
              >
                Join
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-700 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © {year}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-300 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
          <div className="flex gap-3 text-xs text-gray-500">
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300 transition-colors"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
