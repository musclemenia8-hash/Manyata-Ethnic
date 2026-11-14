import React from 'react';
import { ArrowLeft, Heart, Search } from 'lucide-react';
import { useStore } from '../context/StoreContext';

/**
 * Section 01 – Premium Luxury Navigation Bar
 * Strictly contains EXACTLY five main controls in order:
 * 1. Three-horizontal-line hamburger menu
 * 2. Circular brand logo
 * 3. Search button (supports text + image/camera search)
 * 4. Wishlist / Like button
 * 5. Back button
 * Note: Zero cart/bag icon in this five-control bar per brand specification.
 */
export const Navbar: React.FC = () => {
  const {
    canGoBack,
    goBack,
    navigate,
    setMenuOpen,
    setSearchOpen,
    setWishlistOpen,
    wishlist,
  } = useStore();

  return (
    <header className="bg-luxury-nav sticky top-0 z-40 w-full border-b border-[#D2B993]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-3 sm:px-6 lg:px-8">
        {/* Left Unit: HAMBURGER MENU -> ORIGINAL BRAND LOGO -> MANYATA ETHNIC */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          {/* Control 1: Three-horizontal-line Hamburger Menu (Extreme Left) */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open Navigation Menu"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#594238] transition-colors hover:bg-[#E8D8BD] sm:h-10 sm:w-10"
          >
            <svg
              width="21"
              height="15"
              viewBox="0 0 22 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <line x1="1" y1="2" x2="21" y2="2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <line x1="1" y1="8" x2="21" y2="8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <line x1="1" y1="14" x2="21" y2="14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>

          {/* Control 2: Connected Brand Identity Unit (Original Circular Logo + Manyata Ethnic) */}
          <button
            type="button"
            onClick={() => navigate({ page: 'home' })}
            aria-label="Manyata Ethnic Home"
            className="group flex min-w-0 items-center gap-2 focus:outline-none sm:gap-2.5"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#B18A58]/55 bg-[#F9F2E7] shadow-xs transition-transform duration-300 group-hover:scale-105 sm:h-11 sm:w-11">
              <img
                src="/assets/aistudio/cropped_circle_image__17__fc4e52af.png"
                alt="Manyata Ethnic Original Logo"
                className="h-full w-full object-contain"
              />
            </span>
            <span className="truncate font-serif text-[17px] font-semibold tracking-[0.06em] text-[#594238] transition-colors group-hover:text-[#967141] sm:text-xl sm:tracking-[0.1em]">
              Manyata Ethnic
            </span>
          </button>
        </div>

        {/* Right Controls: Search, Wishlist, and Back arranged neatly after brand identity */}
        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1.5">
          {/* Control 3: Search Button (Text + Image Search) */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Search Products or Upload Photo"
            title="Search & Photo Match"
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#594238] transition-colors hover:bg-[#E8D8BD] sm:h-10 sm:w-10"
          >
            <Search className="h-[18px] w-[18px] sm:h-[19px] sm:w-[19px]" strokeWidth={1.7} />
          </button>

          {/* Control 4: Wishlist / Like Button */}
          <button
            type="button"
            onClick={() => setWishlistOpen(true)}
            aria-label={`Open Wishlist (${wishlist.length} saved)`}
            title="Saved Wishlist"
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-[#594238] transition-colors hover:bg-[#E8D8BD] sm:h-10 sm:w-10"
          >
            <Heart
              className="h-[18px] w-[18px] sm:h-[19px] sm:w-[19px]"
              strokeWidth={1.7}
              fill={wishlist.length > 0 ? '#B18A58' : 'none'}
              stroke={wishlist.length > 0 ? '#B18A58' : 'currentColor'}
            />
            {wishlist.length > 0 && (
              <span className="tabular-nums absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#594238] px-1 text-[10px] font-medium text-[#F5EBDD] sm:right-1 sm:top-1">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Control 5: Back Button */}
          <button
            type="button"
            onClick={goBack}
            disabled={!canGoBack}
            aria-label="Go Back to Previous Page"
            title={canGoBack ? 'Back' : 'At Home'}
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors sm:h-10 sm:w-10 ${
              canGoBack
                ? 'text-[#594238] hover:bg-[#E8D8BD]'
                : 'cursor-default text-[#796454]/45'
            }`}
          >
            <ArrowLeft className="h-[18px] w-[18px] sm:h-[19px] sm:w-[19px]" strokeWidth={1.7} />
          </button>
        </div>
      </div>
    </header>
  );
};
