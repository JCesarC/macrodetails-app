/**
 * Replaces `{name}` placeholders in a message with the given values.
 * Unknown placeholders are left untouched so missing values are easy to spot.
 */
export function formatMessage(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
