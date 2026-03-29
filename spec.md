# Anya Clothing

## Current State
Full-stack e-commerce app with:
- Product catalog (6 collections, seed products)
- Wishlist (backend-persisted, up to 800 items)
- Admin panel at /admin with Internet Identity login
- Product detail page with size/color selection
- Seed products functionality
- Authorization component (admin/user/guest roles)

Missing/broken:
- Orders are not saved to backend — no Order type or API exists
- No admin view for orders
- "Seed Products" sometimes fails silently
- WhatsApp order confirmation link not implemented

## Requested Changes (Diff)

### Add
- Order data model: orderId, productId, productName, customerName, phone, email, address, size, color, price, status, createdAt
- Backend APIs: placeOrder, getAllOrders (admin only), updateOrderStatus, getMyOrders
- Admin panel Orders tab: table showing all orders with customer details and status update (Pending/Processing/Shipped/Delivered)
- WhatsApp link on order confirmation page
- COD (Cash on Delivery) as default payment method shown at checkout

### Modify
- ProductDetailPage: wire Place Order button to backend placeOrder API, collect name/phone/email/address in a form before submitting
- AdminPage: add Orders tab alongside Products tab
- Order confirmation: show WhatsApp contact link after order placed

### Remove
- Nothing removed

## Implementation Plan
1. Regenerate Motoko backend with Order type and order management APIs
2. Update frontend:
   a. ProductDetailPage: add checkout form (name, phone, email, address, COD label), call placeOrder API
   b. Order confirmation modal/page: show order summary + WhatsApp link
   c. AdminPage: add Orders tab with table of all orders, status dropdown per row
3. Validate and deploy
