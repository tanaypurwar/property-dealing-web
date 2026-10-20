/**
 * Enquiry handling shared by every lead form (project enquiry, brochure gate).
 * Runs in the browser. Swap the delivery in `submitEnquiry` once a backend is chosen.
 */
import { site } from '../config/site';
import { whatsappUrl } from './whatsapp';

export interface Enquiry {
  name: string;
  phone: string; // 10 digits, no country code
  email?: string;
  configuration?: string;
  callTime?: string;
  project?: string;
  source: 'enquiry-form' | 'brochure' | 'price-row';
  page: string;
}

/**
 * Accepts the ways people type Indian mobile numbers ("98765 43210", "+91-98765-43210",
 * "098765 43210") and returns the 10-digit number, or null if it isn't a valid mobile.
 */
export function normalizeIndianMobile(input: string): string | null {
  let digits = input.replace(/[\s\-().]/g, '').replace(/^\+/, '');
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}

export type Delivery = 'sent' | 'whatsapp' | 'not-sent';

function whatsappText(e: Enquiry): string {
  return [
    `Namaste! I'd like details${e.project ? ` for ${e.project}` : ''}.`,
    `Name: ${e.name}`,
    `Phone: +91 ${e.phone}`,
    e.email && `Email: ${e.email}`,
    e.configuration && `Interested in: ${e.configuration}`,
    e.callTime && `Best time to call: ${e.callTime}`,
  ]
    .filter(Boolean)
    .join('\n');
}

/**
 * Sends the enquiry. With `site.enquiryEndpoint` set, it POSTs JSON there.
 * Without one, `fallback: 'whatsapp'` opens WhatsApp with the details typed in;
 * `fallback: 'none'` records nothing (used by the brochure gate).
 *
 * Call it directly from the submit handler, before any other `await`, so the
 * browser treats the WhatsApp window as user-initiated.
 */
export async function submitEnquiry(
  enquiry: Enquiry,
  fallback: 'whatsapp' | 'none' = 'whatsapp',
): Promise<Delivery> {
  if (site.enquiryEndpoint) {
    const res = await fetch(site.enquiryEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(enquiry),
    });
    if (!res.ok) throw new Error(`Enquiry endpoint returned ${res.status}`);
    return 'sent';
  }
  if (fallback === 'whatsapp') {
    window.open(whatsappUrl(whatsappText(enquiry)), '_blank', 'noopener');
    return 'whatsapp';
  }
  console.warn('No enquiryEndpoint configured: this lead was not recorded.', enquiry);
  return 'not-sent';
}

/** Shows or clears an inline error under a field. The error element is `#<field id>-error`. */
export function setFieldError(field: HTMLInputElement | HTMLSelectElement, message: string) {
  const error = document.getElementById(`${field.id}-error`);
  field.setAttribute('aria-invalid', String(Boolean(message)));
  if (error) {
    error.textContent = message;
    error.hidden = !message;
  }
}

export interface ValidatedFields {
  name: string;
  phone: string;
  email?: string;
}

/**
 * Validates the shared name / phone / email / consent fields of a lead form.
 * Returns the cleaned values, or null after marking the first invalid field and focusing it.
 */
export function validateLeadForm(form: HTMLFormElement): ValidatedFields | null {
  const get = <T extends Element>(name: string) => form.elements.namedItem(name) as T | null;
  const name = get<HTMLInputElement>('name')!;
  const phone = get<HTMLInputElement>('phone')!;
  const email = get<HTMLInputElement>('email');
  const consent = get<HTMLInputElement>('consent');

  const checks: [HTMLInputElement | null, string][] = [
    [name, name.value.trim().length < 2 ? 'Enter your name.' : ''],
    [
      phone,
      !phone.value.trim()
        ? 'Enter your mobile number.'
        : normalizeIndianMobile(phone.value)
          ? ''
          : 'Enter a 10-digit Indian mobile number, e.g. 98765 43210.',
    ],
    [
      email,
      email && email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())
        ? 'Check the email address, or leave it blank.'
        : '',
    ],
    [consent, consent && !consent.checked ? 'Tick the box so we can contact you.' : ''],
  ];

  let firstInvalid: HTMLInputElement | null = null;
  for (const [field, message] of checks) {
    if (!field) continue;
    setFieldError(field, message);
    if (message && !firstInvalid) firstInvalid = field;
  }
  if (firstInvalid) {
    firstInvalid.focus();
    return null;
  }
  return {
    name: name.value.trim(),
    phone: normalizeIndianMobile(phone.value)!,
    email: email?.value.trim() || undefined,
  };
}
