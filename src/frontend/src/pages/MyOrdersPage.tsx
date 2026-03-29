import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { Package, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetMyOrders } from "../hooks/useQueries";

const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  Processing: "bg-blue-100 text-blue-800 border-blue-300",
  Shipped: "bg-purple-100 text-purple-800 border-purple-300",
  Delivered: "bg-green-100 text-green-800 border-green-300",
};

function formatDate(ns: bigint) {
  return new Date(Number(ns / BigInt(1_000_000))).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function MyOrdersPage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const isLoggedIn = !!identity && !identity.getPrincipal().isAnonymous();
  const { data: orders = [], isLoading } = useGetMyOrders();

  if (!isLoggedIn) {
    return (
      <main
        className="min-h-screen flex items-center justify-center"
        data-ocid="orders.page"
      >
        <div className="text-center px-4">
          <Package
            size={56}
            className="text-muted-foreground mx-auto mb-6 opacity-30"
          />
          <h2 className="font-display text-2xl mb-3">
            Login to view your orders
          </h2>
          <p className="text-muted-foreground text-sm mb-8">
            Sign in with Internet Identity to access your order history.
          </p>
          <Button
            onClick={login}
            disabled={loginStatus === "logging-in"}
            className="bg-primary text-primary-foreground tracking-widest text-xs uppercase px-8"
            data-ocid="orders.primary_button"
          >
            {loginStatus === "logging-in" ? "Logging in..." : "Login"}
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen" data-ocid="orders.page">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl mb-1">
              My Orders
            </h1>
            <p className="text-sm text-muted-foreground">
              {orders.length} order{orders.length !== 1 ? "s" : ""} placed
            </p>
          </div>
          <Package size={28} className="text-muted-foreground mt-1" />
        </div>

        {isLoading ? (
          <div className="space-y-4" data-ocid="orders.loading_state">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-28 w-full rounded-none" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
            data-ocid="orders.empty_state"
          >
            <ShoppingBag
              size={56}
              className="text-muted-foreground mx-auto mb-6 opacity-30"
            />
            <h2 className="font-display text-2xl mb-3">No orders yet</h2>
            <p className="text-muted-foreground text-sm mb-8">
              Your orders will appear here once you place one.
            </p>
            <Link
              to="/catalog"
              search={{ q: "", category: "", bestsellers: "", sale: "" }}
            >
              <Button
                className="bg-primary text-primary-foreground tracking-widest text-xs uppercase px-8"
                data-ocid="orders.primary_button"
              >
                <ShoppingBag size={14} className="mr-2" /> Shop Now
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4" data-ocid="orders.list">
            {orders.map((order, i) => (
              <motion.div
                key={String(order.id)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border border-warm-border p-5 bg-background hover:bg-secondary/30 transition-colors"
                data-ocid={`orders.item.${i + 1}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-muted-foreground">
                        Order #{String(order.id)}
                      </span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {order.productName}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                      {order.size && (
                        <span>
                          Size:{" "}
                          <strong className="text-foreground">
                            {order.size}
                          </strong>
                        </span>
                      )}
                      {order.color && (
                        <span>
                          Color:{" "}
                          <strong className="text-foreground">
                            {order.color}
                          </strong>
                        </span>
                      )}
                      <span>
                        Payment:{" "}
                        <strong className="text-foreground">
                          {order.paymentMethod}
                        </strong>
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="font-semibold text-primary text-lg">
                      ₹{Number(order.price).toLocaleString("en-IN")}
                    </span>
                    <Badge
                      className={`text-xs border ${
                        STATUS_COLORS[order.status] ??
                        "bg-gray-100 text-gray-800 border-gray-300"
                      }`}
                      variant="outline"
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-warm-border text-xs text-muted-foreground">
                  <span>Deliver to: {order.address}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
