import React, { useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../ProductCard';

/**
 * Best Sellers Section
 * Displays 6 curated signature products using the universal ProductCard (grid-cols-2 lg:grid-cols-4),
 * with zero fabricated popularity rankings or counters.
 */
export const BestSellersSection: React.FC = () => {
  const { navigate, products } = useStore();
  const bestSellers = useMemo(
    () => products.filter((p) => p.isBestSeller).slice(0, 6),
    [products]
  );

  return (
    <section
      aria-label="Best Sellers"
      className="bg-luxury-champagne border-t border-[#D4BC96] py-14 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-4 border-b border-[#D4BC96] pb-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#967141]">
              Signature Silhouettes
            </p>
            <h2 className="mt-1.5 [text-wrap:balance] font-serif text-3xl font-semibold text-[#2A1E19] sm:text-4xl">
              Best Sellers
            </h2>
          </div>

          <button
            type="button"
            onClick={() => navigate({ page: 'best-sellers' })}
            className="self-start text-xs font-semibold uppercase tracking-[0.15em] text-[#594238] underline decoration-[#B18A58] underline-offset-4 hover:text-[#967141] sm:self-auto"
          >
            View All Best Sellers
          </button>
        </div>

        {/* Mobile: 2 cards per row | Desktop: 4 cards per row */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} badgeText="Best Seller" />
          ))}
        </div>
      </div>
    </section>
  );
};
