export interface NavItem {
  href: string;
  labelKey: 'explore' | 'occasions' | 'concierge';
}

export const NAV_ITEMS: NavItem[] = [
  { href: '/products', labelKey: 'explore' },
  { href: '/#occasions', labelKey: 'occasions' },
  { href: '/concierge', labelKey: 'concierge' },
];
