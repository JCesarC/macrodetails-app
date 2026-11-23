import { formatMessage, getMessages } from '@/i18n';

export function SiteFooter() {
  const { brand, footer: t } = getMessages().layout;

  return (
    <footer className="mt-16 border-t bg-secondary/40">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:px-6">
        <p className="font-heading text-base font-semibold text-foreground">{brand}</p>
        <p>{t.tagline}</p>
        <p>{t.city}</p>
        <p className="text-xs">{t.demoNotice}</p>
        <p className="text-xs">{formatMessage(t.rights, { year: 2026 })}</p>
      </div>
    </footer>
  );
}
