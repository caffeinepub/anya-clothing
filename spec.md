# Anya Clothing

## Current State
New project. Empty backend and frontend scaffolding.

## Requested Changes (Diff)

### Add
- Product data model: id, name, category, price (200–7000), sizes (XS/S/M/L), colors (name+hex), images, isBestseller flag, description
- Wishlist data model: list of product ids per anonymous session (max 800 items)
- Backend CRUD for products (admin)
- Backend queries: list all products, filter by size/color/price range/category/search, get bestsellers
- Backend wishlist: add, remove, list, count
- Admin authentication to protect content management panel
- Homepage: hero banner, featured categories, bestsellers section
- Product catalog page with filter sidebar (size, color, price slider, category)
- Search bar in header
- Product cards: image, name, price, color swatches, size chips, wishlist heart button
- Wishlist page showing saved products
- Content management panel (admin): add/edit/delete products with all fields including bestseller flag and image upload
- Blob storage integration for product images

### Modify
- Nothing (new project)

### Remove
- Nothing

## Implementation Plan
1. Backend: Product type with all fields; stable storage map; CRUD functions (addProduct, updateProduct, deleteProduct, getProducts, getProductById, getBestsellers); filter/search query function; Wishlist per-principal with 800 item cap (addToWishlist, removeFromWishlist, getWishlist)
2. Authorization: admin role to protect write operations
3. Blob storage: product image upload and retrieval
4. Frontend homepage: announcement bar, sticky header with nav + icons, hero banner, category tiles, bestsellers strip
5. Frontend catalog: filter sidebar (size chips, color swatches, price range slider, category), product grid, search
6. Frontend product cards: image, wishlist heart, name, price, color/size options
7. Frontend wishlist page: grid of saved products, count badge
8. Frontend admin panel: product list table, add/edit form with image upload, delete confirmation
9. Sample product data pre-loaded on deploy
