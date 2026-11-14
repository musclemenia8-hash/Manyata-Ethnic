import React from 'react';
import { useStore } from '../../context/StoreContext';

/**
 * Premium Kurti Video & Fashion Story
 */
export const KurtiVideoStory: React.FC = () => {
  const { navigate, siteConfig } = useStore();

  return (
    <section aria-label="Craftsmanship and Kurti Fashion Story" className="bg-luxury-silk py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          {/* Editorial Fashion Prose */}
          <div className="order-2 lg:order-1 lg:col-span-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8F693A]">
              The Kurti Fashion Story
            </p>
            <h2 className="mt-2 [text-wrap:balance] font-serif text-3xl font-semibold leading-tight text-[#2A1E19] sm:text-4xl">
              Crafted Movement, Effortless Poise
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#4A3830] sm:text-base">
              Indian ethnic dressing is defined by the rhythm of fabric in motion—the sweep of a
              flared kalidar hem, the poise of a tailored straight-cut kurta, and the quiet shimmer
              of fine zari and mirror accents catching daylight.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#4A3830] sm:text-base">
              From breathable hand-block printed cottons suited for long mornings to luminous ivory,
              emerald, and crimson festive Anarkalis paired with bordered dupattas, every piece is
              curated so modern wardrobes feel rooted in tradition.
            </p>

            <div className="mt-7 border-y border-[#DCC8AC] py-4">
              <p className="font-serif text-lg italic text-[#594238]">
                &ldquo;Designed for effortless drape—graceful for festive rituals, composed for every
                occasion in between.&rdquo;
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#967141]">
                {siteConfig.brandName} · {siteConfig.tagline}
              </p>
            </div>

            <div className="mt-7">
              <button
                type="button"
                onClick={() => navigate({ page: 'product', id: 'me-anr-09' })}
                className="rounded-md border border-[#594238] bg-[#594238] px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#F5EBDD] transition-colors hover:bg-[#46332B]"
              >
                Shop Featured Ensemble
              </button>
            </div>
          </div>

          {/* Responsive Video Frame */}
          <div className="order-1 lg:order-2 lg:col-span-6">
            <div className="relative mx-auto max-w-md overflow-hidden rounded-xl border border-[#DCC8AC] bg-[#E8D8BD] shadow-sm">
              <div className="aspect-[3/4] w-full overflow-hidden">
                <video
                  src={siteConfig.fashionStoryVideo}
                  poster="/assets/aistudio/IMG-20261107-WA0129_1a00ba8b.jpg"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="photo-graded h-full w-full object-cover object-top"
                />
              </div>
              <div className="bg-luxury-card border-t border-[#D4B890]/85 px-5 py-3.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8F693A]">
                  In Motion · Champagne Ivory & Emerald Set
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
