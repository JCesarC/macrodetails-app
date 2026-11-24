import Link from 'next/link';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterLinkProps {
  href: string;
  active: boolean;
  children: React.ReactNode;
}

export function FilterLink({ href, active, children }: FilterLinkProps) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? 'true' : undefined}
      className={cn(
        'flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent',
        active ? 'font-medium text-foreground' : 'text-muted-foreground',
      )}
    >
      {children}
      {active && <Check className="size-4 text-primary" aria-hidden />}
    </Link>
  );
}
