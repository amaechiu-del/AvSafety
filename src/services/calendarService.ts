/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CalendarEventSummary {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
  htmlLink?: string;
}

/**
 * List upcoming events from user's primary calendar
 */
export async function listCalendarEvents(accessToken: string): Promise<CalendarEventSummary[]> {
  const timeMin = new Date().toISOString();
  const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&maxResults=20&singleEvents=true&orderBy=startTime`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Failed to fetch calendar events: ${res.status}`);
  }

  const data = await res.json();
  return data.items || [];
}

/**
 * Create a new event in the user's primary Google Calendar
 */
export async function createCalendarEvent(
  accessToken: string,
  summary: string,
  description: string,
  location: string,
  startDateTime: string, // ISO string
  endDateTime: string   // ISO string
): Promise<CalendarEventSummary> {
  const url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      summary,
      description,
      location,
      start: { dateTime: startDateTime },
      end: { dateTime: endDateTime }
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Failed to create calendar event: ${res.status}`);
  }

  return await res.json();
}
