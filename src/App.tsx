import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { SidebarMenu } from './components/SidebarMenu';
import { SearchModal } from './components/SearchModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CartDrawer } from './components/CartDrawer';
import { HeroSection } from './components/home/HeroSection';
import { CollageSliders } from './components/home/CollageSliders';
import { CategoriesSection } from './components/home/CategoriesSection';
import { OffersSection } from './components/home/OffersSection';
import { NewArrivalsSection } from './components/home/NewArrivalsSection';
import { BestSellersSection } from './components/home/BestSellersSection';
import { EditorialBanner } from './components/home/EditorialBanner';
import { KurtiVideoStory } from './components/home/KurtiVideoStory';
import { BrandStorySection } from './components/home/BrandStorySection';
import { RoyalShowcaseSlider } from './components/home/RoyalShowcaseSlider';
import { Footer } from './components/home/Footer';
import { CatalogView } from './components/views/CatalogView';
import { ProductDetailView } from './components/views/ProductDetailView';
import { CheckoutView } from './components/views/CheckoutView';
import { InfoPagesView } from './components/views/InfoPagesView';
import { AdminView } from './components/views/AdminView';
import { formatINR } from './utils/pricing';

const StorefrontShell: React.FC = () => {
  const { route, setCartOpen, pricingSummary, toastMessage } = useStore();

  const renderMainContent = () => {
    switch (route.page) {
      case 'home':
        return (
          <>
            <HeroSection />
            <CollageSliders />
            <CategoriesSection />
            <OffersSection />
            <NewArrivalsSection />
            <BestSellersSection />
            <EditorialBanner />
            <KurtiVideoStory />
            <BrandStorySection />
            <RoyalShowcaseSlider />
          </>
        );
      case 'shop':
        return <CatalogView mode="shop" />;
      case 'category':
        return <CatalogView mode="category" categorySlug={route.slug} />;
      case 'new-arrivals':
        return <CatalogView mode="new-arrivals" />;
      case 'best-sellers':
        return <CatalogView mode="best-sellers" />;
      case 'offers':
        return <CatalogView mode="offers" />;
      case 'product':
        return <ProductDetailView productId={route.id} initialColorId={route.colorId} />;
      case 'checkout':
        return <CheckoutView />;
      case 'admin':
        return <AdminView />;
      case 'contact':
      case 'about':
      case 'faq':
      case 'policy-terms':
      case 'policy-no-return':
      case 'policy-no-exchange':
      case 'policy-shipping':
        return <InfoPagesView page={route.page} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-luxury-silk flex min-h-screen flex-col text-[#594238]">
      {/* Exact 5-control slim luxury navigation bar */}
      <Navbar />

      {/* Main Page Content */}
      <main className="flex-1">{renderMainContent()}</main>

      {/* Luxury Boutique Footer */}
      <Footer />

      {/* Global Drawers & Modals */}
      <SidebarMenu />
      <SearchModal />
      <WishlistDrawer />
      <CartDrawer />

      {/* Subtle Floating Bag Access Button (outside the 5-control navbar) */}
      {route.page !== 'checkout' && route.page !== 'admin' && (
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          aria-label={`Open Shopping Bag (${pricingSummary.totalUnits} items)`}
          className="fixed bottom-5 right-5 z-30 flex items-center gap-2.5 rounded-full border border-[#B18A58] bg-[#594238] px-4 py-3 text-xs font-semibold text-[#F5EBDD] shadow-lg transition-transform hover:scale-105"
        >
          <ShoppingBag className="h-4 w-4 text-[#E8D8BD]" />
          <span className="tabular-nums">
            {pricingSummary.totalUnits > 0
              ? `Bag (${pricingSummary.totalUnits}) · ${formatINR(pricingSummary.finalTotal)}`
              : 'Bag'}
          </span>
        </button>
      )}

      {/* Subtle Toast Confirmation */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-full border border-[#B18A58] bg-[#594238] px-5 py-2.5 text-xs font-medium text-[#F5EBDD] shadow-lg"
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <StorefrontShell />
    </StoreProvider>
  );
}
