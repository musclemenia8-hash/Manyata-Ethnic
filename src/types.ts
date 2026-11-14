export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL';

export const ALL_PRODUCT_SIZES: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL'];

export const SIZE_DETAILS: Record<
  ProductSize,
  { fullName: string; bust: string; waist: string }
> = {
  XS: { fullName: 'Extra Small', bust: '34 in', waist: '30 in' },
  S: { fullName: 'Small', bust: '36 in', waist: '32 in' },
  M: { fullName: 'Medium', bust: '38 in', waist: '34 in' },
  L: { fullName: 'Large', bust: '40 in', waist: '36 in' },
  XL: { fullName: 'Extra Large', bust: '42 in', waist: '38 in' },
};

export type CategorySlug =
  | 'anarkali-kurtis'
  | 'straight-kurtis'
  | 'cotton-kurtis'
  | 'festive-collection'
  | 'embroidered-sets'
  | 'skirt-blouse-sets';

export interface CategoryInfo {
  slug: CategorySlug;
  name: string;
  subtitle: string;
  description: string;
  coverImage: string;
}

export interface ProductColorVariant {
  id: string;
  colorName: string;
  colorFamily: string;
  swatchHex: string;
  dominantRgb: [number, number, number];
  images: string[];
  stockBySize: Record<ProductSize, number>;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: CategorySlug;
  categoryLabel: string;
  price: number;
  colors: ProductColorVariant[];
  silhouette: string;
  detailing: string;
  setIncludes: string;
  occasion: string;
  description: string;
  isNewArrival: boolean;
  isBestSeller: boolean;
}

export interface CartItem {
  productId: string;
  colorId: string;
  colorName: string;
  size: ProductSize;
  quantity: number;
}

export interface CustomerReview {
  id: string;
  productId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface OrderCustomerDetails {
  fullName: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
}

export type DispatchStatus =
  | 'Pending Confirmation'
  | 'Confirmed'
  | 'Packed'
  | 'Dispatched (3-4 Days)'
  | 'Delivered';

export interface OrderRecord {
  orderId: string;
  createdAt: string;
  source: 'Cart WhatsApp Request' | 'Direct Buy Now WhatsApp';
  dispatchStatus: DispatchStatus;
  customer: OrderCustomerDetails;
  items: Array<{
    productId: string;
    sku: string;
    name: string;
    colorName: string;
    size: ProductSize;
    quantity: number;
    unitPrice: number;
    image: string;
  }>;
  pricing: {
    totalUnits: number;
    regularTotal: number;
    finalTotal: number;
    savings: number;
    appliedBreakdown: Array<{ label: string; amount: number }>;
  };
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface PolicyContent {
  terms: string[];
  noReturn: string[];
  noExchange: string[];
  shipping: string[];
}

export interface SiteConfig {
  brandName: string;
  tagline: string;
  whatsappNumber: string;
  whatsappDisplay: string;
  instagramHandle: string;
  facebookPage: string;
  discountBannerText: string;
  offerExpiryIso: string; // Empty string unless admin explicitly sets an expiry date
  heroVideoOne: string;
  heroVideoTwo: string;
  fashionStoryVideo: string;
  editorialBannerImage: string;
  editorialHeadline: string;
  editorialBody: string;
  faqs: FaqItem[];
  policies: PolicyContent;
  adminPasscode: string;
}

export type AppRoute =
  | { page: 'home' }
  | { page: 'shop' }
  | { page: 'category'; slug: CategorySlug }
  | { page: 'new-arrivals' }
  | { page: 'best-sellers' }
  | { page: 'offers' }
  | { page: 'product'; id: string; colorId?: string }
  | { page: 'checkout' }
  | { page: 'contact' }
  | { page: 'about' }
  | { page: 'faq' }
  | { page: 'policy-terms' }
  | { page: 'policy-no-return' }
  | { page: 'policy-no-exchange' }
  | { page: 'policy-shipping' }
  | { page: 'admin' };
