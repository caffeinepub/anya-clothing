import MixinStorage "blob-storage/Mixin";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Float "mo:core/Float";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Integrate storage and access control
  let accessControlState = AccessControl.initState();

  include MixinAuthorization(accessControlState);
  include MixinStorage();

  type Wishlist = [Nat];

  type Product = {
    id : Nat;
    name : Text;
    category : Text;
    description : Text;
    price : Float;
    sizes : [Text];
    colors : [Color];
    imageUrls : [Text];
    isBestseller : Bool;
    createdAt : Int;
  };

  type Color = {
    name : Text;
    hex : Text;
  };

  type ProductInput = {
    name : Text;
    category : Text;
    description : Text;
    price : Float;
    sizes : [Text];
    colors : [Color];
    imageUrls : [Text];
    isBestseller : Bool;
  };

  public type UserProfile = {
    name : Text;
  };

  module Product {
    public func compare(product1 : Product, product2 : Product) : Order.Order {
      Nat.compare(product1.id, product2.id);
    };

    public func compareByPrice(product1 : Product, product2 : Product) : Order.Order {
      Float.compare(product1.price, product2.price);
    };

    public func compareByCreatedAt(product1 : Product, product2 : Product) : Order.Order {
      Int.compare(product2.createdAt, product1.createdAt); // Newest first
    };
  };

  module Color {
    public func compare(color1 : Color, color2 : Color) : Order.Order {
      Text.compare(color1.name, color2.name);
    };
  };

  let products = Map.empty<Nat, Product>();
  let wishlists = Map.empty<Principal, Wishlist>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var productIdCounter = 0;

  // Helper: check if caller is authenticated (not anonymous)
  func isAuthenticated(caller : Principal) : Bool {
    not caller.isAnonymous();
  };

  // Check if caller is store owner (authenticated user)
  public query ({ caller }) func isCallerStoreOwner() : async Bool {
    isAuthenticated(caller);
  };

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not isAuthenticated(caller)) {
      Runtime.trap("Unauthorized: Must be logged in");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not isAuthenticated(caller)) {
      Runtime.trap("Unauthorized: Must be logged in");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not isAuthenticated(caller)) {
      Runtime.trap("Unauthorized: Must be logged in");
    };
    userProfiles.add(caller, profile);
  };

  // Product CRUD (any authenticated user - store owner)
  public shared ({ caller }) func addProduct(input : ProductInput) : async Nat {
    if (not isAuthenticated(caller)) {
      Runtime.trap("Unauthorized: Must be logged in to add products");
    };
    let product : Product = {
      input with
      id = productIdCounter;
      createdAt = Time.now();
    };
    let newId = productIdCounter;
    products.add(newId, product);
    productIdCounter += 1;
    newId;
  };

  public shared ({ caller }) func updateProduct(id : Nat, input : ProductInput) : async () {
    if (not isAuthenticated(caller)) {
      Runtime.trap("Unauthorized: Must be logged in to update products");
    };
    let product : Product = getProductInternal(id);
    let updatedProduct : Product = {
      input with id;
      createdAt = product.createdAt;
    };
    products.add(id, updatedProduct);
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async () {
    if (not isAuthenticated(caller)) {
      Runtime.trap("Unauthorized: Must be logged in to delete products");
    };
    if (not products.containsKey(id)) {
      Runtime.trap("Product not found");
    };
    products.remove(id);
  };

  // Product Queries (accessible to all including guests)
  public query func getAllProducts() : async [Product] {
    products.values().toArray().sort(Product.compareByCreatedAt);
  };

  public query func getProductById(id : Nat) : async Product {
    getProductInternal(id);
  };

  public query func getBestsellers() : async [Product] {
    products.values().toArray().filter(
      func(product) { product.isBestseller }
    ).sort(Product.compareByPrice);
  };

  public query func searchProducts(searchText : Text) : async [Product] {
    let lowerSearch = searchText.toLower();
    products.values().toArray().filter(
      func(product) {
        product.name.toLower().contains(#text lowerSearch) or product.category.toLower().contains(#text lowerSearch)
      }
    ).sort(Product.compareByPrice);
  };

  public query func filterProducts(sizes : ?[Text], colors : ?[Color], minPrice : ?Float, maxPrice : ?Float, category : ?Text) : async [Product] {
    products.values().toArray().filter(
      func(product) {
        let sizeFilter = switch (sizes) {
          case (null) { true };
          case (?someSizes) {
            someSizes.foldLeft(
              false,
              func(acc, size) {
                product.sizes.foldLeft(acc, func(acc2, pSize) { acc2 or pSize == size });
              },
            );
          };
        };

        let colorFilter = switch (colors) {
          case (null) { true };
          case (?colorArray) {
            colorArray.foldLeft(
              false,
              func(acc, color) {
                product.colors.foldLeft(acc, func(acc2, pColor) { acc2 or pColor == color });
              },
            );
          };
        };

        let priceFilter = switch (minPrice, maxPrice) {
          case (null, null) { true };
          case (?min, null) { product.price >= min };
          case (null, ?max) { product.price <= max };
          case (?min, ?max) { product.price >= min and product.price <= max };
        };

        let categoryFilter = switch (category) {
          case (null) { true };
          case (?cat) { product.category == cat };
        };

        sizeFilter and colorFilter and priceFilter and categoryFilter;
      }
    ).sort(Product.compareByPrice);
  };

  // Wishlist functionality (authenticated users only)
  public shared ({ caller }) func addToWishlist(productId : Nat) : async () {
    if (not isAuthenticated(caller)) {
      Runtime.trap("Unauthorized: Must be logged in");
    };
    ignore getProductInternal(productId);
    let currentWishlist = switch (wishlists.get(caller)) {
      case (null) { [] };
      case (?wishlist) { wishlist };
    };
    if (currentWishlist.size() >= 800 or currentWishlist.any(func(id) { id == productId })) {
      return;
    };
    let newWishlist = currentWishlist.concat([productId]);
    wishlists.add(caller, newWishlist);
  };

  public shared ({ caller }) func removeFromWishlist(productId : Nat) : async () {
    if (not isAuthenticated(caller)) {
      Runtime.trap("Unauthorized: Must be logged in");
    };
    let currentWishlist = switch (wishlists.get(caller)) {
      case (null) { return };
      case (?wishlist) { wishlist };
    };
    let filteredWishlist = currentWishlist.filter(func(id) { id != productId });
    wishlists.add(caller, filteredWishlist);
  };

  public query ({ caller }) func getWishlist() : async Wishlist {
    if (not isAuthenticated(caller)) {
      Runtime.trap("Unauthorized: Must be logged in");
    };
    switch (wishlists.get(caller)) {
      case (null) { [] };
      case (?wishlist) { wishlist };
    };
  };

  public query ({ caller }) func getWishlistCount() : async Nat {
    if (not isAuthenticated(caller)) {
      Runtime.trap("Unauthorized: Must be logged in");
    };
    switch (wishlists.get(caller)) {
      case (null) { 0 };
      case (?wishlist) { wishlist.size() };
    };
  };

  // Helper function to get product by id
  func getProductInternal(id : Nat) : Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };
};
