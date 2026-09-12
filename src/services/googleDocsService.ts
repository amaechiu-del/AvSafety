/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GoogleDocSummary {
  id: string;
  name: string;
  modifiedTime?: string;
  createdTime?: string;
  webViewLink?: string;
  iconLink?: string;
  owners?: Array<{ displayName?: string; emailAddress?: string }>;
}

export interface GoogleDocDetail {
  documentId: string;
  title: string;
  revisionId?: string;
  body?: {
    content?: Array<{
      startIndex?: number;
      endIndex?: number;
      paragraph?: {
        elements?: Array<{
          startIndex?: number;
          endIndex?: number;
          textRun?: {
            content?: string;
            textStyle?: Record<string, any>;
          };
        }>;
      };
    }>;
  };
}

/**
 * List all Google Docs belonging to or accessible by the user in Google Drive
 */
export async function listGoogleDocs(accessToken: string): Promise<GoogleDocSummary[]> {
  const query = encodeURIComponent("mimeType='application/vnd.google-apps.document' and trashed=false");
  const fields = encodeURIComponent("files(id,name,modifiedTime,createdTime,webViewLink,iconLink,owners)");
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&orderBy=modifiedTime desc&pageSize=30&fields=${fields}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json'
    }
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Failed to fetch Google Docs: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.files || [];
}

/**
 * Fetch a specific Google Doc's content and structure
 */
export async function getGoogleDoc(accessToken: string, documentId: string): Promise<GoogleDocDetail> {
  const url = `https://docs.googleapis.com/v1/documents/${documentId}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json'
    }
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Failed to fetch document: ${res.status} ${res.statusText}`);
  }

  return await res.json();
}

/**
 * Create a new Google Doc with title and optional initial content
 */
export async function createGoogleDoc(
  accessToken: string, 
  title: string, 
  initialBodyText?: string
): Promise<{ documentId: string; title: string; webViewLink?: string }> {
  // Step 1: Create the document via Docs API
  const createUrl = 'https://docs.googleapis.com/v1/documents';
  const createRes = await fetch(createUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title })
  });

  if (!createRes.ok) {
    const err = await createRes.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Failed to create Google Doc: ${createRes.status} ${createRes.statusText}`);
  }

  const doc = await createRes.json();
  const documentId = doc.documentId;

  // Step 2: Insert initial body text if specified
  if (initialBodyText && initialBodyText.trim().length > 0) {
    const batchUpdateUrl = `https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`;
    await fetch(batchUpdateUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requests: [
          {
            insertText: {
              location: { index: 1 },
              text: initialBodyText
            }
          }
        ]
      })
    });
  }

  return {
    documentId,
    title: doc.title || title,
    webViewLink: `https://docs.google.com/document/d/${documentId}/edit`
  };
}

/**
 * Append text to an existing Google Document
 */
export async function appendTextToGoogleDoc(
  accessToken: string,
  documentId: string,
  textToAppend: string
): Promise<void> {
  // First retrieve doc to find valid end index
  const doc = await getGoogleDoc(accessToken, documentId);
  const content = doc.body?.content || [];
  
  // The last structural element in Docs body is typically the end of document
  let insertIndex = 1;
  if (content.length > 0) {
    const lastElement = content[content.length - 1];
    insertIndex = Math.max(1, (lastElement.endIndex || 2) - 1);
  }

  const batchUpdateUrl = `https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`;
  const res = await fetch(batchUpdateUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      requests: [
        {
          insertText: {
            location: { index: insertIndex },
            text: `\n\n${textToAppend}`
          }
        }
      ]
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Failed to append content: ${res.status}`);
  }
}

/**
 * Permanently delete or trash a Google Doc from Google Drive
 */
export async function deleteGoogleDoc(accessToken: string, documentId: string): Promise<void> {
  const url = `https://www.googleapis.com/drive/v3/files/${documentId}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!res.ok && res.status !== 204) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Failed to delete file: ${res.status}`);
  }
}

/**
 * Extract human readable plain text representation from a Google Doc structure
 */
export function extractDocPlainText(doc: GoogleDocDetail): string {
  if (!doc.body?.content) return '';
  let fullText = '';

  for (const element of doc.body.content) {
    if (element.paragraph?.elements) {
      for (const el of element.paragraph.elements) {
        if (el.textRun?.content) {
          fullText += el.textRun.content;
        }
      }
    }
  }

  return fullText.trim();
}

/**
 * Pre-configured Aviation Safety Summit templates ready for Google Docs export
 */
export const SUMMIT_DOC_TEMPLATES = [
  {
    id: 'communique',
    name: 'Official Summit Communiqué & Declaration (Draft)',
    category: 'Resolutions & Governance',
    description: 'The standard inter-agency resolution and declaration draft covering all 24 aviation sectors for official ministerial and regulatory endorsement.',
    defaultTitle: 'Aviation Safety Summit 2026 — Official Communiqué & Safety Declarations (Draft)',
    content: `AVIATION SAFETY SUMMIT 2026
OFFICIAL SUMMIT COMMUNIQUÉ & SAFETY DECLARATION (DRAFT)
Theme: "EVERYBODY IS INVOLVED IN AVIATION SAFETY"
Date: 17 November 2026
Venue: Marriott Hotel, Ikeja, Lagos, Nigeria
Host Secretariat: Domislink International Services Ltd / The Digital Empire

1. PREAMBLE
Recognizing that aviation safety is the collective responsibility of airlines, regulatory agencies, ground handlers, maintenance organizations, fuel suppliers, financial institutions, insurance providers, passengers, and civil society;

The delegates assembled at the Aviation Safety Summit 2026 at the Marriott Hotel, Ikeja, Lagos on 17 November 2026, hereby declare their unified commitment to achieving Zero Preventable Accidents through proactive risk intelligence, modern simulation training, robust safety management systems (SMS), and continuous inter-agency collaboration.

2. CORE DECLARATIONS
2.1 "Everybody Is Involved": Safety is not confined to the flight deck. Maintenance crews, ground marshals, air traffic controllers, regulatory inspectors, corporate leadership, and everyday passengers constitute the holistic safety chain.
2.2 Proactive Reporting Culture: A non-punitive, just-culture reporting framework must be instituted across all Nigerian and regional aviation operators to identify latent safety hazards before they escalate into incidents.
2.3 Modern Simulation Mandate: Under the principle "Sim Saves Fuel, Sim Saves Dollars, Sim Saves Lives", operators commit to increasing recurrent procedural training on Level-D and flight training devices (FTD).

3. KEY POLICY RESOLUTIONS
- Resolution 1: Establishment of a Unified Inter-Agency Safety Data Exchange among NCAA, NAMA, FAAN, NSIB, and commercial operators.
- Resolution 2: Mandatory annual human factors and Crew Resource Management (CRM) refresher certification for all airside personnel.
- Resolution 3: Expansion of the National Aviation Safety Memo Repository to crowd-source frontline safety innovations from engineers, pilots, and controllers.
- Resolution 4: Financial incentives and tax rebates for operators investing in state-of-the-art Flight Data Monitoring (FDM) and Maintenance Tracking software.

4. WORKING COMMITTEE SIGNATORIES & ENDORSEMENTS
[   ] Federal Ministry of Aviation & Aerospace Development
[   ] Nigeria Civil Aviation Authority (NCAA)
[   ] Nigerian Airspace Management Agency (NAMA)
[   ] Federal Airports Authority of Nigeria (FAAN)
[   ] National Safety Investigation Bureau (NSIB)
[   ] Airline Operators of Nigeria (AON)
[   ] Summit Secretariat — Domislink International Services Ltd
`
  },
  {
    id: 'safety_memo',
    name: 'Aviation Safety Memo & Hazard Assessment Report',
    category: 'Risk Intelligence',
    description: 'Structured ICAO Annex 19 safety report format with hazard identification, risk matrix rating, root cause analysis, and corrective action proposals.',
    defaultTitle: 'Aviation Safety Memo & Risk Assessment Report — Summit Working Draft',
    content: `AVIATION SAFETY MEMO & RISK ASSESSMENT REPORT
Summit Reference: Aviation Safety Summit 2026
Framework: ICAO Annex 19 Safety Management Systems (SMS)

I. MEMO GENERAL INFORMATION
Title of Submission: 
Author / Submitting Organization: 
Functional Sector: [Flight Operations / Maintenance / ATC / Ground Handling / Cargo / Fuel / Other]
Submission Date: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
Summit Registration ID: 

II. HAZARD DESCRIPTION & OPERATIONAL CONTEXT
1. Location / Phase of Operation: 
2. Aircraft / Equipment / System Involved: 
3. Nature of Hazard or Latent Safety Deficiency: 
[Detail the exact operational condition, human factors, weather, maintenance discrepancy, or procedural ambiguity observed.]

III. RISK MATRIX EVALUATION
- Likelihood (1 = Extremely Improbable to 5 = Frequent): 
- Severity (A = Negligible to E = Catastrophic): 
- Initial Safety Risk Index: 

IV. PROPOSED CORRECTIVE ACTION PLAN (CAP)
1. Immediate Containment Action: 
2. Root Cause Analysis (5-Whys / Fishbone): 
3. Long-Term Systemic Elimination Strategy: 
4. Training or Standard Operating Procedure (SOP) Revision Required: 

V. SUMMIT TECHNICAL COMMITTEE REVIEW NOTES
Status: [Submitted for Review]
Reviewer Comments: 
Action Assigned To: 
`
  },
  {
    id: 'sim_training',
    name: 'Simulation & Flight Training Policy Brief',
    category: 'Flight Training & Technology',
    description: 'Technical policy paper on simulator economics, safety dividends, abnormal situation management, and recurrent flight crew proficiency.',
    defaultTitle: 'Simulation Training Policy Paper — Sim Saves Fuel, Dollars, & Lives',
    content: `SIMULATION & FLIGHT TRAINING TECHNICAL POLICY BRIEF
"Sim Saves Fuel. Sim Saves Dollars. Sim Saves Lives."
Aviation Safety Summit 2026 — Plenary Technology Working Group

1. EXECUTIVE SUMMARY
Flight simulation represents the pinnacle of proactive aviation safety. By enabling flight crews and technical operators to experience high-stress emergency scenarios in a zero-risk, high-fidelity environment, simulators preserve human lives and generate vast operational efficiencies.

2. THE TRIPLE VALUE PROPOSITION
- Sim Saves Fuel: Zero aviation turbine fuel (Jet A-1) burned during procedural maneuvers, engine-out climbs, and crosswind practice.
- Sim Saves Dollars: Eliminates airframe wear-and-tear, insurance premiums, and aircraft repositioning expenses while tripling training throughput.
- Sim Saves Lives: Flight crews practice uncontained engine fires, dual hydraulic failures, and severe microburst recoveries until responses are second nature.

3. STRATEGIC RECOMMENDATIONS FOR WEST AFRICAN AIRLINES
- Recommendation 1: Regional Simulator Pooling to eliminate expensive overseas pilot travel.
- Recommendation 2: Integration of Upset Prevention and Recovery Training (UPRT) across all commercial type-ratings.
- Recommendation 3: Simulator-based air traffic controller and ramp coordinator joint training sessions.

Presented at the Aviation Safety Summit 2026, Marriott Hotel, Lagos.
`
  },
  {
    id: 'delegate_notes',
    name: 'Summit Delegate Action Plan & Working Notes',
    category: 'Delegate Workspace',
    description: 'Personalized working document for delegates to capture key panel takeaways, speaker insights, collaborative commitments, and organizational follow-ups.',
    defaultTitle: 'My Aviation Safety Summit 2026 — Delegate Action Plan & Working Notes',
    content: `MY AVIATION SAFETY SUMMIT 2026 DELEGATE ACTION PLAN & WORKING NOTES
Participant: 
Organization: 
Date of Attendance: 17 November 2026
Venue: Marriott Hotel, Ikeja, Lagos, Nigeria

1. KEY PLENARY TAKEAWAYS
- Session: "Everybody Is Involved in Aviation Safety"
  Notes: 
- Session: "Government & Regulatory Alignment" (NCAA, NAMA, FAAN, NSIB)
  Notes: 
- Session: "Commercial Airline Operations & Maintenance Standards"
  Notes: 

2. SAFETY INITIATIVES TO IMPLEMENT IN MY HOME ORGANIZATION
[1] 
[2] 
[3] 

3. INDUSTRY STAKEHOLDER CONTACTS & COLLABORATIONS
- Contact 1: 
- Contact 2: 
- Contact 3: 

4. MEMOS AND RESOLUTIONS SUPPORTED
- Memo / Topic Reference: 
- Commitment: 
`
  }
];
