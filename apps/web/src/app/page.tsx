import { FeaturedProducts } from '@/components/home/featured-products';
import { Hero } from '@/components/home/hero';
import { Highlights } from '@/components/home/highlights';
import { OccasionGrid } from '@/components/home/occasion-grid';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Highlights />
      <OccasionGrid />
      <FeaturedProducts />
    </main>
  );
}
