import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BRAND_MEDIA } from '../../data/products';
import { useStore } from '../../context/StoreContext';

/**
 * Section 11 – Royal Photo & Video Slider
 * Pre-footer visual showcase alternating between our best royal supplied photograph and video.
 */
export const RoyalShowcaseSlider: React.FC = () => {
  const { navigate } = useStore();
  const slides = BRAND_MEDIA.royalSlider;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const duration = slides[index].type === 'video' ? 6500 : 4800;
    const timer = window.setTimeout(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, duration);
    return () => window.clearTimeout(timer);
  }, [index, slides]);

  const active = slides[index];

  return (
    <section aria-label="Royal Photo and Video Showcase" className="bg-luxury-silk py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8F693A]">
              Pre-Footer Showcase
            </p>
            <h2 className="mt-1.5 font-serif text-3xl font-semibold text-[#2A1E19] sm:text-4xl">
              Royal Lookbook & Motion
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIndex((prev) => (prev - 1 + slides.length) % slides.length)}
              aria-label="Previous Showcase"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#DCC8AC] bg-[#EFE3D0] text-[#594238] hover:border-[#B18A58]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setIndex((prev) => (prev + 1) % slides.length)}
              aria-label="Next Showcase"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#DCC8AC] bg-[#EFE3D0] text-[#594238] hover:border-[#B18A58]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="bg-luxury-card grid items-stretch overflow-hidden rounded-xl border border-[#D4B890]/85 shadow-sm md:grid-cols-12">
          <div className="relative h-[420px] w-full overflow-hidden bg-[#E8D8BD] sm:h-[480px] md:col-span-7">
            {slides.map((item, idx) => {
              const isCurrent = idx === index;
              return (
                <div
                  key={`${item.type}-${idx}`}
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    isCurrent ? 'opacity-100 z-10' : 'pointer-events-none opacity-0 z-0'
                  }`}
                >
                  {item.type === 'image' ? (
                    <img
                      src={item.src}
                      alt={item.title}
                      className="photo-graded h-full w-full object-cover object-top"
                    />
                  ) : (
                    <video
                      src={item.src}
                      poster={item.poster}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="photo-graded h-full w-full object-cover object-top"
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-col justify-between p-6 sm:p-10 md:col-span-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8F693A]">
                {active.type === 'image' ? 'Royal Editorial Still' : 'Royal Couture Motion'}
              </p>
              <h3 className="mt-2 font-serif text-2xl font-semibold text-[#2A1E19] sm:text-3xl">
                {active.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#4A3830]">{active.caption}</p>
            </div>

            <div className="mt-8 space-y-5">
              <div className="flex items-center gap-2">
                {slides.map((s, idx) => (
                  <button
                    key={s.title}
                    type="button"
                    onClick={() => setIndex(idx)}
                    className={`rounded border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                      idx === index
                        ? 'border-[#594238] bg-[#594238] text-[#F5EBDD]'
                        : 'border-[#DCC8AC] bg-[#F5EBDD] text-[#594238] hover:border-[#B18A58]'
                    }`}
                  >
                    {s.type === 'image' ? 'Royal Photo' : 'Fashion Video'}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => navigate({ page: 'shop' })}
                className="w-full rounded-md bg-[#B18A58] py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#F5EBDD] transition-colors hover:bg-[#967141]"
              >
                Explore Complete Collection
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
