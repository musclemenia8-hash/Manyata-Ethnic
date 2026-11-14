import React, { useEffect, useMemo, useState } from 'react';
import {
  Check,
  Heart,
  MessageCircle,
  Minus,
  Package,
  Plus,
  RefreshCwOff,
  Ruler,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
  X,
  ZoomIn,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ALL_PRODUCT_SIZES, ProductSize, SIZE_DETAILS } from '../../types';
import { calculateUnitsOfferTotal, formatINR } from '../../utils/pricing';
import { ProductCard } from '../ProductCard';

interface ProductDetailViewProps {
  productId: string;
  initialColorId?: string;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  productId,
  initialColorId,
}) => {
  const {
    products,
    productsMap,
    siteConfig,
    navigate,
    addToCart,
    toggleWishlist,
    isWishlisted,
    recordProductView,
    recentlyViewedIds,
    getProductReviews,
    submitReview,
    logOrderRequest,
  } = useStore();

  const product = productsMap.get(productId) || products[0];

  const [selectedColorId, setSelectedColorId] = useState<string>(
    initialColorId || product?.colors[0]?.id || ''
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<ProductSize>('M');
  const [quantity, setQuantity] = useState(1);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // WhatsApp Direct Buy Now Modal state
  const [isBuyNowModalOpen, setIsBuyNowModalOpen] = useState(false);
  const [buyerName, setBuyerName] = useState('');
  const [pendingOrderRef, setPendingOrderRef] = useState<string | null>(null);

  // Genuine Customer Review submission state
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    if (!product) return;
    const targetColor =
      product.colors.find((c) => c.id === initialColorId) || product.colors[0];
    setSelectedColorId(targetColor?.id || '');
    setActiveImageIndex(0);
    setQuantity(1);
    setPendingOrderRef(null);
    setIsBuyNowModalOpen(false);
    recordProductView(product.id);
  }, [product, initialColorId, recordProductView]);

  const activeColor = useMemo(() => {
    if (!product) return undefined;
    return product.colors.find((c) => c.id === selectedColorId) || product.colors[0];
  }, [product, selectedColorId]);

  // Ensure selected size picks an in-stock size if current size is out of stock on this colour
  useEffect(() => {
    if (!activeColor) return;
    const currentStock = activeColor.stockBySize[selectedSize] ?? 0;
    if (currentStock <= 0) {
      const firstAvailable = ALL_PRODUCT_SIZES.find(
        (sz) => (activeColor.stockBySize[sz] ?? 0) > 0
      );
      if (firstAvailable) {
        setSelectedSize(firstAvailable);
      }
    }
    setQuantity(1);
  }, [activeColor, selectedSize]);

  if (!product || !activeColor) {
    return null;
  }

  const activeStock = activeColor.stockBySize[selectedSize] ?? 0;
  const anySizeInStock = ALL_PRODUCT_SIZES.some((sz) => (activeColor.stockBySize[sz] ?? 0) > 0);
  const saved = isWishlisted(product.id);
  const productReviews = getProductReviews(product.id);

  // Quantity-aware price preview
  const unitPrice = product.price;
  const regularLineTotal = unitPrice * quantity;
  const offerCalc = calculateUnitsOfferTotal(quantity);
  const totalPayable = Math.min(regularLineTotal, offerCalc.bundleTotal);

  const productUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/?product=${encodeURIComponent(product.id)}&color=${encodeURIComponent(activeColor.id)}`
      : '';
  const primaryImageSrc = activeColor.images[0] || '';
  const imageFullUrl =
    typeof window !== 'undefined' && primaryImageSrc.startsWith('/')
      ? `${window.location.origin}${primaryImageSrc}`
      : primaryImageSrc;

  const whatsappBuyMessage = [
    `Hello ${siteConfig.brandName}, I would like to place an order:`,
    buyerName.trim() ? `Customer Name: ${buyerName.trim()}` : null,
    `Product: ${product.name}`,
    `SKU: ${product.sku}`,
    `Selected Colour: ${activeColor.colorName}`,
    `Selected Size: ${selectedSize} (${SIZE_DETAILS[selectedSize].fullName})`,
    `Quantity: ${quantity}`,
    `Unit Price: ${formatINR(unitPrice)}`,
    `Estimated Total: ${formatINR(totalPayable)}`,
    imageFullUrl ? `Product Image: ${imageFullUrl}` : null,
    productUrl ? `Page Link: ${productUrl}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  const whatsappHref = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    whatsappBuyMessage
  )}`;

  // Grounded catalog recommendations
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  const similarProducts = products
    .filter(
      (p) =>
        p.id !== product.id &&
        !relatedProducts.some((r) => r.id === p.id) &&
        (p.colors.some((c) => c.colorFamily === activeColor.colorFamily) ||
          p.silhouette === product.silhouette)
    )
    .slice(0, 4);

  const youMayAlsoLike = products
    .filter(
      (p) =>
        p.id !== product.id &&
        !relatedProducts.some((r) => r.id === p.id) &&
        !similarProducts.some((s) => s.id === p.id)
    )
    .slice(0, 4);

  const recentlyViewedProducts = recentlyViewedIds
    .filter((id) => id !== product.id)
    .map((id) => productsMap.get(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 4);

  const handleLogWhatsAppBuyNow = () => {
    const record = logOrderRequest(
      {
        fullName: buyerName.trim() || 'WhatsApp Direct Customer',
        mobile: siteConfig.whatsappDisplay,
        address: 'Shared via WhatsApp Direct Concierge',
        city: 'Pending WhatsApp Chat',
        state: 'India',
        pinCode: '000000',
      },
      [
        {
          productId: product.id,
          sku: product.sku,
          name: product.name,
          colorName: activeColor.colorName,
          size: selectedSize,
          quantity,
          unitPrice,
          image: primaryImageSrc,
        },
      ],
      {
        totalUnits: quantity,
        regularTotal: regularLineTotal,
        finalTotal: totalPayable,
        savings: Math.max(0, regularLineTotal - totalPayable),
        appliedBreakdown: offerCalc.breakdown,
      },
      'Direct Buy Now WhatsApp'
    );
    setPendingOrderRef(record.orderId);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) return;
    submitReview(product.id, reviewerName, reviewRating, reviewComment);
    setReviewerName('');
    setReviewRating(5);
    setReviewComment('');
  };

  return (
    <div className="bg-luxury-silk py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 font-sans text-xs font-medium text-[#594238]">
          <button
            type="button"
            onClick={() => navigate({ page: 'home' })}
            className="hover:text-[#241915]"
          >
            Home
          </button>
          <span>/</span>
          <button
            type="button"
            onClick={() => navigate({ page: 'category', slug: product.category })}
            className="hover:text-[#241915]"
          >
            {product.categoryLabel}
          </button>
          <span>/</span>
          <span className="font-semibold text-[#241915]">{product.name}</span>
        </nav>

        {/* Main PDP Two-Column Layout */}
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left: Gallery + Thumbnails + Zoom */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-[#D4BC96] bg-[#E8D8BD] shadow-xs">
              <img
                src={activeColor.images[activeImageIndex] || activeColor.images[0]}
                alt={`${product.name} - ${activeColor.colorName} view ${activeImageIndex + 1}`}
                referrerPolicy="no-referrer"
                className="photo-graded h-full w-full cursor-zoom-in object-cover object-top"
                onClick={() => setIsZoomOpen(true)}
              />
              <button
                type="button"
                onClick={() => setIsZoomOpen(true)}
                aria-label="Zoom Product Image"
                className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full border border-[#D4BC96] bg-[#FAF3E8]/95 px-3 py-1.5 text-[11px] font-semibold text-[#241915] backdrop-blur-xs hover:bg-[#E8D8BD]"
              >
                <ZoomIn className="h-3.5 w-3.5 text-[#B18A58]" />
                Zoom
              </button>
            </div>

            {activeColor.images.length > 1 && (
              <div className="mt-3 flex flex-wrap gap-3">
                {activeColor.images.map((imgSrc, idx) => (
                  <button
                    key={`${imgSrc}-${idx}`}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`h-22 w-18 overflow-hidden rounded-lg border transition-all ${
                      idx === activeImageIndex
                        ? 'border-[#241915] ring-2 ring-[#B18A58]/60'
                        : 'border-[#D4BC96] opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgSrc}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover object-top"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Core Information, Genuine Colour Swatches (when >1), 5-Size Selector (XS-XL), Actions, Myntra-inspired Dark Clean Product Details */}
          <div className="lg:col-span-6">
            <div className="border-b border-[#D4BC96] pb-5">
              <p className="tabular-nums font-sans text-xs font-bold uppercase tracking-[0.14em] text-[#7D5B30]">
                SKU: {product.sku} · {product.categoryLabel}
              </p>
              <h1 className="mt-2 [text-wrap:balance] font-serif text-3xl font-bold leading-tight text-[#241915] sm:text-4xl">
                {product.name}
              </h1>

              <div className="mt-4 flex flex-wrap items-baseline gap-3">
                <span className="tabular-nums font-sans text-2xl font-bold text-[#241915] sm:text-3xl">
                  {formatINR(product.price)}
                </span>
                <span className="font-sans text-xs font-semibold text-[#3D2E27] sm:text-[13px]">
                  {activeStock > 0
                    ? `In Stock (${activeStock} in ${selectedSize}) · Dispatch in 3–4 Days`
                    : anySizeInStock
                    ? 'Select another in-stock size'
                    : 'Out of Stock in this colour'}
                </span>
              </div>

              {/* Bundle Offer Callout */}
              <div className="bg-luxury-card mt-4 rounded-lg border border-[#B18A58]/55 p-3.5">
                <p className="font-sans text-xs font-bold uppercase tracking-[0.1em] text-[#241915]">
                  Eligible for Manyata Special Bundle Offer
                </p>
                <p className="tabular-nums mt-1 font-sans text-[13px] font-medium text-[#3B2C25]">
                  1 Dress ₹699 · 2 Dresses ₹1,299 · 3 Dresses ₹1,699 · 5 Dresses ₹2,499
                </p>
              </div>
            </div>

            {/* Interactive Colour Selector: ONLY displayed when genuinely available in multiple colours */}
            {product.colors.length > 1 && (
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-xs font-bold uppercase tracking-[0.1em] text-[#241915]">
                    More Colours ({product.colors.length}):{' '}
                    <span className="font-semibold text-[#7D5B30]">{activeColor.colorName}</span>
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2.5">
                  {product.colors.map((color) => {
                    const isSelected = color.id === activeColor.id;
                    const colorHasStock = ALL_PRODUCT_SIZES.some(
                      (sz) => (color.stockBySize[sz] ?? 0) > 0
                    );
                    return (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() => {
                          setSelectedColorId(color.id);
                          setActiveImageIndex(0);
                        }}
                        className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 font-sans text-xs font-semibold transition-all ${
                          isSelected
                            ? 'border-[#241915] bg-[#241915] text-[#FAF3E8]'
                            : 'border-[#D4BC96] bg-[#FAF3E8]/80 text-[#241915] hover:border-[#B18A58]'
                        } ${!colorHasStock ? 'opacity-55' : ''}`}
                      >
                        <span
                          className="h-4 w-4 rounded-full border border-[#FAF3E8]/70"
                          style={{ backgroundColor: color.swatchHex }}
                        />
                        <span>{color.colorName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Strictly Supported 5 Sizes: XS, S, M, L, XL */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-bold uppercase tracking-[0.1em] text-[#241915] sm:text-[13px]">
                  Select Size:{' '}
                  <span className="font-semibold text-[#7D5B30]">
                    {selectedSize} ({SIZE_DETAILS[selectedSize].fullName})
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowSizeGuide((v) => !v)}
                  className="inline-flex items-center gap-1 font-sans text-xs font-bold uppercase tracking-wider text-[#241915] underline decoration-[#B18A58] underline-offset-4 hover:text-[#7D5B30]"
                >
                  <Ruler className="h-3.5 w-3.5" />
                  Size Chart
                </button>
              </div>

              <div className="mt-3 grid grid-cols-5 gap-2">
                {ALL_PRODUCT_SIZES.map((sz) => {
                  const stockCount = activeColor.stockBySize[sz] ?? 0;
                  const available = stockCount > 0;
                  const active = selectedSize === sz;
                  return (
                    <button
                      key={sz}
                      type="button"
                      disabled={!available}
                      onClick={() => available && setSelectedSize(sz)}
                      className={`flex flex-col items-center justify-center rounded-lg border py-2.5 font-sans transition-all ${
                        !available
                          ? 'cursor-not-allowed border-[#D4BC96]/60 bg-[#EFE3D0]/45 text-[#796454]/50 line-through'
                          : active
                          ? 'border-[#241915] bg-[#241915] text-[#FAF3E8] shadow-xs'
                          : 'border-[#D4BC96] bg-[#FAF3E8]/85 text-[#241915] hover:border-[#B18A58]'
                      }`}
                    >
                      <span className="text-sm font-bold">{sz}</span>
                      <span
                        className={`mt-0.5 text-[11px] font-medium ${
                          active ? 'text-[#E8D8BD]' : 'text-[#4A3830]'
                        }`}
                      >
                        {available ? `${stockCount} left` : 'Out'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {showSizeGuide && (
                <div className="bg-luxury-card mt-3 rounded-lg border border-[#D4BC96] p-4 font-sans text-xs text-[#241915]">
                  <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.08em] text-[#241915]">
                    Size Information & Garment Measurements (XS to XL)
                  </p>
                  <div className="grid grid-cols-2 gap-3 border-t border-[#D4BC96] pt-3 sm:grid-cols-5">
                    {ALL_PRODUCT_SIZES.map((sz) => (
                      <div key={sz}>
                        <p className="font-bold text-[#241915]">
                          {sz} · {SIZE_DETAILS[sz].fullName}
                        </p>
                        <p className="tabular-nums mt-0.5 text-[#3B2C25]">
                          Bust: {SIZE_DETAILS[sz].bust}
                        </p>
                        <p className="tabular-nums text-[#3B2C25]">
                          Waist: {SIZE_DETAILS[sz].waist}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quantity Picker */}
            <div className="mt-5 flex items-center gap-4">
              <span className="font-sans text-xs font-bold uppercase tracking-[0.1em] text-[#241915]">
                Quantity
              </span>
              <div className="inline-flex items-center rounded-md border border-[#D4BC96] bg-[#FAF3E8]/90">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || activeStock <= 0}
                  aria-label="Decrease Quantity"
                  className="px-3 py-2 text-[#241915] disabled:opacity-40"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="tabular-nums min-w-8 text-center font-sans text-sm font-bold text-[#241915]">
                  {activeStock <= 0 ? 0 : quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(activeStock, q + 1))}
                  disabled={quantity >= activeStock || activeStock <= 0}
                  aria-label="Increase Quantity"
                  className="px-3 py-2 text-[#241915] disabled:opacity-40"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              {quantity > 1 && totalPayable < regularLineTotal && (
                <span className="tabular-nums font-sans text-xs font-bold text-[#7D5B30]">
                  Bundle Price: {formatINR(totalPayable)}
                </span>
              )}
            </div>

            {/* Primary CTA Buttons */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                disabled={activeStock <= 0}
                onClick={() => addToCart(product.id, activeColor.id, selectedSize, quantity, true)}
                className="flex flex-1 items-center justify-center gap-2 rounded-md border border-[#594238] bg-[#594238] py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#FAF3E8] transition-colors hover:bg-[#46332B] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingBag className="h-4 w-4" />
                Add to Bag
              </button>

              <button
                type="button"
                disabled={activeStock <= 0}
                onClick={() => {
                  setPendingOrderRef(null);
                  setIsBuyNowModalOpen(true);
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-md bg-[#B18A58] py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#FAF3E8] transition-colors hover:bg-[#967141] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <MessageCircle className="h-4 w-4" />
                Buy Now · WhatsApp
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-label="Toggle Wishlist"
                className="flex items-center justify-center gap-2 rounded-md border border-[#D4BC96] bg-[#FAF3E8]/85 px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#241915] hover:border-[#B18A58]"
              >
                <Heart
                  className="h-4 w-4"
                  fill={saved ? '#B18A58' : 'none'}
                  stroke={saved ? '#B18A58' : 'currentColor'}
                />
                <span className="sm:hidden">{saved ? 'Saved' : 'Wishlist'}</span>
              </button>
            </div>

            {/* Trust Features Strip (Exact Boutique Policies) */}
            <div className="bg-luxury-card mt-7 grid grid-cols-2 gap-3 rounded-xl border border-[#D4BC96] p-4 font-sans sm:grid-cols-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#241915]">
                <RefreshCwOff className="h-4 w-4 shrink-0 text-[#967141]" />
                <span>NO RETURN</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#241915]">
                <ShieldCheck className="h-4 w-4 shrink-0 text-[#967141]" />
                <span>NO EXCHANGE</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#241915]">
                <Package className="h-4 w-4 shrink-0 text-[#967141]" />
                <span className="tabular-nums">DISPATCH IN 3–4 DAYS</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#241915]">
                <Check className="h-4 w-4 shrink-0 text-[#967141]" />
                <span className="tabular-nums">8000+ DELIVERIES</span>
              </div>
              <div className="col-span-2 flex items-center gap-2 text-xs font-bold text-[#241915] sm:col-span-2">
                <Truck className="h-4 w-4 shrink-0 text-[#967141]" />
                <span>ALL INDIA DELIVERY</span>
              </div>
            </div>

            {/* Product Description & Specifications (Myntra-inspired Dark, Clean & Highly Readable Typography) */}
            <div className="mt-8 space-y-6 border-t border-[#D4BC96] pt-7 font-sans">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-[0.08em] text-[#241915] sm:text-[15px]">
                  Product Details
                </h2>
                <p className="mt-2.5 text-[15px] font-normal leading-[1.7] text-[#2F221D] sm:text-base">
                  {product.description}
                </p>
              </div>

              {/* Clean Specification Matrix */}
              <div className="border-t border-[#D4BC96]/80 pt-5">
                <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-[#241915] sm:text-[13px]">
                  Specifications & Care Information
                </h3>
                <dl className="mt-3.5 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                  <div className="border-b border-[#D4BC96]/70 pb-3">
                    <dt className="text-xs font-semibold text-[#594238]">Colour Shade</dt>
                    <dd className="mt-1 text-[14px] font-semibold text-[#241915] sm:text-[15px]">
                      {activeColor.colorName}
                    </dd>
                  </div>
                  <div className="border-b border-[#D4BC96]/70 pb-3">
                    <dt className="text-xs font-semibold text-[#594238]">Silhouette</dt>
                    <dd className="mt-1 text-[14px] font-semibold text-[#241915] sm:text-[15px]">
                      {product.silhouette}
                    </dd>
                  </div>
                  <div className="border-b border-[#D4BC96]/70 pb-3">
                    <dt className="text-xs font-semibold text-[#594238]">Work & Detailing</dt>
                    <dd className="mt-1 text-[14px] font-semibold leading-snug text-[#241915] sm:text-[15px]">
                      {product.detailing}
                    </dd>
                  </div>
                  <div className="border-b border-[#D4BC96]/70 pb-3">
                    <dt className="text-xs font-semibold text-[#594238]">Set Includes</dt>
                    <dd className="mt-1 text-[14px] font-semibold leading-snug text-[#241915] sm:text-[15px]">
                      {product.setIncludes}
                    </dd>
                  </div>
                  <div className="border-b border-[#D4BC96]/70 pb-3 sm:col-span-2">
                    <dt className="text-xs font-semibold text-[#594238]">Occasion</dt>
                    <dd className="mt-1 text-[14px] font-semibold text-[#241915] sm:text-[15px]">
                      {product.occasion}
                    </dd>
                  </div>
                  <div className="border-b border-[#D4BC96]/70 pb-3 sm:col-span-2">
                    <dt className="text-xs font-semibold text-[#594238]">
                      Size & Fit Information
                    </dt>
                    <dd className="mt-1 text-[14px] font-medium leading-relaxed text-[#2F221D] sm:text-[15px]">
                      Available in sizes XS (34&Prime; Bust), S (36&Prime; Bust), M (38&Prime; Bust),
                      L (40&Prime; Bust), and XL (42&Prime; Bust). Select your exact size above before ordering.
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Genuine Customer Reviews Section */}
        <section className="mt-16 border-t border-[#DCC8AC] pt-12">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#967141]">
                Customer Feedback
              </p>
              <h2 className="mt-1.5 font-serif text-3xl font-semibold text-[#594238]">
                Reviews & Ratings
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-[#796454]">
                Share your fit experience and styling feedback for {product.name}.
              </p>

              <form
                onSubmit={handleReviewSubmit}
                className="mt-6 space-y-4 rounded-xl border border-[#DCC8AC] bg-[#EFE3D0]/80 p-5"
              >
                <div>
                  <label className="block text-xs font-semibold text-[#594238]">
                    Your Name
                    <input
                      type="text"
                      required
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      placeholder="e.g., Ananya Sharma"
                      className="mt-1.5 w-full rounded-md border border-[#DCC8AC] bg-[#F5EBDD] px-3.5 py-2.5 text-xs text-[#594238] focus:border-[#B18A58] focus:outline-none"
                    />
                  </label>
                </div>

                <div>
                  <span className="block text-xs font-semibold text-[#594238]">Rating</span>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                        className="p-1"
                      >
                        <Star
                          className="h-5 w-5"
                          fill={star <= reviewRating ? '#B18A58' : 'none'}
                          stroke={star <= reviewRating ? '#B18A58' : '#796454'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#594238]">
                    Your Review
                    <textarea
                      rows={3}
                      required
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Tell us about comfort, fit (XS–XL), and colour..."
                      className="mt-1.5 w-full rounded-md border border-[#DCC8AC] bg-[#F5EBDD] px-3.5 py-2.5 text-xs text-[#594238] focus:border-[#B18A58] focus:outline-none"
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-md bg-[#594238] py-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#F5EBDD] hover:bg-[#46332B]"
                >
                  Submit Review
                </button>
              </form>
            </div>

            <div className="lg:col-span-7">
              {productReviews.length === 0 ? (
                <div className="flex h-full min-h-[220px] flex-col items-center justify-center rounded-xl border border-[#DCC8AC] bg-[#EFE3D0]/50 p-8 text-center">
                  <Star className="h-7 w-7 text-[#B18A58]" />
                  <p className="mt-3 font-serif text-2xl font-medium text-[#594238]">
                    No written reviews for this piece yet
                  </p>
                  <p className="mt-1.5 max-w-sm text-xs text-[#796454]">
                    Be the first customer to review {product.name} using the form beside.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {productReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="rounded-xl border border-[#DCC8AC] bg-[#EFE3D0]/65 p-5"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-[#594238]">{rev.reviewerName}</p>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className="h-3.5 w-3.5"
                              fill={s <= rev.rating ? '#B18A58' : 'none'}
                              stroke="#B18A58"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-[#594238]">{rev.comment}</p>
                      <p className="mt-2 text-[10px] uppercase tracking-wider text-[#796454]">
                        {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 border-t border-[#DCC8AC] pt-12">
            <h2 className="mb-6 font-serif text-2xl font-semibold text-[#594238] sm:text-3xl">
              Related Products
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* Similar Styles */}
        {similarProducts.length > 0 && (
          <section className="mt-14 border-t border-[#DCC8AC] pt-12">
            <h2 className="mb-6 font-serif text-2xl font-semibold text-[#594238] sm:text-3xl">
              Similar Colours & Silhouettes
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {similarProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* You May Also Like */}
        {youMayAlsoLike.length > 0 && (
          <section className="mt-14 border-t border-[#DCC8AC] pt-12">
            <h2 className="mb-6 font-serif text-2xl font-semibold text-[#594238] sm:text-3xl">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {youMayAlsoLike.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* Recently Viewed */}
        {recentlyViewedProducts.length > 0 && (
          <section className="mt-14 border-t border-[#DCC8AC] pt-12">
            <h2 className="mb-6 font-serif text-2xl font-semibold text-[#594238] sm:text-3xl">
              Recently Viewed
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {recentlyViewedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Direct WhatsApp Buy Now Modal */}
      {isBuyNowModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#3F2D25]/65 p-4 backdrop-blur-xs"
          onClick={() => setIsBuyNowModalOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-xl border border-[#B18A58]/60 bg-[#F5EBDD] p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-[#DCC8AC] pb-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#967141]">
                  Direct WhatsApp Ordering · {siteConfig.whatsappDisplay}
                </p>
                <h2 className="mt-1 font-serif text-2xl font-semibold text-[#594238]">
                  Review Your Order Message
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsBuyNowModalOpen(false)}
                aria-label="Close Buy Now Dialog"
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#594238] hover:bg-[#E8D8BD]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-3 rounded-lg border border-[#DCC8AC] bg-[#EFE3D0] p-3">
                <img
                  src={primaryImageSrc}
                  alt={product.name}
                  className="h-18 w-14 shrink-0 rounded object-cover object-top"
                />
                <div className="min-w-0 flex-1 text-xs">
                  <p className="truncate font-serif text-base font-semibold text-[#594238]">
                    {product.name}
                  </p>
                  <p className="tabular-nums text-[#796454]">
                    {product.sku} · {activeColor.colorName} · Size {selectedSize} · Qty {quantity}
                  </p>
                  <p className="tabular-nums mt-0.5 font-semibold text-[#594238]">
                    Total Estimate: {formatINR(totalPayable)}
                  </p>
                </div>
              </div>

              <label className="block text-xs font-semibold text-[#594238]">
                Your Name (Optional)
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="Enter your name for the WhatsApp greeting"
                  className="mt-1.5 w-full rounded-md border border-[#DCC8AC] bg-[#F9F2E7] px-3.5 py-2.5 text-sm text-[#594238] focus:border-[#B18A58] focus:outline-none"
                />
              </label>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#796454]">
                  Pre-Formatted WhatsApp Message Preview
                </p>
                <pre className="mt-1.5 max-h-40 overflow-y-auto whitespace-pre-wrap rounded-lg border border-[#DCC8AC] bg-[#EFE3D0]/80 p-3 font-sans text-xs leading-relaxed text-[#594238]">
                  {whatsappBuyMessage}
                </pre>
              </div>

              {/* Honest confirmation policy notice */}
              <div className="rounded-lg border border-[#B18A58]/45 bg-[#E8D8BD]/70 p-3 text-[11px] leading-relaxed text-[#594238]">
                <strong>Please note:</strong> Your order is <strong>not placed or confirmed</strong>{' '}
                until you send this message on WhatsApp and our team confirms availability &
                dispatch with you. No Return · No Exchange applies on all confirmed orders.
              </div>

              {pendingOrderRef && (
                <div className="rounded-lg border border-[#B18A58] bg-[#EFE3D0] p-3 text-xs text-[#594238]">
                  <p className="font-semibold">
                    WhatsApp Draft Opened (Reference: {pendingOrderRef})
                  </p>
                  <p className="mt-0.5 text-[#796454]">
                    Complete sending the message in WhatsApp so our boutique team can confirm your order.
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-2.5 pt-1 sm:flex-row">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleLogWhatsAppBuyNow}
                  className="flex flex-1 items-center justify-center gap-2 rounded-md bg-[#594238] py-3.5 text-center text-xs font-semibold uppercase tracking-[0.15em] text-[#F5EBDD] transition-colors hover:bg-[#46332B]"
                >
                  <MessageCircle className="h-4 w-4 text-[#E8D8BD]" />
                  Open WhatsApp & Send Order
                </a>
                <button
                  type="button"
                  onClick={() => setIsBuyNowModalOpen(false)}
                  className="rounded-md border border-[#DCC8AC] bg-[#EFE3D0] px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#594238] hover:border-[#B18A58]"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Image Zoom Modal */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#3F2D25]/85 p-4 backdrop-blur-xs"
          onClick={() => setIsZoomOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsZoomOpen(false)}
            aria-label="Close Zoom"
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#F5EBDD] text-[#594238]"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={activeColor.images[activeImageIndex] || activeColor.images[0]}
            alt={product.name}
            className="max-h-[90vh] max-w-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};
