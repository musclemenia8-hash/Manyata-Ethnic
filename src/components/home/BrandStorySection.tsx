import React from 'react';
import { useStore } from '../../context/StoreContext';

/**
 * Brand Description ("Tradition Meet Modern Elegance")
 */
export const BrandStorySection: React.FC = () => {
  const { navigate, siteConfig } = useStore();

  return (
    <section
      aria-label={`About ${siteConfig.brandName}`}
      className="bg-luxury-champagne border-y border-[#D4B890]/80 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#8F693A]">
          The House of {siteConfig.brandName}
        </p>
        <h2 className="mt-3 [text-wrap:balance] font-serif text-3xl font-semibold text-[#2A1E19] sm:text-5xl">
          {siteConfig.tagline}
        </h2>
        <div className="mx-auto mt-5 h-px w-24 bg-[#B18A58]" />
        <p className="mt-6 text-sm leading-relaxed text-[#4A3830] sm:text-base">
          {siteConfig.brandName} celebrates the quiet richness of Indian ethnic wear—where classic
          silhouettes, warm heritage palettes, and thoughtful detailing meet accessible everyday
          refinement. Whether you reach for an airy hand-block printed cotton kurta, a zari-bordered
          straight suit, or a sweeping festive Anarkali, each piece is curated for balanced fit,
          comfortable wearability, and timeless poise.
        </p>

        <div className="mt-9 grid grid-cols-2 gap-4 border-y border-[#DCC8AC] py-6 sm:grid-cols-4">
          <div>
            <p className="tabular-nums font-serif text-2xl font-semibold text-[#594238]">8000+</p>
            <p className="mt-1 text-[11px] uppercase tracking-wider text-[#796454]">
              Deliveries Across India
            </p>
          </div>
          <div>
            <p className="tabular-nums font-serif text-2xl font-semibold text-[#594238]">3–4 Days</p>
            <p className="mt-1 text-[11px] uppercase tracking-wider text-[#796454]">
              Prompt Dispatch
            </p>
          </div>
          <div>
            <p className="font-serif text-2xl font-semibold text-[#594238]">XS – XL</p>
            <p className="mt-1 text-[11px] uppercase tracking-wider text-[#796454]">
              Five Standard Sizes
            </p>
          </div>
          <div>
            <p className="tabular-nums font-serif text-2xl font-semibold text-[#594238]">
              ₹699 Onward
            </p>
            <p className="mt-1 text-[11px] uppercase tracking-wider text-[#796454]">
              Bundle Value Tiers
            </p>
          </div>
        </div>

        <div className="mt-8">
          <button
            type="button"
            onClick={() => navigate({ page: 'about' })}
            className="text-xs font-semibold uppercase tracking-[0.18em] text-[#594238] underline decoration-[#B18A58] underline-offset-4 hover:text-[#967141]"
          >
            Read Our Story
          </button>
        </div>
      </div>
    </section>
  );
};
