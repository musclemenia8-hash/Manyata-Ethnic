import React from 'react';
import { useStore } from '../../context/StoreContext';

/**
 * Luxury Editorial Feature Banner (Admin-editable image, headline & copy)
 */
export const EditorialBanner: React.FC = () => {
  const { navigate, siteConfig } = useStore();

  return (
    <section
      aria-label="Signature Editorial Feature"
      className="bg-luxury-champagne border-y border-[#D4B890]/80 py-14 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-luxury-card grid items-stretch gap-8 overflow-hidden rounded-xl border border-[#D4B890]/85 shadow-sm lg:grid-cols-12">
          {/* Editorial Photo */}
          <div className="aspect-[4/5] w-full overflow-hidden bg-[#E8D8BD] lg:col-span-6 lg:aspect-auto lg:h-[540px]">
            <img
              src={siteConfig.editorialBannerImage}
              alt={siteConfig.editorialHeadline}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="photo-graded h-full w-full object-cover object-top"
            />
          </div>

          {/* Editorial Copy & CTA */}
          <div className="flex flex-col justify-center p-6 sm:p-10 lg:col-span-6 lg:p-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8F693A]">
              Signature Festive Edition
            </p>
            <h2 className="mt-3 [text-wrap:balance] font-serif text-3xl font-semibold leading-tight text-[#2A1E19] sm:text-5xl">
              {siteConfig.editorialHeadline}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#4A3830] sm:text-base">
              {siteConfig.editorialBody}
            </p>

            <div className="mt-7 grid grid-cols-3 gap-4 border-y border-[#DCC8AC] py-4">
              <div>
                <p className="font-serif text-xl font-semibold text-[#594238] sm:text-2xl">
                  XS – XL
                </p>
                <p className="mt-0.5 text-[11px] uppercase tracking-wider text-[#796454]">
                  Five Standard Sizes
                </p>
              </div>
              <div>
                <p className="tabular-nums font-serif text-xl font-semibold text-[#594238] sm:text-2xl">
                  3–4 Days
                </p>
                <p className="mt-0.5 text-[11px] uppercase tracking-wider text-[#796454]">
                  Dispatch Window
                </p>
              </div>
              <div>
                <p className="tabular-nums font-serif text-xl font-semibold text-[#594238] sm:text-2xl">
                  8000+
                </p>
                <p className="mt-0.5 text-[11px] uppercase tracking-wider text-[#796454]">
                  All India Orders
                </p>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate({ page: 'category', slug: 'festive-collection' })}
                className="rounded-md bg-[#594238] px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#F5EBDD] transition-colors hover:bg-[#46332B]"
              >
                Explore Festive Edit
              </button>
              <button
                type="button"
                onClick={() => navigate({ page: 'shop' })}
                className="rounded-md border border-[#B18A58] bg-transparent px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#594238] transition-colors hover:bg-[#E8D8BD]"
              >
                View All Designs
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
