# Anya Clothing

## Current State
Catalog page shows product cards with display-only size chips. No product detail page exists. Clicking a product does nothing. No size/color selection or order placement flow.

## Requested Changes (Diff)

### Add
- Product detail page at /product/$id with full info, image, size selector, color selector, Place Order button
- useGetProductById hook
- Route /product/$id in App.tsx

### Modify
- ProductCard: make entire card clickable, navigate to /product/$id
- App.tsx: add productRoute

### Remove
- Nothing

## Implementation Plan
1. Add useGetProductById to useQueries.ts
2. Create ProductDetailPage.tsx with size/color selection and order confirmation
3. Register route in App.tsx
4. Make ProductCard navigate on click
