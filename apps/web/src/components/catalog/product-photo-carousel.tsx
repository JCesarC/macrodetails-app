'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { ProductImage } from '@macrodetails/contracts';
import { cn } from '@/lib/utils';

interface ProductPhotoCarouselProps {
  images: ProductImage[];
  labels: { gallery: string; showPhoto: string[] };
}

export function ProductPhotoCarousel({ images, labels }: ProductPhotoCarouselProps) {
  const [selected, setSelected] = useState(0);
  const current = images[selected] ?? images[0]!;

  return (
    <div className="flex flex-col gap-3" role="group" aria-label={labels.gallery}>
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
        <Image
          src={current.url}
          alt={current.alt}
          fill
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <ul className="grid grid-cols-5 gap-2">
        {images.map((image, index) => (
          <li key={image.url}>
            <button
              type="button"
              onClick={() => setSelected(index)}
              aria-label={labels.showPhoto[index]}
              aria-pressed={index === selected}
              className={cn(
                'relative block aspect-square w-full overflow-hidden rounded-lg border-2 transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
                index === selected ? 'border-primary' : 'border-transparent hover:border-border',
              )}
            >
              <Image src={image.url} alt="" fill sizes="20vw" className="object-cover" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
