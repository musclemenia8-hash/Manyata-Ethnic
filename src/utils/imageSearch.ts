import { Product, ProductColorVariant } from '../types';

export interface ImageMatchResult {
  product: Product;
  matchedColor: ProductColorVariant;
  score: number;
  matchReason: string;
}

export interface ExtractedVisualProfile {
  dominantRgb: [number, number, number];
  secondaryRgb: [number, number, number];
  paletteHex: string[];
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function colorDistance(a: [number, number, number], b: [number, number, number]): number {
  const rMean = (a[0] + b[0]) / 2;
  const dr = a[0] - b[0];
  const dg = a[1] - b[1];
  const db = a[2] - b[2];
  return Math.sqrt(
    (2 + rMean / 256) * dr * dr +
      4 * dg * dg +
      (2 + (255 - rMean) / 256) * db * db
  );
}

export function extractImageProfile(file: File): Promise<ExtractedVisualProfile> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read uploaded image.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Could not decode uploaded image.'));
      img.onload = () => {
        const size = 64;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable.'));
          return;
        }
        ctx.drawImage(img, 0, 0, size, size);

        const start = Math.floor(size * 0.2);
        const span = Math.floor(size * 0.6);
        const data = ctx.getImageData(start, start, span, span).data;

        const buckets = new Map<string, { r: number; g: number; b: number; count: number }>();

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];
          if (a < 128) continue;

          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const l = (max + min) / 510;
          const s = max === min ? 0 : (max - min) / (255 - Math.abs(max + min - 255));

          const qr = Math.round(r / 28) * 28;
          const qg = Math.round(g / 28) * 28;
          const qb = Math.round(b / 28) * 28;
          const key = `${qr}-${qg}-${qb}`;
          const weight = s > 0.14 || l < 0.78 ? 2 : 1;
          const entry = buckets.get(key) || { r: 0, g: 0, b: 0, count: 0 };
          entry.r += r * weight;
          entry.g += g * weight;
          entry.b += b * weight;
          entry.count += weight;
          buckets.set(key, entry);
        }

        const sorted = Array.from(buckets.values()).sort((a, b) => b.count - a.count);
        const top1 = sorted[0] || { r: 177, g: 138, b: 88, count: 1 };
        const top2 = sorted[1] || top1;
        const top3 = sorted[2] || top2;

        const dominantRgb: [number, number, number] = [
          Math.round(top1.r / top1.count),
          Math.round(top1.g / top1.count),
          Math.round(top1.b / top1.count),
        ];
        const secondaryRgb: [number, number, number] = [
          Math.round(top2.r / top2.count),
          Math.round(top2.g / top2.count),
          Math.round(top2.b / top2.count),
        ];
        const thirdRgb: [number, number, number] = [
          Math.round(top3.r / top3.count),
          Math.round(top3.g / top3.count),
          Math.round(top3.b / top3.count),
        ];

        resolve({
          dominantRgb,
          secondaryRgb,
          paletteHex: [
            rgbToHex(...dominantRgb),
            rgbToHex(...secondaryRgb),
            rgbToHex(...thirdRgb),
          ],
        });
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export function findVisuallySimilarProducts(
  profile: ExtractedVisualProfile,
  products: Product[],
  limit = 8
): ImageMatchResult[] {
  const ranked = products.map((product) => {
    let bestColor = product.colors[0];
    let bestScore = -1;

    for (const color of product.colors) {
      const d1 = colorDistance(profile.dominantRgb, color.dominantRgb);
      const d2 = colorDistance(profile.secondaryRgb, color.dominantRgb);
      const bestDist = Math.min(d1, d2 * 1.08);
      const score = Math.max(0, Math.min(99, Math.round(100 - (bestDist / 720) * 100)));
      if (score > bestScore) {
        bestScore = score;
        bestColor = color;
      }
    }

    const matchReason =
      bestScore >= 82
        ? `Matches ${bestColor.colorName}`
        : bestScore >= 68
        ? `Similar ${bestColor.colorFamily.toLowerCase()} tone`
        : `${product.silhouette}`;

    return {
      product,
      matchedColor: bestColor,
      score: bestScore,
      matchReason,
    };
  });

  return ranked.sort((a, b) => b.score - a.score).slice(0, limit);
}
