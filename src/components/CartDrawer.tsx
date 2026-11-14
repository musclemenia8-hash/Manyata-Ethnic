import React from 'react';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatINR } from '../utils/pricing';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setCartOpen,
    cart,
    productsMap,
    pricingSummary,
    updateCartQuantity,
    removeFromCart,
    navigate,
  } = useStore();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-[#594238]/35 backdrop-blur-xs"
        onClick={() => setCartOpen(false)}
      />

      <aside className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-[#DCC8AC] bg-[#F5EBDD] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#DCC8AC] px-6 py-5">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="h-5 w-5 text-[#B18A58]" />
            <h2 className="font-serif text-2xl font-semibold text-[#594238]">
              Shopping Bag ({pricingSummary.totalUnits})
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setCartOpen(false)}
            aria-label="Close Shopping Bag"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#DCC8AC] text-[#594238] hover:bg-[#E8D8BD]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="border-b border-[#DCC8AC] bg-[#E8D8BD]/75 px-6 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#594238]">
            Bundle Offer: 1 ₹699 · 2 ₹1,299 · 3 ₹1,699 · 5 ₹2,499
          </p>
          {pricingSummary.nextTierHint && (
            <p className="mt-0.5 text-xs text-[#796454]">{pricingSummary.nextTierHint}</p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#DCC8AC] bg-[#E8D8BD]">
                <ShoppingBag className="h-6 w-6 text-[#B18A58]" />
              </div>
              <p className="font-serif text-xl font-medium text-[#594238]">
                Your bag is currently empty
              </p>
              <p className="mt-1.5 max-w-xs text-xs text-[#796454]">
                Choose your preferred colour and size (XS–XL) to enjoy Manyata Ethnic bundle pricing.
              </p>
              <button
                type="button"
                onClick={() => navigate({ page: 'shop' })}
                className="mt-6 rounded-md bg-[#594238] px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#F5EBDD] hover:bg-[#46332B]"
              >
                Shop Collection
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => {
                const product = productsMap.get(item.productId);
                if (!product) return null;
                const colorVariant =
                  product.colors.find((c) => c.id === item.colorId) || product.colors[0];

                return (
                  <div
                    key={`${item.productId}-${item.colorId}-${item.size}`}
                    className="flex gap-4 rounded-lg border border-[#DCC8AC] bg-[#EFE3D0]/70 p-3"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        navigate({ page: 'product', id: product.id, colorId: item.colorId })
                      }
                      className="h-24 w-20 shrink-0 overflow-hidden rounded border border-[#DCC8AC] bg-[#E8D8BD]"
                    >
                      <img
                        src={colorVariant?.images[0] || ''}
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
                              navigate({ page: 'product', id: product.id, colorId: item.colorId })
                            }
                            className="text-left text-sm font-semibold text-[#594238] hover:text-[#B18A58]"
                          >
                            {product.name}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFromCart(product.id, item.colorId, item.size)}
                            aria-label="Remove item"
                            className="text-[#796454] hover:text-[#594238]"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="mt-0.5 text-xs text-[#796454]">
                          {item.colorName} · Size:{' '}
                          <span className="font-semibold text-[#594238]">{item.size}</span> ·{' '}
                          <span className="tabular-nums">{formatINR(product.price)}</span>
                        </p>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="inline-flex items-center rounded border border-[#DCC8AC] bg-[#F5EBDD]">
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQuantity(
                                product.id,
                                item.colorId,
                                item.size,
                                item.quantity - 1
                              )
                            }
                            aria-label="Decrease quantity"
                            className="px-2.5 py-1 text-[#594238] hover:bg-[#E8D8BD]"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="tabular-nums min-w-8 text-center text-xs font-semibold text-[#594238]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQuantity(
                                product.id,
                                item.colorId,
                                item.size,
                                item.quantity + 1
                              )
                            }
                            aria-label="Increase quantity"
                            className="px-2.5 py-1 text-[#594238] hover:bg-[#E8D8BD]"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <p className="tabular-nums text-sm font-semibold text-[#594238]">
                          {formatINR(product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-[#DCC8AC] bg-[#E8D8BD]/70 p-6">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[#796454]">
                <span>Subtotal ({pricingSummary.totalUnits} items)</span>
                <span className="tabular-nums">{formatINR(pricingSummary.regularTotal)}</span>
              </div>
              {pricingSummary.savings > 0 && (
                <div className="flex justify-between font-medium text-[#967141]">
                  <span>Bundle Offer Adjustment</span>
                  <span className="tabular-nums">-{formatINR(pricingSummary.savings)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-[#DCC8AC] pt-2 text-base font-semibold text-[#594238]">
                <span>Offer Total</span>
                <span className="tabular-nums">{formatINR(pricingSummary.finalTotal)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate({ page: 'checkout' })}
              className="mt-4 w-full rounded-md bg-[#594238] py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#F5EBDD] transition-colors hover:bg-[#46332B]"
            >
              Review Order & WhatsApp Checkout
            </button>
            <p className="mt-2.5 text-center text-[11px] text-[#796454]">
              NO RETURN · NO EXCHANGE · DISPATCH IN 3–4 DAYS · ALL INDIA DELIVERY
            </p>
          </div>
        )}
      </aside>
    </div>
  );
};
