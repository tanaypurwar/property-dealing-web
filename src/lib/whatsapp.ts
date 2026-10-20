import { site } from '../config/site';

/** A wa.me link that opens a chat with the message already typed. */
export function whatsappUrl(message: string = site.whatsappGreeting): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function projectWhatsappMessage(name: string, area: string): string {
  return `Namaste! Please send me the full price sheet for ${name}, ${area}.`;
}
