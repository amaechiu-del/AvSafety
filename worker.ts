import seedDb from './data/db.json';
import { INITIAL_AD_POSITIONS, INITIAL_SPONSORSHIP_PACKAGES } from './src/data/marketplaceData';
import { STAKEHOLDER_CATEGORIES } from './src/data/stakeholdersData';

interface KVNamespaceLike {
  get(key: string, type: 'json'): Promise<any | null>;
  get(key: string, type?: 'text'): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
}

interface AssetsBinding {
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
}

interface WorkerEnv {
  AVSAFETY_KV: KVNamespaceLike;
  ASSETS?: AssetsBinding;
  APP_URL?: string;
  API_ORIGIN?: string;
  CORS_ORIGIN?: string;
  GEMINI_API_KEY?: string;
  PAYSTACK_SECRET_KEY?: string;
  PAYSTACK_PUBLIC_KEY?: string;
  NODE_ENV?: string;
}

interface WorkerExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
}

const DB_KEY = 'avsafety:db';
const PAYSTACK_BASE_URL = 'https://api.paystack.co';
const GEMINI_MODEL = 'gemini-2.5-flash';
const jsonContentType = { 'content-type': 'application/json; charset=utf-8' };

function paystackHeaders(secretKey: string) {
  return {
    ...jsonContentType,
    Authorization: ['Bearer', secretKey].join(' '),
  };
}

const defaultDb = {
  ...seedDb,
  ad_positions: (seedDb as any).ad_positions ?? INITIAL_AD_POSITIONS,
  sponsorship_packages: (seedDb as any).sponsorship_packages ?? INITIAL_SPONSORSHIP_PACKAGES,
  marketplace_orders: (seedDb as any).marketplace_orders ?? [],
  custom_quotes: (seedDb as any).custom_quotes ?? [],
  creative_requests: (seedDb as any).creative_requests ?? [],
  proof_of_displays: (seedDb as any).proof_of_displays ?? [],
  invitation_letters: (seedDb as any).invitation_letters ?? [],
};

function cloneDefaultDb() {
  return JSON.parse(JSON.stringify(defaultDb));
}

function json(data: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set('content-type', 'application/json; charset=utf-8');
  return new Response(JSON.stringify(data, null, 2), {
    ...init,
    headers,
  });
}

function applyCors(response: Response, request: Request, env: WorkerEnv) {
  const headers = new Headers(response.headers);
  const requestOrigin = request.headers.get('Origin');
  const configuredOrigins = (env.CORS_ORIGIN || env.APP_URL || '*')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  const allowOrigin = configuredOrigins.includes('*')
    ? '*'
    : requestOrigin && configuredOrigins.includes(requestOrigin)
      ? requestOrigin
      : configuredOrigins[0] || '*';

  headers.set('Access-Control-Allow-Origin', allowOrigin);
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Mode');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  headers.set('Access-Control-Allow-Credentials', 'true');
  headers.set('Vary', 'Origin');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

async function parseJson(request: Request) {
  const text = await request.text();
  return text ? JSON.parse(text) : {};
}

function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function createReference(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

function mergeDeep(target: any, source: any): any {
  if (!source || typeof source !== 'object' || Array.isArray(source)) {
    return source ?? target;
  }

  const base = Array.isArray(target) ? [...target] : { ...(target || {}) };
  for (const [key, value] of Object.entries(source)) {
    if (Array.isArray(value)) {
      base[key] = value;
    } else if (value && typeof value === 'object') {
      base[key] = mergeDeep(base[key], value);
    } else {
      base[key] = value;
    }
  }
  return base;
}

async function readDb(env: WorkerEnv) {
  const existing = await env.AVSAFETY_KV.get(DB_KEY, 'json');
  if (existing) {
    return mergeDeep(cloneDefaultDb(), existing);
  }

  const seeded = cloneDefaultDb();
  await writeDb(env, seeded);
  return seeded;
}

async function writeDb(env: WorkerEnv, data: any) {
  await env.AVSAFETY_KV.put(DB_KEY, JSON.stringify(data));
}

function calculateStakeholderStats(stakeholders: any[]) {
  const stats = {
    totalCandidates: stakeholders.length,
    proposedInvitees: 0,
    invitationsSent: 0,
    acknowledged: 0,
    interested: 0,
    accepted: 0,
    confirmed: 0,
    declined: 0,
    noResponse: 0,
    archived: 0,
    sponsorshipInterestCount: 0,
    speakerInterestCount: 0,
    exhibitorInterestCount: 0,
    byCategory: {} as Record<string, number>,
  };

  for (const stakeholder of stakeholders) {
    if (stakeholder.status === 'PROPOSED INVITEE') stats.proposedInvitees += 1;
    else if (stakeholder.status === 'INVITATION SENT') stats.invitationsSent += 1;
    else if (stakeholder.status === 'ACKNOWLEDGED') stats.acknowledged += 1;
    else if (stakeholder.status === 'INTERESTED') stats.interested += 1;
    else if (stakeholder.status === 'ACCEPTED') stats.accepted += 1;
    else if (stakeholder.status === 'CONFIRMED') stats.confirmed += 1;
    else if (stakeholder.status === 'DECLINED') stats.declined += 1;
    else if (stakeholder.status === 'NO RESPONSE') stats.noResponse += 1;
    else if (stakeholder.status === 'ARCHIVED') stats.archived += 1;

    if (stakeholder.sponsorshipInterest && stakeholder.sponsorshipInterest !== 'NONE') stats.sponsorshipInterestCount += 1;
    if (stakeholder.speakerInterest) stats.speakerInterestCount += 1;
    if (stakeholder.exhibitorInterest) stats.exhibitorInterestCount += 1;

    const category = stakeholder.category || 'OTHER';
    stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
  }

  return stats;
}

function computeOrderTotals(order: any) {
  const items = Array.isArray(order.items) ? order.items : [];
  const currency = order.currency === 'USD' ? 'USD' : 'NGN';
  const priceKey = currency === 'USD' ? 'unitPriceUSD' : 'unitPriceNGN';
  const productionKey = currency === 'USD' ? 'productionCostUSD' : 'productionCostNGN';
  const installationKey = currency === 'USD' ? 'installationCostUSD' : 'installationCostNGN';

  const subtotal = items.reduce((sum: number, item: any) => sum + (Number(item[priceKey]) || 0) * (Number(item.quantity) || 1), 0);
  const productionTotal = items.reduce((sum: number, item: any) => {
    if (item.supplyOption === 'SUPPLIED_BY_CLIENT') return sum;
    return sum + (Number(item[productionKey]) || 0) * (Number(item.quantity) || 1);
  }, 0);
  const installationTotal = items.reduce((sum: number, item: any) => sum + (Number(item[installationKey]) || 0) * (Number(item.quantity) || 1), 0);
  const addonsTotal = Array.isArray(order.addons)
    ? order.addons.reduce((sum: number, addon: any) => sum + (Number(addon[currency === 'USD' ? 'priceUSD' : 'priceNGN']) || 0), 0)
    : 0;

  return {
    subtotal,
    productionTotal,
    installationTotal,
    addonsTotal,
    totalAmount: subtotal + productionTotal + installationTotal + addonsTotal,
  };
}

function scorePosition(position: any, text: string) {
  const haystack = `${position.name} ${position.description} ${position.location} ${position.category} ${position.targetAudience}`.toLowerCase();
  let score = 0;
  for (const word of text.split(/\W+/).filter(Boolean)) {
    if (haystack.includes(word)) score += 1;
  }
  if (text.includes('vip') && /vip|executive|leadership/.test(haystack)) score += 2;
  if (text.includes('water') && /water|delegate/.test(haystack)) score += 3;
  if (text.includes('digital') && /online|portal|digital/.test(haystack)) score += 2;
  if (text.includes('booth') && /booth|exhibition|showcase/.test(haystack)) score += 2;
  return score;
}

async function maybeProxyRequest(request: Request, env: WorkerEnv) {
  if (!env.API_ORIGIN) return null;

  const url = new URL(request.url);
  const upstreamUrl = new URL(url.pathname + url.search, env.API_ORIGIN);
  const body = request.method === 'GET' || request.method === 'HEAD' ? undefined : await request.text();
  const headers = new Headers(request.headers);
  headers.delete('host');

  return fetch(upstreamUrl, {
    method: request.method,
    headers,
    body,
    redirect: 'manual',
  });
}

async function generateGeminiText(env: WorkerEnv, systemInstruction: string, prompt: string) {
  if (!env.GEMINI_API_KEY) return null;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(env.GEMINI_API_KEY)}`,
    {
      method: 'POST',
      headers: jsonContentType,
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemInstruction}\n\n${prompt}` }],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          topP: 0.9,
        },
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Gemini request failed with status ${response.status}`);
  }

  const data: any = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.map((part: any) => part.text).filter(Boolean).join('\n').trim();
  return text || null;
}

async function handleSummitChat(request: Request, env: WorkerEnv) {
  const db = await readDb(env);
  const payload = await parseJson(request);
  const message = String(payload.message || '').trim();

  if (!message) {
    return json({ error: 'Message is required.' }, { status: 400 });
  }

  const speakerNames = (db.speakers || []).slice(0, 8).map((speaker: any) => speaker.name).join(', ');
  const sessionTitles = (db.sessions || []).slice(0, 6).map((session: any) => session.title).join(', ');
  const fallback = `The summit theme is "${db.event?.theme}" and it holds on ${db.event?.date} at ${db.event?.venue}. Featured speakers include ${speakerNames || 'verified aviation leaders'}. Session highlights include ${sessionTitles || 'the published summit programme'}.`;

  try {
    const text = await generateGeminiText(
      env,
      'You are the official Aviation Safety Summit 2026 assistant. Answer only with grounded information from the supplied context. If context is missing, say so plainly.',
      `Context:\nTheme: ${db.event?.theme}\nDate: ${db.event?.date}\nVenue: ${db.event?.venue}\nSpeakers: ${speakerNames}\nSessions: ${sessionTitles}\n\nQuestion: ${message}`,
    );

    return json({ text: text || fallback, grounded: Boolean(text) });
  } catch {
    return json({ text: fallback, grounded: false });
  }
}

async function handleSpeakerTopics(request: Request, env: WorkerEnv) {
  const payload = await parseJson(request);
  const speakerName = String(payload.name || 'The invited speaker');
  const organisation = String(payload.organisation || 'their organisation');
  const industry = String(payload.industry || 'aviation safety');
  const role = String(payload.role || 'speaker');

  const fallbackTopics = [
    `${industry} safety governance priorities for 2026`,
    `Operational resilience lessons from ${organisation}`,
    `${role} perspective on cross-sector aviation safety collaboration`,
  ];

  try {
    const text = await generateGeminiText(
      env,
      'Return exactly three concise aviation-safety-focused talk topics as plain lines, with no numbering and no extra commentary.',
      `Speaker: ${speakerName}\nOrganisation: ${organisation}\nIndustry: ${industry}\nRole: ${role}`,
    );

    const topics = text?.split('\n').map((line) => line.replace(/^[-*\d.\s]+/, '').trim()).filter(Boolean).slice(0, 3) || fallbackTopics;
    return json({ topics, disclaimer: 'AI-generated suggestions must be confirmed by the summit editorial team.' });
  } catch {
    return json({ topics: fallbackTopics, disclaimer: 'Fallback suggestions were generated from verified speaker metadata only.' });
  }
}

async function handleSpeakerAssistant(request: Request, env: WorkerEnv) {
  const db = await readDb(env);
  const payload = await parseJson(request);
  const question = String(payload.question || '').trim().toLowerCase();
  if (!question) return json({ answer: 'Please provide a speaker question.' }, { status: 400 });

  const speakers = (db.speakers || []) as any[];
  const match = speakers.find((speaker) => {
    const haystack = `${speaker.name} ${speaker.position} ${speaker.organisation} ${speaker.topic} ${speaker.industry}`.toLowerCase();
    return question.split(/\W+/).filter(Boolean).some((word) => word.length > 3 && haystack.includes(word));
  }) || speakers[0];

  if (!match) {
    return json({ answer: 'No speaker records are available in the current summit registry.' });
  }

  const answer = `${match.name} serves as ${match.position} at ${match.organisation}. Their featured summit topic is "${match.topic}" and they bring a ${match.industry} perspective to aviation safety.`;
  return json({ answer });
}

async function handleStakeholderBrainstorm(_request: Request, env: WorkerEnv) {
  const db = await readDb(env);
  const stakeholders = (db.stakeholders || []) as any[];
  const counts = calculateStakeholderStats(stakeholders).byCategory;

  const suggestions = STAKEHOLDER_CATEGORIES
    .map((category) => ({ category, total: counts[category.id] || 0 }))
    .sort((left, right) => left.total - right.total)
    .slice(0, 5)
    .map(({ category }) => ({
      name: `${category.shortLabel} Executive Candidate`,
      position: `${category.shortLabel} Safety / Strategy Lead`,
      organisation: `${category.title} (Manual Verification Required)`,
      category: category.id,
      proposedRole: 'Panelist',
      proposedTopic: category.defaultDiscussionArea,
      whyRelevant: category.whyCorporateBelongs,
    }));

  return json({
    suggestions,
    disclaimer: 'Brainstorm output highlights underrepresented sectors in the current stakeholder register. Every candidate still requires manual verification before outreach.',
  });
}

async function handleStakeholderLetter(request: Request) {
  const payload = await parseJson(request);
  const recipientName = String(payload.recipientName || 'Distinguished Stakeholder');
  const recipientPosition = String(payload.recipientPosition || 'Executive Leader');
  const recipientOrg = String(payload.recipientOrg || 'Organisation');
  const recipientEmail = String(payload.recipientEmail || '');
  const proposedTopic = String(payload.proposedTopic || 'Aviation Safety Leadership');
  const eventRole = String(payload.eventRole || 'Distinguished Speaker');

  const subject = `Invitation to Participate in Aviation Safety Summit 2026`;
  const formalSalutation = `Dear ${recipientName},`;
  const formalInvitationText = `On behalf of Domislink International Services Ltd, we respectfully invite you to participate as ${eventRole} at the Aviation Safety Summit 2026. We believe your leadership as ${recipientPosition} at ${recipientOrg} will add practical value to the summit conversation on "${proposedTopic}."`;
  const eventDetailsText = 'Event Details: 17 November 2026 · Marriott Hotel, Ikeja, Lagos, Nigeria · Theme: EVERYBODY IS INVOLVED IN AVIATION SAFETY.';
  const sectorRelevanceText = `Your organisation's perspective is especially relevant as the summit convenes regulators, operators, financiers, trainers, and infrastructure leaders around shared safety outcomes.`;
  const proposedRoleText = `Proposed Participation: ${eventRole} with emphasis on ${proposedTopic}.`;
  const callToActionText = 'Kindly confirm your availability, preferred speaking topic, and protocol contact for formal follow-up.';
  const signatureBlock = 'Warm regards,\nDomislink International Services Ltd\nAviation Safety Summit Secretariat';
  const mailtoUrl = recipientEmail
    ? `mailto:${encodeURIComponent(recipientEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`${formalSalutation}\n\n${formalInvitationText}\n\n${eventDetailsText}\n\n${sectorRelevanceText}\n\n${proposedRoleText}\n\n${callToActionText}\n\n${signatureBlock}`)}`
    : '';
  const gmailDraftUrl = recipientEmail
    ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipientEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(`${formalSalutation}\n\n${formalInvitationText}\n\n${eventDetailsText}\n\n${sectorRelevanceText}\n\n${proposedRoleText}\n\n${callToActionText}\n\n${signatureBlock}`)}`
    : '';

  return json({
    letter: {
      recipientEmail,
      subject,
      formalSalutation,
      formalInvitationText,
      eventDetailsText,
      sectorRelevanceText,
      proposedRoleText,
      callToActionText,
      signatureBlock,
      mailtoUrl,
      gmailDraftUrl,
    },
  });
}

async function handleStakeholderProposal(request: Request, env: WorkerEnv) {
  const db = await readDb(env);
  const payload = await parseJson(request);
  const companyName = String(payload.companyName || 'Your organisation');
  const industry = String(payload.industry || 'AVIATION');
  const executiveName = String(payload.executiveName || 'Your executive team');
  const packages = (db.sponsorship_packages || []).slice(0, 3).map((pkg: any) => ({
    tier: pkg.tier || pkg.name,
    feeNGN: `₦${Number(pkg.priceNGN || 0).toLocaleString()}`,
    feeUSD: `$${Number(pkg.priceUSD || 0).toLocaleString()}`,
    benefits: (pkg.benefits || pkg.keyBenefits || [pkg.description]).slice(0, 4),
  }));

  return json({
    proposal: {
      headline: `${companyName} x Aviation Safety Summit 2026`,
      whySectorMatters: `${industry} institutions influence operational resilience, investment quality, and safety culture across the aviation value chain.`,
      howParticipationSupportsSafety: `${executiveName} can use sponsorship to demonstrate measurable commitment to safer skies, stronger governance, and cross-sector collaboration.`,
      recommendedTiers: packages,
      callToAction: 'Select a preferred package, confirm decision-makers, and the Domislink secretariat can convert this into a formal commercial offer.',
    },
  });
}

async function handleMarketplaceAdvisor(request: Request, env: WorkerEnv) {
  const db = await readDb(env);
  const payload = await parseJson(request);
  const currency = payload.currency === 'USD' ? 'USD' : 'NGN';
  const context = `${payload.organisation || ''} ${payload.promotionGoal || ''} ${payload.targetAudience || ''} ${payload.estimatedBudget || ''} ${payload.message || ''}`.toLowerCase();
  const positions = (db.ad_positions || INITIAL_AD_POSITIONS)
    .filter((position: any) => position.availableInventory > 0)
    .map((position: any) => ({ ...position, score: scorePosition(position, context) }))
    .sort((left: any, right: any) => right.score - left.score || left.priceNGN - right.priceNGN)
    .slice(0, 4)
    .map((position: any) => ({
      ...position,
      reason: `Matched to your stated goal using verified catalogue data for ${position.category.toLowerCase()} placement.`,
      expectedImpact: position.targetAudience,
      safetyCompliance: position.requiresRegulatoryApproval
        ? 'Requires final regulatory review before campaign go-live.'
        : 'Operationally suitable for the summit safety environment.',
    }));

  const packages = (db.sponsorship_packages || INITIAL_SPONSORSHIP_PACKAGES)
    .map((pkg: any) => ({
      id: pkg.id,
      name: pkg.name,
      category: pkg.tier || 'SPONSORSHIP',
      priceNGN: pkg.priceNGN,
      priceUSD: pkg.priceUSD,
      reason: pkg.description || `${pkg.name} delivers premium visibility across summit touchpoints.`,
      expectedImpact: (pkg.keyBenefits || pkg.benefits || []).slice(0, 2).join(' • ') || 'Executive visibility and delegate engagement',
      safetyCompliance: 'All inclusions use approved summit inventory and review controls.',
    }))
    .slice(0, 2);

  const recommendedPackages = [...positions, ...packages].sort((left: any, right: any) => {
    const leftPrice = currency === 'USD' ? left.priceUSD : left.priceNGN;
    const rightPrice = currency === 'USD' ? right.priceUSD : right.priceNGN;
    return (leftPrice || 0) - (rightPrice || 0);
  }).slice(0, 4);

  return json({
    success: true,
    advisorGreeting: `We analysed the verified summit inventory for ${payload.organisation || 'your organisation'}.`,
    strategicAdvice: 'Prioritise inventory that aligns with your audience, message repetition, and high-trust safety positioning rather than broad untargeted reach.',
    recommendedPackages,
    nextSteps: 'Shortlist preferred placements, confirm artwork timelines, and use the booking cart to proceed to quote generation or payment.',
  });
}

async function handleCreativeRequest(request: Request, env: WorkerEnv) {
  const db = await readDb(env);
  const payload = await parseJson(request);
  const fallbackConcept = `Headline: Safety Leadership That Protects Every Flight\n\nPrimary message: ${payload.message || 'Position your brand as a trusted aviation safety partner.'}\n\nRecommended visual direction: combine your logo with summit gold/navy branding, a credible aviation operations image, and a short proof-based call to action for regulators, operators, and executives.`;

  let aiDraftConcept = fallbackConcept;
  try {
    const prompt = await generateGeminiText(
      env,
      'Write concise sponsor ad copy for an aviation safety summit. Use a professional tone and avoid unsupported claims.',
      `Company: ${payload.companyName}\nAudience: ${payload.targetAudience}\nFormat: ${payload.preferredSizeFormat}\nGoal: ${payload.message}`,
    );
    if (prompt) aiDraftConcept = prompt;
  } catch {
    // Use fallback concept.
  }

  const requestRecord = {
    id: createId('creative'),
    companyName: payload.companyName,
    contactPerson: payload.contactPerson,
    email: payload.email,
    phone: payload.phone,
    targetAudience: payload.targetAudience,
    preferredSizeFormat: payload.preferredSizeFormat,
    logoUrl: payload.logoUrl,
    deadline: payload.deadline,
    message: payload.message,
    aiDraftConcept,
    createdAt: new Date().toISOString(),
    status: 'DRAFT_GENERATED',
  };

  db.creative_requests = [requestRecord, ...(db.creative_requests || [])];
  await writeDb(env, db);

  return json({ success: true, request: requestRecord });
}

async function handlePaystackInitialize(request: Request, env: WorkerEnv) {
  const payload = await parseJson(request);
  if (!env.PAYSTACK_SECRET_KEY) {
    return json({ success: false, error: 'PAYSTACK_SECRET_KEY is not configured.' }, { status: 503 });
  }

  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: 'POST',
    headers: paystackHeaders(env.PAYSTACK_SECRET_KEY),
    body: JSON.stringify({
      email: payload.email,
      amount: Math.round(Number(payload.amount || 0) * 100),
      currency: payload.currency || 'NGN',
      metadata: {
        orderId: payload.orderId,
        companyName: payload.companyName,
        contactPerson: payload.contactPerson,
      },
      callback_url: env.APP_URL,
    }),
  });

  const data: any = await response.json();
  if (!response.ok || !data.status) {
    return json({ success: false, error: data.message || 'Unable to initialize Paystack transaction.' }, { status: 502 });
  }

  return json({
    success: true,
    reference: data.data.reference,
    authorizationUrl: data.data.authorization_url,
    accessCode: data.data.access_code,
    publicKey: env.PAYSTACK_PUBLIC_KEY || '',
  });
}

async function handlePaystackVerify(request: Request, env: WorkerEnv) {
  const payload = await parseJson(request);
  if (!env.PAYSTACK_SECRET_KEY) {
    return json({ success: false, error: 'PAYSTACK_SECRET_KEY is not configured.' }, { status: 503 });
  }

  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(String(payload.reference || ''))}`, {
    headers: paystackHeaders(env.PAYSTACK_SECRET_KEY),
  });

  const data: any = await response.json();
  if (!response.ok || !data.status || data.data?.status !== 'success') {
    return json({ success: false, verified: false, error: data.message || 'Payment verification failed.' }, { status: 502 });
  }

  const db = await readDb(env);
  const orders = (db.marketplace_orders || []) as any[];
  const orderIndex = orders.findIndex((order) => order.id === payload.orderId);
  const receiptNumber = createReference('REC-AVS26');

  if (orderIndex >= 0) {
    const updatedOrder = {
      ...orders[orderIndex],
      paymentStatus: 'VERIFIED_PAID',
      paystackReference: payload.reference,
      paystackChannel: data.data.channel,
      paidAt: new Date().toISOString(),
      orderStatus: 'APPROVED',
      receiptNumber,
      updatedAt: new Date().toISOString(),
    };
    orders[orderIndex] = updatedOrder;
    db.marketplace_orders = orders;
    await writeDb(env, db);
    return json({ success: true, verified: true, order: updatedOrder, receiptNumber });
  }

  return json({ success: true, verified: true, receiptNumber });
}

async function handleApiRequest(request: Request, env: WorkerEnv, _ctx: WorkerExecutionContext) {
  const url = new URL(request.url);
  const { pathname, searchParams } = url;

  if (pathname === '/api/health' && request.method === 'GET') {
    return json({ ok: true, runtime: 'cloudflare-workers', storage: 'kv', env: env.NODE_ENV || 'production' });
  }

  if (pathname === '/api/db' && request.method === 'GET') {
    return json(await readDb(env));
  }

  if (pathname === '/api/db/update' && request.method === 'POST') {
    const payload = await parseJson(request);
    const current = await readDb(env);
    const updated = mergeDeep(current, payload);
    await writeDb(env, updated);
    return json({ success: true, db: updated });
  }

  if (pathname === '/api/db/reset' && request.method === 'POST') {
    const resetDb = cloneDefaultDb();
    await writeDb(env, resetDb);
    return json({ success: true, db: resetDb });
  }

  if (pathname === '/api/admin/registrations' && request.method === 'GET') {
    const db = await readDb(env);
    return json({ registrations: db.registrations || [] });
  }

  if (pathname === '/api/registrations' && request.method === 'POST') {
    const db = await readDb(env);
    const payload = await parseJson(request);
    const now = new Date().toISOString();
    const registration = {
      id: createId('reg'),
      registrationCode: createReference('AVS26').toUpperCase(),
      status: 'PENDING_REVIEW',
      registeredAt: now,
      consentTimestamp: payload.consentTimestamp || now,
      jurisdiction: payload.jurisdiction || 'Nigeria',
      ...payload,
    };
    db.registrations = [registration, ...(db.registrations || [])];
    await writeDb(env, db);
    return json({ success: true, registration });
  }

  if (pathname === '/api/registrations/status' && request.method === 'POST') {
    const db = await readDb(env);
    const payload = await parseJson(request);
    const registrations = (db.registrations || []) as any[];
    const updatedRegistrations = registrations.map((registration) => {
      if (registration.id === payload.id || registration.registrationCode === payload.registrationCode) {
        return { ...registration, status: payload.status, adminNotes: payload.adminNotes ?? registration.adminNotes };
      }
      return registration;
    });
    db.registrations = updatedRegistrations;
    await writeDb(env, db);
    return json({ success: true, registrations: updatedRegistrations });
  }

  if (pathname === '/api/memos' && request.method === 'POST') {
    const db = await readDb(env);
    const payload = await parseJson(request);
    const memo = {
      id: createId('memo'),
      submittedAt: new Date().toISOString(),
      ...payload,
    };
    db.memo_submissions = [memo, ...(db.memo_submissions || [])];
    await writeDb(env, db);
    return json({ success: true, memo });
  }

  if (pathname === '/api/marketplace/inventory' && request.method === 'GET') {
    const db = await readDb(env);
    return json({ positions: db.ad_positions || INITIAL_AD_POSITIONS, packages: db.sponsorship_packages || INITIAL_SPONSORSHIP_PACKAGES });
  }

  if (pathname === '/api/marketplace/inventory/update' && request.method === 'POST') {
    const db = await readDb(env);
    const payload = await parseJson(request);
    db.ad_positions = (db.ad_positions || INITIAL_AD_POSITIONS).map((position: any) => position.id === payload.id ? { ...position, ...payload } : position);
    await writeDb(env, db);
    return json({ success: true, positions: db.ad_positions });
  }

  if (pathname === '/api/marketplace/orders' && request.method === 'GET') {
    const db = await readDb(env);
    const email = (searchParams.get('email') || '').toLowerCase();
    const orders = (db.marketplace_orders || []).filter((order: any) => !email || String(order.email || '').toLowerCase() === email);
    return json({ success: true, orders });
  }

  if (pathname === '/api/marketplace/orders' && request.method === 'POST') {
    const db = await readDb(env);
    const payload = await parseJson(request);
    const now = new Date().toISOString();
    const totals = computeOrderTotals(payload);
    const order = {
      id: createId('ord'),
      orderNumber: createReference('ORD-AVS26').toUpperCase(),
      currency: payload.currency === 'USD' ? 'USD' : 'NGN',
      paymentMethod: payload.paymentMethod || 'PAYSTACK',
      paymentStatus: payload.paymentStatus || 'PENDING_PAYMENT',
      orderStatus: payload.orderStatus || 'PENDING_PAYMENT',
      artworkStatus: payload.artworkStatus || 'PENDING_ARTWORK',
      artworkFiles: payload.artworkFiles || [],
      proofOfDisplay: payload.proofOfDisplay || [],
      createdAt: now,
      updatedAt: now,
      ...payload,
      ...totals,
    };

    db.marketplace_orders = [order, ...(db.marketplace_orders || [])];
    await writeDb(env, db);
    return json({ success: true, order });
  }

  if (pathname === '/api/marketplace/orders/status' && request.method === 'POST') {
    const db = await readDb(env);
    const payload = await parseJson(request);
    db.marketplace_orders = (db.marketplace_orders || []).map((order: any) => order.id === payload.orderId ? { ...order, orderStatus: payload.orderStatus, updatedAt: new Date().toISOString() } : order);
    await writeDb(env, db);
    return json({ success: true, orders: db.marketplace_orders });
  }

  if (pathname === '/api/marketplace/orders/artwork' && request.method === 'POST') {
    const db = await readDb(env);
    const payload = await parseJson(request);
    let updatedOrder = null;
    db.marketplace_orders = (db.marketplace_orders || []).map((order: any) => {
      if (order.id !== payload.orderId) return order;
      updatedOrder = {
        ...order,
        artworkStatus: 'UNDER_REVIEW',
        artworkFiles: [
          {
            id: createId('art'),
            uploadedAt: new Date().toISOString(),
            status: 'SUBMITTED',
            ...payload,
          },
          ...(order.artworkFiles || []),
        ],
        updatedAt: new Date().toISOString(),
      };
      return updatedOrder;
    });
    await writeDb(env, db);
    return json({ success: Boolean(updatedOrder), order: updatedOrder }, { status: updatedOrder ? 200 : 404 });
  }

  if (pathname === '/api/marketplace/orders/artwork-status' && request.method === 'POST') {
    const db = await readDb(env);
    const payload = await parseJson(request);
    let updatedOrder = null;
    db.marketplace_orders = (db.marketplace_orders || []).map((order: any) => {
      if (order.id !== payload.orderId) return order;
      updatedOrder = {
        ...order,
        artworkStatus: payload.artworkStatus,
        updatedAt: new Date().toISOString(),
        artworkFiles: (order.artworkFiles || []).map((file: any, index: number) => index === 0 ? { ...file, status: payload.artworkStatus, adminFeedback: payload.adminFeedback || file.adminFeedback } : file),
      };
      return updatedOrder;
    });
    await writeDb(env, db);
    return json({ success: Boolean(updatedOrder), order: updatedOrder }, { status: updatedOrder ? 200 : 404 });
  }

  if (pathname === '/api/marketplace/proof-of-display' && request.method === 'GET') {
    const db = await readDb(env);
    const orderId = searchParams.get('orderId');
    const proofs = (db.proof_of_displays || []).filter((proof: any) => !orderId || proof.orderId === orderId);
    return json({ success: true, proofs });
  }

  if (pathname === '/api/marketplace/proof-of-display' && request.method === 'POST') {
    const db = await readDb(env);
    const payload = await parseJson(request);
    const proof = {
      id: createId('pod'),
      uploadedAt: new Date().toISOString(),
      verifiedBy: payload.verifiedBy || 'Domislink Digital Broadcast Officer',
      ...payload,
    };
    db.proof_of_displays = [proof, ...(db.proof_of_displays || [])];
    db.marketplace_orders = (db.marketplace_orders || []).map((order: any) => order.id === payload.orderId ? { ...order, proofOfDisplay: [proof, ...(order.proofOfDisplay || [])] } : order);
    await writeDb(env, db);
    return json({ success: true, proof });
  }

  if (pathname === '/api/marketplace/quotes' && request.method === 'GET') {
    const db = await readDb(env);
    return json({ success: true, quotes: db.custom_quotes || [] });
  }

  if (pathname === '/api/marketplace/quotes' && request.method === 'POST') {
    const db = await readDb(env);
    const payload = await parseJson(request);
    const quote = {
      id: createId('quote'),
      quoteNumber: createReference('Q-AVS26').toUpperCase(),
      createdAt: new Date().toISOString(),
      status: payload.status || 'DRAFT',
      ...payload,
    };
    db.custom_quotes = [quote, ...(db.custom_quotes || [])];
    await writeDb(env, db);
    return json({ success: true, quote });
  }

  if (pathname === '/api/marketplace/creative-request' && request.method === 'POST') {
    return handleCreativeRequest(request, env);
  }

  if (pathname === '/api/marketplace/revenue-metrics' && request.method === 'GET') {
    const db = await readDb(env);
    const orders = db.marketplace_orders || [];
    const revenue = orders.filter((order: any) => order.paymentStatus === 'VERIFIED_PAID').reduce((sum: number, order: any) => sum + Number(order.totalAmount || 0), 0);
    return json({
      success: true,
      metrics: {
        totalOrders: orders.length,
        paidOrders: orders.filter((order: any) => order.paymentStatus === 'VERIFIED_PAID').length,
        pendingOrders: orders.filter((order: any) => order.paymentStatus !== 'VERIFIED_PAID').length,
        totalRevenue: revenue,
        outstandingQuotes: (db.custom_quotes || []).length,
      },
    });
  }

  if (pathname === '/api/marketplace/ai-assistant' && request.method === 'POST') {
    return handleMarketplaceAdvisor(request, env);
  }

  if (pathname === '/api/marketplace/ai-quote-parse' && request.method === 'POST') {
    const payload = await parseJson(request);
    const text = String(payload.text || payload.message || '');
    const amountMatch = text.match(/([₦$]?)(\d[\d,\.]*)/);
    return json({ success: true, parsed: { amount: amountMatch?.[2] || null, currency: amountMatch?.[1] === '$' ? 'USD' : 'NGN', rawText: text } });
  }

  if (pathname === '/api/paystack/initialize' && request.method === 'POST') {
    return handlePaystackInitialize(request, env);
  }

  if (pathname === '/api/paystack/verify' && request.method === 'POST') {
    return handlePaystackVerify(request, env);
  }

  if (pathname === '/api/gemini/chat' && request.method === 'POST') {
    return handleSummitChat(request, env);
  }

  if (pathname === '/api/speakers/ai-suggest-topics' && request.method === 'POST') {
    return handleSpeakerTopics(request, env);
  }

  if (pathname === '/api/speakers/ai-assistant' && request.method === 'POST') {
    return handleSpeakerAssistant(request, env);
  }

  if (pathname === '/api/stakeholders' && request.method === 'GET') {
    const db = await readDb(env);
    const stakeholders = db.stakeholders || [];
    return json({ stakeholders, stats: calculateStakeholderStats(stakeholders), categories: STAKEHOLDER_CATEGORIES });
  }

  if (pathname === '/api/stakeholders' && request.method === 'POST') {
    const db = await readDb(env);
    const payload = await parseJson(request);
    const now = new Date().toISOString();
    const stakeholder = {
      id: createId('stk'),
      status: payload.status || 'PROPOSED INVITEE',
      createdAt: now,
      updatedAt: now,
      ...payload,
    };
    db.stakeholders = [stakeholder, ...(db.stakeholders || [])];
    await writeDb(env, db);
    return json({ success: true, stakeholder, stats: calculateStakeholderStats(db.stakeholders) });
  }

  const stakeholderMatch = pathname.match(/^\/api\/stakeholders\/([^/]+)$/);
  if (stakeholderMatch && request.method === 'PUT') {
    const db = await readDb(env);
    const payload = await parseJson(request);
    let updatedStakeholder = null;
    db.stakeholders = (db.stakeholders || []).map((stakeholder: any) => {
      if (stakeholder.id !== stakeholderMatch[1]) return stakeholder;
      updatedStakeholder = { ...stakeholder, ...payload, updatedAt: new Date().toISOString() };
      return updatedStakeholder;
    });
    await writeDb(env, db);
    return json({ success: Boolean(updatedStakeholder), stakeholder: updatedStakeholder, stats: calculateStakeholderStats(db.stakeholders) }, { status: updatedStakeholder ? 200 : 404 });
  }

  if (stakeholderMatch && request.method === 'DELETE') {
    const db = await readDb(env);
    const before = (db.stakeholders || []).length;
    db.stakeholders = (db.stakeholders || []).filter((stakeholder: any) => stakeholder.id !== stakeholderMatch[1]);
    await writeDb(env, db);
    return json({ success: before !== db.stakeholders.length, stats: calculateStakeholderStats(db.stakeholders) });
  }

  if (pathname === '/api/stakeholders/ai-brainstorm' && request.method === 'POST') {
    return handleStakeholderBrainstorm(request, env);
  }

  if (pathname === '/api/stakeholders/ai-letter' && request.method === 'POST') {
    return handleStakeholderLetter(request);
  }

  if (pathname === '/api/stakeholders/ai-sponsorship-proposal' && request.method === 'POST') {
    return handleStakeholderProposal(request, env);
  }

  if (pathname === '/api/stakeholders/dispatch-letter' && request.method === 'POST') {
    const db = await readDb(env);
    const payload = await parseJson(request);
    const now = new Date();
    const followUpDate = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString();
    let invitee = null;

    db.stakeholders = (db.stakeholders || []).map((stakeholder: any) => {
      if (stakeholder.id !== payload.inviteeId) return stakeholder;
      invitee = {
        ...stakeholder,
        status: 'INVITATION SENT',
        invitationDate: now.toISOString(),
        followUpDate,
        email: payload.recipientEmail || stakeholder.email,
        nextAction: `Awaiting acknowledgment. Follow-up scheduled for ${new Date(followUpDate).toLocaleDateString('en-GB')}.`,
        updatedAt: now.toISOString(),
      };
      return invitee;
    });

    db.invitation_letters = [
      {
        id: createId('dispatch'),
        inviteeId: payload.inviteeId,
        recipientEmail: payload.recipientEmail,
        subject: payload.subject,
        method: payload.method || 'DOMISLINK_MAIL_AI_GMAIL',
        dispatchedAt: now.toISOString(),
        followUpDueAt: followUpDate,
      },
      ...(db.invitation_letters || []),
    ];

    await writeDb(env, db);
    return json({ success: true, invitee, followUpDate, stats: calculateStakeholderStats(db.stakeholders) });
  }

  const proxied = await maybeProxyRequest(request, env);
  if (proxied) return proxied;

  return json({ success: false, error: `No Cloudflare Worker handler is defined for ${pathname}.` }, { status: 404 });
}

export default {
  async fetch(request: Request, env: WorkerEnv, ctx: WorkerExecutionContext) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS' && url.pathname.startsWith('/api/')) {
      return applyCors(new Response(null, { status: 204 }), request, env);
    }

    try {
      const response = url.pathname.startsWith('/api/')
        ? await handleApiRequest(request, env, ctx)
        : env.ASSETS
          ? await env.ASSETS.fetch(request)
          : new Response('Not Found', { status: 404 });

      return applyCors(response, request, env);
    } catch (error: any) {
      return applyCors(
        json({ success: false, error: error?.message || 'Worker request failed.' }, { status: 500 }),
        request,
        env,
      );
    }
  },
};
