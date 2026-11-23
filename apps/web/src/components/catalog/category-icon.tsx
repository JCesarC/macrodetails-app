import { Cake, Candy, Flower2, Gift, PartyPopper, Sparkles, type LucideIcon } from 'lucide-react';
import type { Category } from '@macrodetails/contracts';

const ICONS: Record<Category, LucideIcon> = {
  flowers: Flower2,
  desserts: Cake,
  chocolates: Candy,
  'gift-boxes': Gift,
  balloons: PartyPopper,
  personalized: Sparkles,
};

export function CategoryIcon({ category, className }: { category: Category; className?: string }) {
  const Icon = ICONS[category];
  return <Icon className={className} aria-hidden />;
}
