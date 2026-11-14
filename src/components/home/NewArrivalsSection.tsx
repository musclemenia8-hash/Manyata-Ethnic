import React, { useMemo, useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../ProductCard';

/**
 * New Arrivals Section
 * Initially displays exact 6 products (Mobile: 2 per row x 3 rows; Desktop: 4 + 2)
 * with a clean Load More action revealing remaining new arrivals.
 */
export const NewArrivalsSection: React.FC = () => {
  const { products } = useStore();
  const newArrivals = useMemo(() => products.filter((p) => p.isNewArrival), [products]);
  const [visibleCount, setVisibleCount] = useState(6);

  const visibleProducts = newArrivals.slice(0, visibleCount);
  const hasMore = visibleCount < newArrivals.length;

  return (
    <section aria-label="New Arrivals" className="bg-luxury-silk py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-3 border-b border-[#D4BC96] pb-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#967141]">
              Fresh From The Loom
            </p>
            <h2 className="mt-1.5 [text-wrap:balance] font-serif text-3xl font-semibold text-[#2A1E19] sm:text-4xl">
              New Arrivals
            </h2>
          </div>
          <p className="tabular-nums text-xs font-medium text-[#796454]">
            Showing {visibleProducts.length} of {newArrivals.length} new silhouettes
          </p>
        </div>

        {/* Mobile: 2 cards per row | Desktop: 4 cards per row */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} badgeText="New Arrival" />
          ))}
        </div>

        {hasMore && (
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => setVisibleCount(newArrivals.length)}
              className="rounded-md border border-[#B18A58] bg-[#E8D8BD] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#594238] transition-colors hover:bg-[#594238] hover:text-[#F5EBDD]"
            >
              Load More New Arrivals ({newArrivals.length - visibleCount} more)
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
