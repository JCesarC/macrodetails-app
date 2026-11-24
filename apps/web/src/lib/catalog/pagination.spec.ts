import { describe, expect, it } from 'vitest';
import { paginationItems } from './pagination';

describe('paginationItems', () => {
  it('renders nothing for a single page', () => {
    expect(paginationItems(1, 1)).toEqual([]);
  });

  it('lists every page when there are few', () => {
    expect(paginationItems(2, 4)).toEqual([1, 2, 3, 4]);
  });

  it('collapses the far side with an ellipsis', () => {
    expect(paginationItems(1, 10)).toEqual([1, 2, 'ellipsis', 10]);
  });

  it('collapses both sides around the current page', () => {
    expect(paginationItems(5, 10)).toEqual([1, 'ellipsis', 4, 5, 6, 'ellipsis', 10]);
  });

  it('shows a single skipped page instead of an ellipsis', () => {
    expect(paginationItems(4, 10)).toEqual([1, 2, 3, 4, 5, 'ellipsis', 10]);
  });

  it('handles the last page', () => {
    expect(paginationItems(10, 10)).toEqual([1, 'ellipsis', 9, 10]);
  });
});
