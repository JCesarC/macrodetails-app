import Image from 'next/image';
import type { Category, ProductImage as ProductImageData } from '@macrodetails/contracts';
import { getMessages } from '@/i18n';
import { cn } from '@/lib/utils';
import { CategoryIcon } from './category-icon';

// Soft per-category backgrounds for products that have no photo yet.
const PLACEHOLDER_TONES: Record<Category, string> = {
  flowers: 'from-rose-100 to-pink-50 text-rose-400',
  desserts: 'from-amber-100 to-orange-50 text-amber-500',
  chocolates: 'from-stone-200 to-amber-50 text-stone-500',
  'gift-boxes': 'from-violet-100 to-fuchsia-50 text-violet-400',
  balloons: 'from-sky-100 to-cyan-50 text-sky-400',
  personalized: 'from-emerald-100 to-teal-50 text-emerald-500',
};

interface ProductImageProps {
  image: ProductImageData | undefined;
  category: Category;
  /** `sizes` hint for next/image so it downloads the right resolution. */
  sizes: string;
  priority?: boolean;
  className?: string;
}

/** Product photo, or a category-tinted placeholder while photos are pending. */
export function ProductImage({ image, category, sizes, priority, className }: ProductImageProps) {
  if (image) {
    return (
      <div className={cn('relative overflow-hidden bg-muted', className)}>
        <Image
          src={image.url}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    );
  }

  const { product: t } = getMessages().catalog;
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 bg-gradient-to-br',
        PLACEHOLDER_TONES[category],
        className,
      )}
    >
      <CategoryIcon category={category} className="size-10" />
      <span className="text-xs font-medium opacity-80">{t.noImage}</span>
    </div>
  );
}
