/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GoogleSlidePresentationSummary {
  presentationId: string;
  title: string;
  webViewLink?: string;
}

/**
 * Create a new Google Slides presentation
 */
export async function createGoogleSlidePresentation(
  accessToken: string,
  title: string
): Promise<GoogleSlidePresentationSummary> {
  const url = 'https://slides.googleapis.com/v1/presentations';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Failed to create Google Slides presentation: ${res.status}`);
  }

  const data = await res.json();
  return {
    presentationId: data.presentationId,
    title: data.title || title,
    webViewLink: `https://docs.google.com/presentation/d/${data.presentationId}/edit`
  };
}
