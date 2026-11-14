import React, { useEffect, useState } from 'react';
import { OFFICIAL_BUNDLE_TIERS, formatINR } from '../../utils/pricing';
import { useStore } from '../../context/StoreContext';

const MARQUEE_ITEMS = [
  '1 Dress – ₹699',
  '2 Dresses – ₹1,299',
  '3 Dresses – ₹1,699',
  '5 Dresses – ₹2,499',
  'Dispatch in 3–4 Days',
  'All India Delivery',
  '8000+ Deliveries Completed',
  'Sizes Available: XS · S · M · L · XL',
];

function getOfferCountdown(isoString: string): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} | null {
  if (!isoString) return null;
  const target = Date.parse(isoString);
  if (Number.isNaN(target)) return null;
  const diff = target - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

/**
 * Premium Offers & Discount Zone
 * Strictly shows 1 Dress ₹699, 2 Dresses ₹1,299, 3 Dresses ₹1,699, 5 Dresses ₹2,499.
 * Countdown timer renders ONLY if Admin configures an explicit future expiry date.
 */
export const OffersSection: React.FC = () => {
  const { navigate, siteConfig } = useStore();
  const [countdown, setCountdown] = useState(() => getOfferCountdown(siteConfig.offerExpiryIso));

  useEffect(() => {
    setCountdown(getOfferCountdown(siteConfig.offerExpiryIso));
    if (!siteConfig.offerExpiryIso) return;
    const t = window.setInterval(() => {
      setCountdown(getOfferCountdown(siteConfig.offerExpiryIso));
    }, 1000);
    return () => window.clearInterval(t);
  }, [siteConfig.offerExpiryIso]);

  return (
    <section aria-label="Premium Offers and Discount Zone" className="bg-luxury-champagne">
      {/* Moving Horizontal Marquee Strip */}
      <div className="overflow-hidden border-y border-[#B18A58]/40 bg-[#594238] py-3 text-[#F5EBDD]">
        <div className="animate-manyata-marquee">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
            <span
              key={idx}
              className="tabular-nums mx-6 inline-flex items-center gap-6 whitespace-nowrap text-xs font-medium uppercase tracking-[0.18em]"
            >
              <span>{item}</span>
              <span className="text-[#B18A58]">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* Special Offer Price List Card Section */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="bg-luxury-silk rounded-xl border border-[#B18A58]/50 p-6 shadow-sm sm:p-10">
          <div className="flex flex-col justify-between gap-4 border-b border-[#DCC8AC] pb-6 md:flex-row md:items-end">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#967141]">
                Boutique Value Packs
              </p>
              <h2 className="mt-1.5 [text-wrap:balance] font-serif text-3xl font-semibold text-[#594238] sm:text-4xl">
                Special Offer Price List
              </h2>
              <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-[#796454] sm:text-sm">
                Mix and match any designs, colours, and sizes (XS, S, M, L, XL) across the store—bundle pricing calculates automatically inside your shopping bag.
              </p>
              {countdown && (
                <p className="tabular-nums mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#967141]">
                  Offer ends in {countdown.days}d {String(countdown.hours).padStart(2, '0')}h{' '}
                  {String(countdown.minutes).padStart(2, '0')}m {String(countdown.seconds).padStart(2, '0')}s
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => navigate({ page: 'shop' })}
              className="self-start whitespace-nowrap rounded-md bg-[#594238] px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#F5EBDD] transition-colors hover:bg-[#46332B] md:self-auto"
            >
              Build Your Bundle
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {OFFICIAL_BUNDLE_TIERS.map((tier, index) => {
              const perDress = Math.round(tier.price / tier.count);
              const isBestValue = tier.count === 5;
              return (
                <button
                  key={tier.count}
                  type="button"
                  onClick={() => navigate({ page: 'shop' })}
                  className={`flex flex-col justify-between rounded-lg border p-5 text-left transition-all hover:shadow-md ${
                    isBestValue
                      ? 'border-[#B18A58] bg-[#E8D8BD]'
                      : 'border-[#DCC8AC] bg-[#EFE3D0]/70 hover:border-[#B18A58]'
                  }`}
                >
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#967141]">
                      Tier 0{index + 1} {isBestValue ? '· Best Value' : ''}
                    </p>
                    <p className="mt-2 font-serif text-2xl font-semibold text-[#594238]">
                      {tier.count === 1 ? '1 Dress' : `${tier.count} Dresses`}
                    </p>
                  </div>

                  <div className="mt-5 border-t border-[#DCC8AC] pt-3">
                    <p className="tabular-nums font-serif text-3xl font-semibold text-[#594238]">
                      {formatINR(tier.price)}
                    </p>
                    <p className="tabular-nums mt-1 text-xs text-[#796454]">
                      Approx. {formatINR(perDress)} per dress
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
