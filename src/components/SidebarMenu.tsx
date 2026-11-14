import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Shield, ShoppingBag, X } from 'lucide-react';
import { CATEGORIES, ORIGINAL_LOGO_URL } from '../data/products';
import { useStore } from '../context/StoreContext';
import { AppRoute } from '../types';

export const SidebarMenu: React.FC = () => {
  const { isMenuOpen, setMenuOpen, navigate, setCartOpen, pricingSummary, siteConfig } = useStore();
  const [showCategories, setShowCategories] = useState(false);

  if (!isMenuOpen) return null;

  const go = (r: AppRoute) => navigate(r);

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="fixed inset-0 bg-[#594238]/35 backdrop-blur-xs transition-opacity"
        onClick={() => setMenuOpen(false)}
      />

      <aside className="relative z-10 flex h-full w-full max-w-sm flex-col border-r border-[#DCC8AC] bg-[#F5EBDD] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#DCC8AC] px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#B18A58]/55 bg-[#F9F2E7]">
              <img
                src={ORIGINAL_LOGO_URL}
                alt="Manyata Ethnic Logo"
                className="h-full w-full object-contain"
              />
            </span>
            <div>
              <p className="font-serif text-xl font-semibold tracking-[0.08em] text-[#594238]">
                {siteConfig.brandName}
              </p>
              <p className="text-[10px] uppercase tracking-[0.16em] text-[#796454]">
                {siteConfig.tagline}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Close Menu"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#DCC8AC] text-[#594238] transition-colors hover:bg-[#E8D8BD]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-6 py-6">
          <ul className="space-y-1">
            <li>
              <button
                type="button"
                onClick={() => go({ page: 'home' })}
                className="flex w-full items-center justify-between rounded-md px-3 py-3 text-left text-sm font-medium tracking-wide text-[#594238] hover:bg-[#E8D8BD]"
              >
                <span>Home</span>
                <ChevronRight className="h-4 w-4 text-[#B18A58]" />
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => go({ page: 'shop' })}
                className="flex w-full items-center justify-between rounded-md px-3 py-3 text-left text-sm font-medium tracking-wide text-[#594238] hover:bg-[#E8D8BD]"
              >
                <span>Shop All</span>
                <ChevronRight className="h-4 w-4 text-[#B18A58]" />
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => setShowCategories((v) => !v)}
                className="flex w-full items-center justify-between rounded-md px-3 py-3 text-left text-sm font-medium tracking-wide text-[#594238] hover:bg-[#E8D8BD]"
              >
                <span>Categories</span>
                <ChevronDown
                  className={`h-4 w-4 text-[#B18A58] transition-transform ${
                    showCategories ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {showCategories && (
                <ul className="ml-3 mt-1 space-y-1 border-l border-[#DCC8AC] pl-3">
                  {CATEGORIES.map((cat) => (
                    <li key={cat.slug}>
                      <button
                        type="button"
                        onClick={() => go({ page: 'category', slug: cat.slug })}
                        className="block w-full rounded-md px-3 py-2 text-left text-xs font-medium tracking-wide text-[#796454] hover:bg-[#E8D8BD] hover:text-[#594238]"
                      >
                        {cat.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
            <li>
              <button
                type="button"
                onClick={() => go({ page: 'new-arrivals' })}
                className="flex w-full items-center justify-between rounded-md px-3 py-3 text-left text-sm font-medium tracking-wide text-[#594238] hover:bg-[#E8D8BD]"
              >
                <span>New Arrivals</span>
                <ChevronRight className="h-4 w-4 text-[#B18A58]" />
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => go({ page: 'best-sellers' })}
                className="flex w-full items-center justify-between rounded-md px-3 py-3 text-left text-sm font-medium tracking-wide text-[#594238] hover:bg-[#E8D8BD]"
              >
                <span>Best Sellers</span>
                <ChevronRight className="h-4 w-4 text-[#B18A58]" />
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => go({ page: 'offers' })}
                className="flex w-full items-center justify-between rounded-md px-3 py-3 text-left text-sm font-medium tracking-wide text-[#594238] hover:bg-[#E8D8BD]"
              >
                <span>Offers</span>
                <ChevronRight className="h-4 w-4 text-[#B18A58]" />
              </button>
            </li>
          </ul>

          <div className="my-5 border-t border-[#DCC8AC]" />

          <ul className="space-y-1">
            <li>
              <button
                type="button"
                onClick={() => go({ page: 'contact' })}
                className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm text-[#796454] hover:bg-[#E8D8BD] hover:text-[#594238]"
              >
                <span>Contact</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => go({ page: 'about' })}
                className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm text-[#796454] hover:bg-[#E8D8BD] hover:text-[#594238]"
              >
                <span>About</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => go({ page: 'faq' })}
                className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm text-[#796454] hover:bg-[#E8D8BD] hover:text-[#594238]"
              >
                <span>FAQ</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => go({ page: 'admin' })}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-xs font-medium text-[#967141] hover:bg-[#E8D8BD]"
              >
                <Shield className="h-3.5 w-3.5" />
                <span>Admin Panel</span>
              </button>
            </li>
          </ul>
        </nav>

        <div className="border-t border-[#DCC8AC] bg-[#E8D8BD]/70 p-6">
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              setCartOpen(true);
            }}
            className="mb-4 flex w-full items-center justify-between rounded-md border border-[#B18A58] bg-[#594238] px-4 py-3 text-xs font-medium uppercase tracking-[0.14em] text-[#F5EBDD] hover:bg-[#46332B]"
          >
            <span className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-[#E8D8BD]" />
              Shopping Bag
            </span>
            <span className="tabular-nums">{pricingSummary.totalUnits} items</span>
          </button>
          <p className="text-xs text-[#796454]">
            WhatsApp:{' '}
            <a
              href={`https://wa.me/${siteConfig.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="tabular-nums font-medium text-[#594238] underline decoration-[#B18A58]/60 underline-offset-2"
            >
              {siteConfig.whatsappDisplay}
            </a>
          </p>
        </div>
      </aside>
    </div>
  );
};
