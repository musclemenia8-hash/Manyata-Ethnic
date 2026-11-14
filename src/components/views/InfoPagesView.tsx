import React, { useState } from 'react';
import { ChevronDown, Mail, MessageCircle, Phone } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

type InfoPageType =
  | 'contact'
  | 'about'
  | 'faq'
  | 'policy-terms'
  | 'policy-no-return'
  | 'policy-no-exchange'
  | 'policy-shipping';

interface InfoPagesViewProps {
  page: InfoPageType;
}

export const InfoPagesView: React.FC<InfoPagesViewProps> = ({ page }) => {
  const { navigate, showToast, siteConfig } = useStore();
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [contactSent, setContactSent] = useState(false);

  const cleanHandle = siteConfig.instagramHandle.replace(/^@/, '');

  if (page === 'contact') {
    return (
      <div className="bg-luxury-silk py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8F693A]">
            Customer Support
          </p>
          <h1 className="mt-1.5 font-serif text-3xl font-semibold text-[#241915] sm:text-5xl">
            Contact {siteConfig.brandName}
          </h1>
          <p className="mt-2.5 max-w-xl text-sm text-[#4A3830]">
            Need sizing guidance between XS, S, M, L, and XL or assistance with your bundle order?
            Reach us directly.
          </p>

          <div className="mt-9 grid gap-8 md:grid-cols-12">
            <div className="space-y-4 md:col-span-5">
              <div className="rounded-xl border border-[#DCC8AC] bg-[#EFE3D0] p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#967141]">
                  Phone & WhatsApp
                </p>
                <a
                  href={`tel:+${siteConfig.whatsappNumber}`}
                  className="tabular-nums mt-2 flex items-center gap-2 text-lg font-semibold text-[#594238] hover:text-[#967141]"
                >
                  <Phone className="h-4 w-4 text-[#B18A58]" />
                  +91 {siteConfig.whatsappDisplay}
                </a>
                <a
                  href={`https://wa.me/${siteConfig.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 rounded bg-[#594238] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#F5EBDD]"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Chat on WhatsApp
                </a>
              </div>

              <div className="rounded-xl border border-[#DCC8AC] bg-[#EFE3D0] p-5 text-xs text-[#796454]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#967141]">
                  Official Social Channels
                </p>
                <p className="mt-2">
                  Instagram:{' '}
                  <a
                    href={`https://instagram.com/${cleanHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#594238] underline decoration-[#B18A58]"
                  >
                    {siteConfig.instagramHandle}
                  </a>
                </p>
                <p className="mt-1.5">
                  Facebook Page:{' '}
                  <a
                    href={`https://www.facebook.com/search/top?q=${encodeURIComponent(siteConfig.facebookPage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#594238] underline decoration-[#B18A58]"
                  >
                    {siteConfig.facebookPage}
                  </a>
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-[#DCC8AC] bg-[#EFE3D0]/80 p-6 md:col-span-7">
              {contactSent ? (
                <div className="py-10 text-center">
                  <Mail className="mx-auto h-8 w-8 text-[#B18A58]" />
                  <h2 className="mt-3 font-serif text-2xl font-semibold text-[#594238]">
                    Message Received
                  </h2>
                  <p className="mt-1.5 text-xs text-[#796454]">
                    Our concierge team will respond shortly, or you can message us directly on
                    WhatsApp at {siteConfig.whatsappDisplay}.
                  </p>
                  <button
                    type="button"
                    onClick={() => setContactSent(false)}
                    className="mt-5 rounded bg-[#594238] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#F5EBDD]"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setContactSent(true);
                    showToast(`Inquiry submitted to ${siteConfig.brandName}`);
                  }}
                  className="space-y-4"
                >
                  <h2 className="font-serif text-2xl font-semibold text-[#594238]">
                    Send an Inquiry
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-xs font-semibold text-[#594238]">
                      Your Name *
                      <input
                        type="text"
                        required
                        className="mt-1 w-full rounded border border-[#DCC8AC] bg-[#F5EBDD] px-3 py-2.5 text-sm text-[#594238]"
                      />
                    </label>
                    <label className="block text-xs font-semibold text-[#594238]">
                      Mobile Number *
                      <input
                        type="tel"
                        required
                        className="tabular-nums mt-1 w-full rounded border border-[#DCC8AC] bg-[#F5EBDD] px-3 py-2.5 text-sm text-[#594238]"
                      />
                    </label>
                  </div>
                  <label className="block text-xs font-semibold text-[#594238]">
                    Message *
                    <textarea
                      rows={4}
                      required
                      placeholder="Ask about an SKU, XS–XL fit, or bundle pack..."
                      className="mt-1 w-full rounded border border-[#DCC8AC] bg-[#F5EBDD] px-3 py-2.5 text-sm text-[#594238]"
                    />
                  </label>
                  <button
                    type="submit"
                    className="rounded-md bg-[#594238] px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#F5EBDD] hover:bg-[#46332B]"
                  >
                    Submit Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (page === 'faq') {
    return (
      <div className="bg-luxury-silk py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8F693A]">
            Help & Guidance
          </p>
          <h1 className="mt-1.5 font-serif text-3xl font-semibold text-[#241915] sm:text-5xl">
            Frequently Asked Questions
          </h1>

          <div className="mt-8 space-y-3">
            {siteConfig.faqs.map((item, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-xl border border-[#DCC8AC] bg-[#EFE3D0]/75"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left"
                  >
                    <span className="font-serif text-lg font-semibold text-[#594238]">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-[#B18A58] transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="border-t border-[#DCC8AC] bg-[#F5EBDD]/80 px-5 py-4 text-sm leading-relaxed text-[#796454]">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (page === 'about') {
    return (
      <div className="bg-luxury-silk py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8F693A]">
            Brand Story
          </p>
          <h1 className="mt-1.5 font-serif text-3xl font-semibold text-[#241915] sm:text-5xl">
            About {siteConfig.brandName}
          </h1>
          <p className="mt-2 font-serif text-xl italic text-[#4A3830]">{siteConfig.tagline}</p>
          <div className="mt-6 space-y-4 text-sm leading-relaxed text-[#2F221D]">
            <p>
              {siteConfig.brandName} is dedicated to curating timeless Indian ethnic apparel that
              brings together traditional aesthetics and modern everyday grace. From finely flared
              Anarkali silhouettes and zari-bordered straight sets to breathable cotton ensembles, our
              focus remains on balanced tailoring across five sizes (XS, S, M, L, XL) and curated
              colour variations.
            </p>
            <p>
              With over 8000+ completed deliveries across India, our boutique ensures thoughtful
              quality inspection before every dispatch (within 3–4 days) alongside transparent
              bundle pricing (1 Dress ₹699, 2 Dresses ₹1,299, 3 Dresses ₹1,699, and 5 Dresses
              ₹2,499).
            </p>
          </div>
          <div className="mt-8">
            <button
              type="button"
              onClick={() => navigate({ page: 'shop' })}
              className="rounded-md bg-[#594238] px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#F5EBDD]"
            >
              Explore Our Collection
            </button>
          </div>
        </div>
      </div>
    );
  }

  const policyContent: Record<
    'policy-terms' | 'policy-no-return' | 'policy-no-exchange' | 'policy-shipping',
    { title: string; eyebrow: string; paragraphs: string[] }
  > = {
    'policy-terms': {
      eyebrow: 'Boutique Guidelines',
      title: 'Terms & Conditions',
      paragraphs: siteConfig.policies.terms,
    },
    'policy-no-return': {
      eyebrow: 'Store Policy',
      title: 'No Return Policy',
      paragraphs: siteConfig.policies.noReturn,
    },
    'policy-no-exchange': {
      eyebrow: 'Store Policy',
      title: 'No Exchange Policy',
      paragraphs: siteConfig.policies.noExchange,
    },
    'policy-shipping': {
      eyebrow: 'Delivery Standards',
      title: 'Shipping & Delivery Information',
      paragraphs: siteConfig.policies.shipping,
    },
  };

  const doc = policyContent[page];

  return (
    <div className="bg-luxury-silk py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8F693A]">
          {doc.eyebrow}
        </p>
        <h1 className="mt-1.5 font-serif text-3xl font-semibold text-[#241915] sm:text-5xl">
          {doc.title}
        </h1>
        <div className="bg-luxury-card mt-7 space-y-4 rounded-xl border border-[#D4B890] p-6 sm:p-8">
          {doc.paragraphs.map((p, i) => (
            <p key={i} className="text-sm leading-relaxed text-[#2F221D]">
              {p}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};
