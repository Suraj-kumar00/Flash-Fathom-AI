import { format, toZonedTime } from 'date-fns-tz';

/**
 * Formats a date to YYYY-MM-DD in the specified timezone
 * @param date - The date to format
 * @param timezone - IANA timezone string (e.g., 'America/Los_Angeles', 'UTC')
 * @returns Date string in YYYY-MM-DD format in the user's timezone
 */
export function formatDateInTimezone(date: Date, timezone: string): string {
  const zonedDate = toZonedTime(date, timezone);
  return format(zonedDate, 'yyyy-MM-dd', { timeZone: timezone });
}

/**
 * Gets the day of week (0-6) for a date in the specified timezone
 * @param date - The date
 * @param timezone - IANA timezone string
 * @returns Day of week (0 = Sunday, 6 = Saturday)
 */
export function getDayInTimezone(date: Date, timezone: string): number {
  const zonedDate = toZonedTime(date, timezone);
  return zonedDate.getDay();
}

/**
 * Gets the hour (0-23) for a date in the specified timezone
 * @param date - The date
 * @param timezone - IANA timezone string
 * @returns Hour (0-23)
 */
export function getHourInTimezone(date: Date, timezone: string): number {
  const zonedDate = toZonedTime(date, timezone);
  return zonedDate.getHours();
}

/**
 * Validates a timezone string
 * @param timezone - The timezone to validate
 * @returns true if valid, false otherwise
 */
export function isValidTimezone(timezone: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
}

