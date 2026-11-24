import Link from 'next/link';
import {
  Cake,
  Flower,
  Gem,
  GraduationCap,
  HandHeart,
  Heart,
  HeartPulse,
  Smile,
  Trophy,
  type LucideIcon,
} from 'lucide-react';
import { OCCASIONS, type Occasion } from '@macrodetails/contracts';
import { getMessages } from '@/i18n';

const ICONS: Record<Occasion, LucideIcon> = {
  birthday: Cake,
  anniversary: Gem,
  valentines: Heart,
  'mothers-day': Flower,
  graduation: GraduationCap,
  congratulations: Trophy,
  'thank-you': HandHeart,
  'get-well': HeartPulse,
  'just-because': Smile,
};

export function OccasionGrid() {
  const { home, catalog } = getMessages();
  const t = home.occasions;

  return (
    <section id="occasions" className="scroll-mt-20 mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex flex-col gap-1">
        <h2 className="font-heading text-2xl font-semibold sm:text-3xl">{t.title}</h2>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {OCCASIONS.map((occasion) => {
          const Icon = ICONS[occasion];
          return (
            <li key={occasion}>
              <Link
                href={`/products?occasion=${occasion}`}
                className="flex h-full items-center gap-3 rounded-xl border bg-card px-4 py-3 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                  <Icon className="size-4" aria-hidden />
                </span>
                {catalog.occasions[occasion]}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
