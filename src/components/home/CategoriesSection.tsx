import React from 'react';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES } from '../../data/products';
import { useStore } from '../../context/StoreContext';

/**
 * Shop by Categories
 * Strictly displays category cards ONLY in a crisp 2-column mobile / 3-column desktop grid.
 */
export const CategoriesSection: React.FC = () => {
  const { navigate, products } = useStore();

  return (
    <section aria-label="Shop by Categories" className="bg-luxury-silk py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-4 border-b border-[#D4BC96] pb-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#967141]">
              Curated Wardrobe
            </p>
            <h2 className="mt-1.5 [text-wrap:balance] font-serif text-3xl font-semibold text-[#2A1E19] sm:text-4xl">
              Shop by Categories
            </h2>
          </div>
          <p className="max-w-md text-xs leading-relaxed text-[#4F3D34] sm:text-sm">
            Explore silhouette-led collections tailored across sizes XS to XL for everyday elegance and celebratory gatherings.
          </p>
        </div>

        {/* Mobile 2 columns, Desktop 3 columns: strictly Category Cards only */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
          {CATEGORIES.map((category) => {
            const itemCount = products.filter((p) => p.category === category.slug).length;
            return (
              <button
                key={category.slug}
                type="button"
                onClick={() => navigate({ page: 'category', slug: category.slug })}
                className="bg-luxury-card group relative flex flex-col overflow-hidden rounded-xl border border-[#D4BC96] text-left transition-all duration-300 hover:border-[#B18A58] hover:shadow-md"
              >
                <div className="aspect-[4/5] w-full overflow-hidden bg-[#E8D8BD]">
                  <img
                    src={category.coverImage}
                    alt={category.name}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="photo-graded photo-graded-hover h-full w-full object-cover object-top"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                  <div>
                    <p className="tabular-nums text-[10px] font-semibold uppercase tracking-[0.16em] text-[#967141] sm:text-[11px]">
                      {itemCount} Design{itemCount === 1 ? '' : 's'}
                    </p>
                    <h3 className="mt-1 font-serif text-lg font-semibold text-[#594238] sm:text-2xl">
                      {category.name}
                    </h3>
                    <p className="mt-1 hidden text-xs leading-relaxed text-[#796454] sm:block">
                      {category.description}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#594238] transition-colors group-hover:text-[#B18A58]">
                    <span>Explore</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
