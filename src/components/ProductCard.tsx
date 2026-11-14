import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ALL_PRODUCT_SIZES, Product } from '../types';
import { formatINR } from '../utils/pricing';

interface ProductCardProps {
  product: Product;
  badgeText?: string;
}

/**
 * Universal Product Card Design
 * - Shows interactive colour swatches ONLY when genuinely available in multiple colours (> 1).
 * - Single-colour designs hide swatches cleanly without fake colour options.
 * - Uses coordinated golden-beige luxury card surface & crisp dark Myntra-inspired readable typography.
 */
export const ProductCard: React.FC<ProductCardProps> = ({ product, badgeText }) => {
  const { navigate, toggleWishlist, isWishlisted } = useStore();
  const saved = isWishlisted(product.id);
  const hasMultipleColors = product.colors.length > 1;
  const [previewColorId, setPreviewColorId] = useState<string>(product.colors[0]?.id || '');

  const activeColor =
    product.colors.find((c) => c.id === previewColorId) || product.colors[0];

  const availableSizeCount = activeColor
    ? ALL_PRODUCT_SIZES.filter((sz) => (activeColor.stockBySize[sz] ?? 0) > 0).length
    : 0;

  return (
    <article className="bg-luxury-card group flex h-full flex-col overflow-hidden rounded-xl border border-[#D4BC96]/90 shadow-xs transition-all duration-300 hover:border-[#B18A58] hover:shadow-md">
      {/* Consistent Portrait Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#E8D8BD]">
        <button
          type="button"
          onClick={() =>
            navigate({ page: 'product', id: product.id, colorId: activeColor?.id })
          }
          className="block h-full w-full text-left focus:outline-none"
          aria-label={`View ${product.name}`}
        >
          <img
            src={activeColor?.images[0] || ''}
            alt={`${product.name}${activeColor ? ` - ${activeColor.colorName}` : ''}`}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="photo-graded photo-graded-hover h-full w-full object-cover object-top"
          />
        </button>

        {/* Refined Wishlist Icon */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          aria-label={
            saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`
          }
          className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full border border-[#D4BC96] bg-[#FAF3E8]/95 text-[#594238] shadow-xs backdrop-blur-xs transition-transform hover:scale-105"
        >
          <Heart
            className="h-4 w-4"
            strokeWidth={1.7}
            fill={saved ? '#B18A58' : 'none'}
            stroke={saved ? '#B18A58' : '#594238'}
          />
        </button>
      </div>

      {/* Product Typography (Dark, Clean, Readable Hierarchy) */}
      <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-4">
        <div>
          <p className="font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-[#6D5549] sm:text-[11px]">
            {badgeText ? `${badgeText} · ${product.categoryLabel}` : product.categoryLabel}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate({ page: 'product', id: product.id, colorId: activeColor?.id })
            }
            className="mt-1 block text-left font-sans text-sm font-semibold leading-snug text-[#241915] transition-colors group-hover:text-[#7D5B30] sm:text-[15px]"
          >
            {product.name}
          </button>

          {/* Show Colour Options ONLY when genuinely available in multiple colours */}
          {hasMultipleColors && (
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              {product.colors.map((c) => {
                const isSelected = c.id === activeColor?.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    title={c.colorName}
                    aria-label={`Preview ${product.name} in ${c.colorName}`}
                    onClick={() => setPreviewColorId(c.id)}
                    className={`h-4 w-4 rounded-full border transition-transform hover:scale-110 ${
                      isSelected
                        ? 'border-[#241915] ring-2 ring-[#B18A58]/70 ring-offset-1 ring-offset-[#F4E8D5]'
                        : 'border-[#594238]/35'
                    }`}
                    style={{ backgroundColor: c.swatchHex }}
                  />
                );
              })}
              <span className="ml-0.5 font-sans text-[11px] font-medium text-[#4A3830]">
                {product.colors.length} colours
              </span>
            </div>
          )}
        </div>

        <div className="mt-3 flex items-baseline justify-between border-t border-[#D4BC96]/75 pt-2.5">
          <div>
            <span className="tabular-nums font-sans text-sm font-bold text-[#241915] sm:text-base">
              {formatINR(product.price)}
            </span>
            <span className="ml-2 font-sans text-[11px] font-medium text-[#4A3830]">
              {availableSizeCount > 0 ? 'XS–XL' : 'Out of Stock'}
            </span>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate({ page: 'product', id: product.id, colorId: activeColor?.id })
            }
            className="font-sans text-[11px] font-bold uppercase tracking-[0.1em] text-[#241915] underline decoration-[#B18A58] underline-offset-4 transition-colors hover:text-[#967141]"
          >
            View
          </button>
        </div>
      </div>
    </article>
  );
};
