import React, { useMemo, useState } from 'react';
import {
  Check,
  Lock,
  LogOut,
  Package,
  Plus,
  RotateCcw,
  Search,
  Star,
  Trash2,
} from 'lucide-react';
import { CATEGORIES, COLOR_FAMILIES } from '../../data/products';
import { useStore } from '../../context/StoreContext';
import {
  ALL_PRODUCT_SIZES,
  CategorySlug,
  DispatchStatus,
  FaqItem,
  Product,
  ProductColorVariant,
  ProductSize,
} from '../../types';
import { formatINR } from '../../utils/pricing';

type AdminTab = 'products' | 'orders' | 'media' | 'content';

const DISPATCH_STATUSES: DispatchStatus[] = [
  'Pending Confirmation',
  'Confirmed',
  'Packed',
  'Dispatched (3-4 Days)',
  'Delivered',
];

function toDatetimeLocalValue(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export const AdminView: React.FC = () => {
  const {
    products,
    siteConfig,
    orders,
    reviews,
    updateSiteConfig,
    updateProduct,
    addProduct,
    deleteProduct,
    updateVariantStock,
    updateOrderDispatchStatus,
    deleteReview,
    resetStorefrontDefaults,
    showToast,
  } = useStore();

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>('products');

  // Products & Inventory tab state
  const [productQuery, setProductQuery] = useState('');
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [showAddProductForm, setShowAddProductForm] = useState(false);

  // Add Product form state
  const [newSku, setNewSku] = useState('');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<CategorySlug>('anarkali-kurtis');
  const [newPrice, setNewPrice] = useState('699');
  const [newSilhouette, setNewSilhouette] = useState('Flared Anarkali Kurti');
  const [newDetailing, setNewDetailing] = useState('Fine border detailing');
  const [newSetIncludes, setNewSetIncludes] = useState('Kurti & Dupatta');
  const [newOccasion, setNewOccasion] = useState('Festive & Daily Wear');
  const [newDescription, setNewDescription] = useState('');
  const [newIsArrival, setNewIsArrival] = useState(true);
  const [newIsBestSeller, setNewIsBestSeller] = useState(false);
  const [newColorName, setNewColorName] = useState('');
  const [newColorFamily, setNewColorFamily] = useState('Red');
  const [newSwatchHex, setNewSwatchHex] = useState('#8C1D24');
  const [newImageUrl, setNewImageUrl] = useState(
    '/assets/aistudio/IMG-20261107-WA0027_f0c40cf3.jpg'
  );
  const [newStock, setNewStock] = useState<Record<ProductSize, number>>({
    XS: 5,
    S: 8,
    M: 10,
    L: 10,
    XL: 6,
  });

  // Orders filter
  const [orderStatusFilter, setOrderStatusFilter] = useState<'All' | DispatchStatus>('All');

  // Media & Offers local state
  const [bannerText, setBannerText] = useState(siteConfig.discountBannerText);
  const [expiryInput, setExpiryInput] = useState(toDatetimeLocalValue(siteConfig.offerExpiryIso));
  const [heroV1, setHeroV1] = useState(siteConfig.heroVideoOne);
  const [heroV2, setHeroV2] = useState(siteConfig.heroVideoTwo);
  const [storyVideo, setStoryVideo] = useState(siteConfig.fashionStoryVideo);
  const [editorialImg, setEditorialImg] = useState(siteConfig.editorialBannerImage);
  const [editorialHeadline, setEditorialHeadline] = useState(siteConfig.editorialHeadline);
  const [editorialBody, setEditorialBody] = useState(siteConfig.editorialBody);

  // Content, Policies & Brand local state
  const [brandName, setBrandName] = useState(siteConfig.brandName);
  const [tagline, setTagline] = useState(siteConfig.tagline);
  const [whatsappNum, setWhatsappNum] = useState(siteConfig.whatsappNumber);
  const [whatsappDisp, setWhatsappDisp] = useState(siteConfig.whatsappDisplay);
  const [igHandle, setIgHandle] = useState(siteConfig.instagramHandle);
  const [fbPage, setFbPage] = useState(siteConfig.facebookPage);
  const [adminPassInput, setAdminPassInput] = useState(siteConfig.adminPasscode);
  const [termsText, setTermsText] = useState(siteConfig.policies.terms.join('\n\n'));
  const [noReturnText, setNoReturnText] = useState(siteConfig.policies.noReturn.join('\n\n'));
  const [noExchangeText, setNoExchangeText] = useState(siteConfig.policies.noExchange.join('\n\n'));
  const [shippingText, setShippingText] = useState(siteConfig.policies.shipping.join('\n\n'));
  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);

  const filteredProducts = useMemo(() => {
    const q = productQuery.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q)
    );
  }, [productQuery, products]);

  const stats = useMemo(() => {
    let totalVariants = 0;
    let outOfStockVariants = 0;
    for (const p of products) {
      for (const c of p.colors) {
        totalVariants += 1;
        const anyLeft = ALL_PRODUCT_SIZES.some((sz) => (c.stockBySize[sz] ?? 0) > 0);
        if (!anyLeft) outOfStockVariants += 1;
      }
    }
    const pendingOrders = orders.filter((o) => o.dispatchStatus === 'Pending Confirmation').length;
    return {
      totalDesigns: products.length,
      totalVariants,
      outOfStockVariants,
      pendingOrders,
    };
  }, [orders, products]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeInput.trim() === siteConfig.adminPasscode) {
      setIsUnlocked(true);
      setAuthError(null);
      setPasscodeInput('');
    } else {
      setAuthError('Incorrect boutique admin passcode.');
    }
  };

  if (!isUnlocked) {
    return (
      <div className="bg-luxury-silk py-16 sm:py-24">
        <div className="mx-auto max-w-md px-4">
          <div className="bg-luxury-card rounded-xl border border-[#B18A58]/55 p-7 shadow-sm sm:p-9">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#B18A58] bg-[#E8D8BD]">
                <Lock className="h-5 w-5 text-[#594238]" />
              </div>
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#967141]">
                {siteConfig.brandName} · Store Management
              </p>
              <h1 className="mt-1.5 font-serif text-3xl font-semibold text-[#594238]">
                Admin Access
              </h1>
              <p className="mt-1.5 text-xs text-[#796454]">
                Enter the store passcode to manage catalog designs, colourways, XS–XL stock, offers,
                and WhatsApp order requests.
              </p>
            </div>

            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <label className="block text-xs font-semibold text-[#594238]">
                Admin Passcode
                <input
                  type="password"
                  required
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  placeholder="Enter passcode"
                  className="mt-1.5 w-full rounded-md border border-[#DCC8AC] bg-[#F5EBDD] px-3.5 py-2.5 text-sm text-[#594238] focus:border-[#B18A58] focus:outline-none"
                />
              </label>
              {authError && (
                <p className="rounded border border-[#9C3B30]/40 bg-[#9C3B30]/10 px-3 py-2 text-xs text-[#8C2B22]">
                  {authError}
                </p>
              )}
              <button
                type="submit"
                className="w-full rounded-md bg-[#594238] py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#F5EBDD] hover:bg-[#46332B]"
              >
                Unlock Admin Panel
              </button>
              <p className="text-center text-[11px] text-[#796454]">
                Default initial passcode: <span className="font-mono font-semibold">manyata2026</span>
              </p>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newSku.trim() || !newColorName.trim()) return;
    const catInfo = CATEGORIES.find((c) => c.slug === newCategory) || CATEGORIES[0];
    const id = `me-custom-${Date.now()}`;
    const created: Product = {
      id,
      sku: newSku.trim().toUpperCase(),
      name: newName.trim(),
      category: catInfo.slug,
      categoryLabel: catInfo.name,
      price: Math.max(1, Number(newPrice) || 699),
      silhouette: newSilhouette.trim(),
      detailing: newDetailing.trim(),
      setIncludes: newSetIncludes.trim(),
      occasion: newOccasion.trim(),
      description: newDescription.trim() || `${newName.trim()} crafted for timeless elegance.`,
      isNewArrival: newIsArrival,
      isBestSeller: newIsBestSeller,
      colors: [
        {
          id: `col-${Date.now()}`,
          colorName: newColorName.trim(),
          colorFamily: newColorFamily,
          swatchHex: newSwatchHex,
          dominantRgb: [177, 138, 88],
          images: [newImageUrl.trim()],
          stockBySize: { ...newStock },
        },
      ],
    };
    addProduct(created);
    setShowAddProductForm(false);
    setExpandedProductId(created.id);
    setNewSku('');
    setNewName('');
    setNewColorName('');
    setNewDescription('');
    showToast(`Added ${created.name} (${created.sku})`);
  };

  const handleAddColorVariant = (product: Product) => {
    const nextColor: ProductColorVariant = {
      id: `col-${Date.now()}`,
      colorName: 'New Colourway',
      colorFamily: 'Red',
      swatchHex: '#B18A58',
      dominantRgb: [177, 138, 88],
      images: [product.colors[0]?.images[0] || '/assets/aistudio/IMG-20261107-WA0027_f0c40cf3.jpg'],
      stockBySize: { XS: 4, S: 6, M: 8, L: 8, XL: 5 },
    };
    updateProduct({
      ...product,
      colors: [...product.colors, nextColor],
    });
    showToast(`Added new colour slot to ${product.name}`);
  };

  const handleSaveMediaAndOffers = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteConfig({
      discountBannerText: bannerText.trim(),
      offerExpiryIso: expiryInput ? new Date(expiryInput).toISOString() : '',
      heroVideoOne: heroV1.trim(),
      heroVideoTwo: heroV2.trim(),
      fashionStoryVideo: storyVideo.trim(),
      editorialBannerImage: editorialImg.trim(),
      editorialHeadline: editorialHeadline.trim(),
      editorialBody: editorialBody.trim(),
    });
    showToast('Offers, countdown, and editorial media updated live.');
  };

  const handleSavePoliciesAndBrand = (e: React.FormEvent) => {
    e.preventDefault();
    const splitParas = (txt: string) =>
      txt
        .split(/\n{2,}/)
        .map((s) => s.trim())
        .filter(Boolean);

    updateSiteConfig({
      brandName: brandName.trim() || 'Manyata Ethnic',
      tagline: tagline.trim() || 'Tradition Meet Modern Elegance',
      whatsappNumber: whatsappNum.replace(/\D/g, '') || '918209160383',
      whatsappDisplay: whatsappDisp.trim() || '82091 60383',
      instagramHandle: igHandle.trim() || '@manyataethnic',
      facebookPage: fbPage.trim() || 'Manyata Chikankari',
      adminPasscode: adminPassInput.trim() || 'manyata2026',
      policies: {
        terms: splitParas(termsText),
        noReturn: splitParas(noReturnText),
        noExchange: splitParas(noExchangeText),
        shipping: splitParas(shippingText),
      },
    });
    showToast('Brand profile and policies saved.');
  };

  const handleAddFaq = () => {
    if (!newFaqQuestion.trim() || !newFaqAnswer.trim()) return;
    const item: FaqItem = {
      id: `faq-${Date.now()}`,
      question: newFaqQuestion.trim(),
      answer: newFaqAnswer.trim(),
    };
    updateSiteConfig({ faqs: [...siteConfig.faqs, item] });
    setNewFaqQuestion('');
    setNewFaqAnswer('');
    showToast('Added new FAQ entry.');
  };

  const filteredOrders =
    orderStatusFilter === 'All'
      ? orders
      : orders.filter((o) => o.dispatchStatus === orderStatusFilter);

  return (
    <div className="bg-luxury-silk py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Bar */}
        <div className="flex flex-col justify-between gap-4 border-b border-[#D4B890]/80 pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8F693A]">
              {siteConfig.brandName} · Boutique Console
            </p>
            <h1 className="mt-1.5 font-serif text-3xl font-semibold text-[#241915] sm:text-4xl">
              Admin Management Panel
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setIsUnlocked(false)}
            className="inline-flex items-center gap-2 self-start rounded-md border border-[#DCC8AC] bg-[#EFE3D0] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#594238] hover:border-[#B18A58] sm:self-auto"
          >
            <LogOut className="h-3.5 w-3.5" />
            Lock Panel
          </button>
        </div>

        {/* Summary KPI Strip */}
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-xl border border-[#DCC8AC] bg-[#EFE3D0]/80 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#796454]">
              Catalog Designs
            </p>
            <p className="tabular-nums mt-1 font-serif text-3xl font-semibold text-[#594238]">
              {stats.totalDesigns}
            </p>
          </div>
          <div className="rounded-xl border border-[#DCC8AC] bg-[#EFE3D0]/80 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#796454]">
              Colour Variants
            </p>
            <p className="tabular-nums mt-1 font-serif text-3xl font-semibold text-[#594238]">
              {stats.totalVariants}
            </p>
          </div>
          <div className="rounded-xl border border-[#DCC8AC] bg-[#EFE3D0]/80 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#796454]">
              WhatsApp Requests
            </p>
            <p className="tabular-nums mt-1 font-serif text-3xl font-semibold text-[#594238]">
              {orders.length}
            </p>
          </div>
          <div className="rounded-xl border border-[#DCC8AC] bg-[#EFE3D0]/80 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#796454]">
              Pending Confirmation
            </p>
            <p className="tabular-nums mt-1 font-serif text-3xl font-semibold text-[#967141]">
              {stats.pendingOrders}
            </p>
          </div>
        </div>

        {/* Segmented Admin Tabs */}
        <div className="mt-7 flex flex-wrap gap-2 border-b border-[#DCC8AC] pb-4">
          {(
            [
              { id: 'products', label: 'Products & XS–XL Stock' },
              { id: 'orders', label: `Orders & Dispatch (${orders.length})` },
              { id: 'media', label: 'Offers, Countdown & Media' },
              { id: 'content', label: 'Reviews, FAQs & Policies' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`rounded-md border px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] transition-colors ${
                activeTab === t.id
                  ? 'border-[#594238] bg-[#594238] text-[#F5EBDD]'
                  : 'border-[#DCC8AC] bg-[#EFE3D0] text-[#594238] hover:border-[#B18A58]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB 1: PRODUCTS & INVENTORY */}
        {activeTab === 'products' && (
          <div className="mt-7 space-y-6">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#796454]" />
                <input
                  type="text"
                  value={productQuery}
                  onChange={(e) => setProductQuery(e.target.value)}
                  placeholder="Filter by product name, SKU, or category..."
                  className="w-full rounded-md border border-[#DCC8AC] bg-[#F9F2E7] py-2.5 pl-9 pr-3 text-xs text-[#594238] focus:border-[#B18A58] focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() => setShowAddProductForm((v) => !v)}
                className="inline-flex items-center gap-2 rounded-md bg-[#594238] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#F5EBDD] hover:bg-[#46332B]"
              >
                <Plus className="h-4 w-4" />
                {showAddProductForm ? 'Close New Design Form' : 'Add New Product'}
              </button>
            </div>

            {/* Add Product Form */}
            {showAddProductForm && (
              <form
                onSubmit={handleCreateProduct}
                className="rounded-xl border border-[#B18A58] bg-[#EFE3D0] p-6 space-y-4"
              >
                <h2 className="font-serif text-2xl font-semibold text-[#594238]">
                  Create New Design Listing
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <label className="block text-xs font-semibold text-[#594238]">
                    SKU *
                    <input
                      type="text"
                      required
                      value={newSku}
                      onChange={(e) => setNewSku(e.target.value)}
                      placeholder="ME-NEW-01"
                      className="mt-1 w-full rounded border border-[#DCC8AC] bg-[#F5EBDD] px-3 py-2 text-xs"
                    />
                  </label>
                  <label className="block text-xs font-semibold text-[#594238] lg:col-span-2">
                    Product Name *
                    <input
                      type="text"
                      required
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="e.g., Champagne Zari Anarkali Set"
                      className="mt-1 w-full rounded border border-[#DCC8AC] bg-[#F5EBDD] px-3 py-2 text-xs"
                    />
                  </label>
                  <label className="block text-xs font-semibold text-[#594238]">
                    Unit Price (₹) *
                    <input
                      type="number"
                      min={1}
                      required
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="tabular-nums mt-1 w-full rounded border border-[#DCC8AC] bg-[#F5EBDD] px-3 py-2 text-xs"
                    />
                  </label>
                  <label className="block text-xs font-semibold text-[#594238]">
                    Category
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as CategorySlug)}
                      className="mt-1 w-full rounded border border-[#DCC8AC] bg-[#F5EBDD] px-3 py-2 text-xs"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block text-xs font-semibold text-[#594238]">
                    Primary Colour Name *
                    <input
                      type="text"
                      required
                      value={newColorName}
                      onChange={(e) => setNewColorName(e.target.value)}
                      placeholder="e.g., Crimson Wine"
                      className="mt-1 w-full rounded border border-[#DCC8AC] bg-[#F5EBDD] px-3 py-2 text-xs"
                    />
                  </label>
                  <label className="block text-xs font-semibold text-[#594238]">
                    Colour Family
                    <select
                      value={newColorFamily}
                      onChange={(e) => setNewColorFamily(e.target.value)}
                      className="mt-1 w-full rounded border border-[#DCC8AC] bg-[#F5EBDD] px-3 py-2 text-xs"
                    >
                      {COLOR_FAMILIES.filter((c) => c !== 'All').map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block text-xs font-semibold text-[#594238]">
                    Swatch Hex
                    <input
                      type="color"
                      value={newSwatchHex}
                      onChange={(e) => setNewSwatchHex(e.target.value)}
                      className="mt-1 h-9 w-full rounded border border-[#DCC8AC] bg-[#F5EBDD] p-1"
                    />
                  </label>
                  <label className="block text-xs font-semibold text-[#594238] sm:col-span-2">
                    Primary Photo Path / URL *
                    <input
                      type="text"
                      required
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="mt-1 w-full rounded border border-[#DCC8AC] bg-[#F5EBDD] px-3 py-2 text-xs"
                    />
                  </label>
                  <label className="block text-xs font-semibold text-[#594238]">
                    Silhouette
                    <input
                      type="text"
                      value={newSilhouette}
                      onChange={(e) => setNewSilhouette(e.target.value)}
                      className="mt-1 w-full rounded border border-[#DCC8AC] bg-[#F5EBDD] px-3 py-2 text-xs"
                    />
                  </label>
                  <label className="block text-xs font-semibold text-[#594238]">
                    Occasion
                    <input
                      type="text"
                      value={newOccasion}
                      onChange={(e) => setNewOccasion(e.target.value)}
                      className="mt-1 w-full rounded border border-[#DCC8AC] bg-[#F5EBDD] px-3 py-2 text-xs"
                    />
                  </label>
                  <label className="block text-xs font-semibold text-[#594238] sm:col-span-2">
                    Set Includes
                    <input
                      type="text"
                      value={newSetIncludes}
                      onChange={(e) => setNewSetIncludes(e.target.value)}
                      className="mt-1 w-full rounded border border-[#DCC8AC] bg-[#F5EBDD] px-3 py-2 text-xs"
                    />
                  </label>
                  <label className="block text-xs font-semibold text-[#594238] sm:col-span-2">
                    Detailing
                    <input
                      type="text"
                      value={newDetailing}
                      onChange={(e) => setNewDetailing(e.target.value)}
                      className="mt-1 w-full rounded border border-[#DCC8AC] bg-[#F5EBDD] px-3 py-2 text-xs"
                    />
                  </label>
                  <label className="block text-xs font-semibold text-[#594238] sm:col-span-2 lg:col-span-4">
                    Description
                    <textarea
                      rows={2}
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      className="mt-1 w-full rounded border border-[#DCC8AC] bg-[#F5EBDD] px-3 py-2 text-xs"
                    />
                  </label>
                </div>

                {/* Initial 5-Size Stock */}
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#796454]">
                    Initial Stock (XS – XL)
                  </p>
                  <div className="mt-2 grid grid-cols-5 gap-2 max-w-md">
                    {ALL_PRODUCT_SIZES.map((sz) => (
                      <label key={sz} className="block text-xs font-semibold text-[#594238]">
                        {sz}
                        <input
                          type="number"
                          min={0}
                          value={newStock[sz]}
                          onChange={(e) =>
                            setNewStock((prev) => ({
                              ...prev,
                              [sz]: Math.max(0, Number(e.target.value) || 0),
                            }))
                          }
                          className="tabular-nums mt-1 w-full rounded border border-[#DCC8AC] bg-[#F5EBDD] px-2 py-1.5 text-xs"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6">
                  <label className="flex items-center gap-2 text-xs font-medium text-[#594238]">
                    <input
                      type="checkbox"
                      checked={newIsArrival}
                      onChange={(e) => setNewIsArrival(e.target.checked)}
                      className="h-4 w-4 accent-[#594238]"
                    />
                    Feature in New Arrivals
                  </label>
                  <label className="flex items-center gap-2 text-xs font-medium text-[#594238]">
                    <input
                      type="checkbox"
                      checked={newIsBestSeller}
                      onChange={(e) => setNewIsBestSeller(e.target.checked)}
                      className="h-4 w-4 accent-[#594238]"
                    />
                    Feature in Best Sellers
                  </label>
                </div>

                <button
                  type="submit"
                  className="rounded-md bg-[#B18A58] px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#F5EBDD] hover:bg-[#967141]"
                >
                  Publish Product to Storefront
                </button>
              </form>
            )}

            {/* Catalog List */}
            <div className="space-y-4">
              {filteredProducts.map((product) => {
                const isExpanded = expandedProductId === product.id;
                const totalStock = product.colors.reduce(
                  (sum, c) =>
                    sum + ALL_PRODUCT_SIZES.reduce((s, sz) => s + (c.stockBySize[sz] ?? 0), 0),
                  0
                );
                return (
                  <div
                    key={product.id}
                    className="rounded-xl border border-[#DCC8AC] bg-[#EFE3D0]/70 p-4 sm:p-5"
                  >
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={product.colors[0]?.images[0] || ''}
                          alt={product.name}
                          className="h-18 w-14 shrink-0 rounded object-cover object-top"
                        />
                        <div>
                          <p className="tabular-nums text-[11px] font-semibold uppercase tracking-[0.14em] text-[#967141]">
                            {product.sku} · {product.categoryLabel} · {product.colors.length}{' '}
                            colour{product.colors.length === 1 ? '' : 's'}
                          </p>
                          <h3 className="font-serif text-xl font-semibold text-[#594238]">
                            {product.name}
                          </h3>
                          <p className="tabular-nums text-xs text-[#796454]">
                            {formatINR(product.price)} · Total Inventory: {totalStock} units
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedProductId(isExpanded ? null : product.id)
                          }
                          className="rounded-md border border-[#B18A58] bg-[#F5EBDD] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#594238] hover:bg-[#594238] hover:text-[#F5EBDD]"
                        >
                          {isExpanded ? 'Done Editing' : 'Edit & Stock'}
                        </button>

                        {confirmDeleteId === product.id ? (
                          <button
                            type="button"
                            onClick={() => {
                              deleteProduct(product.id);
                              setConfirmDeleteId(null);
                              showToast(`Deleted ${product.name}`);
                            }}
                            className="rounded-md bg-[#8C2B22] px-3 py-2 text-xs font-semibold text-[#F5EBDD]"
                          >
                            Confirm Delete
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(product.id)}
                            aria-label={`Delete ${product.name}`}
                            className="rounded-md border border-[#DCC8AC] bg-[#F5EBDD] p-2 text-[#796454] hover:text-[#8C2B22]"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-5 space-y-5 border-t border-[#DCC8AC] pt-5">
                        {/* Basic Design Details */}
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                          <label className="block text-xs font-semibold text-[#594238]">
                            Product Name
                            <input
                              type="text"
                              value={product.name}
                              onChange={(e) =>
                                updateProduct({ ...product, name: e.target.value })
                              }
                              className="mt-1 w-full rounded border border-[#DCC8AC] bg-[#F5EBDD] px-3 py-2 text-xs"
                            />
                          </label>
                          <label className="block text-xs font-semibold text-[#594238]">
                            SKU
                            <input
                              type="text"
                              value={product.sku}
                              onChange={(e) =>
                                updateProduct({ ...product, sku: e.target.value })
                              }
                              className="mt-1 w-full rounded border border-[#DCC8AC] bg-[#F5EBDD] px-3 py-2 text-xs"
                            />
                          </label>
                          <label className="block text-xs font-semibold text-[#594238]">
                            Price (₹)
                            <input
                              type="number"
                              min={1}
                              value={product.price}
                              onChange={(e) =>
                                updateProduct({
                                  ...product,
                                  price: Math.max(1, Number(e.target.value) || 0),
                                })
                              }
                              className="tabular-nums mt-1 w-full rounded border border-[#DCC8AC] bg-[#F5EBDD] px-3 py-2 text-xs"
                            />
                          </label>
                          <label className="block text-xs font-semibold text-[#594238]">
                            Category
                            <select
                              value={product.category}
                              onChange={(e) => {
                                const slug = e.target.value as CategorySlug;
                                const info = CATEGORIES.find((c) => c.slug === slug);
                                updateProduct({
                                  ...product,
                                  category: slug,
                                  categoryLabel: info?.name || product.categoryLabel,
                                });
                              }}
                              className="mt-1 w-full rounded border border-[#DCC8AC] bg-[#F5EBDD] px-3 py-2 text-xs"
                            >
                              {CATEGORIES.map((c) => (
                                <option key={c.slug} value={c.slug}>
                                  {c.name}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>

                        <div className="flex flex-wrap items-center gap-6">
                          <label className="flex items-center gap-2 text-xs font-medium text-[#594238]">
                            <input
                              type="checkbox"
                              checked={product.isNewArrival}
                              onChange={(e) =>
                                updateProduct({ ...product, isNewArrival: e.target.checked })
                              }
                              className="h-4 w-4 accent-[#594238]"
                            />
                            Show in New Arrivals
                          </label>
                          <label className="flex items-center gap-2 text-xs font-medium text-[#594238]">
                            <input
                              type="checkbox"
                              checked={product.isBestSeller}
                              onChange={(e) =>
                                updateProduct({ ...product, isBestSeller: e.target.checked })
                              }
                              className="h-4 w-4 accent-[#594238]"
                            />
                            Show in Best Sellers
                          </label>

                          <button
                            type="button"
                            onClick={() => handleAddColorVariant(product)}
                            className="inline-flex items-center gap-1.5 rounded border border-[#B18A58] bg-[#E8D8BD] px-3 py-1.5 text-xs font-semibold text-[#594238] hover:bg-[#594238] hover:text-[#F5EBDD]"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Add Colour Variant
                          </button>
                        </div>

                        {/* Colour Variants & Per-Size (XS-XL) Stock */}
                        <div className="space-y-3">
                          {product.colors.map((color) => (
                            <div
                              key={color.id}
                              className="rounded-lg border border-[#DCC8AC] bg-[#F5EBDD] p-4"
                            >
                              <div className="grid gap-3 sm:grid-cols-4">
                                <label className="block text-xs font-semibold text-[#594238]">
                                  Colour Name
                                  <input
                                    type="text"
                                    value={color.colorName}
                                    onChange={(e) =>
                                      updateProduct({
                                        ...product,
                                        colors: product.colors.map((c) =>
                                          c.id === color.id
                                            ? { ...c, colorName: e.target.value }
                                            : c
                                        ),
                                      })
                                    }
                                    className="mt-1 w-full rounded border border-[#DCC8AC] bg-[#F9F2E7] px-2.5 py-1.5 text-xs"
                                  />
                                </label>
                                <label className="block text-xs font-semibold text-[#594238]">
                                  Swatch Hex
                                  <input
                                    type="color"
                                    value={color.swatchHex}
                                    onChange={(e) =>
                                      updateProduct({
                                        ...product,
                                        colors: product.colors.map((c) =>
                                          c.id === color.id
                                            ? { ...c, swatchHex: e.target.value }
                                            : c
                                        ),
                                      })
                                    }
                                    className="mt-1 h-8 w-full rounded border border-[#DCC8AC] bg-[#F9F2E7] p-0.5"
                                  />
                                </label>
                                <label className="block text-xs font-semibold text-[#594238] sm:col-span-2">
                                  Image URLs (comma-separated)
                                  <input
                                    type="text"
                                    value={color.images.join(', ')}
                                    onChange={(e) =>
                                      updateProduct({
                                        ...product,
                                        colors: product.colors.map((c) =>
                                          c.id === color.id
                                            ? {
                                                ...c,
                                                images: e.target.value
                                                  .split(',')
                                                  .map((s) => s.trim())
                                                  .filter(Boolean),
                                              }
                                            : c
                                        ),
                                      })
                                    }
                                    className="mt-1 w-full rounded border border-[#DCC8AC] bg-[#F9F2E7] px-2.5 py-1.5 text-xs"
                                  />
                                </label>
                              </div>

                              <div className="mt-3 grid grid-cols-5 gap-2 max-w-md">
                                {ALL_PRODUCT_SIZES.map((sz) => (
                                  <label
                                    key={sz}
                                    className="block text-[11px] font-semibold text-[#796454]"
                                  >
                                    {sz} Stock
                                    <input
                                      type="number"
                                      min={0}
                                      value={color.stockBySize[sz] ?? 0}
                                      onChange={(e) =>
                                        updateVariantStock(
                                          product.id,
                                          color.id,
                                          sz,
                                          Math.max(0, Number(e.target.value) || 0)
                                        )
                                      }
                                      className="tabular-nums mt-1 w-full rounded border border-[#DCC8AC] bg-[#F9F2E7] px-2 py-1 text-xs font-semibold text-[#594238]"
                                    />
                                  </label>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS & DISPATCH */}
        {activeTab === 'orders' && (
          <div className="mt-7 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {(['All', ...DISPATCH_STATUSES] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setOrderStatusFilter(status)}
                    className={`rounded-md border px-3 py-1.5 text-xs font-medium ${
                      orderStatusFilter === status
                        ? 'border-[#594238] bg-[#594238] text-[#F5EBDD]'
                        : 'border-[#DCC8AC] bg-[#EFE3D0] text-[#594238]'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="rounded-xl border border-[#DCC8AC] bg-[#EFE3D0]/60 p-10 text-center">
                <Package className="mx-auto h-8 w-8 text-[#B18A58]" />
                <p className="mt-3 font-serif text-2xl font-medium text-[#594238]">
                  No WhatsApp order requests recorded yet
                </p>
                <p className="mt-1 text-xs text-[#796454]">
                  Orders initiated via Direct Buy Now WhatsApp or Checkout appear here so you can
                  track confirmation and 3–4 day dispatch progress.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order.orderId}
                    className="rounded-xl border border-[#DCC8AC] bg-[#EFE3D0]/80 p-5"
                  >
                    <div className="flex flex-col justify-between gap-4 border-b border-[#DCC8AC] pb-4 sm:flex-row sm:items-center">
                      <div>
                        <p className="tabular-nums text-xs font-semibold text-[#594238]">
                          {order.orderId} · {order.source}
                        </p>
                        <p className="mt-0.5 text-xs text-[#796454]">
                          {order.customer.fullName} · {order.customer.mobile} ·{' '}
                          {new Date(order.createdAt).toLocaleString('en-IN')}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <label className="text-xs font-semibold text-[#594238]">
                          Dispatch Status:
                          <select
                            value={order.dispatchStatus}
                            onChange={(e) => {
                              updateOrderDispatchStatus(
                                order.orderId,
                                e.target.value as DispatchStatus
                              );
                              showToast(`Updated ${order.orderId} status`);
                            }}
                            className="ml-2 rounded border border-[#B18A58] bg-[#F5EBDD] px-2.5 py-1.5 text-xs font-medium text-[#594238]"
                          >
                            {DISPATCH_STATUSES.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {order.items.map((it, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 rounded border border-[#DCC8AC] bg-[#F5EBDD] p-2.5 text-xs"
                        >
                          <img
                            src={it.image}
                            alt={it.name}
                            className="h-12 w-10 rounded object-cover object-top"
                          />
                          <div>
                            <p className="font-semibold text-[#594238]">{it.name}</p>
                            <p className="tabular-nums text-[#796454]">
                              {it.sku} · {it.colorName} · Size {it.size} · Qty {it.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 flex flex-wrap justify-between gap-2 text-xs text-[#796454]">
                      <span>
                        Address: {order.customer.address}, {order.customer.city},{' '}
                        {order.customer.state} – {order.customer.pinCode}
                      </span>
                      <span className="tabular-nums font-semibold text-[#594238]">
                        Total: {formatINR(order.pricing.finalTotal)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: OFFERS, COUNTDOWN & MEDIA */}
        {activeTab === 'media' && (
          <form onSubmit={handleSaveMediaAndOffers} className="mt-7 space-y-6 max-w-4xl">
            <div className="rounded-xl border border-[#DCC8AC] bg-[#EFE3D0]/75 p-6 space-y-5">
              <h2 className="font-serif text-2xl font-semibold text-[#594238]">
                Promotional Banner & Optional Offer Countdown
              </h2>
              <label className="block text-xs font-semibold text-[#594238]">
                Top Discount Banner Text
                <input
                  type="text"
                  value={bannerText}
                  onChange={(e) => setBannerText(e.target.value)}
                  className="mt-1.5 w-full rounded border border-[#DCC8AC] bg-[#F5EBDD] px-3.5 py-2.5 text-xs text-[#594238]"
                />
              </label>

              <div>
                <label className="block text-xs font-semibold text-[#594238]">
                  Offer Expiry Date & Time (Leave empty to hide countdown timer)
                  <div className="mt-1.5 flex flex-wrap items-center gap-3">
                    <input
                      type="datetime-local"
                      value={expiryInput}
                      onChange={(e) => setExpiryInput(e.target.value)}
                      className="rounded border border-[#DCC8AC] bg-[#F5EBDD] px-3.5 py-2 text-xs text-[#594238]"
                    />
                    <button
                      type="button"
                      onClick={() => setExpiryInput('')}
                      className="rounded border border-[#DCC8AC] bg-[#F5EBDD] px-3 py-2 text-xs font-medium text-[#796454] hover:text-[#594238]"
                    >
                      Clear Timer
                    </button>
                  </div>
                </label>
              </div>
            </div>

            <div className="rounded-xl border border-[#DCC8AC] bg-[#EFE3D0]/75 p-6 space-y-4">
              <h2 className="font-serif text-2xl font-semibold text-[#594238]">
                Hero Videos & Editorial Banner Media
              </h2>
              <label className="block text-xs font-semibold text-[#594238]">
                Hero Video 1 Path / URL
                <input
                  type="text"
                  value={heroV1}
                  onChange={(e) => setHeroV1(e.target.value)}
                  className="mt-1 w-full rounded border border-[#DCC8AC] bg-[#F5EBDD] px-3.5 py-2 text-xs"
                />
              </label>
              <label className="block text-xs font-semibold text-[#594238]">
                Hero Video 2 Path / URL
                <input
                  type="text"
                  value={heroV2}
                  onChange={(e) => setHeroV2(e.target.value)}
                  className="mt-1 w-full rounded border border-[#DCC8AC] bg-[#F5EBDD] px-3.5 py-2 text-xs"
                />
              </label>
              <label className="block text-xs font-semibold text-[#594238]">
                Kurti Fashion Story Video Path / URL
                <input
                  type="text"
                  value={storyVideo}
                  onChange={(e) => setStoryVideo(e.target.value)}
                  className="mt-1 w-full rounded border border-[#DCC8AC] bg-[#F5EBDD] px-3.5 py-2 text-xs"
                />
              </label>
              <label className="block text-xs font-semibold text-[#594238]">
                Editorial Feature Banner Image URL
                <input
                  type="text"
                  value={editorialImg}
                  onChange={(e) => setEditorialImg(e.target.value)}
                  className="mt-1 w-full rounded border border-[#DCC8AC] bg-[#F5EBDD] px-3.5 py-2 text-xs"
                />
              </label>
              <label className="block text-xs font-semibold text-[#594238]">
                Editorial Headline
                <input
                  type="text"
                  value={editorialHeadline}
                  onChange={(e) => setEditorialHeadline(e.target.value)}
                  className="mt-1 w-full rounded border border-[#DCC8AC] bg-[#F5EBDD] px-3.5 py-2 text-xs"
                />
              </label>
              <label className="block text-xs font-semibold text-[#594238]">
                Editorial Body Copy
                <textarea
                  rows={3}
                  value={editorialBody}
                  onChange={(e) => setEditorialBody(e.target.value)}
                  className="mt-1 w-full rounded border border-[#DCC8AC] bg-[#F5EBDD] px-3.5 py-2 text-xs"
                />
              </label>
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-md bg-[#594238] px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#F5EBDD] hover:bg-[#46332B]"
            >
              <Check className="h-4 w-4" />
              Save Offers & Media Settings
            </button>
          </form>
        )}

        {/* TAB 4: REVIEWS, FAQS, POLICIES & BRAND */}
        {activeTab === 'content' && (
          <div className="mt-7 space-y-8 max-w-4xl">
            {/* Customer Reviews Moderation */}
            <div className="rounded-xl border border-[#DCC8AC] bg-[#EFE3D0]/75 p-6">
              <h2 className="font-serif text-2xl font-semibold text-[#594238]">
                Submitted Customer Reviews ({reviews.length})
              </h2>
              {reviews.length === 0 ? (
                <p className="mt-2 text-xs text-[#796454]">
                  No customer reviews submitted yet. Genuine reviews posted on product pages appear
                  here for moderation.
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="flex items-start justify-between gap-4 rounded-lg border border-[#DCC8AC] bg-[#F5EBDD] p-3.5 text-xs"
                    >
                      <div>
                        <p className="font-semibold text-[#594238]">
                          {rev.reviewerName} · Product ID: {rev.productId}
                        </p>
                        <div className="mt-1 flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className="h-3 w-3"
                              fill={s <= rev.rating ? '#B18A58' : 'none'}
                              stroke="#B18A58"
                            />
                          ))}
                        </div>
                        <p className="mt-1.5 text-[#594238]">{rev.comment}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          deleteReview(rev.id);
                          showToast('Removed review.');
                        }}
                        aria-label="Delete Review"
                        className="text-[#796454] hover:text-[#8C2B22]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* FAQ Manager */}
            <div className="rounded-xl border border-[#DCC8AC] bg-[#EFE3D0]/75 p-6 space-y-4">
              <h2 className="font-serif text-2xl font-semibold text-[#594238]">
                Manage Frequently Asked Questions ({siteConfig.faqs.length})
              </h2>
              <div className="space-y-3">
                {siteConfig.faqs.map((faq, idx) => (
                  <div
                    key={faq.id}
                    className="flex items-start justify-between gap-3 rounded-lg border border-[#DCC8AC] bg-[#F5EBDD] p-3.5 text-xs"
                  >
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => {
                          const next = [...siteConfig.faqs];
                          next[idx] = { ...faq, question: e.target.value };
                          updateSiteConfig({ faqs: next });
                        }}
                        className="w-full rounded border border-[#DCC8AC] bg-[#F9F2E7] px-2.5 py-1.5 font-semibold text-[#594238]"
                      />
                      <textarea
                        rows={2}
                        value={faq.answer}
                        onChange={(e) => {
                          const next = [...siteConfig.faqs];
                          next[idx] = { ...faq, answer: e.target.value };
                          updateSiteConfig({ faqs: next });
                        }}
                        className="w-full rounded border border-[#DCC8AC] bg-[#F9F2E7] px-2.5 py-1.5 text-[#796454]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        updateSiteConfig({
                          faqs: siteConfig.faqs.filter((f) => f.id !== faq.id),
                        })
                      }
                      aria-label="Remove FAQ"
                      className="mt-1 text-[#796454] hover:text-[#8C2B22]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="rounded-lg border border-[#B18A58]/50 bg-[#E8D8BD]/65 p-4 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#967141]">
                  Add New FAQ
                </p>
                <input
                  type="text"
                  value={newFaqQuestion}
                  onChange={(e) => setNewFaqQuestion(e.target.value)}
                  placeholder="Question"
                  className="w-full rounded border border-[#DCC8AC] bg-[#F5EBDD] px-3 py-2 text-xs"
                />
                <textarea
                  rows={2}
                  value={newFaqAnswer}
                  onChange={(e) => setNewFaqAnswer(e.target.value)}
                  placeholder="Answer"
                  className="w-full rounded border border-[#DCC8AC] bg-[#F5EBDD] px-3 py-2 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddFaq}
                  className="rounded bg-[#594238] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#F5EBDD]"
                >
                  Add FAQ Item
                </button>
              </div>
            </div>

            {/* Policies & Brand Identity Form */}
            <form
              onSubmit={handleSavePoliciesAndBrand}
              className="rounded-xl border border-[#DCC8AC] bg-[#EFE3D0]/75 p-6 space-y-4"
            >
              <h2 className="font-serif text-2xl font-semibold text-[#594238]">
                Brand Contact, Admin Passcode & Policy Pages
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-xs font-semibold text-[#594238]">
                  Brand Name
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="mt-1 w-full rounded border border-[#DCC8AC] bg-[#F5EBDD] px-3 py-2 text-xs"
                  />
                </label>
                <label className="block text-xs font-semibold text-[#594238]">
                  Tagline
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="mt-1 w-full rounded border border-[#DCC8AC] bg-[#F5EBDD] px-3 py-2 text-xs"
                  />
                </label>
                <label className="block text-xs font-semibold text-[#594238]">
                  WhatsApp Digits (with country code)
                  <input
                    type="text"
                    value={whatsappNum}
                    onChange={(e) => setWhatsappNum(e.target.value)}
                    className="tabular-nums mt-1 w-full rounded border border-[#DCC8AC] bg-[#F5EBDD] px-3 py-2 text-xs"
                  />
                </label>
                <label className="block text-xs font-semibold text-[#594238]">
                  WhatsApp Display Number
                  <input
                    type="text"
                    value={whatsappDisp}
                    onChange={(e) => setWhatsappDisp(e.target.value)}
                    className="tabular-nums mt-1 w-full rounded border border-[#DCC8AC] bg-[#F5EBDD] px-3 py-2 text-xs"
                  />
                </label>
                <label className="block text-xs font-semibold text-[#594238]">
                  Instagram Handle
                  <input
                    type="text"
                    value={igHandle}
                    onChange={(e) => setIgHandle(e.target.value)}
                    className="mt-1 w-full rounded border border-[#DCC8AC] bg-[#F5EBDD] px-3 py-2 text-xs"
                  />
                </label>
                <label className="block text-xs font-semibold text-[#594238]">
                  Facebook Page
                  <input
                    type="text"
                    value={fbPage}
                    onChange={(e) => setFbPage(e.target.value)}
                    className="mt-1 w-full rounded border border-[#DCC8AC] bg-[#F5EBDD] px-3 py-2 text-xs"
                  />
                </label>
                <label className="block text-xs font-semibold text-[#594238] sm:col-span-2">
                  Admin Passcode
                  <input
                    type="text"
                    value={adminPassInput}
                    onChange={(e) => setAdminPassInput(e.target.value)}
                    className="mt-1 w-full rounded border border-[#DCC8AC] bg-[#F5EBDD] px-3 py-2 text-xs"
                  />
                </label>
              </div>

              <label className="block text-xs font-semibold text-[#594238]">
                Terms & Conditions (separate paragraphs with blank line)
                <textarea
                  rows={4}
                  value={termsText}
                  onChange={(e) => setTermsText(e.target.value)}
                  className="mt-1 w-full rounded border border-[#DCC8AC] bg-[#F5EBDD] px-3 py-2 text-xs"
                />
              </label>

              <label className="block text-xs font-semibold text-[#594238]">
                No Return Policy
                <textarea
                  rows={3}
                  value={noReturnText}
                  onChange={(e) => setNoReturnText(e.target.value)}
                  className="mt-1 w-full rounded border border-[#DCC8AC] bg-[#F5EBDD] px-3 py-2 text-xs"
                />
              </label>

              <label className="block text-xs font-semibold text-[#594238]">
                No Exchange Policy
                <textarea
                  rows={3}
                  value={noExchangeText}
                  onChange={(e) => setNoExchangeText(e.target.value)}
                  className="mt-1 w-full rounded border border-[#DCC8AC] bg-[#F5EBDD] px-3 py-2 text-xs"
                />
              </label>

              <label className="block text-xs font-semibold text-[#594238]">
                Shipping / Delivery Information
                <textarea
                  rows={3}
                  value={shippingText}
                  onChange={(e) => setShippingText(e.target.value)}
                  className="mt-1 w-full rounded border border-[#DCC8AC] bg-[#F5EBDD] px-3 py-2 text-xs"
                />
              </label>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <button
                  type="submit"
                  className="rounded-md bg-[#594238] px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#F5EBDD] hover:bg-[#46332B]"
                >
                  Save Policies & Brand Info
                </button>

                {confirmReset ? (
                  <button
                    type="button"
                    onClick={() => {
                      resetStorefrontDefaults();
                      setConfirmReset(false);
                    }}
                    className="inline-flex items-center gap-1.5 rounded bg-[#8C2B22] px-4 py-2.5 text-xs font-semibold text-[#F5EBDD]"
                  >
                    Confirm Full Reset
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmReset(true)}
                    className="inline-flex items-center gap-1.5 rounded border border-[#DCC8AC] bg-[#F5EBDD] px-4 py-2.5 text-xs font-medium text-[#796454] hover:text-[#594238]"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Restore Defaults
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
