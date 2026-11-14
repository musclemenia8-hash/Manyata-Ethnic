import React from 'react';
import { Phone } from 'lucide-react';
import { ORIGINAL_LOGO_URL } from '../../data/products';
import { useStore } from '../../context/StoreContext';

/**
 * Luxury Boutique Footer
 * Warm ivory/champagne cream palette with antique gold divider hairlines,
 * brand logo, Instagram/Facebook/WhatsApp links, navigation, policies, and subtle Admin link.
 */
export const Footer: React.FC = () => {
  const { navigate, siteConfig } = useStore();
  const cleanHandle = siteConfig.instagramHandle.replace(/^@/, '');

  return (
    <footer className="bg-luxury-footer border-t border-[#B18A58]/50 text-[#4A3830]">
      {/* Thin Antique Gold Top Accent Line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#B18A58]/60 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Summary */}
          <div>
            <button
              type="button"
              onClick={() => navigate({ page: 'home' })}
              className="flex items-center gap-3 text-left"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#B18A58]/60 bg-[#F9F2E7] shadow-xs">
                <img
                  src={ORIGINAL_LOGO_URL}
                  alt={`${siteConfig.brandName} Logo`}
                  className="h-full w-full object-contain"
                />
              </span>
              <div>
                <p className="font-serif text-xl font-semibold tracking-[0.08em] text-[#594238]">
                  {siteConfig.brandName}
                </p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#796454]">
                  {siteConfig.tagline}
                </p>
              </div>
            </button>

            <p className="mt-4 text-xs leading-relaxed text-[#796454]">
              Luxury Indian ethnic-wear boutique offering Anarkali kurtis, straight-cut sets,
              breathable cotton ensembles, and festive collections across India.
            </p>

            {/* Official Social Links */}
            <div className="mt-5 flex items-center gap-3">
              <a
                href={`https://instagram.com/${cleanHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${siteConfig.brandName} on Instagram ${siteConfig.instagramHandle}`}
                title={`Instagram: ${siteConfig.instagramHandle}`}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#B18A58]/60 bg-[#F5EBDD] text-[#594238] transition-colors hover:bg-[#594238] hover:text-[#F5EBDD]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>

              <a
                href={`https://www.facebook.com/search/top?q=${encodeURIComponent(siteConfig.facebookPage)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${siteConfig.facebookPage} on Facebook`}
                title={`Facebook: ${siteConfig.facebookPage}`}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#B18A58]/60 bg-[#F5EBDD] text-[#594238] transition-colors hover:bg-[#594238] hover:text-[#F5EBDD]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>

              <a
                href={`https://wa.me/${siteConfig.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`WhatsApp ${siteConfig.brandName} on ${siteConfig.whatsappDisplay}`}
                title={`WhatsApp: ${siteConfig.whatsappDisplay}`}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#B18A58]/60 bg-[#F5EBDD] text-[#594238] transition-colors hover:bg-[#594238] hover:text-[#F5EBDD]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Footer Navigation */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#967141]">
              Navigation
            </p>
            <ul className="mt-4 space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ page: 'home' })}
                  className="text-[#594238] hover:text-[#967141]"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ page: 'shop' })}
                  className="text-[#594238] hover:text-[#967141]"
                >
                  Shop All
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ page: 'category', slug: 'anarkali-kurtis' })}
                  className="text-[#594238] hover:text-[#967141]"
                >
                  Categories
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ page: 'new-arrivals' })}
                  className="text-[#594238] hover:text-[#967141]"
                >
                  New Arrivals
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ page: 'best-sellers' })}
                  className="text-[#594238] hover:text-[#967141]"
                >
                  Best Sellers
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ page: 'offers' })}
                  className="text-[#594238] hover:text-[#967141]"
                >
                  Offers
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ page: 'about' })}
                  className="text-[#594238] hover:text-[#967141]"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ page: 'contact' })}
                  className="text-[#594238] hover:text-[#967141]"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Policies & Support */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#967141]">
              Policies & Support
            </p>
            <ul className="mt-4 space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ page: 'policy-terms' })}
                  className="text-[#594238] hover:text-[#967141]"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ page: 'policy-no-return' })}
                  className="text-[#594238] hover:text-[#967141]"
                >
                  No Return Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ page: 'policy-no-exchange' })}
                  className="text-[#594238] hover:text-[#967141]"
                >
                  No Exchange Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ page: 'policy-shipping' })}
                  className="text-[#594238] hover:text-[#967141]"
                >
                  Shipping / Delivery Information
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ page: 'faq' })}
                  className="text-[#594238] hover:text-[#967141]"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ page: 'contact' })}
                  className="text-[#594238] hover:text-[#967141]"
                >
                  Customer Support
                </button>
              </li>
              <li className="pt-1">
                <button
                  type="button"
                  onClick={() => navigate({ page: 'admin' })}
                  className="text-[11px] font-medium text-[#796454] underline decoration-[#B18A58]/60 underline-offset-4 hover:text-[#594238]"
                >
                  Admin Panel
                </button>
              </li>
            </ul>
          </div>

          {/* Direct Contact */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#967141]">
              Direct Concierge
            </p>
            <div className="mt-4 space-y-3 text-xs text-[#796454]">
              <p className="flex items-center gap-2 text-[#594238]">
                <Phone className="h-3.5 w-3.5 text-[#B18A58]" />
                <a
                  href={`tel:+${siteConfig.whatsappNumber}`}
                  className="tabular-nums font-semibold hover:underline"
                >
                  +91 {siteConfig.whatsappDisplay}
                </a>
              </p>
              <p>
                Instagram:{' '}
                <a
                  href={`https://instagram.com/${cleanHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#594238] hover:underline"
                >
                  {siteConfig.instagramHandle}
                </a>
              </p>
              <p>
                Facebook:{' '}
                <a
                  href={`https://www.facebook.com/search/top?q=${encodeURIComponent(siteConfig.facebookPage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#594238] hover:underline"
                >
                  {siteConfig.facebookPage}
                </a>
              </p>
              <button
                type="button"
                onClick={() => navigate({ page: 'contact' })}
                className="mt-2 inline-block rounded border border-[#B18A58] bg-[#F5EBDD] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#594238] transition-colors hover:bg-[#594238] hover:text-[#F5EBDD]"
              >
                Customer Support
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Trust Summary */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-[#DCC8AC] pt-6 text-[11px] text-[#796454] sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.brandName} · {siteConfig.tagline}
          </p>
          <p className="uppercase tracking-[0.14em]">
            No Return · No Exchange · Dispatch 3–4 Days · 8000+ Deliveries · All India Delivery
          </p>
        </div>
      </div>
    </footer>
  );
};
