/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GmailMessageSummary {
  id: string;
  threadId: string;
  snippet?: string;
  subject?: string;
  from?: string;
  date?: string;
}

/**
 * List recent messages in user's Gmail inbox
 */
export async function listGmailMessages(accessToken: string, maxResults = 15): Promise<GmailMessageSummary[]> {
  const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Failed to list Gmail messages: ${res.status}`);
  }

  const data = await res.json();
  const messages = data.messages || [];

  // Fetch summaries for each message
  const detailedMessages: GmailMessageSummary[] = await Promise.all(
    messages.map(async (msg: { id: string; threadId: string }) => {
      try {
        const detailRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (detailRes.ok) {
          const detail = await detailRes.json();
          const headers = detail.payload?.headers || [];
          const subject = headers.find((h: any) => h.name.toLowerCase() === 'subject')?.value || '(No Subject)';
          const from = headers.find((h: any) => h.name.toLowerCase() === 'from')?.value || '(Unknown Sender)';
          const date = headers.find((h: any) => h.name.toLowerCase() === 'date')?.value || '';
          return {
            id: msg.id,
            threadId: msg.threadId,
            snippet: detail.snippet,
            subject,
            from,
            date
          };
        }
      } catch (e) {
        // ignore individual fetch errors
      }
      return { id: msg.id, threadId: msg.threadId, snippet: '(Details unavailable)' };
    })
  );

  return detailedMessages;
}

/**
 * Send an email via Gmail API
 */
export async function sendGmailMessage(
  accessToken: string,
  to: string,
  subject: string,
  bodyText: string
): Promise<void> {
  const utf8Subject = `=?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;
  const messageParts = [
    `To: ${to}`,
    `Subject: ${utf8Subject}`,
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
    '',
    bodyText
  ];
  const message = messageParts.join('\n');

  // The body needs to be base64url encoded
  const encodedMessage = btoa(unescape(encodeURIComponent(message)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const url = 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ raw: encodedMessage })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Failed to send email via Gmail: ${res.status}`);
  }
}
