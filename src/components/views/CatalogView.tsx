import React, { useMemo, useState } from 'react';
import { CATEGORIES, COLOR_FAMILIES } from '../../data/products';
import { CategorySlug } from '../../types';
import { OFFICIAL_BUNDLE_TIERS, formatINR } from '../../utils/pricing';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../ProductCard';

interface CatalogViewProps {
  mode: 'shop' | 'category' | 'new-arrivals' | 'best-sellers' | 'offers';
  categorySlug?: CategorySlug;
}

export const CatalogView: React.FC<CatalogViewProps> = ({ mode, categorySlug }) => {
  const { navigate, products } = useStore();
  const [selectedColor, setSelectedColor] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const activeCategoryInfo = useMemo(
    () => (categorySlug ? CATEGORIES.find((c) => c.slug === categorySlug) : undefined),
    [categorySlug]
  );

  const pageMeta = useMemo(() => {
    if (mode === 'category' && activeCategoryInfo) {
      return {
        eyebrow: 'Category Collection',
        title: activeCategoryInfo.name,
        description: activeCategoryInfo.description,
      };
    }
    if (mode === 'new-arrivals') {
      return {
        eyebrow: 'Seasonal Release',
        title: 'New Arrivals',
        description: 'Our newest Anarkalis, straight-cut kurtis, cotton weaves, and flared sets.',
      };
    }
    if (mode === 'best-sellers') {
      return {
        eyebrow: 'Signature Edit',
        title: 'Best Sellers',
        description: 'Signature silhouettes curated across celebratory and everyday palettes.',
      };
    }
    if (mode === 'offers') {
      return {
        eyebrow: 'Value Bundles',
        title: 'Special Offer Collection',
        description:
          'Mix and match any outfits below—1 Dress ₹699 · 2 Dresses ₹1,299 · 3 Dresses ₹1,699 · 5 Dresses ₹2,499.',
      };
    }
    return {
      eyebrow: 'Complete Wardrobe',
      title: 'Shop All Ethnic Wear',
      description: 'Every Manyata Ethnic silhouette in sizes XS to XL with bundle value tiers.',
    };
  }, [activeCategoryInfo, mode]);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (mode === 'category' && categorySlug) {
      list = list.filter((p) => p.category === categorySlug);
    } else if (mode === 'new-arrivals') {
      list = list.filter((p) => p.isNewArrival);
    } else if (mode === 'best-sellers') {
      list = list.filter((p) => p.isBestSeller);
    }

    if (mode !== 'category' && selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (selectedColor !== 'All') {
      list = list.filter((p) => p.colors.some((c) => c.colorFamily === selectedColor));
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [categorySlug, mode, products, selectedCategory, selectedColor, sortBy]);

  return (
    <div className="bg-luxury-silk py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="border-b border-[#D4B890]/80 pb-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8F693A]">
            {pageMeta.eyebrow}
          </p>
          <h1 className="mt-2 [text-wrap:balance] font-serif text-3xl font-semibold text-[#241915] sm:text-5xl">
            {pageMeta.title}
          </h1>
          <p className="mt-2.5 max-w-2xl font-sans text-sm leading-relaxed text-[#4A3830]">
            {pageMeta.description}
          </p>

          {mode === 'offers' && (
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {OFFICIAL_BUNDLE_TIERS.map((tier) => (
                <div
                  key={tier.count}
                  className="bg-luxury-card rounded-lg border border-[#B18A58]/55 p-3.5 shadow-xs"
                >
                  <p className="text-xs font-bold text-[#241915]">
                    {tier.count === 1 ? '1 Dress' : `${tier.count} Dresses`}
                  </p>
                  <p className="tabular-nums mt-0.5 font-serif text-2xl font-semibold text-[#241915]">
                    {formatINR(tier.price)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category Switcher Tabs */}
        {mode !== 'category' && (
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`rounded-md border px-3.5 py-2 text-xs font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'border-[#594238] bg-[#594238] text-[#F5EBDD]'
                  : 'border-[#DCC8AC] bg-[#EFE3D0] text-[#594238] hover:border-[#B18A58]'
              }`}
            >
              All Categories
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => setSelectedCategory(cat.slug)}
                className={`rounded-md border px-3.5 py-2 text-xs font-medium transition-colors ${
                  selectedCategory === cat.slug
                    ? 'border-[#594238] bg-[#594238] text-[#F5EBDD]'
                    : 'border-[#DCC8AC] bg-[#EFE3D0] text-[#594238] hover:border-[#B18A58]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Filters Row */}
        <div className="bg-luxury-card mt-5 flex flex-col justify-between gap-4 rounded-lg border border-[#D4B890]/80 p-4 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#3B2C26]">
              Color:
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="ml-2 rounded border border-[#D4B890] bg-[#FAF2E6] px-2.5 py-1.5 text-xs font-semibold text-[#241915] focus:border-[#B18A58] focus:outline-none"
              >
                {COLOR_FAMILIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#3B2C26]">
              Sort:
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="ml-2 rounded border border-[#D4B890] bg-[#FAF2E6] px-2.5 py-1.5 text-xs font-semibold text-[#241915] focus:border-[#B18A58] focus:outline-none"
              >
                <option value="featured">Curated Order</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </label>
          </div>

          <p className="tabular-nums text-xs font-semibold text-[#3B2C26]">
            {filteredProducts.length} design{filteredProducts.length === 1 ? '' : 's'}
          </p>
        </div>

        {/* Product Grid: 2 cols mobile, 4 cols desktop */}
        {filteredProducts.length === 0 ? (
          <div className="bg-luxury-card mt-10 rounded-xl border border-[#D4B890] p-10 text-center">
            <p className="font-serif text-2xl font-medium text-[#241915]">
              No designs matched the current filter
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedColor('All');
                setSelectedCategory('all');
              }}
              className="mt-4 rounded-md bg-[#594238] px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-[#F5EBDD]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Quick Category Switcher Footer when browsing a single category */}
        {mode === 'category' && (
          <div className="mt-14 border-t border-[#DCC8AC] pt-8">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#967141]">
              Explore Other Categories
            </p>
            <div className="flex flex-wrap gap-2.5">
              {CATEGORIES.filter((c) => c.slug !== categorySlug).map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => navigate({ page: 'category', slug: cat.slug })}
                  className="rounded-md border border-[#DCC8AC] bg-[#EFE3D0] px-4 py-2 text-xs font-medium text-[#594238] transition-colors hover:border-[#B18A58] hover:bg-[#E8D8BD]"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
