import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { COLLAGE_BANNERS } from '../../data/products';
import { useStore } from '../../context/StoreContext';

/**
 * Three Premium Four-Photo Collage Sliders
 * Zero-gap seamless 2x2 grid: all four panels have equal dimensions and touch directly
 * with zero lines, margins, padding, or gutters between images.
 */
export const CollageSliders: React.FC = () => {
  const { navigate } = useStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % COLLAGE_BANNERS.length);
    }, 4800);
    return () => window.clearInterval(timer);
  }, [isHovered]);

  const currentCollage = COLLAGE_BANNERS[activeIndex];

  return (
    <section
      aria-label="Curated Lookbook Collages"
      className="bg-luxury-champagne border-y border-[#D4BC96]/80 py-12 sm:py-16"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading & Controls */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#967141]">
              {currentCollage.eyebrow}
            </p>
            <h2 className="mt-1.5 [text-wrap:balance] font-serif text-3xl font-semibold text-[#2A1E19] sm:text-4xl">
              {currentCollage.title}
            </h2>
            <p className="mt-1 text-sm text-[#4F3D34]">{currentCollage.subtitle}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              {COLLAGE_BANNERS.map((banner, idx) => (
                <button
                  key={banner.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Show collage ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === activeIndex
                      ? 'w-7 bg-[#594238]'
                      : 'w-2 bg-[#B18A58]/40 hover:bg-[#B18A58]'
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() =>
                  setActiveIndex(
                    (prev) => (prev - 1 + COLLAGE_BANNERS.length) % COLLAGE_BANNERS.length
                  )
                }
                aria-label="Previous Collage"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D4BC96] bg-[#F7EFE2] text-[#594238] transition-colors hover:border-[#B18A58] hover:bg-[#EFE3D0]"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setActiveIndex((prev) => (prev + 1) % COLLAGE_BANNERS.length)}
                aria-label="Next Collage"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D4BC96] bg-[#F7EFE2] text-[#594238] transition-colors hover:border-[#B18A58] hover:bg-[#EFE3D0]"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Seamless Zero-Gap Sliding Track of 3 Distinct 2x2 Collages */}
        <div className="overflow-hidden rounded-xl border border-[#D4BC96] bg-[#F5EBDD] shadow-sm">
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {COLLAGE_BANNERS.map((banner) => (
              <div key={banner.id} className="w-full shrink-0">
                {/* Zero gap, zero padding, zero margins, zero borders between the 4 tiles */}
                <div className="grid grid-cols-2 gap-0">
                  {banner.photos.map((photo, pIdx) => (
                    <button
                      key={`${banner.id}-${pIdx}`}
                      type="button"
                      onClick={() => navigate({ page: 'product', id: photo.productId })}
                      className="group relative m-0 block aspect-square w-full overflow-hidden rounded-none border-0 p-0 text-left focus:outline-none"
                    >
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="photo-collage-tile block h-full w-full object-cover object-top"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#2A1E19]/75 via-[#2A1E19]/25 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <p className="text-xs font-medium text-[#F9F2E7]">{photo.alt}</p>
                        <p className="text-[10px] uppercase tracking-widest text-[#E8D8BD]">
                          View Dress
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-luxury-card flex items-center justify-between border-t border-[#D4BC96]/80 px-4 py-3 sm:px-5">
            <span className="tabular-nums text-xs font-medium text-[#4F3D34]">
              Collage 0{activeIndex + 1} / 0{COLLAGE_BANNERS.length}
            </span>
            <button
              type="button"
              onClick={() =>
                navigate({ page: 'category', slug: currentCollage.ctaCategory })
              }
              className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2A1E19] underline decoration-[#B18A58] underline-offset-4 hover:text-[#967141]"
            >
              Explore This Edit
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
