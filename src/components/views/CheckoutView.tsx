import React, { useState } from 'react';
import { MessageCircle, Minus, Plus, ShieldAlert, ShoppingBag, Trash2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { OrderRecord } from '../../types';
import { formatINR } from '../../utils/pricing';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    productsMap,
    siteConfig,
    pricingSummary,
    updateCartQuantity,
    removeFromCart,
    logOrderRequest,
    clearCart,
    navigate,
  } = useStore();

  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [preparedRequest, setPreparedRequest] = useState<OrderRecord | null>(null);

  const handlePrepareWhatsAppOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (cart.length === 0) {
      setFormError('Your shopping bag is empty.');
      return;
    }

    const cleanedPhone = mobile.replace(/\D/g, '');
    if (cleanedPhone.length < 10) {
      setFormError('Please enter a valid 10-digit mobile number.');
      return;
    }

    const cleanedPin = pinCode.replace(/\D/g, '');
    if (cleanedPin.length !== 6) {
      setFormError('Please enter a valid 6-digit Indian PIN code.');
      return;
    }

    if (!acceptedPolicy) {
      setFormError('Please acknowledge the No Return & No Exchange Policy before continuing.');
      return;
    }

    const orderItems: OrderRecord['items'] = cart
      .map((item) => {
        const product = productsMap.get(item.productId);
        if (!product) return null;
        const color = product.colors.find((c) => c.id === item.colorId) || product.colors[0];
        return {
          productId: product.id,
          sku: product.sku,
          name: product.name,
          colorName: color ? color.colorName : item.colorName,
          size: item.size,
          quantity: item.quantity,
          unitPrice: product.price,
          image: color?.images[0] || '',
        };
      })
      .filter((x): x is NonNullable<typeof x> => Boolean(x));

    const record = logOrderRequest(
      {
        fullName: fullName.trim(),
        mobile: cleanedPhone,
        address: address.trim(),
        city: city.trim(),
        state: stateName.trim(),
        pinCode: cleanedPin,
      },
      orderItems,
      {
        totalUnits: pricingSummary.totalUnits,
        regularTotal: pricingSummary.regularTotal,
        finalTotal: pricingSummary.finalTotal,
        savings: pricingSummary.savings,
        appliedBreakdown: pricingSummary.appliedBreakdown,
      },
      'Cart WhatsApp Request'
    );

    setPreparedRequest(record);
    clearCart();
  };

  if (preparedRequest) {
    const waLines = [
      `Hello ${siteConfig.brandName}, I would like to request order *${preparedRequest.orderId}*:`,
      `Customer: ${preparedRequest.customer.fullName}`,
      ...preparedRequest.items.map(
        (it) =>
          `- ${it.name} (${it.sku}) | Colour: ${it.colorName} | Size: ${it.size} | Qty: ${it.quantity} | Unit: ${formatINR(it.unitPrice)}`
      ),
      `Total Offer Amount: ${formatINR(preparedRequest.pricing.finalTotal)}`,
      `Delivery Address: ${preparedRequest.customer.address}, ${preparedRequest.customer.city}, ${preparedRequest.customer.state} - ${preparedRequest.customer.pinCode} | Mobile: ${preparedRequest.customer.mobile}`,
    ].join('\n');

    return (
      <div className="bg-luxury-silk py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="bg-luxury-card rounded-xl border border-[#B18A58]/60 p-6 shadow-sm sm:p-10">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#B18A58] bg-[#E8D8BD]">
                <MessageCircle className="h-7 w-7 text-[#594238]" />
              </div>
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#967141]">
                Order Draft Prepared · Send via WhatsApp to Confirm
              </p>
              <h1 className="mt-1.5 font-serif text-3xl font-semibold text-[#594238] sm:text-4xl">
                Ready for WhatsApp, {preparedRequest.customer.fullName}
              </h1>
              <p className="tabular-nums mt-2 text-xs font-medium text-[#796454]">
                Request Reference:{' '}
                <span className="font-semibold text-[#594238]">{preparedRequest.orderId}</span> ·
                Status: Pending Confirmation
              </p>
            </div>

            <div className="mt-5 rounded-lg border border-[#B18A58]/50 bg-[#E8D8BD]/80 p-3.5 text-center text-xs leading-relaxed text-[#594238]">
              Please tap <strong>Send Order via WhatsApp</strong> below to submit your order details
              to <strong>{siteConfig.whatsappDisplay}</strong>. Your order will be confirmed and
              scheduled for dispatch (3–4 days) after we reply on WhatsApp.
            </div>

            {/* Order Items */}
            <div className="mt-6 space-y-3 border-t border-[#DCC8AC] pt-6">
              {preparedRequest.items.map((item) => (
                <div
                  key={`${item.productId}-${item.colorName}-${item.size}`}
                  className="flex items-center justify-between gap-4 rounded-lg border border-[#DCC8AC] bg-[#F5EBDD] p-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-14 rounded object-cover object-top"
                    />
                    <div>
                      <p className="text-sm font-semibold text-[#594238]">{item.name}</p>
                      <p className="tabular-nums text-xs text-[#796454]">
                        {item.sku} · {item.colorName} · Size: {item.size} · Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="tabular-nums text-sm font-semibold text-[#594238]">
                    {formatINR(item.unitPrice * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            {/* Pricing Summary */}
            <div className="mt-6 space-y-2 border-t border-[#DCC8AC] pt-5 text-xs">
              <div className="flex justify-between text-[#796454]">
                <span>Catalog Subtotal</span>
                <span className="tabular-nums">
                  {formatINR(preparedRequest.pricing.regularTotal)}
                </span>
              </div>
              {preparedRequest.pricing.savings > 0 && (
                <div className="flex justify-between font-medium text-[#967141]">
                  <span>Special Bundle Savings Applied</span>
                  <span className="tabular-nums">
                    -{formatINR(preparedRequest.pricing.savings)}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-t border-[#DCC8AC] pt-2.5 text-base font-semibold text-[#594238]">
                <span>Estimated Offer Total</span>
                <span className="tabular-nums">{formatINR(preparedRequest.pricing.finalTotal)}</span>
              </div>
            </div>

            <div className="mt-6 rounded-lg border border-[#DCC8AC] bg-[#F5EBDD] p-4 text-xs text-[#796454]">
              <p className="font-semibold text-[#594238]">Delivery Details</p>
              <p className="mt-1">
                {preparedRequest.customer.fullName} · {preparedRequest.customer.mobile}
              </p>
              <p>
                {preparedRequest.customer.address}, {preparedRequest.customer.city},{' '}
                {preparedRequest.customer.state} – {preparedRequest.customer.pinCode}
              </p>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(waLines)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-md bg-[#594238] py-3.5 text-center text-xs font-semibold uppercase tracking-[0.15em] text-[#F5EBDD] hover:bg-[#46332B]"
              >
                <MessageCircle className="h-4 w-4 text-[#E8D8BD]" />
                Send Order via WhatsApp ({siteConfig.whatsappDisplay})
              </a>
              <button
                type="button"
                onClick={() => navigate({ page: 'home' })}
                className="flex-1 rounded-md border border-[#B18A58] bg-transparent py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#594238] hover:bg-[#E8D8BD]"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-luxury-silk py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-b border-[#D4B890]/80 pb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8F693A]">
            {siteConfig.brandName} Checkout
          </p>
          <h1 className="mt-1.5 font-serif text-3xl font-semibold text-[#241915] sm:text-4xl">
            Prepare WhatsApp Order
          </h1>
        </div>

        {cart.length === 0 ? (
          <div className="bg-luxury-card mt-10 rounded-xl border border-[#D4B890] p-10 text-center">
            <ShoppingBag className="mx-auto h-9 w-9 text-[#B18A58]" />
            <h2 className="mt-3 font-serif text-2xl font-semibold text-[#594238]">
              Your shopping bag is empty
            </h2>
            <p className="mt-1.5 text-xs text-[#796454]">
              Explore our kurtis and bundle offers before proceeding to WhatsApp ordering.
            </p>
            <button
              type="button"
              onClick={() => navigate({ page: 'shop' })}
              className="mt-6 rounded-md bg-[#594238] px-7 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#F5EBDD]"
            >
              Browse Collection
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-12">
            {/* Customer Details Form */}
            <form onSubmit={handlePrepareWhatsAppOrder} className="space-y-6 lg:col-span-7">
              <div className="bg-luxury-card rounded-xl border border-[#D4B890]/85 p-6 sm:p-8">
                <h2 className="font-serif text-2xl font-semibold text-[#241915]">
                  Delivery Information
                </h2>
                <p className="mt-1 text-xs text-[#796454]">
                  All India delivery · Confirmed orders dispatch within 3–4 days.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <label className="block text-xs font-semibold text-[#594238]">
                    Customer Full Name *
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Full Name"
                      className="mt-1.5 w-full rounded-md border border-[#DCC8AC] bg-[#F5EBDD] px-3.5 py-2.5 text-sm text-[#594238] focus:border-[#B18A58] focus:outline-none"
                    />
                  </label>

                  <label className="block text-xs font-semibold text-[#594238]">
                    Mobile Number *
                    <input
                      type="tel"
                      required
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="tabular-nums mt-1.5 w-full rounded-md border border-[#DCC8AC] bg-[#F5EBDD] px-3.5 py-2.5 text-sm text-[#594238] focus:border-[#B18A58] focus:outline-none"
                    />
                  </label>

                  <label className="block text-xs font-semibold text-[#594238] sm:col-span-2">
                    Complete Delivery Address *
                    <textarea
                      rows={3}
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="House/Flat No., Building, Street, Landmark"
                      className="mt-1.5 w-full rounded-md border border-[#DCC8AC] bg-[#F5EBDD] px-3.5 py-2.5 text-sm text-[#594238] focus:border-[#B18A58] focus:outline-none"
                    />
                  </label>

                  <label className="block text-xs font-semibold text-[#594238]">
                    City / Town *
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                      className="mt-1.5 w-full rounded-md border border-[#DCC8AC] bg-[#F5EBDD] px-3.5 py-2.5 text-sm text-[#594238] focus:border-[#B18A58] focus:outline-none"
                    />
                  </label>

                  <label className="block text-xs font-semibold text-[#594238]">
                    State *
                    <input
                      type="text"
                      required
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      placeholder="State"
                      className="mt-1.5 w-full rounded-md border border-[#DCC8AC] bg-[#F5EBDD] px-3.5 py-2.5 text-sm text-[#594238] focus:border-[#B18A58] focus:outline-none"
                    />
                  </label>

                  <label className="block text-xs font-semibold text-[#594238]">
                    PIN Code *
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      placeholder="6-digit PIN code"
                      className="tabular-nums mt-1.5 w-full rounded-md border border-[#DCC8AC] bg-[#F5EBDD] px-3.5 py-2.5 text-sm text-[#594238] focus:border-[#B18A58] focus:outline-none"
                    />
                  </label>
                </div>

                {/* Mandatory Policy Confirmation */}
                <div className="mt-6 rounded-lg border border-[#B18A58]/50 bg-[#E8D8BD]/75 p-4">
                  <div className="flex items-start gap-3">
                    <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-[#967141]" />
                    <div className="text-xs text-[#594238]">
                      <p className="font-semibold uppercase tracking-wider">
                        Important Boutique Policy
                      </p>
                      <p className="mt-1 leading-relaxed text-[#796454]">
                        {siteConfig.brandName} operates strictly under a{' '}
                        <strong className="text-[#594238]">No Return</strong> and{' '}
                        <strong className="text-[#594238]">No Exchange</strong> policy. Please
                        verify your selected colour and size (XS–XL) before sending your order on
                        WhatsApp.
                      </p>
                      <label className="mt-3 flex cursor-pointer items-center gap-2 font-medium text-[#594238]">
                        <input
                          type="checkbox"
                          checked={acceptedPolicy}
                          onChange={(e) => setAcceptedPolicy(e.target.checked)}
                          className="h-4 w-4 accent-[#594238]"
                        />
                        <span>
                          I confirm my colours & sizes and agree to the No Return and No Exchange policies.
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {formError && (
                  <p className="mt-4 rounded-md border border-[#9C3B30]/40 bg-[#9C3B30]/10 px-4 py-2.5 text-xs font-medium text-[#8C2B22]">
                    {formError}
                  </p>
                )}

                <button
                  type="submit"
                  className="mt-6 w-full rounded-md bg-[#594238] py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#F5EBDD] transition-colors hover:bg-[#46332B]"
                >
                  Review & Send on WhatsApp ({formatINR(pricingSummary.finalTotal)})
                </button>
              </div>
            </form>

            {/* Right: Itemized Bag & Bundle Offer Summary */}
            <aside className="lg:col-span-5">
              <div className="bg-luxury-card rounded-xl border border-[#D4B890]/85 p-6">
                <h2 className="font-serif text-2xl font-semibold text-[#241915]">
                  Order Summary ({pricingSummary.totalUnits})
                </h2>

                <div className="mt-5 space-y-3">
                  {cart.map((item) => {
                    const product = productsMap.get(item.productId);
                    if (!product) return null;
                    const color =
                      product.colors.find((c) => c.id === item.colorId) || product.colors[0];
                    return (
                      <div
                        key={`${item.productId}-${item.colorId}-${item.size}`}
                        className="flex items-center gap-3 rounded-lg border border-[#DCC8AC] bg-[#F5EBDD] p-3"
                      >
                        <img
                          src={color?.images[0] || ''}
                          alt={product.name}
                          className="h-20 w-16 shrink-0 rounded object-cover object-top"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-semibold text-[#594238]">
                            {product.name}
                          </p>
                          <p className="tabular-nums mt-0.5 text-[11px] text-[#796454]">
                            {product.sku} · {item.colorName} · Size {item.size} ·{' '}
                            {formatINR(product.price)}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="inline-flex items-center rounded border border-[#DCC8AC] bg-[#EFE3D0]">
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
                                className="px-2 py-0.5 text-[#594238]"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="tabular-nums px-2 text-xs font-semibold text-[#594238]">
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
                                className="px-2 py-0.5 text-[#594238]"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFromCart(product.id, item.colorId, item.size)}
                              aria-label="Remove item"
                              className="text-[#796454] hover:text-[#594238]"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bundle Breakdown */}
                <div className="mt-6 space-y-2 border-t border-[#DCC8AC] pt-4 text-xs">
                  <div className="flex justify-between text-[#796454]">
                    <span>Catalog Subtotal</span>
                    <span className="tabular-nums">{formatINR(pricingSummary.regularTotal)}</span>
                  </div>

                  {pricingSummary.appliedBreakdown.map((pack, i) => (
                    <div key={i} className="flex justify-between text-[#796454]">
                      <span>{pack.label}</span>
                      <span className="tabular-nums">{formatINR(pack.amount)}</span>
                    </div>
                  ))}

                  {pricingSummary.savings > 0 && (
                    <div className="flex justify-between font-semibold text-[#967141]">
                      <span>Total Bundle Savings</span>
                      <span className="tabular-nums">-{formatINR(pricingSummary.savings)}</span>
                    </div>
                  )}

                  <div className="flex justify-between border-t border-[#DCC8AC] pt-3 text-base font-semibold text-[#594238]">
                    <span>Estimated Offer Total</span>
                    <span className="tabular-nums">{formatINR(pricingSummary.finalTotal)}</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};
