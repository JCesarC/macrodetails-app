import { CalendarClock, Store, WandSparkles, type LucideIcon } from 'lucide-react';
import { getMessages } from '@/i18n';

const ITEMS: { key: 'local' | 'scheduled' | 'personalized'; icon: LucideIcon }[] = [
  { key: 'local', icon: Store },
  { key: 'scheduled', icon: CalendarClock },
  { key: 'personalized', icon: WandSparkles },
];

export function Highlights() {
  const t = getMessages().home.highlights;

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <ul className="grid gap-6 sm:grid-cols-3">
        {ITEMS.map(({ key, icon: Icon }) => (
          <li key={key} className="flex gap-3">
            <Icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
            <div>
              <p className="font-medium">{t[key].title}</p>
              <p className="text-sm text-muted-foreground">{t[key].description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
