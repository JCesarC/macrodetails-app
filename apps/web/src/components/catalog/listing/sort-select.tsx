'use client';

import { useRouter } from 'next/navigation';
import type { ProductSort } from '@macrodetails/contracts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SortSelectProps {
  label: string;
  value: ProductSort;
  options: { value: ProductSort; label: string; href: string }[];
}

export function SortSelect({ label, value, options }: SortSelectProps) {
  const router = useRouter();

  function navigate(next: string) {
    const option = options.find((candidate) => candidate.value === next);
    if (option) router.push(option.href, { scroll: false });
  }

  return (
    <Select value={value} onValueChange={navigate}>
      <SelectTrigger aria-label={label} className="w-56">
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
