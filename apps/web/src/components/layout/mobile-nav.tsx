'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { NAV_ITEMS, type NavItem } from './site-nav';

interface MobileNavProps {
  labels: Record<NavItem['labelKey'] | 'openMenu' | 'menuTitle', string>;
}

/** Labels come from the server component, so the client bundle carries no dictionary. */
export function MobileNav({ labels }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label={labels.openMenu}>
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle>{labels.menuTitle}</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
            >
              {labels[item.labelKey]}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
