import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Product {
    id: bigint;
    imageUrls: Array<string>;
    name: string;
    createdAt: bigint;
    description: string;
    sizes: Array<string>;
    isBestseller: boolean;
    category: string;
    colors: Array<Color>;
    price: number;
}
export interface ProductInput {
    imageUrls: Array<string>;
    name: string;
    description: string;
    sizes: Array<string>;
    isBestseller: boolean;
    category: string;
    colors: Array<Color>;
    price: number;
}
export type Wishlist = Array<bigint>;
export interface Color {
    hex: string;
    name: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProduct(input: ProductInput): Promise<bigint>;
    addToWishlist(productId: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteProduct(id: bigint): Promise<void>;
    filterProducts(sizes: Array<string> | null, colors: Array<Color> | null, minPrice: number | null, maxPrice: number | null, category: string | null): Promise<Array<Product>>;
    getAllProducts(): Promise<Array<Product>>;
    getBestsellers(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProductById(id: bigint): Promise<Product>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWishlist(): Promise<Wishlist>;
    getWishlistCount(): Promise<bigint>;
    isCallerAdmin(): Promise<boolean>;
    removeFromWishlist(productId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchProducts(searchText: string): Promise<Array<Product>>;
    updateProduct(id: bigint, input: ProductInput): Promise<void>;
}
