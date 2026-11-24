export type PaginationItem = number | 'ellipsis';

/**
 * Page numbers to render: always the first and last page, the current page with one neighbor on
 * each side, and an ellipsis for every skipped run. A gap of a single page shows that page instead
 * of an ellipsis, since both take the same space.
 */
export function paginationItems(current: number, totalPages: number): PaginationItem[] {
  if (totalPages <= 1) return [];

  const visible = new Set([1, totalPages, current - 1, current, current + 1]);
  const pages = [...visible]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);

  const items: PaginationItem[] = [];
  for (const page of pages) {
    const previous = items.at(-1);
    if (typeof previous === 'number' && page - previous === 2) items.push(previous + 1);
    else if (typeof previous === 'number' && page - previous > 2) items.push('ellipsis');
    items.push(page);
  }
  return items;
}
