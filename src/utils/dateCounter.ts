/**
 * Utility for calculating time elapsed since a given date.
 * Accurately breaks down the elapsed interval into years, months, and days,
 * along with the total count of days.
 */

export interface TimeElapsed {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  isValid: boolean;
  isFuture: boolean;
}

/**
 * Calculates exact calendar years, months, and days elapsed between startDate and currentDate.
 */
export function calculateTimeElapsed(
  startDateInput: string | Date,
  currentDateInput: string | Date = new Date()
): TimeElapsed {
  const start = new Date(startDateInput);
  const current = new Date(currentDateInput);

  if (isNaN(start.getTime()) || isNaN(current.getTime())) {
    return {
      years: 0,
      months: 0,
      days: 0,
      totalDays: 0,
      isValid: false,
      isFuture: false,
    };
  }

  // Handle future date scenario gracefully
  if (current.getTime() < start.getTime()) {
    return {
      years: 0,
      months: 0,
      days: 0,
      totalDays: 0,
      isValid: true,
      isFuture: true,
    };
  }

  // Calculate total days
  const diffTime = current.getTime() - start.getTime();
  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Calculate calendar years, months, days
  let years = current.getFullYear() - start.getFullYear();
  let months = current.getMonth() - start.getMonth();
  let days = current.getDate() - start.getDate();

  if (days < 0) {
    months -= 1;
    // Number of days in the previous month of `current`
    const prevMonthLastDay = new Date(current.getFullYear(), current.getMonth(), 0).getDate();
    days += prevMonthLastDay;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return {
    years: Math.max(0, years),
    months: Math.max(0, months),
    days: Math.max(0, days),
    totalDays: Math.max(0, totalDays),
    isValid: true,
    isFuture: false,
  };
}
