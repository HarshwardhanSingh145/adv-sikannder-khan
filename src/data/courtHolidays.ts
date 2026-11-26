import { formatDateDMY } from "../lib/dateFormat";

export interface CourtHoliday {
  date: string; // YYYY-MM-DD
  name: string;
  category: "gazetted" | "saturday" | "sunday";
  moonDependent?: boolean;
}

/**
 * Remaining Court Holidays for Nov–Dec 2026
 */
export const COURT_HOLIDAYS_2026: CourtHoliday[] = [
  // November 2026
  { date: "2026-11-29", name: "Weekly Court Holiday (Sunday)", category: "sunday" },

  // December 2026
  { date: "2026-12-06", name: "Weekly Court Holiday (Sunday)", category: "sunday" },
  { date: "2026-12-12", name: "Second Saturday", category: "saturday" },
  { date: "2026-12-13", name: "Weekly Court Holiday (Sunday)", category: "sunday" },
  { date: "2026-12-20", name: "Weekly Court Holiday (Sunday)", category: "sunday" },
  { date: "2026-12-25", name: "Christmas Day & Winter Vacation", category: "gazetted" },
  { date: "2026-12-26", name: "Fourth Saturday & Winter Vacation", category: "gazetted" },
  { date: "2026-12-27", name: "Sunday & Winter Vacation", category: "gazetted" },
  { date: "2026-12-28", name: "Winter Vacation", category: "gazetted" },
  { date: "2026-12-29", name: "Winter Vacation", category: "gazetted" },
  { date: "2026-12-30", name: "Winter Vacation", category: "gazetted" },
  { date: "2026-12-31", name: "Winter Vacation", category: "gazetted" },
];

/**
 * Rajasthan High Court — Civil Courts Calendar 2027
 * Official Government / Court Holidays on particular dates (Red Ink entries).
 * Restricted holidays (Note 1) and conditional Summer Vacation (Note 4) are intentionally excluded.
 */
export const COURT_HOLIDAYS_2027: CourtHoliday[] = [
  // January 2027
  { date: "2027-01-01", name: "New Year's Day", category: "gazetted" },
  { date: "2027-01-09", name: "Second Saturday", category: "saturday" },
  { date: "2027-01-23", name: "Fourth Saturday", category: "saturday" },
  { date: "2027-01-26", name: "Republic Day", category: "gazetted" },

  // February 2027
  { date: "2027-02-13", name: "Second Saturday", category: "saturday" },
  { date: "2027-02-27", name: "Fourth Saturday", category: "saturday" },

  // March 2027
  { date: "2027-03-06", name: "Maha Shivratri", category: "gazetted" },
  { date: "2027-03-10", name: "Idul-Fitar", category: "gazetted", moonDependent: true },
  { date: "2027-03-13", name: "Second Saturday", category: "saturday" },
  { date: "2027-03-21", name: "Holi", category: "gazetted" },
  { date: "2027-03-22", name: "Holi", category: "gazetted" },
  { date: "2027-03-26", name: "Good Friday", category: "gazetted" },
  { date: "2027-03-27", name: "Fourth Saturday", category: "saturday" },

  // April 2027
  { date: "2027-04-08", name: "Chetichand", category: "gazetted" },
  { date: "2027-04-10", name: "Second Saturday", category: "saturday" },
  { date: "2027-04-14", name: "Ambedkar Jayanti", category: "gazetted" },
  { date: "2027-04-15", name: "Ram Navmi", category: "gazetted" },
  { date: "2027-04-19", name: "Mahaveer Jayanti", category: "gazetted" },
  { date: "2027-04-24", name: "Fourth Saturday", category: "saturday" },

  // May 2027
  { date: "2027-05-08", name: "Second Saturday", category: "saturday" },
  { date: "2027-05-17", name: "Idul-Azha", category: "gazetted", moonDependent: true },
  { date: "2027-05-22", name: "Fourth Saturday", category: "saturday" },

  // June 2027
  { date: "2027-06-07", name: "Pratap Jayanti", category: "gazetted" },
  { date: "2027-06-12", name: "Second Saturday", category: "saturday" },
  { date: "2027-06-16", name: "Moharram", category: "gazetted", moonDependent: true },
  { date: "2027-06-26", name: "Fourth Saturday", category: "saturday" },

  // July 2027
  { date: "2027-07-10", name: "Second Saturday", category: "saturday" },
  { date: "2027-07-24", name: "Fourth Saturday", category: "saturday" },

  // August 2027
  { date: "2027-08-09", name: "World Tribal Day", category: "gazetted" },
  { date: "2027-08-14", name: "Second Saturday", category: "saturday" },
  { date: "2027-08-15", name: "Independence Day", category: "gazetted" },
  { date: "2027-08-16", name: "Barawafat (Id-Miladun Nabi)", category: "gazetted", moonDependent: true },
  { date: "2027-08-17", name: "Raksha Bandhan", category: "gazetted" },
  { date: "2027-08-25", name: "Janmashtami", category: "gazetted" },
  { date: "2027-08-28", name: "Fourth Saturday", category: "saturday" },

  // September 2027
  { date: "2027-09-10", name: "Baba Ramdev Jayanti", category: "gazetted" },
  { date: "2027-09-11", name: "Second Saturday", category: "saturday" },
  { date: "2027-09-25", name: "Fourth Saturday", category: "saturday" },
  { date: "2027-09-30", name: "Sthapna Navratra", category: "gazetted" },

  // October 2027
  { date: "2027-10-02", name: "Birthday of Mahatma Gandhi", category: "gazetted" },
  { date: "2027-10-07", name: "Dashera Holidays", category: "gazetted" },
  { date: "2027-10-08", name: "Dashera Holidays", category: "gazetted" },
  { date: "2027-10-09", name: "Dashera Holidays / Second Saturday", category: "gazetted" },
  { date: "2027-10-23", name: "Fourth Saturday", category: "saturday" },
  { date: "2027-10-27", name: "Deepawali Holidays", category: "gazetted" },
  { date: "2027-10-28", name: "Deepawali Holidays", category: "gazetted" },
  { date: "2027-10-29", name: "Deepawali Holidays", category: "gazetted" },
  { date: "2027-10-30", name: "Deepawali Holidays", category: "gazetted" },
  { date: "2027-10-31", name: "Deepawali Holidays", category: "gazetted" },

  // November 2027
  { date: "2027-11-13", name: "Second Saturday", category: "saturday" },
  { date: "2027-11-14", name: "Guru Nanak Deo Jayanti", category: "gazetted" },
  { date: "2027-11-27", name: "Fourth Saturday", category: "saturday" },

  // December 2027
  { date: "2027-12-11", name: "Second Saturday", category: "saturday" },
  { date: "2027-12-25", name: "Christmas Day / Winter Holidays (Fourth Saturday)", category: "gazetted" },
  { date: "2027-12-26", name: "Winter Holidays", category: "gazetted" },
  { date: "2027-12-27", name: "Winter Holidays", category: "gazetted" },
  { date: "2027-12-28", name: "Winter Holidays", category: "gazetted" },
  { date: "2027-12-29", name: "Winter Holidays", category: "gazetted" },
  { date: "2027-12-30", name: "Winter Holidays", category: "gazetted" },
  { date: "2027-12-31", name: "Winter Holidays", category: "gazetted" },
];

export const ALL_COURT_HOLIDAYS: CourtHoliday[] = [
  ...COURT_HOLIDAYS_2026,
  ...COURT_HOLIDAYS_2027,
];

export const COURT_HOLIDAY_MAP: Record<string, CourtHoliday> = Object.fromEntries(
  ALL_COURT_HOLIDAYS.map((holiday) => [holiday.date, holiday])
);

export function getCourtHoliday(dateStr?: string | null): CourtHoliday | null {
  if (!dateStr) return null;
  const key = dateStr.trim();
  return COURT_HOLIDAY_MAP[key] || null;
}

export function isCourtHoliday(dateStr?: string | null): boolean {
  return getCourtHoliday(dateStr) !== null;
}

export function getHolidaysForMonth(year: number, monthIndex: number): CourtHoliday[] {
  const prefix = `${year}-${String(monthIndex + 1).padStart(2, "0")}-`;
  return ALL_COURT_HOLIDAYS.filter((h) => h.date.startsWith(prefix));
}

export function getHolidayBlockMessage(dateStr?: string | null): string | null {
  const holiday = getCourtHoliday(dateStr);
  if (!holiday) return null;
  return `${formatDateDMY(holiday.date)} is a Government Holiday (${holiday.name}). Hearing date cannot be scheduled on this day.`;
}
