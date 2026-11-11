/**
 * Formatters for text, numbers, and display strings
 */

export function formatTicketCode(code) {
  if (!code) return '';
  return code.toUpperCase();
}

export function truncateText(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength).trim()}...`;
}

export function formatCapacityString(registeredCount, maxCapacity) {
  const reg = Number(registeredCount) || 0;
  const max = Number(maxCapacity) || 0;
  const pct = max > 0 ? Math.round((reg / max) * 100) : 0;
  return `${reg} / ${max} (${pct}%)`;
}
