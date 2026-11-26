/**
 * Global date formatting utilities — standardized to DD:MM:YYYY (DAY:MONTH:YEAR)
 */

export function getLocalDateIso(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDaysToIso(isoDate: string, days: number): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(isoDate.trim());
  if (!match) return isoDate;
  const d = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  d.setDate(d.getDate() + days);
  return getLocalDateIso(d);
}

/**
 * Format any YYYY-MM-DD string, ISO timestamp, or Date object as DD:MM:YYYY
 */
export function formatDateDMY(input?: string | Date | null): string {
  if (!input) return "";

  if (input instanceof Date) {
    if (Number.isNaN(input.getTime())) return "";
    const dd = String(input.getDate()).padStart(2, "0");
    const mm = String(input.getMonth() + 1).padStart(2, "0");
    const yyyy = input.getFullYear();
    return `${dd}:${mm}:${yyyy}`;
  }

  const trimmed = String(input).trim();
  if (!trimmed) return "";

  // Direct YYYY-MM-DD match (avoids UTC-to-local timezone day shifts)
  const isoDateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (isoDateOnly) {
    return `${isoDateOnly[3]}:${isoDateOnly[2]}:${isoDateOnly[1]}`;
  }

  // Already DD:MM:YYYY
  if (/^\d{2}:\d{2}:\d{4}$/.test(trimmed)) {
    return trimmed;
  }

  // ISO datetime or other parseable date string
  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    const dd = String(parsed.getDate()).padStart(2, "0");
    const mm = String(parsed.getMonth() + 1).padStart(2, "0");
    const yyyy = parsed.getFullYear();
    return `${dd}:${mm}:${yyyy}`;
  }

  return trimmed;
}

/**
 * Format timestamp as "DD:MM:YYYY, HH:MM AM/PM"
 */
export function formatDateTimeDMY(input?: string | Date | null): string {
  if (!input) return "";
  const parsed = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(parsed.getTime())) {
    return formatDateDMY(input);
  }
  const datePart = formatDateDMY(parsed);
  const timePart = parsed.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return `${datePart}, ${timePart}`;
}
