import React, { useState } from 'react';
import { Heart, ShoppingBag, Trash2, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ALL_PRODUCT_SIZES, ProductSize } from '../types';
import { formatINR } from '../utils/pricing';

export const WishlistDrawer: React.FC = () => {
  const {
    isWishlistOpen,
    setWishlistOpen,
    wishlist,
    productsMap,
    toggleWishlist,
    addToCart,
    navigate,
  } = useStore();

  const [selectedSizes, setSelectedSizes] = useState<Record<string, ProductSize>>({});
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>({});

  if (!isWishlistOpen) return null;

  const savedProducts = wishlist
    .map((id) => productsMap.get(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-[#594238]/35 backdrop-blur-xs"
        onClick={() => setWishlistOpen(false)}
      />

      <aside className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-[#DCC8AC] bg-[#F5EBDD] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#DCC8AC] px-6 py-5">
          <div className="flex items-center gap-2.5">
            <Heart className="h-5 w-5 text-[#B18A58]" fill="#B18A58" />
            <h2 className="font-serif text-2xl font-semibold text-[#594238]">
              Wishlist ({savedProducts.length})
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setWishlistOpen(false)}
            aria-label="Close Wishlist"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#DCC8AC] text-[#594238] hover:bg-[#E8D8BD]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {savedProducts.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#DCC8AC] bg-[#E8D8BD]">
                <Heart className="h-6 w-6 text-[#B18A58]" />
              </div>
              <p className="font-serif text-xl font-medium text-[#594238]">
                Your wishlist awaits
              </p>
              <p className="mt-1.5 max-w-xs text-xs text-[#796454]">
                Tap the heart icon on any silhouette to save your favorite ethnic styles.
              </p>
              <button
                type="button"
                onClick={() => navigate({ page: 'shop' })}
                className="mt-6 rounded-md bg-[#594238] px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#F5EBDD] hover:bg-[#46332B]"
              >
                Explore Collection
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {savedProducts.map((product) => {
                const chosenColor =
                  product.colors.find((c) => c.id === selectedColors[product.id]) ||
                  product.colors[0];
                const chosenSize = selectedSizes[product.id] || 'M';
                const stockCount = chosenColor?.stockBySize[chosenSize] ?? 0;

                return (
                  <div
                    key={product.id}
                    className="flex gap-4 rounded-lg border border-[#DCC8AC] bg-[#EFE3D0]/70 p-3"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        navigate({ page: 'product', id: product.id, colorId: chosenColor?.id })
                      }
                      className="h-28 w-22 shrink-0 overflow-hidden rounded border border-[#DCC8AC] bg-[#E8D8BD]"
                    >
                      <img
                        src={chosenColor?.images[0] || ''}
                        alt={product.name}
                        className="h-full w-full object-cover object-top"
                      />
                    </button>

                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              navigate({
                                page: 'product',
                                id: product.id,
                                colorId: chosenColor?.id,
                              })
                            }
                            className="text-left text-sm font-semibold text-[#594238] hover:text-[#B18A58]"
                          >
                            {product.name}
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleWishlist(product.id)}
                            aria-label="Remove from wishlist"
                            className="text-[#796454] hover:text-[#594238]"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="tabular-nums mt-0.5 text-xs font-semibold text-[#594238]">
                          {formatINR(product.price)} ·{' '}
                          <span className="font-normal text-[#796454]">
                            {chosenColor?.colorName}
                          </span>
                        </p>

                        {product.colors.length > 1 && (
                          <div className="mt-1.5 flex items-center gap-1.5">
                            {product.colors.map((c) => (
                              <button
                                key={c.id}
                                type="button"
                                title={c.colorName}
                                onClick={() =>
                                  setSelectedColors((prev) => ({ ...prev, [product.id]: c.id }))
                                }
                                className={`h-4 w-4 rounded-full border ${
                                  chosenColor?.id === c.id
                                    ? 'border-[#594238] ring-1 ring-[#B18A58]'
                                    : 'border-[#594238]/30'
                                }`}
                                style={{ backgroundColor: c.swatchHex }}
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-1">
                          {ALL_PRODUCT_SIZES.map((sz) => {
                            const hasStock = (chosenColor?.stockBySize[sz] ?? 0) > 0;
                            return (
                              <button
                                key={sz}
                                type="button"
                                disabled={!hasStock}
                                onClick={() =>
                                  setSelectedSizes((prev) => ({ ...prev, [product.id]: sz }))
                                }
                                className={`h-6 min-w-6 rounded border px-1 text-[10px] font-semibold transition-colors ${
                                  !hasStock
                                    ? 'cursor-not-allowed border-[#DCC8AC]/50 text-[#796454]/40 line-through'
                                    : chosenSize === sz
                                    ? 'border-[#594238] bg-[#594238] text-[#F5EBDD]'
                                    : 'border-[#DCC8AC] bg-[#F5EBDD] text-[#594238] hover:border-[#B18A58]'
                                }`}
                              >
                                {sz}
                              </button>
                            );
                          })}
                        </div>

                        <button
                          type="button"
                          disabled={stockCount <= 0}
                          onClick={() =>
                            chosenColor && addToCart(product.id, chosenColor.id, chosenSize, 1, true)
                          }
                          className="inline-flex items-center gap-1 rounded bg-[#B18A58] px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#F5EBDD] transition-colors hover:bg-[#967141] disabled:opacity-50"
                        >
                          <ShoppingBag className="h-3 w-3" />
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};
