import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_SITE_CONFIG, PRODUCTS } from '../data/products';
import {
  AppRoute,
  CartItem,
  CustomerReview,
  DispatchStatus,
  OrderCustomerDetails,
  OrderRecord,
  Product,
  ProductSize,
  SiteConfig,
} from '../types';
import { calculateBundlePricing, CartPricingSummary } from '../utils/pricing';

interface StoreContextValue {
  route: AppRoute;
  canGoBack: boolean;
  navigate: (nextRoute: AppRoute) => void;
  goBack: () => void;

  // Drawers & Modals
  isMenuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setWishlistOpen: (open: boolean) => void;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;

  // Live Catalog & Config (Admin-managed)
  products: Product[];
  productsMap: Map<string, Product>;
  siteConfig: SiteConfig;
  updateSiteConfig: (partial: Partial<SiteConfig>) => void;
  updateProduct: (updated: Product) => void;
  addProduct: (newProduct: Product) => void;
  deleteProduct: (productId: string) => void;
  updateVariantStock: (
    productId: string,
    colorId: string,
    size: ProductSize,
    quantity: number
  ) => void;
  resetStorefrontDefaults: () => void;

  // Cart & Pricing (Color + Size XS-XL)
  cart: CartItem[];
  pricingSummary: CartPricingSummary;
  addToCart: (
    productId: string,
    colorId: string,
    size: ProductSize,
    quantity?: number,
    openDrawer?: boolean
  ) => void;
  updateCartQuantity: (
    productId: string,
    colorId: string,
    size: ProductSize,
    quantity: number
  ) => void;
  removeFromCart: (productId: string, colorId: string, size: ProductSize) => void;
  clearCart: () => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  // Recently Viewed
  recentlyViewedIds: string[];
  recordProductView: (productId: string) => void;

  // Genuine Customer Reviews
  reviews: CustomerReview[];
  getProductReviews: (productId: string) => CustomerReview[];
  submitReview: (
    productId: string,
    reviewerName: string,
    rating: number,
    comment: string
  ) => void;
  deleteReview: (reviewId: string) => void;

  // Orders & Dispatch Tracking
  orders: OrderRecord[];
  logOrderRequest: (
    customer: OrderCustomerDetails,
    items: OrderRecord['items'],
    pricing: OrderRecord['pricing'],
    source: OrderRecord['source']
  ) => OrderRecord;
  updateOrderDispatchStatus: (orderId: string, status: DispatchStatus) => void;

  // Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

const STORAGE_KEYS = {
  products: 'manyata_ethnic_products_v2',
  siteConfig: 'manyata_ethnic_config_v2',
  cart: 'manyata_ethnic_cart_v2',
  wishlist: 'manyata_ethnic_wishlist_v2',
  recent: 'manyata_ethnic_recent_v2',
  reviews: 'manyata_ethnic_reviews_v2',
  orders: 'manyata_ethnic_orders_v2',
};

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [historyStack, setHistoryStack] = useState<AppRoute[]>([{ page: 'home' }]);
  const route = historyStack[historyStack.length - 1];
  const canGoBack = historyStack.length > 1;

  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isWishlistOpen, setWishlistOpen] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);

  const [products, setProducts] = useState<Product[]>(() =>
    readJson(STORAGE_KEYS.products, PRODUCTS)
  );
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => ({
    ...DEFAULT_SITE_CONFIG,
    ...readJson<Partial<SiteConfig>>(STORAGE_KEYS.siteConfig, {}),
  }));

  const [cart, setCart] = useState<CartItem[]>(() => readJson(STORAGE_KEYS.cart, []));
  const [wishlist, setWishlist] = useState<string[]>(() => readJson(STORAGE_KEYS.wishlist, []));
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() =>
    readJson(STORAGE_KEYS.recent, [])
  );
  const [reviews, setReviews] = useState<CustomerReview[]>(() =>
    readJson(STORAGE_KEYS.reviews, [])
  );
  const [orders, setOrders] = useState<OrderRecord[]>(() => readJson(STORAGE_KEYS.orders, []));
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const productsMap = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products));
    } catch {
      // Ignore storage quota issues
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.siteConfig, JSON.stringify(siteConfig));
    } catch {
      // Ignore
    }
  }, [siteConfig]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
    } catch {
      // Ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.wishlist, JSON.stringify(wishlist));
    } catch {
      // Ignore
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.recent, JSON.stringify(recentlyViewedIds));
    } catch {
      // Ignore
    }
  }, [recentlyViewedIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.reviews, JSON.stringify(reviews));
    } catch {
      // Ignore
    }
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
    } catch {
      // Ignore
    }
  }, [orders]);

  const showToast = useCallback((msg: string) => setToastMessage(msg), []);

  useEffect(() => {
    if (!toastMessage) return;
    const t = window.setTimeout(() => setToastMessage(null), 3000);
    return () => window.clearTimeout(t);
  }, [toastMessage]);

  const navigate = useCallback((nextRoute: AppRoute) => {
    setMenuOpen(false);
    setSearchOpen(false);
    setWishlistOpen(false);
    setCartOpen(false);

    setHistoryStack((prev) => {
      const current = prev[prev.length - 1];
      if (JSON.stringify(current) === JSON.stringify(nextRoute)) {
        return prev;
      }
      return [...prev, nextRoute];
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goBack = useCallback(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setWishlistOpen(false);
    setCartOpen(false);

    setHistoryStack((prev) => {
      if (prev.length <= 1) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return prev;
      }
      return prev.slice(0, -1);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Admin Catalog & Site Mutations
  const updateSiteConfig = useCallback((partial: Partial<SiteConfig>) => {
    setSiteConfig((prev) => ({ ...prev, ...partial }));
  }, []);

  const updateProduct = useCallback((updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }, []);

  const addProduct = useCallback((newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  }, []);

  const deleteProduct = useCallback((productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  const updateVariantStock = useCallback(
    (productId: string, colorId: string, size: ProductSize, quantity: number) => {
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id !== productId) return p;
          return {
            ...p,
            colors: p.colors.map((c) => {
              if (c.id !== colorId) return c;
              return {
                ...c,
                stockBySize: {
                  ...c.stockBySize,
                  [size]: Math.max(0, quantity),
                },
              };
            }),
          };
        })
      );
    },
    []
  );

  const resetStorefrontDefaults = useCallback(() => {
    setProducts(PRODUCTS);
    setSiteConfig(DEFAULT_SITE_CONFIG);
    showToast('Storefront catalog and settings restored to defaults.');
  }, [showToast]);

  // Cart Actions (Color + Size aware with stock enforcement)
  const addToCart = useCallback(
    (
      productId: string,
      colorId: string,
      size: ProductSize,
      quantity = 1,
      openDrawer = true
    ) => {
      const product = productsMap.get(productId);
      if (!product) return;
      const color = product.colors.find((c) => c.id === colorId) || product.colors[0];
      if (!color) return;

      const availableStock = color.stockBySize[size] ?? 0;
      if (availableStock <= 0) {
        showToast(`${color.colorName} in size ${size} is currently out of stock.`);
        return;
      }

      setCart((prev) => {
        const existingIndex = prev.findIndex(
          (item) =>
            item.productId === productId && item.colorId === color.id && item.size === size
        );
        if (existingIndex >= 0) {
          const currentQty = prev[existingIndex].quantity;
          const nextQty = Math.min(availableStock, currentQty + quantity);
          const updated = [...prev];
          updated[existingIndex] = { ...updated[existingIndex], quantity: nextQty };
          return updated;
        }
        return [
          ...prev,
          {
            productId,
            colorId: color.id,
            colorName: color.colorName,
            size,
            quantity: Math.min(availableStock, quantity),
          },
        ];
      });

      showToast(`${product.name} (${color.colorName} · ${size}) added to bag`);
      if (openDrawer) setCartOpen(true);
    },
    [productsMap, showToast]
  );

  const updateCartQuantity = useCallback(
    (productId: string, colorId: string, size: ProductSize, quantity: number) => {
      if (quantity <= 0) {
        setCart((prev) =>
          prev.filter(
            (item) =>
              !(item.productId === productId && item.colorId === colorId && item.size === size)
          )
        );
        return;
      }

      const product = productsMap.get(productId);
      const color = product?.colors.find((c) => c.id === colorId);
      const maxStock = color ? color.stockBySize[size] ?? quantity : quantity;
      const clampedQty = Math.min(maxStock, quantity);

      setCart((prev) =>
        prev.map((item) =>
          item.productId === productId && item.colorId === colorId && item.size === size
            ? { ...item, quantity: clampedQty }
            : item
        )
      );
    },
    [productsMap]
  );

  const removeFromCart = useCallback(
    (productId: string, colorId: string, size: ProductSize) => {
      setCart((prev) =>
        prev.filter(
          (item) =>
            !(item.productId === productId && item.colorId === colorId && item.size === size)
        )
      );
    },
    []
  );

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback(
    (productId: string) => {
      const product = productsMap.get(productId);
      setWishlist((prev) => {
        const exists = prev.includes(productId);
        if (exists) {
          showToast(product ? `Removed ${product.name} from wishlist` : 'Removed from wishlist');
          return prev.filter((id) => id !== productId);
        }
        showToast(product ? `Saved ${product.name} to wishlist` : 'Saved to wishlist');
        return [productId, ...prev];
      });
    },
    [productsMap, showToast]
  );

  const isWishlisted = useCallback((productId: string) => wishlist.includes(productId), [wishlist]);

  const recordProductView = useCallback((productId: string) => {
    setRecentlyViewedIds((prev) =>
      [productId, ...prev.filter((id) => id !== productId)].slice(0, 8)
    );
  }, []);

  const getProductReviews = useCallback(
    (productId: string) => reviews.filter((r) => r.productId === productId),
    [reviews]
  );

  const submitReview = useCallback(
    (productId: string, reviewerName: string, rating: number, comment: string) => {
      const next: CustomerReview = {
        id: `rev-${Date.now()}`,
        productId,
        reviewerName: reviewerName.trim(),
        rating: Math.max(1, Math.min(5, rating)),
        comment: comment.trim(),
        createdAt: new Date().toISOString(),
      };
      setReviews((prev) => [next, ...prev]);
      showToast('Thank you for sharing your review.');
    },
    [showToast]
  );

  const deleteReview = useCallback((reviewId: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
  }, []);

  const pricingSummary = useMemo(
    () => calculateBundlePricing(cart, productsMap),
    [cart, productsMap]
  );

  const logOrderRequest = useCallback(
    (
      customer: OrderCustomerDetails,
      items: OrderRecord['items'],
      pricing: OrderRecord['pricing'],
      source: OrderRecord['source']
    ): OrderRecord => {
      const record: OrderRecord = {
        orderId: `ME-${Math.floor(100000 + Math.random() * 900000)}`,
        createdAt: new Date().toISOString(),
        source,
        dispatchStatus: 'Pending Confirmation',
        customer,
        items,
        pricing,
      };
      setOrders((prev) => [record, ...prev]);
      return record;
    },
    []
  );

  const updateOrderDispatchStatus = useCallback((orderId: string, status: DispatchStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, dispatchStatus: status } : o))
    );
  }, []);

  const value: StoreContextValue = {
    route,
    canGoBack,
    navigate,
    goBack,
    isMenuOpen,
    setMenuOpen,
    isSearchOpen,
    setSearchOpen,
    isWishlistOpen,
    setWishlistOpen,
    isCartOpen,
    setCartOpen,
    products,
    productsMap,
    siteConfig,
    updateSiteConfig,
    updateProduct,
    addProduct,
    deleteProduct,
    updateVariantStock,
    resetStorefrontDefaults,
    cart,
    pricingSummary,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    wishlist,
    toggleWishlist,
    isWishlisted,
    recentlyViewedIds,
    recordProductView,
    reviews,
    getProductReviews,
    submitReview,
    deleteReview,
    orders,
    logOrderRequest,
    updateOrderDispatchStatus,
    toastMessage,
    showToast,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
