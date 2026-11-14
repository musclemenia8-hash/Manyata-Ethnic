import React, { useMemo, useRef, useState } from 'react';
import { Camera, Search, Upload, X } from 'lucide-react';
import { CATEGORIES } from '../data/products';
import { useStore } from '../context/StoreContext';
import { formatINR } from '../utils/pricing';
import {
  extractImageProfile,
  ExtractedVisualProfile,
  findVisuallySimilarProducts,
  ImageMatchResult,
} from '../utils/imageSearch';
import { ProductCard } from './ProductCard';

const QUICK_SUGGESTIONS = [
  'Anarkali',
  'Crimson',
  'Ivory',
  'Olive',
  'Mirrorwork',
  'Brocade',
  'Straight',
  'Skirt Set',
];

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setSearchOpen, navigate, products } = useStore();
  const [query, setQuery] = useState('');
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [visualProfile, setVisualProfile] = useState<ExtractedVisualProfile | null>(null);
  const [visualMatches, setVisualMatches] = useState<ImageMatchResult[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const textResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter((p) => {
        const colorHit = p.colors.some(
          (c) =>
            c.colorName.toLowerCase().includes(q) || c.colorFamily.toLowerCase().includes(q)
        );
        return (
          colorHit ||
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.categoryLabel.toLowerCase().includes(q) ||
          p.detailing.toLowerCase().includes(q) ||
          p.silhouette.toLowerCase().includes(q)
        );
      })
      .slice(0, 12);
  }, [products, query]);

  if (!isSearchOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageError(null);
    setAnalyzingImage(true);

    try {
      const objectUrl = URL.createObjectURL(file);
      setUploadedPreview(objectUrl);
      const profile = await extractImageProfile(file);
      setVisualProfile(profile);
      const matches = findVisuallySimilarProducts(profile, products, 8);
      setVisualMatches(matches);
    } catch {
      setImageError('Please upload a clear JPG, PNG, or WEBP product photograph.');
    } finally {
      setAnalyzingImage(false);
    }
  };

  const resetImageSearch = () => {
    setUploadedPreview(null);
    setVisualProfile(null);
    setVisualMatches([]);
    setImageError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#594238]/45 px-4 py-8 backdrop-blur-xs sm:py-12">
      <div className="relative w-full max-w-5xl rounded-xl border border-[#DCC8AC] bg-[#F5EBDD] p-5 shadow-2xl sm:p-8">
        <div className="flex items-center justify-between border-b border-[#DCC8AC] pb-4">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-[#594238]">
              Search & Visual Photo Match
            </h2>
            <p className="text-xs text-[#796454]">
              Search by product name, SKU, category, colour, or upload a garment photograph
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSearchOpen(false)}
            aria-label="Close Search"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#DCC8AC] text-[#594238] hover:bg-[#E8D8BD]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#796454]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Anarkali, Crimson, Cotton, ME-ANR-01..."
              className="w-full rounded-lg border border-[#DCC8AC] bg-[#F9F2E7] py-3 pl-10 pr-10 text-sm text-[#594238] placeholder:text-[#796454]/70 focus:border-[#B18A58] focus:outline-none"
              autoFocus
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search text"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#796454] hover:text-[#594238]"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#B18A58] bg-[#E8D8BD] px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#594238] transition-colors hover:bg-[#DEC8A4]"
          >
            <Camera className="h-4 w-4 text-[#B18A58]" />
            <span>Search by Photo</span>
          </button>
        </div>

        {!query && !uploadedPreview && (
          <div className="mt-5">
            <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#796454]">
              Popular Searches
            </p>
            <div className="flex flex-wrap gap-2">
              {QUICK_SUGGESTIONS.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setQuery(term)}
                  className="rounded-md border border-[#DCC8AC] bg-[#EFE3D0] px-3 py-1.5 text-xs font-medium text-[#594238] hover:border-[#B18A58] hover:bg-[#E8D8BD]"
                >
                  {term}
                </button>
              ))}
            </div>

            <p className="mb-2.5 mt-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#796454]">
              Browse Categories
            </p>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => navigate({ page: 'category', slug: cat.slug })}
                  className="flex items-center gap-3 rounded-lg border border-[#DCC8AC] bg-[#EFE3D0]/70 p-2 text-left hover:border-[#B18A58] hover:bg-[#E8D8BD]"
                >
                  <img
                    src={cat.coverImage}
                    alt={cat.name}
                    className="h-11 w-11 rounded object-cover object-top"
                  />
                  <div>
                    <p className="text-xs font-semibold text-[#594238]">{cat.name}</p>
                    <p className="text-[11px] text-[#796454]">{cat.subtitle}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {uploadedPreview && (
          <div className="mt-6 rounded-lg border border-[#DCC8AC] bg-[#EFE3D0]/60 p-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#DCC8AC] pb-4">
              <div className="flex items-center gap-4">
                <img
                  src={uploadedPreview}
                  alt="Uploaded query garment"
                  className="h-16 w-16 rounded-md border border-[#DCC8AC] object-cover object-top"
                />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#594238]">
                    Visual Colour Match
                  </p>
                  <p className="mt-0.5 text-xs text-[#796454]">
                    {analyzingImage
                      ? 'Analyzing dominant garment tones...'
                      : 'Closest Manyata Ethnic silhouettes & colourways'}
                  </p>
                  {visualProfile && (
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="text-[11px] text-[#796454]">Detected tones:</span>
                      {visualProfile.paletteHex.map((hex, i) => (
                        <span
                          key={`${hex}-${i}`}
                          title={hex}
                          className="inline-block h-4 w-4 rounded-full border border-[#594238]/25"
                          style={{ backgroundColor: hex }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-md border border-[#DCC8AC] bg-[#F5EBDD] px-3 py-1.5 text-xs font-medium text-[#594238] hover:bg-[#E8D8BD]"
                >
                  <Upload className="h-3.5 w-3.5" />
                  Try Another
                </button>
                <button
                  type="button"
                  onClick={resetImageSearch}
                  className="rounded-md px-3 py-1.5 text-xs font-medium text-[#796454] hover:text-[#594238]"
                >
                  Clear
                </button>
              </div>
            </div>

            {imageError && <p className="mt-3 text-xs text-[#9C3B30]">{imageError}</p>}

            {!analyzingImage && visualMatches.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
                {visualMatches.map(({ product, matchedColor, score, matchReason }) => (
                  <button
                    key={`${product.id}-${matchedColor.id}`}
                    type="button"
                    onClick={() =>
                      navigate({ page: 'product', id: product.id, colorId: matchedColor.id })
                    }
                    className="group flex flex-col overflow-hidden rounded-lg border border-[#DCC8AC] bg-[#F5EBDD] text-left hover:border-[#B18A58]"
                  >
                    <div className="aspect-[3/4] w-full overflow-hidden bg-[#E8D8BD]">
                      <img
                        src={matchedColor.images[0]}
                        alt={product.name}
                        className="photo-graded photo-graded-hover h-full w-full object-cover object-top"
                      />
                    </div>
                    <div className="p-2.5">
                      <p className="tabular-nums text-[10px] font-medium uppercase tracking-wider text-[#B18A58]">
                        {score}% match · {matchedColor.colorName}
                      </p>
                      <p className="mt-0.5 line-clamp-1 text-xs font-semibold text-[#594238]">
                        {product.name}
                      </p>
                      <p className="mt-0.5 text-[11px] text-[#796454]">{matchReason}</p>
                      <p className="tabular-nums mt-1 text-xs font-semibold text-[#594238]">
                        {formatINR(product.price)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {query.trim() && (
          <div className="mt-6">
            <p className="mb-3 text-xs font-medium text-[#796454]">
              {textResults.length} matching design{textResults.length === 1 ? '' : 's'} for &ldquo;
              {query}&rdquo;
            </p>

            {textResults.length === 0 ? (
              <div className="rounded-lg border border-[#DCC8AC] bg-[#EFE3D0]/60 p-6 text-center">
                <p className="text-sm font-medium text-[#594238]">
                  No garments matched &ldquo;{query}&rdquo;
                </p>
                <p className="mt-1 text-xs text-[#796454]">
                  Try searching by SKU, colour, silhouette, or upload a photo above.
                </p>
              </div>
            ) : (
              <div className="grid max-h-[55vh] grid-cols-2 gap-3 overflow-y-auto pr-1 lg:grid-cols-4">
                {textResults.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
