'use client';

import { SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface MobileFiltersProps {
  labels: { open: string; title: string };
  activeCount: number;
  children: React.ReactNode;
}

export function MobileFilters({ labels, activeCount, children }: MobileFiltersProps) {
  const [open, setOpen] = useState(false);

  function closeOnNavigation(event: React.MouseEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest('a')) setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="lg:hidden">
          <SlidersHorizontal aria-hidden />
          {labels.open}
          {activeCount > 0 && (
            <span className="rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
              {activeCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{labels.title}</SheetTitle>
        </SheetHeader>
        <div className="px-4 pb-6" onClick={closeOnNavigation}>
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}
