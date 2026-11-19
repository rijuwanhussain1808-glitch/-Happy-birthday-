/**
 * Time-of-day greeting utility for personal greetings.
 */

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

/**
 * Returns the period of the day based on a 0-23 hour.
 * - 05:00 - 11:59 -> morning
 * - 12:00 - 16:59 -> afternoon
 * - 17:00 - 21:59 -> evening
 * - 22:00 - 04:59 -> night
 */
export function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 12) {
    return 'morning';
  }
  if (hour >= 12 && hour < 17) {
    return 'afternoon';
  }
  if (hour >= 17 && hour < 22) {
    return 'evening';
  }
  return 'night';
}

/**
 * Generates a warm, birthday celebration greeting for Sarena.
 */
export function getBirthdayGreeting(name: string = 'Saru'): {
  greeting: string;
  subtitleText: string;
} {
  return {
    greeting: `Happy Birthday, ${name} 🎂`,
    subtitleText: 'Wishing you a happy birthday filled with laughter, love, and sweet memories.',
  };
}

/**
 * Generates a warm, personalized greeting for Sarena.
 * Birthday celebration replaces generic late-night greetings.
 */
export function getPersonalizedGreeting(
  name: string = 'Saru',
  date: Date = new Date()
): { greeting: string; period: TimeOfDay; subtitleText: string } {
  const hour = date.getHours();
  const period = getTimeOfDay(hour);

  let greeting = '';
  let subtitleText = '';

  switch (period) {
    case 'morning':
      greeting = `Good morning, ${name}`;
      subtitleText = 'Wishing your day begins with a gentle smile and lovely thoughts.';
      break;
    case 'afternoon':
      greeting = `Good afternoon, ${name}`;
      subtitleText = 'Hope your day is treating you with warmth and kindness.';
      break;
    case 'evening':
      greeting = `Good evening, ${name}`;
      subtitleText = 'As the evening softly settles in, here is a quiet world for you.';
      break;
    case 'night':
      greeting = `Happy Birthday, ${name} 🎂`;
      subtitleText = 'A magical birthday celebration, made with care and love just for you.';
      break;
  }

  return { greeting, period, subtitleText };
}
