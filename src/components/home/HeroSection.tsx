import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { BRAND_MEDIA } from '../../data/products';
import { useStore } from '../../context/StoreContext';

type HeroSlide =
  | { kind: 'video'; src: string; durationMs: number; label: string; headline: string; subline: string }
  | { kind: 'image'; src: string; alt: string; durationMs: number; label: string; headline: string; subline: string };

function getRemainingParts(isoString: string): {
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

export const HeroSection: React.FC = () => {
  const { navigate, siteConfig } = useStore();
  const [countdown, setCountdown] = useState(() => getRemainingParts(siteConfig.offerExpiryIso));

  useEffect(() => {
    setCountdown(getRemainingParts(siteConfig.offerExpiryIso));
    if (!siteConfig.offerExpiryIso) return;
    const timer = window.setInterval(() => {
      setCountdown(getRemainingParts(siteConfig.offerExpiryIso));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [siteConfig.offerExpiryIso]);

  const slides: HeroSlide[] = useMemo(
    () => [
      {
        kind: 'video',
        src: siteConfig.heroVideoOne,
        durationMs: 2200,
        label: 'Heritage Craft in Motion',
        headline: siteConfig.tagline,
        subline: 'Curated ethnic silhouettes tailored with heirloom motifs across XS to XL',
      },
      {
        kind: 'video',
        src: siteConfig.heroVideoTwo,
        durationMs: 2200,
        label: 'Day-to-Festive Grace',
        headline: 'Effortless Embroidered Kurtis',
        subline: 'Soft breathable weaves finished with delicate artisanal bootis',
      },
      ...BRAND_MEDIA.heroStills.map((still) => ({
        kind: 'image' as const,
        src: still.src,
        alt: still.alt,
        durationMs: 4200,
        label: 'Royal Lookbook',
        headline: still.title,
        subline: still.subtitle,
      })),
    ],
    [siteConfig.heroVideoOne, siteConfig.heroVideoTwo, siteConfig.tagline]
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});

  useEffect(() => {
    const active = slides[currentIndex];
    Object.entries(videoRefs.current).forEach(([idxStr, el]) => {
      const idx = Number(idxStr);
      if (!el) return;
      if (idx === currentIndex && active.kind === 'video') {
        el.currentTime = 0;
        if (!isPaused) {
          el.play().catch(() => {
            // Autoplay safeguard
          });
        } else {
          el.pause();
        }
      } else {
        el.pause();
      }
    });
  }, [currentIndex, isPaused, slides]);

  useEffect(() => {
    if (isPaused) return;
    const duration = slides[currentIndex].durationMs;
    const timer = window.setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, duration);
    return () => window.clearTimeout(timer);
  }, [currentIndex, isPaused, slides]);

  const activeSlide = slides[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <section aria-label="Brand Offer and Hero Showcase" className="bg-luxury-silk">
      {/* Original Promotional Discount Banner directly above Hero */}
      <button
        type="button"
        onClick={() => navigate({ page: 'offers' })}
        className="bg-luxury-champagne block w-full border-b border-[#B18A58]/45 px-4 py-2.5 text-center transition-colors hover:brightness-[0.98]"
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-1 sm:flex-row sm:gap-3">
          <span className="tabular-nums text-xs font-semibold tracking-wide text-[#594238] sm:text-[13px]">
            {siteConfig.discountBannerText}
          </span>
          {countdown && (
            <span className="tabular-nums text-[11px] font-semibold uppercase tracking-[0.14em] text-[#967141]">
              · Ends in {countdown.days}d {String(countdown.hours).padStart(2, '0')}h{' '}
              {String(countdown.minutes).padStart(2, '0')}m {String(countdown.seconds).padStart(2, '0')}s
            </span>
          )}
        </div>
      </button>

      {/* Hero Media Slider */}
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-4 sm:px-6 lg:px-8">
        <div className="relative h-[460px] w-full overflow-hidden rounded-xl border border-[#DCC8AC] bg-[#E8D8BD] shadow-sm sm:h-[520px] lg:h-[580px]">
          {slides.map((slide, idx) => {
            const isActive = idx === currentIndex;
            return (
              <div
                key={`${slide.kind}-${slide.src}-${idx}`}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  isActive ? 'z-10 opacity-100' : 'pointer-events-none z-0 opacity-0'
                }`}
              >
                {slide.kind === 'video' ? (
                  <video
                    ref={(el) => {
                      videoRefs.current[idx] = el;
                    }}
                    src={slide.src}
                    muted
                    playsInline
                    preload="auto"
                    className="photo-graded h-full w-full object-cover object-top"
                  />
                ) : (
                  <img
                    src={slide.src}
                    alt={slide.alt}
                    referrerPolicy="no-referrer"
                    className={`photo-graded h-full w-full object-cover object-top ${
                      isActive ? 'animate-ken-burns' : ''
                    }`}
                  />
                )}
                <div className="absolute inset-x-0 bottom-0 h-60 bg-gradient-to-t from-[#3F2D25]/85 via-[#3F2D25]/40 to-transparent" />
              </div>
            );
          })}

          {/* Editorial Overlay Content */}
          <div className="relative z-20 flex h-full flex-col justify-end p-6 sm:p-10 lg:p-12">
            <div className="max-w-xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E8D8BD]">
                {activeSlide.label}
              </p>
              <h1 className="mt-2 [text-wrap:balance] font-serif text-3xl font-semibold leading-tight text-[#F9F2E7] sm:text-5xl">
                {activeSlide.headline}
              </h1>
              <p className="mt-2.5 text-sm leading-relaxed text-[#F5EBDD]/90 sm:text-base">
                {activeSlide.subline}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate({ page: 'shop' })}
                  className="rounded-md bg-[#F5EBDD] px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#594238] transition-colors hover:bg-[#E8D8BD]"
                >
                  Shop Collection
                </button>
                <button
                  type="button"
                  onClick={() => navigate({ page: 'offers' })}
                  className="rounded-md border border-[#E8D8BD]/70 bg-[#594238]/50 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#F5EBDD] backdrop-blur-xs transition-colors hover:bg-[#594238]/80"
                >
                  Bundle Offers
                </button>
              </div>
            </div>

            {/* Slide Controls & Progress */}
            <div className="mt-6 flex items-center justify-between border-t border-[#F5EBDD]/20 pt-4">
              <div className="flex items-center gap-2">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Go to hero slide ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentIndex
                        ? 'w-7 bg-[#E8D8BD]'
                        : 'w-2 bg-[#F5EBDD]/40 hover:bg-[#F5EBDD]/70'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPaused((p) => !p)}
                  aria-label={isPaused ? 'Resume Hero Slider' : 'Pause Hero Slider'}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[#F5EBDD]/35 bg-[#3F2D25]/45 text-[#F5EBDD] backdrop-blur-xs hover:bg-[#3F2D25]/75"
                >
                  {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous Hero Slide"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[#F5EBDD]/35 bg-[#3F2D25]/45 text-[#F5EBDD] backdrop-blur-xs hover:bg-[#3F2D25]/75"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next Hero Slide"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[#F5EBDD]/35 bg-[#3F2D25]/45 text-[#F5EBDD] backdrop-blur-xs hover:bg-[#3F2D25]/75"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
