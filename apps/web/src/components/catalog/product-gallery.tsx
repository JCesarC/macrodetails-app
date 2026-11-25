import type { Category, ProductImage as ProductImageData } from '@macrodetails/contracts';
import { formatMessage, getMessages } from '@/i18n';
import { ProductImage } from './product-image';
import { ProductPhotoCarousel } from './product-photo-carousel';

interface ProductGalleryProps {
  images: ProductImageData[];
  category: Category;
}

export function ProductGallery({ images, category }: ProductGalleryProps) {
  if (images.length <= 1) {
    return (
      <ProductImage
        image={images[0]}
        category={category}
        sizes="(min-width: 768px) 50vw, 100vw"
        priority
        className="aspect-square rounded-2xl"
      />
    );
  }

  const { productDetail: t } = getMessages();
  return (
    <ProductPhotoCarousel
      images={images}
      labels={{
        gallery: t.gallery,
        showPhoto: images.map((_, index) =>
          formatMessage(t.showPhoto, { index: index + 1, total: images.length }),
        ),
      }}
    />
  );
}
